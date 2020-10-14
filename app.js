const { static } = require('express')
const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')

const resList = require('./restaurant.json')
const port = 3000

// DB server set
mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})

app.use(express.static('public'))

app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index', { resList: resList.results })
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  const findRes = resList.results.find(rest => rest.id.toString() === id)
  console.log(id)
  res.render('show', { rest: findRes })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  const searchRes = resList.results.filter(rest => rest.name.toLowerCase().includes(keyword))
  const searchRes2 = resList.results.filter(rest => rest.category.toLowerCase().includes(keyword))
  const searchResult = searchRes.concat(searchRes2)
  res.render('index', { resList: searchResult, keyword })
})

app.listen(port, () => {
  console.log(`This Server is start on http://localhost:${port}`)
})
