#!/usr/bin/env node

const fs = require('fs')
const marked = require('marked')
const moment = require('moment')
const path = require('path')

function dateAndTitle(str) {
  const date = str.split('-').slice(0, 3).join('-')
  const title = str.split('-').slice(3)
  return [
    moment(date, 'DD-MM-YY').format('DD MMM YY'),
    title.join(' ')
  ]
}

const CONTENT_DIR = './content'
fs.readdirSync(CONTENT_DIR).map(file => {
  const [date, title] = dateAndTitle(file.split('.')[0])
  const post = fs.readFileSync(path.join(CONTENT_DIR, file))
  const body = marked(post.toString())
})

