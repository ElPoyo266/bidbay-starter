import express from 'express'
import { Product, Bid, User } from '../orm/index.js'
import authMiddleware from '../middlewares/auth.js'
import { getDetails } from '../validators/index.js'
import product from "../orm/models/product.js";
import { sequelize } from "../orm/database.js";

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
    res.status(400).send('Error : This product does not exist')
  } else {
    res.status(200).send(product)
  }
})

// You can use the authMiddleware with req.user.id to authenticate your endpoint ;)

router.post('/api/products', (req, res) => {
  res.status(600).send()
})

router.put('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

router.delete('/api/products/:productId', async (req, res) => {
  res.status(600).send()
})

export default router
