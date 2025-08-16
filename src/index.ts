import { defineCommand, runMain } from 'citty'

import { version } from '~/package.json'

const APP_VERSION = version

const main = defineCommand({
  meta: {
    name: 'tsf',
    version: APP_VERSION,
  },
  async run() {
    throw new Error('Not implemented')
  },
})

runMain(main)
