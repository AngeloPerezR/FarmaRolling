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
    type: String,
    required: true
  },
  linkDePago: {
    type: String,
    required: true
  },
  estadoDePago: {
    type: String,
    default: 'pendiente',
    enum: ['pendiente', 'pagado', 'cancelado']
  }
})

const OrdenModel = model('orden', OrdenSchema)
module.exports = OrdenModel