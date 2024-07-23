import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const [,, title] = process.argv
const today = new Date().toJSON().split('T')[0]

const filename = `${[today, ...title.split(' ')].join('-')}.md`
const content = `
---
title: <Full Title Here>
---
`.trim()

const __filename = fileURLToPath(import.meta.url)
const localPath = path.join('input', filename)
const writePath = path.join(path.dirname(__filename), '..', localPath)
fs.writeFile(writePath, content, { flag: 'a+' }, (err) => {
  if (err) throw err
  console.log(`${localPath} written...`)
})
