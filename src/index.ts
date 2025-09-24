import { defineCommand, runMain } from 'citty'
import util from 'node:util'

import { ConfigDescriptor } from '@/core/descriptor'
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
    const config = new ConfigDescriptor(args.searchPath, args.configName)

    console.log(util.inspect(config.content, { colors: true, depth: Infinity }))
  },
})

runMain(main)
