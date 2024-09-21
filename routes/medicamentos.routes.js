const { Router } = require('express')
const {crearMedicamento,obtenerLosMedicamentos, obtenerMedicamento,actualizarMedicamento,eliminarMedicamento} = require('../controllers/medicamentos.controllers')
const router = Router()

router.post('/', crearMedicamento)
router.get('/', obtenerLosMedicamentos)
router.get('/:idMedicamento', obtenerMedicamento)
router.put('/:idMedicamento', actualizarMedicamento)
router.delete('/:idMedicamento', eliminarMedicamento)

module.exports = router
