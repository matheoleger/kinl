import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  css: true,
  html: true,
  typescript: true,
  ignores: [
    '**/.react-router/**',
    '**/components/ui/**',
    '**/dist/',
    '**/temp/',
    '**/build/',
    '**/public',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'packages/codegen-api/client/',
    '**/prisma/generated',
  ],
  stylistic: {
    semi: true,
  },
  // typescript: {
  //   tsconfigPath: '@kinl/tsconfig.base.json',
  // },
},
// Starting from the second arguments they are ESLint Flat Configs
// Careful, antfu renames some plugins for consistency https://github.com/antfu/eslint-config?tab=readme-ov-file#plugins-renaming
{
  files: ['apps/api/**/*.ts', 'apps/api/**/*.json'],
  rules: {
    'ts/consistent-type-imports': 'off',
    'node/prefer-global/process': ['error', 'always'],
  },
});
