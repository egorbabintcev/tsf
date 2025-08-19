import { defineCommand, runMain } from 'citty'

import { version } from '~/package.json'

import { createConfigTree } from './tree'

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
    const configTree = createConfigTree(args.searchPath, args.configName)

    console.log(configTree)
  },
})

runMain(main)
