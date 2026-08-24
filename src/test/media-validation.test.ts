import { describe, expect, it } from "vitest";
import {
  COMPRESSION_GUIDES,
  PHOTO_RULES,
  VIDEO_RULES,
  UPLOAD_ERROR_ADVICE,
  classifyUploadError,
  compressionGuideFor,
  fieldForUploadError,
  uploadErrorAdvice,
  validateMediaFile,
  validateMediaFiles,
} from "@/lib/media-validation";

const makeFile = (name: string, type: string, size: number): File =>
  new File([new Uint8Array(size)], name, { type });

describe("validateMediaFile", () => {
  it("接受合法的图片与视频", () => {
    expect(validateMediaFile(makeFile("a.jpg", "image/jpeg", 1024), PHOTO_RULES)).toBeNull();
    expect(validateMediaFile(makeFile("b.webp", "image/webp", 1024), PHOTO_RULES)).toBeNull();
    expect(validateMediaFile(makeFile("c.mp4", "video/mp4", 1024), VIDEO_RULES)).toBeNull();
    expect(validateMediaFile(makeFile("d.mov", "video/quicktime", 1024), VIDEO_RULES)).toBeNull();
  });

  it("拒绝不支持的类型并说明实际类型", () => {
    const msg = validateMediaFile(makeFile("a.gif", "image/gif", 1024), PHOTO_RULES);
    expect(msg).toContain("类型不支持");
    expect(msg).toContain("image/gif");
    expect(msg).toContain("JPG / PNG / WebP");
  });

  it("拒绝超过大小上限的文件并给出实际大小", () => {
    const msg = validateMediaFile(makeFile("a.jpg", "image/jpeg", 11 * 1024 * 1024), PHOTO_RULES);
    expect(msg).toContain("超过");
    expect(msg).toContain("10.0MB");
  });

  it("拒绝空文件", () => {
    expect(validateMediaFile(makeFile("a.jpg", "image/jpeg", 0), PHOTO_RULES)).toContain("内容为空");
  });
});

describe("classifyUploadError", () => {
  it("归类客户端校验错误", () => {
    expect(classifyUploadError(validateMediaFile(makeFile("a.gif", "image/gif", 10), PHOTO_RULES)!)).toBe("type");
    expect(classifyUploadError(validateMediaFile(makeFile("a.jpg", "image/jpeg", 11 * 1024 * 1024), PHOTO_RULES)!)).toBe("size");
    expect(classifyUploadError(validateMediaFile(makeFile("a.jpg", "image/jpeg", 0), PHOTO_RULES)!)).toBe("empty");
  });

  it("归类服务端错误（类型/大小/限流/配额）", () => {
    expect(classifyUploadError("invalid file type: image/gif")).toBe("type");
    expect(classifyUploadError("file too large: max 104857600 bytes")).toBe("size");
    expect(classifyUploadError("rate limit exceeded: 30 uploads per hour")).toBe("rate_limit");
    expect(classifyUploadError("已触发上传限制，请稍后再试")).toBe("rate_limit");
    expect(classifyUploadError("storage quota exceeded for bucket short-videos")).toBe("quota");
  });

  it("无法归类时返回 null", () => {
    expect(classifyUploadError("网络连接失败")).toBeNull();
    expect(classifyUploadError("")).toBeNull();
  });
});

describe("uploadErrorAdvice", () => {
  it("每种失败类别都有可操作的解决建议", () => {
    for (const kind of ["type", "size", "empty", "rate_limit", "quota"] as const) {
      expect(UPLOAD_ERROR_ADVICE[kind]).toMatch(/^解决建议：/);
      expect(UPLOAD_ERROR_ADVICE[kind].length).toBeGreaterThan(10);
    }
  });

  it("错误信息能映射到对应建议", () => {
    expect(uploadErrorAdvice("invalid file type: image/gif")).toBe(UPLOAD_ERROR_ADVICE.type);
    expect(uploadErrorAdvice("file too large")).toBe(UPLOAD_ERROR_ADVICE.size);
    expect(uploadErrorAdvice("rate limit exceeded")).toBe(UPLOAD_ERROR_ADVICE.rate_limit);
    expect(uploadErrorAdvice("storage quota exceeded")).toBe(UPLOAD_ERROR_ADVICE.quota);
    expect(uploadErrorAdvice("其他错误")).toBeNull();
  });
});

describe("fieldForUploadError", () => {
  it("类型/大小/限流/配额错误归因到文件字段", () => {
    expect(fieldForUploadError("invalid file type")).toBe("file");
    expect(fieldForUploadError("file too large")).toBe("file");
    expect(fieldForUploadError("rate limit exceeded")).toBe("file");
    expect(fieldForUploadError("quota exceeded")).toBe("file");
    expect(fieldForUploadError("已触发上传限制")).toBe("file");
    expect(fieldForUploadError("unauthorized")).toBeNull();
  });
});

describe("validateMediaFiles — 批量预校验", () => {
  it("为每个文件独立给出结果，顺序与输入一致", () => {
    const files = [
      makeFile("ok1.jpg", "image/jpeg", 1024),
      makeFile("bad.gif", "image/gif", 1024),
      makeFile("ok2.png", "image/png", 2048),
      makeFile("big.jpg", "image/jpeg", 11 * 1024 * 1024),
    ];
    const verdicts = validateMediaFiles(files, PHOTO_RULES);
    expect(verdicts).toHaveLength(4);
    expect(verdicts.map((v) => v.file.name)).toEqual(["ok1.jpg", "bad.gif", "ok2.png", "big.jpg"]);
    expect(verdicts[0].error).toBeNull();
    expect(verdicts[1].error).toContain("类型不支持");
    expect(verdicts[2].error).toBeNull();
    expect(verdicts[3].error).toContain("超过");
  });

  it("空数组返回空结果", () => {
    expect(validateMediaFiles([], VIDEO_RULES)).toEqual([]);
  });
});

describe("compressionGuideFor — 前置压缩/转码方案", () => {
  it("视频规则返回视频方案（含 ffmpeg 命令与码率参数）", () => {
    const guide = compressionGuideFor(VIDEO_RULES);
    expect(guide).toBe(COMPRESSION_GUIDES.video);
    expect(guide.command).toContain("ffmpeg");
    expect(guide.command).toContain("{input}");
    expect(guide.params.join(" ")).toContain("H.264");
    expect(guide.params.join(" ")).toContain("100.0MB");
    expect(guide.tools.length).toBeGreaterThan(0);
  });

  it("图片规则返回图片方案（含 ImageMagick 命令与尺寸参数）", () => {
    const guide = compressionGuideFor(PHOTO_RULES);
    expect(guide).toBe(COMPRESSION_GUIDES.image);
    expect(guide.command).toContain("magick");
    expect(guide.params.join(" ")).toContain("WebP");
    expect(guide.params.join(" ")).toContain("10.0MB");
  });

  it("大小超限错误可归类为 size（用于触发压缩方案展示）", () => {
    const msg = validateMediaFile(makeFile("big.mp4", "video/mp4", 101 * 1024 * 1024), VIDEO_RULES)!;
    expect(classifyUploadError(msg)).toBe("size");
  });
});
