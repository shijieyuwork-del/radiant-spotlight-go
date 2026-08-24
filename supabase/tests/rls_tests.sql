-- ============================================================================
-- RLS 策略自动化测试（角色模拟版）
--
-- 用法（需要数据库直连权限）：
--   psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f supabase/tests/rls_tests.sql
--
-- 原理：在单个事务里用 SET LOCAL ROLE + request.jwt.claims 模拟
--   anon / authenticated(普通用户) / authenticated(管理员) 三种身份，
--   断言各角色只能访问被允许的数据。全程在事务中，结尾 ROLLBACK，
--   不会留下任何测试数据。
--
-- 覆盖前端 vitest 测试（src/test/rls.test.ts）无法覆盖的部分：
--   管理员写权限、draft 内容对匿名不可见、storage 对象级策略。
-- ============================================================================

BEGIN;

-- 断言辅助：条件不成立即抛错（ON_ERROR_STOP 让 psql 以非零码退出）
CREATE OR REPLACE FUNCTION pg_temp.assert_rls(cond boolean, msg text) RETURNS void AS $$
BEGIN
  IF NOT cond THEN RAISE EXCEPTION 'RLS TEST FAILED: %', msg; END IF;
  RAISE NOTICE 'PASS: %', msg;
END;
$$ LANGUAGE plpgsql;

-- ── 夹具：一条 published + 一条 draft 医生，一条 published + 一条 draft 视频 ──
INSERT INTO public.doctors (id, name, title, hospital, city, bio, status, photo_path)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'RLS Pub Doc',  'T', 'H', 'Shanghai', 'B', 'published', 'rls-test/pub.jpg'),
  ('22222222-2222-2222-2222-222222222222', 'RLS Draft Doc', 'T', 'H', 'Beijing',   'B', 'draft',     'rls-test/draft.jpg');

INSERT INTO public.videos (id, title, storage_path, status)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'RLS Pub Video',   'rls-test/pub.mp4',   'published'),
  ('44444444-4444-4444-4444-444444444444', 'RLS Draft Video', 'rls-test/draft.mp4', 'draft');

-- storage.objects 夹具：直接建行（事务结束回滚，不影响真实文件）
INSERT INTO storage.objects (id, bucket_id, name, owner, version)
VALUES
  (gen_random_uuid(), 'doctor-photos', 'rls-test/pub.jpg',   NULL, '1'),
  (gen_random_uuid(), 'doctor-photos', 'rls-test/draft.jpg', NULL, '2'),
  (gen_random_uuid(), 'short-videos',  'rls-test/pub.mp4',   NULL, '3'),
  (gen_random_uuid(), 'short-videos',  'rls-test/draft.mp4', NULL, '4');

-- ══════════════════════════ anon 匿名角色 ══════════════════════════
SET LOCAL ROLE anon;
SET LOCAL request.jwt.claims = '{"role":"anon"}';

SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.doctors) = 1,
  'anon 只能看到 1 条 published 医生');
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.doctors WHERE status = 'draft') = 0,
  'anon 看不到 draft 医生');
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.videos WHERE status = 'draft') = 0,
  'anon 看不到 draft 视频');
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.profiles) = 0,
  'anon 读不到任何 profiles');

-- storage：只能读到与 published 记录关联的对象
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM storage.objects WHERE bucket_id = 'doctor-photos' AND name = 'rls-test/pub.jpg') = 1,
  'anon 能读 published 医生的照片对象');
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM storage.objects WHERE bucket_id = 'doctor-photos' AND name = 'rls-test/draft.jpg') = 0,
  'anon 读不到 draft 医生的照片对象');
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM storage.objects WHERE bucket_id = 'short-videos' AND name = 'rls-test/draft.mp4') = 0,
  'anon 读不到 draft 视频对象');

-- ═══════════════════ authenticated 普通用户 ═══════════════════
RESET ROLE;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"role":"authenticated","sub":"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa","email":"someone@example.com"}';

SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.doctors WHERE status = 'draft') = 0,
  '普通用户看不到 draft 医生');

-- profiles 隔离：模拟用户只能看到自己 id 的行（随机 id → 0 行）
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.profiles) = 0,
  '普通用户读不到别人的 profiles');

-- 非管理员写 doctors 应被拒（RLS violation）
DO $$
BEGIN
  BEGIN
    INSERT INTO public.doctors (name, title, hospital, city, bio)
    VALUES ('RLS Evil', 'T', 'H', 'C', 'B');
    RAISE EXCEPTION 'RLS TEST FAILED: 普通用户竟然能插入 doctors';
  EXCEPTION WHEN insufficient_privilege OR raise_exception THEN
    IF SQLERRM LIKE 'RLS TEST FAILED%' THEN RAISE; END IF;
    RAISE NOTICE 'PASS: 普通用户插入 doctors 被拒绝';
  END;
END $$;

-- ═══════════════════ authenticated 管理员 ═══════════════════
RESET ROLE;
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims = '{"role":"authenticated","sub":"bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb","email":"shijieyuwork@gmail.com"}';

SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM public.doctors) = 2,
  '管理员能看到全部医生（含 draft）');

-- 管理员可以更新 draft 医生
UPDATE public.doctors SET bio = 'admin edit' WHERE id = '22222222-2222-2222-2222-222222222222';
SELECT pg_temp.assert_rls(FOUND, '管理员可以更新 draft 医生');

-- 管理员可以删除视频
DELETE FROM public.videos WHERE id = '44444444-4444-4444-4444-444444444444';
SELECT pg_temp.assert_rls(FOUND, '管理员可以删除 draft 视频');

-- 管理员可以读 storage 全部对象（含 draft 关联）
SELECT pg_temp.assert_rls(
  (SELECT count(*) FROM storage.objects WHERE bucket_id IN ('doctor-photos','short-videos')) = 4,
  '管理员能读两个桶的全部对象');

RESET ROLE;
ROLLBACK;

-- 全部通过时 psql 正常退出（0）；任一断言失败则非零退出。
