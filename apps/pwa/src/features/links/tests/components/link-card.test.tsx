import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import fallbackImage from '@/assets/images/fallback-img.webp';
import { LinkCard } from '../../components/link-card';

describe('linkCard', () => {
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

  it('renders link card with title and tags', () => {
    render(<LinkCard link={linkBase} />);

    expect(screen.getByRole('heading', { name: /link title/i })).toBeInTheDocument();
    expect(screen.getByText('tag1')).toBeInTheDocument();
    expect(screen.getByText('tag2')).toBeInTheDocument();
  });

  it('click on link card', () => {
    const handleClick = vi.fn();
    render(<LinkCard link={linkBase} onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('uses image from link', () => {
    const { container } = render(<LinkCard link={linkBase} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe('https://kinl.com/image.png');
  });

  it('uses fallback image if link image is not set', () => {
    const link = {
      ...linkBase,
      image: undefined,
    };

    const { container } = render(<LinkCard link={link} />);

    expect(container.querySelector('img')?.getAttribute('src')).toBe(fallbackImage);
  });

  it('use fallback image on error', () => {
    const { container } = render(<LinkCard link={linkBase} />);

    const img = container.querySelector('img') as HTMLImageElement;

    // Simulate an error loading the image
    fireEvent.error(img);

    expect(img.src).toContain(fallbackImage);
  });
});
