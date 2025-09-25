import { defineCommand } from 'citty'

import { sort } from '@/cli/sort'
import { version } from '~/package.json'

const APP_VERSION = version

const main = defineCommand({
  meta: {
    description: 'CLI app for optimizing your tsconfig',
    name: 'tsf',
    version: APP_VERSION,
  },
  subCommands: {
    sort: sort,
  },
})

export {
  main,
}
