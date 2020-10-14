const express = require('express')
const app = express()
const exhbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Rest = require('./models/restaurant')
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

//set static folder
app.use(express.static('public'))
//set body-parser
app.use(bodyParser.urlencoded({ extended: true }))

//set template engine
app.engine('hbs', exhbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

//set route
app.get('/', (req, res) => {
  Rest.find()
    .lean()
    .then(rests => res.render('index', { resList: rests }))
    .catch(error => console.error(error))
})

app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  Rest.find({ id: id })
    .lean()
    .then(function (rest) {
      res.render('show', { rest: rest[0] })
    })
    .catch(error => console.error(error))
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.toLowerCase()
  // 不會使用mongoose-find的includes的功能

  Rest.find()
    .lean()
    .then(rests => {
      const searchRes = rests.filter(rest => rest.name.toLowerCase().includes(keyword))
      const searchRes2 = rests.filter(rest => rest.category.toLowerCase().includes(keyword))
      const searchResult = searchRes.concat(searchRes2)
      res.render('index', { resList: searchResult, keyword })
    })
    .catch(error => console.error(error))
})

// 新增餐廳清單
app.get('/new', (req, res) => {
  res.render('new')
})
app.post('/restaurants', (req, res) => {
  const body = req.body
  return Rest.create(body)
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})


app.listen(port, () => {
  console.log(`This Server is start on http://localhost:${port}`)
})
