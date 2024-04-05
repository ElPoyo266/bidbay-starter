import authMiddleware from '../middlewares/auth.js'
import { Bid } from '../orm/index.js'
import express from 'express'

const router = express.Router()

router.delete('/api/bids/:bidId', authMiddleware, async (req, res) => {
  try {
    const deleteBid = await Bid.findByPk(req.params.bidId)
    if (!deleteBid) {
      return res.status(404).send('Error : This product does not exist')
    }
    if (deleteBid.bidderId !== req.user.id && !req.user.admin) {
      return res.status(403).send('Error : Forbidden')
    }
    await deleteBid.destroy()
    res.status(204).send('Error : No Content')
  } catch (error) {
    return res.status(403).send('Error : Forbidden ' + error)
  }
})

router.post('/api/products/:productId/bids', authMiddleware, async (req, res) => {
  try {
    const { price } = req.body
    if (!req.user.id && !req.user.admin) {
      return res.status(404).send('Error : This bid does not exist')
    }
    let bid
    try {
      bid = await Bid.create({
        productId: req.params.productId,
        price,
        date: Date.now(),
        bidderId: req.user.id
      })
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or missing fields', details: 'Missing price field' })
    }
    res.status(201).send(bid)
  } catch (error) {
    res.status(401).send('Error : Unauthorized ' + error)
  }
})

export default router
