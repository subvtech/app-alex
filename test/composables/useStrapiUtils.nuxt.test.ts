import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFind = vi.fn((_contentType: string, params: any) => {
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

const mockFindOne = vi.fn((_contentType: string, id: number | string) =>
  Promise.resolve({
    data: { id: Number(id), attributes: { submission: { blocks: [] } } },
    meta: {},
  }),
);

mockNuxtImport('useStrapi', () => () => ({
  find: mockFind,
  findOne: mockFindOne,
}));

describe('useStrapiUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('findOne accepts valid numeric and numeric-string IDs and formats the response', async () => {
    const { useStrapiUtils } = await import('~/composables/useStrapiUtils');
    const { findOne } = useStrapiUtils();

    const numericRes = await findOne('task-submissions', 42, { fields: ['submission'] });
    expect(mockFindOne).toHaveBeenCalledWith('task-submissions', 42, { fields: ['submission'] });
    expect(numericRes.data).toEqual({ id: 42, submission: { blocks: [] } });

    const stringRes = await findOne('task-submissions', '77');
    expect(mockFindOne).toHaveBeenCalledWith('task-submissions', 77, undefined);
    expect(stringRes.data).toEqual({ id: 77, submission: { blocks: [] } });
  });

  it('findOne aborts and warns in dev when an object or invalid ID is passed', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { useStrapiUtils, parseValidStrapiId } = await import('~/composables/useStrapiUtils');
    const { findOne } = useStrapiUtils();

    expect(parseValidStrapiId({ id: 10 })).toBeNull();
    expect(parseValidStrapiId(undefined)).toBeNull();
    expect(parseValidStrapiId(null)).toBeNull();
    expect(parseValidStrapiId(0)).toBeNull();
    expect(parseValidStrapiId('abc')).toBeNull();
    expect(parseValidStrapiId('42')).toBe(42);
    expect(parseValidStrapiId(42)).toBe(42);

    const objRes = await findOne('task-submissions', { id: 10 } as any);
    expect(objRes).toEqual({ meta: null, data: null });
    expect(mockFindOne).not.toHaveBeenCalled();

    const emptyRes = await findOne('task-submissions', undefined as any);
    expect(emptyRes).toEqual({ meta: null, data: null });
    expect(mockFindOne).not.toHaveBeenCalled();

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
