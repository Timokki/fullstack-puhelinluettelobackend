const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

// Route juureen. Routet ovat tapahtumankäsittelijöitä, jotka käsittelevät pyynnöt osoitteeseen.
// request parametri sisältää pyynnön tiedot ja responsen avulla määritellään miten pyyntöön vastataan

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

// Route /api/persons hakemistoon
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

// Route /api/persons/id hakemistoon
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  console.log(`Person id: ${id}`)

  if (person) {    
    res.json(person)  
  } 
  else {
      res.status(404).end()  
    }
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
  //app.use(morgan(':id :method :url :response-time'))
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
    
    
  
    const person = {
      id: generateId(),
      name: body.name,
      number: body.number
    }
  
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})