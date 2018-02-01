'use strict'
const BootBot = require('bootbot')
const guide = require('./chat.json')
console.log(process.env.FACEBOOK)
const bot = new BootBot({
  'accessToken': 'EAAVZAVn3QQ0EBAGheJjUUrkSSEjeTpR00HxLgCjKPpZBzWJj0kyHf4LBMYaimP9prT0PFNc9gw6kqLT4m5z2KSVeRUSBBAWZBKy74IPPynI6cKuRQE1JEsAgTWKZB1kkGosq3lkj3s5RTOUF2NEd8uyS1cT12Osf41VLLKizUgZDZD',
  'verifyToken': 'batman@00',
  'appSecret': 'c2052e751440e90db0781d4e817d3c77'
})

function walk (guide, cb, level) {
  level = level || 0
  level++
  var subject = Object
    .keys(guide)
    .map(e => ({k: e, v: guide[e]}))
    .filter(e => Array.isArray(e.v))
    .reduce((a, c) => { return a.v })
  if (subject && subject.v) {
    subject.v
      .forEach(e => {
        if (e && Array.isArray(e.subject)) {
          walk(e, cb, level)
        } else {
          cb(e, level)
        }
      })
  }
}

walk(guide, (element) => { console.log(element) })
walk(guide, (element, level) => {
  if (element.hear) {
    bot.hear(element.hear.split('|'), (payload, chat) => {
      chat.say(element.say, { typing: true })
    })
  }
})
console.log(guide)
// clone
//   .forEach((element) => {
//     bot.hear(element.user.split('|'), (payload, chat) => {
//       chat.say(element.bot, { typing: true })
//     })
//   })
// walk(guide.root, (element, level) => {
//   if (level === 1 && !Array.isArray(element)) {
//     bot.hear(element.user.split('|'), (payload, chat) => {
//       chat.say(element.bot, { typing: true })
//     })
//   }
// })
// walk(guide.root, discovery())
// walk(guide.root, (element) => { console.log(element) })

bot.hear(['hello', 'hi', /hey( there)?/i], (payload, chat) => {
  // Send a text message followed by another text message that contains a typing indicator
  chat.say('Hello, human friend!').then(() => {
    chat.say('How are you today?', { typing: true })
  })
})

bot.hear(['food', 'hungry'], (payload, chat) => {
  // Send a text message with quick replies
  chat.say({
    text: 'What do you want to eat today?',
    quickReplies: ['Mexican', 'Italian', 'American', 'Argentine']
  })
})

bot.hear(['help'], (payload, chat) => {
  // Send a text message with buttons
  chat.say({
    text: 'What do you need help with?',
    buttons: [
      { type: 'postback', title: 'Settings', payload: 'HELP_SETTINGS' },
      { type: 'postback', title: 'FAQ', payload: 'HELP_FAQ' },
      { type: 'postback', title: 'Talk to a human', payload: 'HELP_HUMAN' }
    ]
  })
})

bot.hear('image', (payload, chat) => {
  // Send an attachment
  chat.say({
    attachment: 'image',
    url: 'http://example.com/image.png'
  })
})

const askName = (convo) => {
  convo.ask(`What's your name?`, (payload, convo) => {
    const text = payload.message.text
    convo.set('name', text)
    convo.say(`Oh, your name is ${text}`).then(() => askFavoriteFood(convo))
  })
}

const askFavoriteFood = (convo) => {
  convo.ask(`What's your favorite food?`, (payload, convo) => {
    const text = payload.message.text
    convo.set('food', text)
    convo.say(`Got it, your favorite food is ${text}`).then(() => sendSummary(convo))
  })
}

const sendSummary = (convo) => {
  convo.say(`Ok, here's what  you told me about you:
      - Name: ${convo.get('name')}
      - Favorite Food: ${convo.get('food')}`)
  convo.end()
}

bot.hear('ask me something', (payload, chat) => {
  chat.conversation((convo) => {
    askName(convo)
  })
})

bot.start()
