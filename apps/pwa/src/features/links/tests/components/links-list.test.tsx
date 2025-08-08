import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseTopBar = {
  search: '',
};
vi.mock('@/contexts/topbar/topbar-provider', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTopBar: () => mockUseTopBar,
}));

vi.mock('../../hooks/links', () => ({
  useLinks: vi.fn(),
}));

vi.mock('../../components/link-sheet', () => ({
  LinkSheet: ({ link }: { link: any }) => <div>{link.title}</div>,
}));

// eslint-disable-next-line import/first
import { LinksList } from '../../components/links-list';
// eslint-disable-next-line import/first
import { useLinks } from '../../hooks/links';

const mockRefetch = vi.fn();
const mockLinksData = {
  data: [
    { id: '1', title: 'First link', createdAt: new Date(2025, 1, 1), tags: [{ name: 'tag1' }] },
    { id: '2', title: 'Second link', createdAt: new Date(2025, 2, 1), tags: [{ name: 'tag2' }] },
    { id: '3', title: 'Third link', createdAt: new Date(2025, 0, 1), tags: [{ name: 'tag3' }] },
  ],
};

describe('linksList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTopBar.search = '';
    (useLinks as any).mockReturnValue({
      data: mockLinksData,
      refetch: mockRefetch,
    });
  });

  it('renders links sorted by createdAt descending', () => {
    render(<LinksList />);
    const renderedTitles = screen.getAllByText(/link$/).map(el => el.textContent);

    expect(renderedTitles).toEqual(['Second link', 'First link', 'Third link']);
  });

  it('filters links by search in title or tags', () => {
    mockUseTopBar.search = 'second';
    const { rerender } = render(<LinksList />);
    expect(screen.getByText('Second link')).toBeDefined();
    expect(screen.queryByText('First link')).toBeNull();
    expect(screen.queryByText('Third link')).toBeNull();

    // Test tag filtering
    vi.clearAllMocks();
    mockUseTopBar.search = 'tag3';
    rerender(<LinksList />);
    expect(screen.getByText('Third link')).toBeDefined();
    expect(screen.queryByText('First link')).toBeNull();
    expect(screen.queryByText('Second link')).toBeNull();
  });

  it('calls refetch when tagsFilter changes', () => {
    const { rerender } = render(<LinksList tagsFilter={['tag1']} />);
    expect(mockRefetch).toHaveBeenCalledTimes(1);

    rerender(<LinksList tagsFilter={['tag2']} />);
    expect(mockRefetch).toHaveBeenCalledTimes(2);
  });

  it('renders no links if data is empty or filtered out', () => {
    vi.mocked(mockLinksData.data).splice(0, mockLinksData.data.length); // Clear data

    render(<LinksList />);
    expect(screen.queryByText(/link$/)).toBeNull();

    mockUseTopBar.search = 'nonexistent';
    render(<LinksList />);
    expect(screen.queryByText(/link$/)).toBeNull();
  });
});
