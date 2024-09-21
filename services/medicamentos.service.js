const MedicamentosModel = require("../models/medicamentos.schema")

const nuevoMedicamento = async(body) => {
  const medicamento = new MedicamentosModel(body)
  await medicamento.save()
  return{
    msg:'Medicamento agregada',
    statusCode: 201
  }
}

const traerTodosLosMedicamentos = async () => {
  const medicamentos = await MedicamentosModel.find()
  return{
    medicamentos,
    statusCode: 200
  }
}

const traerUnMedicamento = async(idMedicamento) => {
  const medicamento = await MedicamentosModel.findById(idMedicamento)
  return {
    medicamento,
    statusCode: 200
  }
}

const actualizarUnMedicamento = async (idMedicamento, body) => {
  const medicamentoActualizada = await MedicamentosModel.findByIdAndUpdate({_id: idMedicamento}, body, {new: true})
  return{
    msg:'Medicamento actualizado',
    medicamentoActualizada,
    statusCode: 200
  }  
}

const borrarMedicamento = async(idMedicamento) => {
  await MedicamentosModel.findByIdAndDelete({_id: idMedicamento})
  return{
    msg:'Medicamento borrado',
    statusCode: 200
  }
}

module.exports = {
nuevoMedicamento,
traerTodosLosMedicamentos,
traerUnMedicamento,
actualizarUnMedicamento,
borrarMedicamento
}