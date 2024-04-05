import express from 'express'
import { User, Product, Bid } from '../orm/index.js'

const router = express.Router()

router.get('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId
  const user = await User.findOne({
    where: { id: userId },
    include: [
      { model: Product, as: 'products' },
      { model: Bid, as: 'bids', include: [{ model: Product, as: 'product' }] }
    ]
  })
  if (!user) {
    return res.status(404).send('Error : This user does not exist')
  } else {
    res.status(200).json(user)
  }
})


export default router
