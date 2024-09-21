const serviciosMedicamentos = require('../services/medicamentos.service')

const obtenerLosMedicamentos = async (req, res) => {
  try {
    const medicamentos = await serviciosMedicamentos.traerTodosLosMedicamentos()
    if (medicamentos.statusCode === 200) {
      res.status(200).json(medicamentos.medicamentos)
    }

  } catch (error) {
    console.log(error)
  }
}

const obtenerMedicamento = async (req, res) => {
  try {
    const medicamento = await serviciosMedicamentos.traerUnMedicamento(req.params.idMedicamento)

    if (medicamento.statusCode === 200) {
      res.status(200).json(medicamento.medicamento)
    }


  } catch (error) {
    console.log(error)
  }

}

const crearMedicamento = async (req, res) => {
  try {

    const medicamento = await serviciosMedicamentos.nuevoMedicamento(req.body)

    if (medicamento.statusCode === 201) {
      res.status(201).json({ msg: medicamento.msg })
    }

  } catch (error) {
    console.log(error)
  }

}

const actualizarMedicamento = async (req, res) => {
  try {

    const medicamento = await serviciosMedicamentos.actualizarUnMedicamento(req.params.idMedicamento, req.body)

    if (medicamento.statusCode === 200) {
      res.status(200).json({ msg: medicamento.msg })
    }


  } catch (error) {
    console.log(error)
  }

}

const eliminarMedicamento = async (req, res) => {
  try {
    const medicamento = await serviciosMedicamentos.borrarMedicamento(req.params.idMedicamento)

    if (medicamento.statusCode === 200) {
      res.status(200).json({ msg: medicamento.msg })
    }

  } catch (error) {
    console.log(error)
  }

}



module.exports = {
  obtenerMedicamento,
  obtenerLosMedicamentos,
  crearMedicamento,
  actualizarMedicamento,
  eliminarMedicamento
}