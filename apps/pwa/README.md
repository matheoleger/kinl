# kinL PWA

## Develop

First of all, to start the PWA to develop, you can follow the steps from the [README.md](../../README.md#start-the-project) file.

To work on your front-end functionality, you need to create a folder corresponding to your functionality. This folder can contain the components, hooks, etc. that are related to your functionality:

```bash
apps/pwa/
├── features/
│   ├── <feature-name>/
│   │   ├── components/
│   │   │   ├── <component-name>.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── <hook-name>.ts
│   │   │   └── ...
│   │   ├── tests/
│   │   │   ├── <component-name>.test.tsx
│   │   │   ├── <hook-name>.test.ts
│   │   │   └── ...
└── routes/
    ├── <page-name>.tsx
    └── ...
```

You can call the API client from the components, hooks, etc. but we recommend to use the `useQuery` hook from `Tanstack query` to call the API client.

You can use it in a hook like this:

```ts
export function useCreateLink({ onSuccess, onError }: UseLinkMutationsOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['links'],
    mutationFn: async (data: CreateLinkSchema) => {
      const res = await apiClient.linksControllerCreateLink({ body: data }); // Here the API client is called

      if (res.error) {
        throw res.error; // Error are already handled by the API client so you need to use res.error to throw a new error and catch it with the onError callback.
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(t('links.create_link_dialog.form.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}
```

## Tests

To run the tests, you can use the following command:

```bash
pnpm test
```
