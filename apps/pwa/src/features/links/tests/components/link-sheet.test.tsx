import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LinkSheet } from '../../components/link-sheet';
import { useDeleteLink } from '../../hooks/links';

vi.mock('@/features/links/hooks/links', () => ({
  useDeleteLink: vi.fn(),
}));

const mockDeleteLink = vi.fn();

// Mock fallback image import
vi.mock('@/assets/images/fallback-img.webp', () => ({
  default: 'fallback-img.webp',
}));

// Mock child components to keep tests simple
vi.mock('@/features/links/components/link-card', () => ({
  LinkCard: ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} type="button">Mock LinkCard</button>
  ),
}));
vi.mock('@/features/links/components/edit-link-dialog', () => ({
  EditLinkDialog: ({ trigger }: { trigger: React.ReactNode }) => <div>{trigger}</div>,
}));
vi.mock('@/components/common/alert-button', () => ({
  AlertButton: ({ children, onConfirm }: any) => (
    <div>
      {children}
      <button onClick={onConfirm} type="button">Mock Delete Confirm</button>
    </div>
  ),
}));

describe('linkSheet', () => {
  const linkBase = {
    id: '1',
    title: 'Link Title',
    url: 'https://kinl.com',
    description: 'Link description',
    tags: [{ id: '1', name: 'tag1' }, { id: '2', name: 'tag2' }],
    image: 'https://kinl.com/image.png',
    generated: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useDeleteLink as any).mockReturnValue({ mutate: mockDeleteLink });
  });

  it('opens sheet when LinkCard is clicked', () => {
    render(
      <MemoryRouter>
        <LinkSheet link={linkBase} />
      </MemoryRouter>,
    );

    screen.debug();

    expect(screen.queryByText(/link description/i)).not.toBeInTheDocument();

    // Click mock LinkCard (SheetTrigger)
    fireEvent.click(screen.getByText(/mock linkcard/i));

    expect(screen.getByText(/link description/i)).toBeInTheDocument();

    const links = screen.getAllByRole('link', { name: /link title/i });
    expect(links[0]).toHaveAttribute('href', linkBase.url);
  });

  it('calls deleteLink when delete is confirmed', () => {
    render(
      <MemoryRouter>
        <LinkSheet link={linkBase} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/mock linkcard/i)); // open sheet
    fireEvent.click(screen.getByText(/mock delete confirm/i));

    expect(mockDeleteLink).toHaveBeenCalledWith(linkBase.id);
  });

  it('uses fallback image when link.image is missing', () => {
    const linkWithoutImage = { ...linkBase, image: undefined };
    render(
      <MemoryRouter>
        <LinkSheet link={linkWithoutImage} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/mock linkcard/i)); // open sheet
    const img = screen.getByRole('presentation');
    expect(img).toHaveAttribute('src', 'fallback-img.webp');
  });

  it('renders tags list', () => {
    render(
      <MemoryRouter>
        <LinkSheet link={linkBase} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText(/mock linkcard/i)); // open sheet
    expect(screen.getByText(/tag1/i)).toBeInTheDocument();
    expect(screen.getByText(/tag2/i)).toBeInTheDocument();
  });
});
