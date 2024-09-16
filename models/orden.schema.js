const {model, Schema} = require('mongoose')

const OrdenSchema = new Schema({
  idCliente: {
    type: String,
    required: true
  },
  productos: {
    type: Array
  },
  fecha: {
    type: Date,
    required: true
  }
})

const OrdenModel = model('orden', OrdenSchema)
module.exports = OrdenModel