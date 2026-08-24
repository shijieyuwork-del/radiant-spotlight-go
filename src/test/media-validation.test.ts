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
