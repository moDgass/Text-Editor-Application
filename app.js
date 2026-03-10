// express is the library used to create a web server
// set up a simple editor route
const express = require('express')
const path = require('path')
const hbs = require('hbs')

// create application object
const app = express()

// make view engine treat .html files as handlebars templates
app.engine('html', hbs.__express)
app.set('view engine', 'html')
app.set('views', path.join(__dirname, 'views'))

// serve static files like css and javascript from public folder
app.use(express.static(path.join(__dirname, 'public')))

// main route renders  editor template
app.get('/', (req, res) => {
  res.render('editor')
})

// start the server on port 3000  
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
