import { defineCommand, runMain } from 'citty'
import util from 'node:util'

import { getConfigSpec } from '@/core/get-spec'
import { resolveConfigTree } from '@/core/resolve-tree'
import { version } from '~/package.json'

const APP_VERSION = version

const main = defineCommand({
  args: {
    configName: {
      default: 'tsconfig.json',
      description: 'Name of the tsconfig file',
      type: 'string',
    },
    searchPath: {
      default: './',
      description: 'Path to the directory where the tsconfig file is located',
      type: 'positional',
    },
  },
  meta: {
    name: 'tsf',
    version: APP_VERSION,
  },
  async run({ args }) {
    const rootConfigSpec = getConfigSpec(args.searchPath, args.configName)
    const configTree = resolveConfigTree(rootConfigSpec)

    console.log(util.inspect(configTree, { colors: true, depth: Infinity }))
  },
})

runMain(main)
