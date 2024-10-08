const ProductModel = require('../models/producto.schema')
const cloudinary = require('../helpers/cloudinary')
const UsuarioModel = require('../models/usuario.schema')
const CarritoModel = require('../models/carrito.schema')
const FavModel = require('../models/favoritos.schema')
const { MercadoPagoConfig, Preference } = require('mercadopago')
const OrdenModel = require('../models/orden.schema')
const { envioDeOrdenDeCompra } = require('../helpers/mensajes')
const logger = require('../helpers/logger')

const obtenerTodosLosProductos = async (limit, to) => {
  try {
    const [productos, cantidadTotal] = await Promise.all([
      ProductModel.find({ activo: true }).skip(to * limit).limit(limit),
      ProductModel.countDocuments({ activo: true })
    ])
  
    const paginacion = {
      productos,
      cantidadTotal
    }
  
    return paginacion
  } catch (error) {
    logger.error(error)
  }
}

const obtenerUnProducto = async (id) => {
  try {
    const producto = await ProductModel.findById({ _id: id })
    return producto
  } catch (error) {
    logger.error(error)
  }
}

const buscarProducto = async (termino) => {
  try {
    const reglaBusqueda = new RegExp(termino, 'i')
    const productos = await ProductModel.find({
      $or: [
        { nombre: reglaBusqueda },
        { descripcion: reglaBusqueda }
      ]
    })
    return productos
  } catch (error) {
    logger.error(error)
  }
}

const nuevoProducto = (body) => {
  try {
    const newProduct = new ProductModel(body)
    return newProduct
  } catch (error) {
    logger.error(error)
  }
}

const editarProducto = async (idProducto, body) => {
  try {
    const productoEditado = await ProductModel.findByIdAndUpdate({ _id: idProducto }, body, { new: true })
    return productoEditado
  } catch (error) {
    logger.error(error)
  }
}

const eliminarProducto = async (idProducto) => {
  try {
    await ProductModel.findByIdAndDelete({ _id: idProducto })
    return 200
  } catch (error) {
    logger.error(error)
  }
}


const agregarImagen = async (idProducto, file) => {
  try {
    if (file === undefined) {
      return 401
    }
    const producto = await ProductModel.findOne({ _id: idProducto })
    const resultado = await cloudinary.uploader.upload(file.path)
  
    producto.imagen = resultado.secure_url
    await producto.save()
  
    return 200
  } catch (error) {
    logger.error(error)
  }
}

const agregarProductoCarrito = async (idUsuario, idProducto) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    const producto = await ProductModel.findOne({ _id: idProducto })
    const carrito = await CarritoModel.findOne({ _id: usuario.idCarrito })

    const productoExiste = carrito.productos.find((obj) => obj.producto._id.toString() === producto._id.toString())

    if (productoExiste) {
      productoExiste.cantidad = productoExiste.cantidad + 1;
      await CarritoModel.findByIdAndUpdate({ _id: carrito._id }, carrito, { new: true })
      return {
        msg: `Cantidad de producto ${productoExiste.cantidad}`,
        statusCode: 202
      }
    } else {
      let cantidad = 1
      let productoCarrito = { cantidad, producto }
      carrito.productos.push(productoCarrito)
      await carrito.save()

      return {
        msg: 'Producto cargado correctamente en el carrito',
        statusCode: 200
      }
    }
  } catch (error) {
    logger.error(error)
  }
}

const quitarProductoCarrito = async (idUsuario, idProducto) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    const producto = await ProductModel.findOne({ _id: idProducto })
    const carrito = await CarritoModel.findOne({ _id: usuario.idCarrito })
  
    const productoCarrito = carrito.productos.find((prod) => prod.producto._id.toString() === producto._id.toString())
    if (productoCarrito === undefined) {
      return {
        msg: 'No se encontro el producto que buscas',
        statusCode: 400
      }
    } else{
      if(productoCarrito.cantidad > 1){
        productoCarrito.cantidad --
        await CarritoModel.findByIdAndUpdate({_id: usuario.idCarrito}, carrito, {new: true})
        return {
          msg: `Cantidad de ${producto.nombre} en tu carrito es ${productoCarrito.cantidad}`,
          statusCode: 202
        }
      } else{
        const posicionProducto = carrito.productos.findIndex((prod) => prod.producto._id.toString() === producto._id.toString())
        carrito.productos.splice(posicionProducto, 1)
        await carrito.save()
        return {
          msg: 'Producto eliminado correctamente del carrito',
          statusCode: 200
        }
      }
    }
    
  
  } catch (error) {
    logger.error(error)
  }
}

const agregarProductoFav = async (idUsuario, idProducto) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    const producto = await ProductModel.findOne({ _id: idProducto })
    const favoritos = await FavModel.findOne({ _id: usuario.idFavoritos })

    const productoExiste = favoritos.productos.find((prod) => prod._id.toString() === producto._id.toString())

    if (productoExiste) {
      return {
        msg: 'Producto ya existe en Favoritos',
        statusCode: 400
      }
    }

    favoritos.productos.push(producto)
    await favoritos.save()

    return {
      msg: 'Producto cargado correctamente a Favoritos',
      statusCode: 200
    }
  } catch (error) {
    logger.error(error)
  }
}

const quitarProductoFav = async (idUsuario, idProducto) => {
  try {
    const usuario = await UsuarioModel.findById(idUsuario)
    const producto = await ProductModel.findOne({ _id: idProducto })
    const favoritos = await FavModel.findOne({ _id: usuario.idFavoritos })
  
    const posicionProducto = favoritos.productos.findIndex((prod) => prod._id.toString() === producto._id.toString())
  
  
    if (posicionProducto < 0) {
      return {
        msg: 'No se encontro el producto que buscas',
        statusCode: 400
      }
    }
  
    favoritos.productos.splice(posicionProducto, 1)
  
    await favoritos.save()
  
    return {
      msg: 'Producto eliminado correctamente de Favoritos',
      statusCode: 200
    }
  } catch (error) {
    logger.error(error)
  }
}


const pagoConMP = async (idCliente) => {
  try {
    const cliente = await UsuarioModel.findOne({ _id: idCliente })
    const carrito = await CarritoModel.findOne({ idUsuario: idCliente })
    const clienteMP = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN })
    const preference = new Preference(clienteMP)
    const compra = carrito.productos.map(obj => {
      return {
        title: obj.producto.nombre,
        quantity: obj.cantidad,
        unit_price: obj.producto.precio * obj.cantidad,
        currency_id: 'ARS'
      }
    })
    const result = await preference.create({
      body: {
        items: compra,
        back_urls: {
          success: 'myApp.netlify.com/carrito/success',
          failure: 'myApp.netlify.com/carrito/failure',
          pending: 'myApp.netlify.com/carrito/pending'
        },
        auto_return: 'approved'
      }
    })

    const fechaOrden = new Date().toString()
    const orden = new OrdenModel({ idCliente, productos: carrito.productos, fecha: fechaOrden, linkDePago: result.init_point })
    carrito.productos = []
    envioDeOrdenDeCompra(cliente.emailUsuario, result.init_point)
    await orden.save()
    await carrito.save()
    return {
      result,
      statusCode: 200
    }
  } catch (error) {
    logger.error(error)
  }
}

module.exports = {
  obtenerTodosLosProductos,
  obtenerUnProducto,
  nuevoProducto,
  editarProducto,
  eliminarProducto,
  agregarImagen,
  buscarProducto,
  agregarProductoCarrito,
  quitarProductoCarrito,
  agregarProductoFav,
  quitarProductoFav,
  pagoConMP
}
