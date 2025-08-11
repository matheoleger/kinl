import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LinkTagsList } from '../../components/link-tags-list';

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
}));

const tags = [
  { id: '1', name: 'tag1' },
  { id: '2', name: 'tag2' },
  { id: '3', name: 'tag3' },
  { id: '4', name: 'tag4' },
  { id: '5', name: 'tag5' },
];

describe('linkTagsList', () => {
  it('renders limited tags and shows +N badge when displayAll is false', () => {
    render(<LinkTagsList tags={tags} displayLimit={3} displayAll={false} />);

    expect(screen.getByText('tag1')).toBeDefined();
    expect(screen.getByText('tag2')).toBeDefined();
    expect(screen.getByText('tag3')).toBeDefined();

    expect(screen.queryByText('tag4')).toBeNull();
    expect(screen.queryByText('tag5')).toBeNull();

    // Should show +2 badge
    expect(screen.getByText('+2')).toBeDefined();
  });

  it('renders all tags when displayAll is true', () => {
    render(<LinkTagsList tags={tags} displayAll={true} />);

    tags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeDefined();
    });

    expect(screen.queryByText(/\+\d+/)).toBeNull();
  });

  it('renders all tags if number of tags is less than or equal to displayLimit', () => {
    const smallTags = tags.slice(0, 3);

    render(<LinkTagsList tags={smallTags} displayLimit={3} displayAll={false} />);

    smallTags.forEach((tag) => {
      expect(screen.getByText(tag.name)).toBeDefined();
    });

    expect(screen.queryByText(/\+\d+/)).toBeNull();
  });

  it('renders nothing if tags is empty or undefined', () => {
    const { container } = render(<LinkTagsList tags={[]} />);
    expect(container.querySelectorAll('li').length).toBe(0);

    const { container: container2 } = render(<LinkTagsList tags={undefined as any} />);
    expect(container2.querySelectorAll('li').length).toBe(0);
  });
});
