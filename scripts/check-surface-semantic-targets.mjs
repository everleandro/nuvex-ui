import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const targetFiles = [
  'src/components/layout/main.vue',
  'src/components/layout/drawer/style.scss',
  'src/components/layout/bar/style.scss',
  'src/components/card/style.scss',
  'src/components/button/style.scss',
]

const numericSurfacePattern = /--e-(color|contrast)-surface-[0-9]/
const semanticSurfacePattern = /surface-(canvas|base|raised|subtle)/

const violations = []

for (const relativePath of targetFiles) {
  const absolutePath = resolve(process.cwd(), relativePath)
  const content = readFileSync(absolutePath, 'utf8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    if (!numericSurfacePattern.test(line)) {
      return
    }

    // Numeric surface tokens are allowed only as fallback on a semantic token line.
    if (semanticSurfacePattern.test(line)) {
      return
    }

    violations.push(`${relativePath}:${index + 1}: ${line.trim()}`)
  })
}

if (violations.length > 0) {
  console.error('Found direct numeric surface token usage without semantic alias in target files:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log('Surface semantic check passed for target files.')
