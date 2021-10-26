const { json } = require('express')
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
//app.use(morgan('tiny'))
morgan.token('personInfo', (request, response) =>
{
  return JSON.stringify(request.body)
})

// Route juureen. Routet ovat tapahtumankäsittelijöitä, jotka käsittelevät pyynnöt osoitteeseen.
// request parametri sisältää pyynnön tiedot ja responsen avulla määritellään miten pyyntöön vastataan

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Route /api/persons hakemistoon
app.get('/api/persons', (req, res) => {
  Person.find({}).then(person => {
    res.json(person)
  })
})

// Route /api/persons/id hakemistoon
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    if (person) {    
      res.json(person)  
    } 
    else {
        res.status(404).end()  
      }
  })
  /* catch-lohko jossa käsitellään tapaukset, joissa findById-metodin 
  palauttama promise päätyy rejected-tilaan
  */
  .catch(error => {
    console.log(error)      
    res.status(400).send({ error: 'malformatted id' })    
  })
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id) //Palauttaa taulukon jossa on kaikki muut paitsi person.id objekti

  res.status(204).end()
})

// Route /info hakemistoon
app.get('/info', (req, res) => {
    let reqTime = new Date(Date.now())
    morgan(':method :url :status :res[content-length] - :response-time ms')
    res.send(
        `phonebook has info for ${persons.length} people <br>
        ${reqTime.toString()}`
    )
  })

  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :personInfo'))

  app.post('/api/persons', (request, response) => {
    //console.log(`request.body: ${request.body.name}`)
    const body = request.body
    
    //console.log(JSON.stringify(request.body))

    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })
    }

    if (persons.some(p => p.name === body.name )){
      return response.status(400).json({ 
        error: 'Name must be unique' 
      })
    }
    
    const person = new Person({
      name: body.name,
      number: body.number
    })
  
    /*Pyyntöön vastataan save-operaation takaisinkutsufunktion sisällä. 
    Näin varmistutaan, että operaation vastaus tapahtuu vain, jos operaatio 
    on onnistunut. Palaamme virheiden käsittelyyn myöhemmin.*/
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })

    persons = persons.concat(person)
  
    response.json(person)
  })

  const generateId = () => {
    const newId = Math.floor(Math.random() * 38000)

    return newId
    // Jos person-lenght on isompi kuin 0, niin maxId saa arvokseen 
    /*const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id)) //luodaan uusi taulukko jossa vain id-numerot, josta max()-funktiolla etsitään suurin arvo
      : 0

    return maxId + 1
    */
  }

//const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})