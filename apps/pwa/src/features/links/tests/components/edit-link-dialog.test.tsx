import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/ui/button';
import { EditLinkDialog } from '../../components/edit-link-dialog';

vi.mock('@/features/links/hooks/links', () => ({
  useUpdateLink: vi.fn(),
}));

vi.mock('@/features/tags/hooks/tags', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTags: () => ({
    data: [{ name: 'tag1' }, { name: 'tag2' }],
  }),
}));

// eslint-disable-next-line import/first
import { useUpdateLink } from '../../hooks/links';

vi.mock('react-i18next', () => ({
  // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('editLinkDialog', () => {
  it('submits form with valid data and defaultValues', async () => {
    const mockUpdateLink = vi.fn();
    (useUpdateLink as any).mockReturnValue({
      mutate: mockUpdateLink,
      isPending: false,
    });

    render(
      <EditLinkDialog
        trigger={<Button>Open</Button>}
        linkId="1"
        defaultValues={{ url: 'https://kinl.com', title: 'Link Title', description: 'Link description', tags: ['tag1', 'tag2'] }}
      />,
    );

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.url'));
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.title'));
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.description'));
    await user.type(screen.getByPlaceholderText('links.update_link_dialog.form.url'), 'https://updated.kinl.com');
    await user.type(screen.getByPlaceholderText('links.update_link_dialog.form.title'), 'Updated Title');
    await user.type(screen.getByPlaceholderText('links.update_link_dialog.form.description'), 'Updated description');

    // Add tags
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag1');
    await user.click(screen.getByLabelText('Add tag to the list'));
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag2');
    await user.click(screen.getByLabelText('Add tag to the list'));
    await user.type(screen.getByPlaceholderText('tags.create_tags_input.placeholder'), 'tag3');
    await user.click(screen.getByLabelText('Add tag to the list'));

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.update_link_dialog.form.submit' }));

    expect(mockUpdateLink).toHaveBeenCalledWith({
      id: '1',
      data: {
        url: 'https://updated.kinl.com',
        title: 'Updated Title',
        description: 'Updated description',
        tags: ['tag1', 'tag2', 'tag3'],
      },
    });
  });

  it('submits form with invalid datas', async () => {
    const mockUpdateLink = vi.fn();
    (useUpdateLink as any).mockReturnValue({
      mutate: mockUpdateLink,
      isPending: false,
    });

    render(
      <EditLinkDialog
        trigger={<Button>Open</Button>}
        linkId="1"
        defaultValues={{ url: 'https://kinl.com', title: 'Link Title', description: 'Link description', tags: ['tag1', 'tag2'] }}
      />,
    );

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.url'));
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.title'));
    await user.clear(screen.getByPlaceholderText('links.update_link_dialog.form.description'));
    await user.type(screen.getByPlaceholderText('links.update_link_dialog.form.url'), 'this is an invalid url');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.update_link_dialog.form.submit' }));

    expect(mockUpdateLink).not.toHaveBeenCalled();
    expect(screen.getByText('links.update_link_dialog.form.errors.invalid_url')).toBeInTheDocument();
    expect(screen.getByText('links.update_link_dialog.form.errors.invalid_title')).toBeInTheDocument();
  });

  it('submits form with removed one tag', async () => {
    const mockUpdateLink = vi.fn();
    (useUpdateLink as any).mockReturnValue({
      mutate: mockUpdateLink,
      isPending: false,
    });

    render(
      <EditLinkDialog
        trigger={<Button>Open</Button>}
        linkId="1"
        defaultValues={{ url: 'https://kinl.com', title: 'Link Title', description: 'Link description', tags: ['tag1', 'tag2'] }}
      />,
    );

    const user = userEvent.setup();

    // Open the dialog
    await user.click(screen.getByRole('button', { name: /open/i }));

    // Fill the form

    // Remove one tag
    await user.click(screen.getByText('tag1'));

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'links.update_link_dialog.form.submit' }));

    expect(mockUpdateLink).toHaveBeenCalledWith({
      id: '1',
      data: {
        url: 'https://kinl.com',
        title: 'Link Title',
        description: 'Link description',
        tags: ['tag2'],
      },
    });
  });
});
