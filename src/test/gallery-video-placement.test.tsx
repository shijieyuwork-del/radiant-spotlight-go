import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { usePublishedVideos } from '@/hooks/use-published-videos';
const db = vi.hoisted(() => {
  const query: any = { then: (resolve: any) => Promise.resolve({ data: [] }).then(resolve) };
  query.select = vi.fn(() => query); query.eq = vi.fn(() => query); query.order = vi.fn(() => query);
  return { query, from: vi.fn(() => query) };
});
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: db.from } }));
vi.mock('@/lib/storage-urls', () => ({ signedUrls: vi.fn() }));
vi.mock('@/hooks/use-realtime-refresh', () => ({ useRealtimeRefresh: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe('video destination isolation', () => {
  it('restricts the default homepage and diary feed to diary placement', async () => {
    renderHook(() => usePublishedVideos('zh'));
    await waitFor(() => expect(db.query.eq).toHaveBeenCalledWith('placement', 'diary'));
    expect(db.query.eq).toHaveBeenCalledWith('status', 'published');
  });
  it('loads gallery cases only when explicitly requested', async () => {
    renderHook(() => usePublishedVideos('zh', 'before-after'));
    await waitFor(() => expect(db.query.eq).toHaveBeenCalledWith('placement', 'before-after'));
    expect(db.query.eq).not.toHaveBeenCalledWith('placement', 'diary');
  });
});
