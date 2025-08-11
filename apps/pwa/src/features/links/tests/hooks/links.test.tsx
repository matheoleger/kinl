import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { Mock } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCreateLink, useDeleteLink, useLinks, useUpdateLink } from '../../hooks/links';

const toast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
}));

const mockApiClient = vi.hoisted(() => ({
  linksControllerGetAllLinks: vi.fn(),
  linksControllerCreateLink: vi.fn(),
  linksControllerDeleteLink: vi.fn(),
  linksControllerUpdateLink: vi.fn(),
}));

const mockUseQuery = vi.hoisted(() => vi.fn());
const mockUseMutation = vi.hoisted(() => vi.fn());
const invalidateQueries = vi.hoisted(() => vi.fn());

vi.mock('sonner', () => ({ toast }));

vi.mock('@/lib/api-client', () => ({ apiClient: mockApiClient }));

vi.mock('react-i18next', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual<any>('@tanstack/react-query');
  return {
    ...actual,
    useQuery: mockUseQuery,
    useMutation: mockUseMutation,
    // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
    useQueryClient: () => ({ invalidateQueries }),
  };
});

function mockQuery(impl: Parameters<Mock>[0]) {
  (mockUseQuery as Mock).mockImplementation(impl);
}

function mockMutation(impl: Parameters<Mock>[0]) {
  (mockUseMutation as Mock).mockImplementation(impl);
}

describe('useLinks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls apiClient.linksControllerGetAllLinks with tags filter', () => {
    mockQuery(({ queryFn }: any) => {
      queryFn();
      return { data: [] } as UseQueryResult;
    });

    renderHook(() => useLinks({ tags: ['tag1'] }));

    expect(mockApiClient.linksControllerGetAllLinks).toHaveBeenCalledWith({
      query: { filter: 'tags:in:["tag1"]' },
    });
  });

  it('calls apiClient.linksControllerGetAllLinks without filter', () => {
    mockQuery(({ queryFn }: any) => {
      queryFn();
      return { data: [] } as UseQueryResult;
    });

    renderHook(() => useLinks());

    expect(mockApiClient.linksControllerGetAllLinks).toHaveBeenCalledWith({
      query: { filter: undefined },
    });
  });

  it('returns empty data if no links are found', () => {
    mockQuery(({ queryFn }: any) => {
      queryFn();
      return { data: [] } as UseQueryResult;
    });

    const { result } = renderHook(() => useLinks());
    expect(result.current.data).toEqual([]);
  });
});

describe('useCreateLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls mutationFn and triggers onSuccess + toast', async () => {
    const onSuccess = vi.fn();

    mockMutation(({ onSuccess: success, mutationFn }: any) => ({
      mutateAsync: async (data: any) => {
        await mutationFn(data);
        success();
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerCreateLink.mockResolvedValue({ data: { id: '1' } });

    const { result } = renderHook(() => useCreateLink({ onSuccess }));
    await act(() => result.current.mutateAsync({ title: 'New link' } as any));

    expect(onSuccess).toHaveBeenCalled();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['links'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tags'] });
    expect(toast.success).toHaveBeenCalledWith('links.create_link_dialog.form.success');
  });

  it('calls onError and shows toast on API error', async () => {
    const onError = vi.fn();
    const error = new Error('test-create-error');

    mockMutation(({ onError: errHandler, mutationFn }: any) => ({
      mutateAsync: async (data: any) => {
        try {
          await mutationFn(data);
        }
        catch (e) {
          errHandler(e);
        }
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerCreateLink.mockResolvedValue({ error });

    const { result } = renderHook(() => useCreateLink({ onError }));
    await act(() => result.current.mutateAsync({ title: 'New link' } as any));

    expect(onError).toHaveBeenCalledWith(error);
    expect(toast.error).toHaveBeenCalledWith(`api_errors.${error.message}`);
  });
});

describe('useDeleteLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('successfully deletes link and calls toast', async () => {
    mockMutation(({ onSuccess: success, mutationFn }: any) => ({
      mutateAsync: async (id: string) => {
        await mutationFn(id);
        success();
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerDeleteLink.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useDeleteLink());
    await act(() => result.current.mutateAsync('1'));

    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['links'] });
    expect(toast.success).toHaveBeenCalledWith('links.delete.success');
  });

  it('handles API error on delete', async () => {
    const error = new Error('test-delete-error');

    mockMutation(({ onError: errHandler, mutationFn }: any) => ({
      mutateAsync: async (id: string) => {
        try {
          await mutationFn(id);
        }
        catch (e) {
          errHandler(e);
        }
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerDeleteLink.mockResolvedValue({ error });

    const { result } = renderHook(() => useDeleteLink());
    await act(() => result.current.mutateAsync('1'));

    expect(toast.error).toHaveBeenCalledWith(`api_errors.${error.message}`);
  });
});

describe('useUpdateLink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates link and triggers onSuccess + toast', async () => {
    const onSuccess = vi.fn();

    mockMutation(({ onSuccess: success, mutationFn }: any) => ({
      mutateAsync: async (vars: any) => {
        await mutationFn(vars);
        success();
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerUpdateLink.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useUpdateLink({ onSuccess }));
    await act(() => result.current.mutateAsync({ id: '1', data: {} } as any));

    expect(onSuccess).toHaveBeenCalled();
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['links'] });
    expect(invalidateQueries).toHaveBeenCalledWith({ queryKey: ['tags'] });
    expect(toast.success).toHaveBeenCalledWith('links.update_link_dialog.form.success');
  });

  it('handles API error on update', async () => {
    const onError = vi.fn();
    const error = new Error('test-update-error');

    mockMutation(({ onError: errHandler, mutationFn }: any) => ({
      mutateAsync: async (vars: any) => {
        try {
          await mutationFn(vars);
        }
        catch (e) {
          errHandler(e);
        }
      },
    }) as unknown as UseMutationResult);

    mockApiClient.linksControllerUpdateLink.mockResolvedValue({ error });

    const { result } = renderHook(() => useUpdateLink({ onError }));
    await act(() => result.current.mutateAsync({ id: '1', data: {} } as any));

    expect(onError).toHaveBeenCalledWith(error);
    expect(toast.error).toHaveBeenCalledWith(`api_errors.${error.message}`);
  });
});
