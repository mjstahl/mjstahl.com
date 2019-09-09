#!/usr/bin/env node

const ejs = require('ejs')
const fs = require('fs')
const mkdirp = require('mkdirp')
const marked = require('marked')
const moment = require('moment')
const path = require('path')
const process = require('process')

const BUILD_DIR = 'build'
const CONTENT_DIR = 'content'
const TEMPLATE_DIR = './templates'

function dateAndTitle (str) {
  const date = str.split('-').slice(0, 3).join('-')
  const title = str.split('-').slice(3).join(' ')
  return [
    moment(date, 'YY-MM-DD').format('DD MMM YY'),
    title.charAt(0).toUpperCase() + title.slice(1)
  ]
}

mkdirp.sync(BUILD_DIR)

const posts = []
fs.readdirSync(CONTENT_DIR).map(file => {
  const baseFilename = path.basename(file, '.md')
  const post = fs.readFileSync(path.join(CONTENT_DIR, file))

  const [date, title] = dateAndTitle(baseFilename)
  const body = marked(post.toString())

  const postTemplate = path.join(TEMPLATE_DIR, 'post.ejs')
  ejs.renderFile(postTemplate, { body, date, title }, {}, (err, result) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    posts.push({ date, href: `${baseFilename}.html`, title })

    const outputFile = path.join(BUILD_DIR, `${baseFilename}.html`)
    fs.writeFileSync(outputFile, result)
  })
})

const listTemplate = path.join(TEMPLATE_DIR, 'list.ejs')
ejs.renderFile(listTemplate, { posts }, {}, (err, result) => {
  if (err) {
    console.log(err)
    process.exit(1)
  }
  const outputFile = path.join(BUILD_DIR, 'index.html')
  fs.writeFileSync(outputFile, result)
})
