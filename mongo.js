const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// Salasan on käynnistyksessä toisena argumenttinä
const password = process.argv[0]
const nameArg = process.argv[1]
const numberArg = process.argv[2]

//mongodb+srv://fullstack:<password>@cluster0.6kjcn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const url = `mongodb+srv://fullstack:${password}@cluster0.6kjcn.mongodb.net/myFirstDatabase?retryWrites=true`

  mongoose.connect(url)

// Scheema kertoo mongooselle, miten oliot tulee tallettaa tietokantaan.
const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Note = mongoose.model('Note', noteSchema)

// Muistiinpano luodaan mongoose.model konstruktorifunktion avulla.
const note = new Note({
  neme: nameArg,
  number: numberArg
})

// Koska oliot on luotu modelien konstruktorifunktiolla, niillä on kaikki modelien 
// ominaisuudet eli joukko metodeja, joiden avulla olioita voidaan mm. tallettaa tietokantaan.
note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close() // TÄRKEÄ, yhteys tietokantaan suljetaan vasta kun tallennus on valmis.
})