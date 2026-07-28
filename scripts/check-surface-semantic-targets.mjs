import { readdirSync, readFileSync } from 'node:fs'
import { extname, relative, resolve } from 'node:path'

const scanRoots = [
  'src',
  'public/styles',
  'playground/src',
  'docs',
]

const allowedExtensions = new Set(['.css', '.js', '.json', '.md', '.mjs', '.scss', '.ts', '.vue'])
const ignoredDirectories = new Set(['.git', '.vitepress', 'dist', 'node_modules'])
const numericSurfacePattern = /(^|[^a-z-])(surface-[0-3]|contrast-surface-[0-3]|--e-surface-[0-3]|--e-(color|contrast)-surface-[0-3])([^a-z0-9-]|$)/i

const workspaceRoot = resolve(process.cwd())

const collectFiles = (absoluteRoot) => {
  const entries = readdirSync(absoluteRoot, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const absoluteEntryPath = resolve(absoluteRoot, entry.name)

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue
      }

      files.push(...collectFiles(absoluteEntryPath))
      continue
    }

    if (!allowedExtensions.has(extname(entry.name))) {
      continue
    }

    files.push(relative(workspaceRoot, absoluteEntryPath))
  }

  return files
}

const targetFiles = scanRoots.flatMap((root) => collectFiles(resolve(workspaceRoot, root)))
const violations = []

for (const relativePath of targetFiles) {
  const absolutePath = resolve(process.cwd(), relativePath)
  const content = readFileSync(absolutePath, 'utf8')
  const lines = content.split('\n')

  lines.forEach((line, index) => {
    if (!numericSurfacePattern.test(line)) {
      return
    }

    violations.push(`${relativePath}:${index + 1}: ${line.trim()}`)
  })
}

if (violations.length > 0) {
  console.error('Found legacy numeric surface usage in source files:')
  for (const violation of violations) {
    console.error(`- ${violation}`)
  }
  process.exit(1)
}

console.log('Surface semantic check passed.')
