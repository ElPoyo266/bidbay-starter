import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import product from '../orm/models/product.js'

const router = express.Router()

router.get('/api/products', async (req, res, next) => {
  const products = await Product.findAll({
    include: [{
      model: User,
      as: 'seller',
      attributes: ['id', 'username']
    }, {
      model: Bid,
      as: 'bids',
      attributes: ['id', 'price', 'productId', 'date']
    }]
  })

  if (product === null) {
    res.status(400).send('Error : No products found')
  } else {
    res.status(200).send(products)
  }
})

router.get('/api/products/:Id', async (req, res) => {
  const productId = req.params.Id
  const product = await Product.findOne({
    where: { id: productId },
    include: [{
      model: User,
      as: 'seller',
      attributes: ['id', 'username']
    }, {
      model: Bid,
      as: 'bids',
      attributes: ['id', 'price', 'date'],
      include: [{
        model: User,
        as: 'bidder',
        attributes: ['id', 'username']
      }]
    }]
  })
  if (product === null) {
    res.status(404).send('Error : This product does not exist')
  } else {
    res.status(200).send(product)
  }
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', authMiddleware, async (req, res) => {
  try {
    req.body.sellerId = req.user.id
    res.status(201).json(await Product.create(req.body))
  } catch (error) {
    res.status(400).json({ error: 'Invalid or missing fields', details: error })
  }
})

router.put('/api/products/:productId', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId
    const oldProduct = await Product.findByPk(productId)
    if (!oldProduct) {
      return res.status(404).send('Error : This product does not exist')
    }
    if (oldProduct.sellerId !== req.user.id && !req.user.admin) {
      return res.status(403).send('Error : Forbidden')
    }
    const newProduct = await oldProduct.update({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      originalPrice: req.body.originalPrice,
      pictureUrl: req.body.pictureUrl,
      endDate: req.body.endDate
    })
    res.status(200).send(newProduct)
  } catch (error) {
    return res.status(403).send('Error : Forbidden ' + error)
  }
})

router.delete('/api/products/:productId', authMiddleware, async (req, res) => {
  try {
    const productId = req.params.productId
    const deleteProduct = await Product.findByPk(productId)
    if (!deleteProduct) {
      return res.status(404).send('Error : This product does not exist')
    }
    if (deleteProduct.sellerId !== req.user.id && !req.user.admin) {
      return res.status(403).send('Error : Forbidden')
    }
    await deleteProduct.destroy()
    res.status(204).send('Error : No Content')
  } catch (error) {
    return res.status(403).send('Error : Forbidden ' + error)
  }
})

export default router
