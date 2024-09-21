const { Schema, model } = require('mongoose')

const MedicamentosSchema = new Schema({
  nombre:{
    type: String,
    required: true,
    unique: true
  }, 
  precio:{
    type: Number,
    required: true,
  },
  cantidad:{
    type: Number,     
    required: true,
  }
})

const MedicamentosModel = model('medicament', MedicamentosSchema)
module.exports = MedicamentosModel