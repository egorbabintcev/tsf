import path from 'path'
import { defineConfig, type UserConfigFn } from 'tsdown'

export default defineConfig(((opts) => {
  return {
    alias: {
      '@': path.resolve('./src'),
      '~': path.resolve('./'),
    },
    external: ['typescript'],
    minify: opts.env?.NODE_ENV === 'production',
    platform: 'node',
    target: ['node22'],
  }
}) satisfies UserConfigFn)
