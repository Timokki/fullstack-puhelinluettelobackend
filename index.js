require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
/* Ilman json-parserin lisäämistä eli komentoa app.use(express.json())
pyynnön kentän body arvo olisi ollut määrittelemätön.
json-parserin toimintaperiaatteena on, että se ottaa pyynnön mukana olevan JSON-muotoisen datan,
muuttaa sen JavaScript-olioksi ja sijoittaa request-olion kenttään body ennen kuin routen
käsittelijää kutsutaan. */
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personInfo'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    response.status(400).json({ error: error.message })
  }
  next(error)
}

//app.use(morgan('tiny'))
/*eslint no-unused-vars: ["error", { "args": "none" }]*/
morgan.token('personInfo', (request, response) => {
  JSON.stringify(request.body)
})

// Route juureen. Routet ovat tapahtumankäsittelijöitä, jotka käsittelevät pyynnöt osoitteeseen.
// request parametri sisältää pyynnön tiedot ja responsen avulla määritellään miten pyyntöön vastataan

app.get('/', (request, response) => {
  console.log('app.get /')
  response.send('<h1>Hello World!</h1>')
})

// Route /api/persons hakemistoon
app.get('/api/persons', (request, response, next) => {
  console.log('app.get /api/persons')
  Person.find({}).then(person => {
    response.json(person)
  })
    .catch(error => next(error))
})

// Route /api/persons/id hakemistoon
app.get('/api/persons/:id', (request, response, next) => {
  console.log('GET /api/persons/:id')
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    }
    else {
      response.status(404).end()
    }
  })
  /* catch-lohko jossa käsitellään tapaukset, joissa findById-metodin
  palauttama promise päätyy rejected-tilaan
  */
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id).then(result => {
    response.status(204).end()
  })
    .catch(error => next(error))
})

// Route /info hakemistoon
app.get('/info', (request, response) => {
  console.log('!!!! /info route')
  let reqTime = new Date(Date.now())
  morgan(':method :url :status :res[content-length] - :response-time ms')
  response.send(
    `phonebook has info for ${Person.length} people <br>
        ${reqTime.toString()}`
  )
})

app.post('/api/persons', (request, response, next) => {
  console.log(`request.body: ${request.body.name}`)
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  // Käytä callback-funktiota. Then-ketjutus ei toimi kuten normaaleissa
  // promisen palauttavissa funktioissa.
  Person.findOne({ name: body.name }, (err, doc) => {
    if (doc !== null)
    {
      try {
        if (err) return err

        console.log(`doc.name.toLowerCase() ${doc.name.toLowerCase()} === body.name.toLowerCase() ${body.name.toLowerCase()}`)
        // findOne-metodi on casesensitiivinen, joten alla oleva if-ehto tarpeeton toistaiseksi.
        if (doc.name === body.name){
          throw 'Name unique validation error'
        }
      }
      catch (err)
      {
        return response.status(400).json({
          error: err }) //'Name must be unique'
      }
    } else{
      const person = new Person({
        name: body.name,
        number: body.number
      })

      /*Pyyntöön vastataan save-operaation takaisinkutsufunktion sisällä.
          Näin varmistutaan, että operaation vastaus tapahtuu vain, jos operaatio
          on onnistunut. Palaamme virheiden käsittelyyn myöhemmin.*/
      person.save()
        .then(savedPerson => savedPerson.toJSON())
        .then(savedAndFormattedPerson => response.json(savedAndFormattedPerson))
        .catch(error => next(error))
    }
  })
})

// Numeron päivitys jo olemassa olevalle henkilölle.
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new : true })
    .then(updatePerson => {
      response.status(204).json(updatePerson)
    })
    .catch(error => next(error))
})

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

//const PORT = process.env.PORT || 3001
// eslint-disable-next-line no-undef
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})