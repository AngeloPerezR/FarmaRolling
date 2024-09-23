const serviciosProductos = require('../services/productos.services')

const obtenerUnProductoPorIdOTodos = async(req, res) => {
  try {
    const id = req.query.id  
    const limit = req.query.limit || 10
    const to = req.query.to || 0
    
    if (id) {
      const producto = await serviciosProductos.obtenerUnProducto(id)
      res.status(200).json(producto)
    } else {
      const productos = await serviciosProductos.obtenerTodosLosProductos(limit, to)

      res.status(200).json(productos)
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const crearProducto = async (req, res) => {
  try {
    const nuevoProducto = await serviciosProductos.nuevoProducto(req.body)
    await nuevoProducto.save()
    res.status(201).json(nuevoProducto)

  } catch (error) {
    res.status(500).json(error)
  }
}

const editarProductoPorId = async(req, res) => {
  try {
    const id = req.params.idProducto
    const productoActualizado = await  serviciosProductos.editarProducto(id, req.body)
    res.status(200).json(productoActualizado)
  } catch (error) {
    res.status(500).json(error)
  }
}

const eliminarProductoPorId = async(req, res) => {
  try {
    const id = req.params.idProducto
    let productoEliminado = await serviciosProductos.eliminarProducto(id)
    console.log("Res",res)
    if (productoEliminado === 200) {
      res.status(200).json({ msg: 'Producto eliminado' })
    }

  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

const agregarImagenProductoPorId = async(req, res) => {
  try {
    if(!req.file){
      return res.status(400).json({msg:'Formato de imagen incorrecto o error en la solicitud'})
      
    }
    const resultado = await serviciosProductos.agregarImagen(req.params.idProducto, req.file)
    if(resultado === 200){
      return res.status(200).json({msg:'Se agrego la imagen correctamente'})
    }
    /* file - path - multer - cloudinary */
    /* c://user/destok/imagen.jpg - .jpg - file */
  } catch (error) {
    console.log(error)
    return res.status(500).json({msg:'Error del servidor'})
  }
}

const buscarProductoPorTermino = async (req, res) => {
  try {
    const resultado = await serviciosProductos.buscarProducto(req.query.termino)
    res.status(200).json(resultado);
  } catch (error) {
    console.log(error)
    res.status(500).json("Error del servidor");
  }
}

const agregarProductoAlCarrito = async (req, res) => {
  try {
    const result = await serviciosProductos.agregarProducto(req.idUsuario, req.params.idProducto)

    if(result.statusCode === 200){
      res.status(200).json({msg: result.msg})
    }else if(result.statusCode === 400){
      res.status(400).json({msg: result.msg})
    }
  } catch (error) {
    res.status(500).json({msg: "Error del servidor"})
    console.log(error)
  }
}

const borrarProductoCarrito = async(req, res) => {
  try {
    const result = await serviciosProductos.quitarProducto(req.idUsuario, req.params.idProducto)
    if(result.statusCode === 200){
      res.status(200).json({msg: result.msg})
    }
    else if(result.statusCode === 400){
      res.status(400).json({msg: result.msg})
    }

  } catch (error) {
    console.log(error)
    res.status(400).json({msg: error})
  }
}

const agregarProductoAlFavoritos = async (req, res) => {
  try {
    const result = await serviciosProductos.agregarProductoFav(req.idUsuario, req.params.idProducto)

    if(result.statusCode === 200){
      res.status(200).json({msg: result.msg})
    }else if(result.statusCode === 400){
      res.status(400).json({msg: result.msg})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: "Error del servidor"})
  }
}

const borrarProductoFavoritos = async(req, res) => {
  try {
    const result = await serviciosProductos.quitarProductoFav(req.idUsuario, req.params.idProducto)
    if(result.statusCode === 200){
      res.status(200).json({msg: result.msg})
    }else if(result.statusCode === 400){
      res.status(400).json({msg: result.msg})
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({msg: 'Error del servidor'})
  }
}

const mercadoPago = async (req, res) => {
  try {

    const resultMp = await serviciosProductos.pagoConMP(req.body)
    if(resultMp.statusCode === 200){
      res.status(200).json(resultMp.result.init_point)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  obtenerUnProductoPorIdOTodos,
  crearProducto,
  editarProductoPorId,
  eliminarProductoPorId,
  agregarImagenProductoPorId,
  buscarProductoPorTermino,
  agregarProductoAlCarrito,
  borrarProductoCarrito,
  agregarProductoAlFavoritos,
  borrarProductoFavoritos,
  mercadoPago
}