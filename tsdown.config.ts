import path from 'path'
import { defineConfig, type UserConfigFn } from 'tsdown'

export default defineConfig(((opts) => {
  const prod = opts.env?.NODE_ENV === 'production'

  return {
    alias: {
      '@': path.resolve('./src'),
      '~': path.resolve('./'),
    },
    minify: prod,
    platform: 'node',
    report: prod,
    sourcemap: !prod,
    target: ['node22'],
  }
}) satisfies UserConfigFn)
