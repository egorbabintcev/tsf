import { defineCommand } from 'citty'
import path from 'node:path'

import { ConfigDescriptor } from '@/core/descriptor'
import { sortTSConfig } from '@/core/sort'

const sort = defineCommand({
  args: {
    input: {
      default: './tsconfig.json',
      description: 'Path to the tsconfig file',
      type: 'positional',
    },
  },
  meta: {
    description: 'Sorts the properties of the given tsconfig file',
    name: 'sort',
  },
  async run({ args }) {
    const absInput = path.resolve(process.cwd(), args.input)
    const searchAt = path.dirname(absInput)
    const configName = path.basename(absInput)

    const config = new ConfigDescriptor(searchAt, configName)

    const sorted = sortTSConfig(config)

    await config.write(sorted)
  },
})

export {
  sort,
}
