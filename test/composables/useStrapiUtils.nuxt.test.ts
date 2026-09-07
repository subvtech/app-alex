import { describe, it, expect, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const mockFind = vi.fn((contentType: string, params: any) => {
  const page = params?.pagination?.page || 1;
  if (page === 1) {
    return Promise.resolve({
      data: [
        { id: 1, attributes: { title: 'Plan 1', type: 'course' } },
        { id: 2, attributes: { title: 'Plan 2', type: 'project' } },
      ],
      meta: { pagination: { page: 1, pageSize: 2, pageCount: 2, total: 3 } },
    });
  }
  return Promise.resolve({
    data: [{ id: 3, attributes: { title: 'Plan 3', type: 'course' } }],
    meta: { pagination: { page: 2, pageSize: 2, pageCount: 2, total: 3 } },
  });
});

mockNuxtImport('useStrapi', () => () => ({
  find: mockFind,
}));

describe('useStrapiUtils', () => {
  it('findAll fetches all pages and formats results', async () => {
    const { useStrapiUtils } = await import('~/composables/useStrapiUtils');
    const { findAll } = useStrapiUtils();
    const result = await findAll('learning-plan-members', { filters: { user: 123 } }, 2);

    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(result.data).toHaveLength(3);
    expect(result.data[0]).toEqual({ id: 1, title: 'Plan 1', type: 'course' });
    expect(result.data[1]).toEqual({ id: 2, title: 'Plan 2', type: 'project' });
    expect(result.data[2]).toEqual({ id: 3, title: 'Plan 3', type: 'course' });
  });
});
