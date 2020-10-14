const mongoose = require('mongoose')
const restList = require('../../restaurant.json')

// 載入model
const Rest = require('../restaurant')
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
  for (let object of restList.results) {
    Rest.create(object)
  }
  console.log('Done!')
})