import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  css: true,
  html: true,
  typescript: true,
  ignores: [
    '**/.react-router/**',
    '**/dist/',
    '**/temp/',
    '**/build/',
    '**/public',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'packages/generated-api/client/',
  ],
  stylistic: {
    semi: true,
  },
  // typescript: {
  //   tsconfigPath: '@kinl/tsconfig.base.json',
  // },
});
