const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

//const url = `mongodb+srv://fullstack:${password}@cluster0.6kjcn.mongodb.net/myFirstDatabase?retryWrites=true`

const url = process.env.MONGODB_URI
console.log('connecting to', url)
mongoose.connect(url)

// Scheema kertoo mongooselle, miten oliot tulee tallettaa tietokantaan.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 8,
    //TODO: unique: true, ei toimi uniqueValidatorin kanssa oikein. 
    required: true
  },
  number: {
     type: String,
     minlength: 3,
     required: true
  }
})

personSchema.plugin(uniqueValidator)

personSchema.set('toJSON', {
  transform: (document, responsePerson) => {
    responsePerson.id = responsePerson._id.toString()
    delete responsePerson._id
    delete responsePerson.__v
  }
})

mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
  })  
.catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

/*Moduulin ulos näkyvä osa määritellään asettamalla arvo muuttujalle module.exports. 
Asetamme arvoksi modelin Person. Muut moduulin sisällä määritellyt asiat, 
esim. muuttujat mongoose ja url eivät näy moduulin käyttäjälle.*/
module.exports = mongoose.model('Person', personSchema)