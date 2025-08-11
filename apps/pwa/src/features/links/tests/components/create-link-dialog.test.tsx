import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';
import { CreateLinkDialog } from '../../components/create-link-dialog';

vi.mock('@/features/links/hooks/links', () => ({
  useCreateLink: vi.fn(),
}));

vi.mock('@/features/tags/hooks/tags', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTags: () => ({
    data: [{ name: 'tag1' }, { name: 'tag2' }],
  }),
}));

// eslint-disable-next-line import/first
import { useCreateLink } from '../../hooks/links';

vi.mock('react-i18next', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('createLinkDialog', () => {
  it('submits form with valid data', async () => {
    const mockCreateLink = vi.fn();
    (useCreateLink as any).mockReturnValue({
      mutate: mockCreateLink,
      isPending: false,
    });

    render(<CreateLinkDialog trigger={<Button>Open</Button>} />);

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.url'), 'https://kinl.com');
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.title'), 'Link Title');
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.description'), 'Link description');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.create_link_dialog.form.submit' }));

    expect(mockCreateLink).toHaveBeenCalledWith({
      url: 'https://kinl.com',
      title: 'Link Title',
      description: 'Link description',
      tags: undefined,
    });
  });

  it('submits form with valid data and tags', async () => {
    const mockCreateLink = vi.fn();
    (useCreateLink as any).mockReturnValue({
      mutate: mockCreateLink,
      isPending: false,
    });

    render(<CreateLinkDialog trigger={<Button>Open</Button>} />);

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.url'), 'https://kinl.com');
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.title'), 'Link Title');
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.description'), 'Link description');

    // Add tags
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag1');
    await user.click(screen.getByLabelText('Add tag to the list'));
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag2');
    await user.click(screen.getByLabelText('Add tag to the list'));
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag3');
    await user.click(screen.getByLabelText('Add tag to the list'));

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.create_link_dialog.form.submit' }));

    expect(mockCreateLink).toHaveBeenCalledWith({
      url: 'https://kinl.com',
      title: 'Link Title',
      description: 'Link description',
      tags: ['tag1', 'tag2', 'tag3'],
    });
  });

  it('submits form only with required data', async () => {
    const mockCreateLink = vi.fn();
    (useCreateLink as any).mockReturnValue({
      mutate: mockCreateLink,
      isPending: false,
    });

    render(<CreateLinkDialog trigger={<Button>Open</Button>} />);

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.url'), 'https://kinl.com');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.create_link_dialog.form.submit' }));

    expect(mockCreateLink).toHaveBeenCalledWith({
      url: 'https://kinl.com',
      tags: undefined,
    });
  });

  it('submits form with invalid data', async () => {
    const mockCreateLink = vi.fn();
    (useCreateLink as any).mockReturnValue({
      mutate: mockCreateLink,
      isPending: false,
    });

    render(<CreateLinkDialog trigger={<Button>Open</Button>} />);

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.type(screen.getByPlaceholderText('links.create_link_dialog.form.url'), 'this is an invalid url');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.create_link_dialog.form.submit' }));

    expect(mockCreateLink).not.toHaveBeenCalled();
    expect(screen.getByText('links.create_link_dialog.form.errors.invalid_url')).toBeInTheDocument();
  });
});
