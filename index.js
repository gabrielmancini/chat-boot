'use strict'
const dbg = require('util').debuglog('chat')
const BootBot = require('bootbot')
const guide = require('./chat.json')
const bot = new BootBot({
  'accessToken': process.env.FACEBOOK_ACCESS_TOKEN,
  'verifyToken': process.env.FACEBOOK_VERIFY_TOKEN,
  'appSecret': process.env.FACEBOOK_APP_SECRET
})
const session = {}

function walk (guide, cb, level) {
  level = level || 0
  level++
  if (guide.subject) {
    guide.subject
      .forEach(e => walk(e, cb, level))
  }
  cb(guide, level)
}

dbg('guide', guide)

// walk(guide, (element) => { dbg(element) })
walk(guide, (element, level) => {
  if (element.hear) {
    dbg('hear', element.hear)
    bot.hear(element.hear.split('|'), (payload, chat) => {
      dbg('on-hear: %o', payload)
      session[payload.sender.id] = session[payload.sender.id] || []
      session[payload.sender.id].push('text', payload.message.text)
      var bootbotComponent = JSON.parse(JSON.stringify(element.bootbot))
      bootbotComponent.text = element.say
      chat.say(bootbotComponent, { typing: true }).then()
    })
  }
})

bot.on('message', (payload, chat, data) => {
  const text = payload.message.text
  if (data.captured) { return }
  chat.say(`Nao entendi: ${text} digite help`)
})

bot.hear('image', (payload, chat) => {
// Send an attachment
  chat.say({
    attachment: 'image',
    url: 'http://example.com/image.png'
  })
})
bot.start({port: process.env.PORT || 3000})
setInterval(function () {
  process.stdout.clearLine()  // clear current text
  process.stdout.cursorTo(0)  // move cursor to beginning of line
  process.stdout.write('Sessions: ' + Object.keys(session))  // write text
}, 300)
