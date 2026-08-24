/**
 * RLS 策略集成测试 —— 直接请求真实后端，验证不同角色只能访问被允许的数据。
 *
 * 覆盖矩阵：
 *   角色          doctors / videos                profiles                storage
 *   anon          只能读 published；写操作全拒     完全不可读               不能上传；列出的文件为空（无 published 关联文件时）
 *   authenticated 同 anon（非管理员无写权限）      只能读/改自己的那一行     同 anon
 *   admin         全部权限（需真实管理员凭据，见下）
 *
 * 运行：
 *   bunx vitest run src/test/rls.test.ts
 *
 * 默认以匿名身份跑全部用例。如提供测试用户凭据（一个普通注册用户），
 * 会额外跑 authenticated 用例：
 *   TEST_USER_EMAIL=you@example.com TEST_USER_PASSWORD=xxx bunx vitest run src/test/rls.test.ts
 *
 * 管理员（写 doctors/videos、管理 storage）的用例需要管理员 JWT，
 * 不适合放在前端测试里，由 supabase/tests/rls_tests.sql 用角色模拟覆盖。
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = import.meta.env.VITE_SUPABASE_URL as string;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const newAnonClient = (): SupabaseClient =>
  createClient(URL, ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

describe("RLS: anon 匿名角色", () => {
  const anon = newAnonClient();

  it("doctors: 只能看到 published 记录", async () => {
    const { data, error } = await anon.from("doctors").select("id,status");
    expect(error).toBeNull();
    expect(data ?? []).toHaveLength(0); // 当前库无 published 记录；有数据时下行保证过滤正确
    for (const row of data ?? []) expect(row.status).toBe("published");
  });

  it("doctors: 按 draft 过滤查不到任何行", async () => {
    const { data, error } = await anon.from("doctors").select("id").eq("status", "draft");
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });

  it("doctors: 匿名写入被拒绝", async () => {
    const { error } = await anon.from("doctors").insert({
      name: "RLS Test", title: "T", hospital: "H", city: "C", bio: "B",
    });
    expect(error).not.toBeNull();
  });

  it("doctors: 匿名更新/删除影响 0 行", async () => {
    const upd = await anon.from("doctors").update({ bio: "hacked" }).not("id", "is", null).select();
    expect(upd.data ?? []).toHaveLength(0);
    const del = await anon.from("doctors").delete().not("id", "is", null).select();
    expect(del.data ?? []).toHaveLength(0);
  });

  it("videos: 只能看到 published 记录", async () => {
    const { data, error } = await anon.from("videos").select("id,status");
    expect(error).toBeNull();
    for (const row of data ?? []) expect(row.status).toBe("published");
    const drafts = await anon.from("videos").select("id").eq("status", "draft");
    expect(drafts.data).toHaveLength(0);
  });

  it("videos: 匿名写入被拒绝", async () => {
    const { error } = await anon.from("videos").insert({ title: "RLS Test", storage_path: "rls/test.mp4" });
    expect(error).not.toBeNull();
  });

  it("profiles: 匿名读不到任何用户资料", async () => {
    const { data, error } = await anon.from("profiles").select("id");
    // 无 anon 策略：要么报权限错误，要么返回空 —— 两种都视为通过，关键是拿不到行
    if (!error) expect(data).toHaveLength(0);
  });

  it("profiles: 匿名写入被拒绝", async () => {
    const { error } = await anon
      .from("profiles")
      .insert({ id: crypto.randomUUID(), display_name: "RLS Test" });
    expect(error).not.toBeNull();
  });

  // 网络请求较慢，给足超时；用 string body 避免 jsdom Blob 与 undici 的兼容问题
  it("storage: 匿名不能向 doctor-photos 上传", { timeout: 20000 }, async () => {
    const { error } = await anon.storage
      .from("doctor-photos")
      .upload(`rls-test/${crypto.randomUUID()}.txt`, "x", { contentType: "text/plain" });
    expect(error).not.toBeNull();
  });

  it("storage: 匿名不能向 short-videos 上传", { timeout: 20000 }, async () => {
    const { error } = await anon.storage
      .from("short-videos")
      .upload(`rls-test/${crypto.randomUUID()}.txt`, "x", { contentType: "text/plain" });
    expect(error).not.toBeNull();
  });

  it("storage: 匿名列表只能看到与 published 记录关联的文件（当前应为空）", async () => {
    const photos = await anon.storage.from("doctor-photos").list();
    const videos = await anon.storage.from("short-videos").list();
    // 库里目前没有 published 的医生/视频，所以两个桶对匿名都应为空
    expect(photos.data ?? []).toHaveLength(0);
    expect(videos.data ?? []).toHaveLength(0);
  });

  it("storage: 匿名不能为无 published 关联的文件生成签名 URL", async () => {
    const { data, error } = await anon.storage
      .from("doctor-photos")
      .createSignedUrl("rls-test/nonexistent.txt", 60);
    expect(error !== null || !data?.signedUrl).toBe(true);
  });
});

// ——  authenticated 普通用户用例：提供 TEST_USER_EMAIL / TEST_USER_PASSWORD 才运行 ——
const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;
const describeAuth = TEST_EMAIL && TEST_PASSWORD ? describe : describe.skip;

describeAuth("RLS: authenticated 普通登录用户", () => {
  let client: SupabaseClient;
  let userId: string;

  beforeAll(async () => {
    client = newAnonClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: TEST_EMAIL!,
      password: TEST_PASSWORD!,
    });
    if (error) throw error;
    userId = data.user.id;
  });

  afterAll(async () => {
    await client?.auth.signOut();
  });

  it("profiles: 只能读到自己那一行", async () => {
    const { data, error } = await client.from("profiles").select("id");
    expect(error).toBeNull();
    for (const row of data ?? []) expect(row.id).toBe(userId);
  });

  it("profiles: 不能改别人的资料", async () => {
    const { data } = await client
      .from("profiles")
      .update({ display_name: "hacked" })
      .neq("id", userId)
      .select();
    expect(data ?? []).toHaveLength(0);
  });

  it("profiles: 不能替别人建行", async () => {
    const { error } = await client
      .from("profiles")
      .insert({ id: crypto.randomUUID(), display_name: "RLS Test" });
    expect(error).not.toBeNull();
  });

  it("doctors/videos: 非管理员写入仍被拒绝", async () => {
    const d = await client.from("doctors").insert({
      name: "RLS Test", title: "T", hospital: "H", city: "C", bio: "B",
    });
    expect(d.error).not.toBeNull();
    const v = await client.from("videos").insert({ title: "RLS Test", storage_path: "rls/test.mp4" });
    expect(v.error).not.toBeNull();
  });

  it("storage: 非管理员不能上传文件", { timeout: 20000 }, async () => {
    const { error } = await client.storage
      .from("doctor-photos")
      .upload(`rls-test/${crypto.randomUUID()}.txt`, "x", { contentType: "text/plain" });
    expect(error).not.toBeNull();
  });
});

describe("RLS: audit_logs 审计日志", () => {
  const anon = newAnonClient();

  it("anon: 无法读取审计日志", async () => {
    const { data, error } = await anon.from("audit_logs").select("id");
    // anon 无 GRANT：应直接报权限错误；即便放行也不允许返回任何行
    if (!error) expect(data ?? []).toHaveLength(0);
    else expect(error.message).toMatch(/permission|denied|row-level|not authorized/i);
  });

  it("anon: 无法写入审计日志", async () => {
    const { error } = await anon
      .from("audit_logs")
      .insert({ action: "storage_read", target: "rls-probe" });
    expect(error).not.toBeNull();
  });

  it("anon: 无法调用 read_profile 函数", async () => {
    const { error } = await anon.rpc("read_profile", { p_id: crypto.randomUUID() });
    expect(error).not.toBeNull();
  });
});

describe("RLS: upload-media 上传权限校验", () => {
  const newForm = () => {
    const form = new FormData();
    form.append("bucket", "doctor-photos");
    form.append("file", new File(["x"], "rls-probe.jpg", { type: "image/jpeg" }));
    return form;
  };

  it("anon: 匿名调用上传函数被拒绝（401）", { timeout: 20000 }, async () => {
    const anon = newAnonClient();
    const { data, error } = await anon.functions.invoke("upload-media", { body: newForm() });
    expect(data?.path).toBeUndefined();
    expect(error).not.toBeNull();
  });

  it("anon: 匿名调用请求读取函数时，未发布文件不返回签名 URL", async () => {
    const anon = newAnonClient();
    const { data } = await anon.functions.invoke("request-file-access", {
      body: { bucket: "doctor-photos", paths: ["rls-test/unpublished.jpg"] },
    });
    expect(data?.urls ?? {}).toEqual({});
  });
});

describeAuth("RLS: upload-media 非管理员登录用户", () => {
  it("非管理员调用上传函数被拒绝（403）", async () => {
    const client = newAnonClient();
    const { error: signInError } = await client.auth.signInWithPassword({
      email: TEST_EMAIL!,
      password: TEST_PASSWORD!,
    });
    if (signInError) throw signInError;
    const form = new FormData();
    form.append("bucket", "short-videos");
    form.append("file", new File(["x"], "rls-probe.mp4", { type: "video/mp4" }));
    const { data, error } = await client.functions.invoke("upload-media", { body: form });
    expect(data?.path).toBeUndefined();
    expect(error).not.toBeNull();
    await client.auth.signOut();
  });
});
