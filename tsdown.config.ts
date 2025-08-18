import path from 'path'
import { defineConfig, type UserConfigFn } from 'tsdown'

export default defineConfig(((opts) => {
  const prod = opts.env?.NODE_ENV === 'production'

  return {
    alias: {
      '@': path.resolve('./src'),
      '~': path.resolve('./'),
    },
    external: ['typescript'],
    minify: prod,
    platform: 'node',
    report: prod,
    target: ['node22'],
  }
}) satisfies UserConfigFn)
