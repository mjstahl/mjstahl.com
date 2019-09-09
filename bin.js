#!/usr/bin/env node

const ejs = require('ejs')
const fs = require('fs')
const mkdirp = require('mkdirp')
const marked = require('marked')
const metadataParser = require('markdown-yaml-metadata-parser')
const moment = require('moment')
const path = require('path')
const process = require('process')

const BUILD_DIR = 'docs'
const CONTENT_DIR = 'content'
const TEMPLATE_DIR = 'templates'

function dateAndTitle (str) {
  const date = str.split('-').slice(0, 3).join('-')
  const title = str.split('-').slice(3).join(' ')
  return [
    moment(date, 'YY-MM-DD').format('DD MMM YY'),
    title.charAt(0).toUpperCase() + title.slice(1),
    moment(date, 'YY-MM-DD').toDate().toUTCString()
  ]
}

function writeListTemplate (template, data, output) {
  ejs.renderFile(template, { posts: data }, {}, (err, result) => {
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

const posts = []
fs.readdirSync(CONTENT_DIR).map(file => {
  const baseFilename = path.basename(file, '.md')
  const source = fs.readFileSync(path.join(CONTENT_DIR, file))

  const [date, title, utc] = dateAndTitle(baseFilename)
  const { /** metadata, */ content } = metadataParser(source.toString())
  const body = marked(content)

  const postTemplate = path.join(TEMPLATE_DIR, 'post.ejs')
  ejs.renderFile(postTemplate, { body, date, title }, {}, (err, result) => {
    if (err) exitWithError(err)

    posts.push({ date, href: `${baseFilename}.html`, title, utc })

    const outputFile = path.join(BUILD_DIR, `${baseFilename}.html`)
    fs.writeFileSync(outputFile, result)
  })
})

const listTemplate = path.join(TEMPLATE_DIR, 'list.ejs')
writeListTemplate(listTemplate, posts, 'index.html')

const rssTemplate = path.join(TEMPLATE_DIR, 'rss.ejs')
writeListTemplate(rssTemplate, posts, 'rss.xml')
