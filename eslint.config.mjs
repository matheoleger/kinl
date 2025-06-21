import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    '**/dist/',
    '**/temp/',
    '**/build/',
    '**/public',
    'pnpm-lock.yaml',
    'pnpm-workspace.yaml',
    'packages/generated-api/client/',
  ],
})
