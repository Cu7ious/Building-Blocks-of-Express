var express = require('express')
var app = express()

var body = require('body-parser')
var urlencode = body.urlencoded({extended: false})

app.use(express.static('public'))

var redis = require('redis')
var client = redis.createClient()

client.select((process.env.NODE_ENV || 'development').length)

client.on('error', function (err) {
  console.log('Error ' + err)
})

// client.hset('cities', "Lotopia", "Fantastic city.");
// client.hset('cities', "Caspiana", "The city on Caspian Sea.");
// client.hset('cities', "Indigo", "The city of the fags.");

app.get('/cities', function (req, res) {
  client.hkeys('cities', function (err, names) {
    if (err) throw err

    console.log(names)

    res.json(names)
  })
})

app.post('/cities', urlencode, function (req, res) {
  var newCity = req.body

  if (!newCity.name || !newCity.description) {
    res.sendStatus(400)
    return false
  }

  client.hset('cities', newCity.name, newCity.description, function (err) {
    if (err) throw err

    res.json(newCity.name)
  })
})

app.delete('/cities/:name', function (req, res) {
  client.hdel('cities', req.params.name, function (err) {
    if (err) throw err

    res.sendStatus(204)
  })
})

app.get('/cities/:name', function (req, res) {
  client.hget('cities', req.params.name, function (err, description) {
    if (err) throw err

    res.render('show.ejs', {
      city: {
        name: req.params.name,
        description: description
      }
    })
  })
})

module.exports = app
