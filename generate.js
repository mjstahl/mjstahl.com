#!/usr/bin/env node

import { parse, format } from 'date-fns'
import ejs from 'ejs'
import fs from 'fs'
import { marked } from 'marked'
import metadataParser from 'markdown-yaml-metadata-parser'
import mkdirp from 'mkdirp'
import path from 'path'
import process from 'process'

const BUILD_DIR = 'docs'
const CONTENT_DIR = 'input'
const TEMPLATE_DIR = 'templates'

const YEAR = (new Date()).getFullYear()

function dateAndTitle (str) {
  const title = str.split('-').slice(3).join(' ')
  const date =
    parse(str.split('-').slice(0, 3).join('-'), 'dd-MM-yy', new Date())
  return [
    format(date, 'd MMMM yy'),
    title.charAt(0).toUpperCase() + title.slice(1),
    date.toUTCString()
  ]
}

function writeListTemplate (template, posts, output) {
  const data = { posts, year: YEAR }
  ejs.renderFile(template, data, {}, (err, result) => {
    if (err) exitWithError(err)

    const outputFile = path.join(BUILD_DIR, output)
    fs.writeFileSync(outputFile, result)
  })
}

function exitWithError (err) {
  console.error(err)
  process.exit(1)
}

mkdirp.sync(BUILD_DIR)
fs.copyFileSync(path.join(TEMPLATE_DIR, 'CNAME'), path.join(BUILD_DIR, 'CNAME'))

const posts = fs.readdirSync(CONTENT_DIR).map(file => {
  const baseFilename = path.basename(file, '.md')
  const source = fs.readFileSync(path.join(CONTENT_DIR, file))

  let [date, title, utc] = dateAndTitle(baseFilename)
  const { metadata, content } = metadataParser(source.toString())

  title = (metadata.title) ? metadata.title : title
  const body = marked(content)

  const postTemplate = path.join(TEMPLATE_DIR, 'post.ejs')
  const data = { body, date, title, year: YEAR }
  ejs.renderFile(postTemplate, data, {}, (err, result) => {
    if (err) exitWithError(err)

    const outputFile = path.join(BUILD_DIR, `${baseFilename}.html`)
    fs.writeFileSync(outputFile, result)

    console.log(`${baseFilename} >>> ${title}`)
  })
  return { date, href: `${baseFilename}.html`, title, utc }
})

const listTemplate = path.join(TEMPLATE_DIR, 'list.ejs')
writeListTemplate(listTemplate, posts, 'index.html')

const rssTemplate = path.join(TEMPLATE_DIR, 'rss.ejs')
writeListTemplate(rssTemplate, posts, 'rss.xml')
