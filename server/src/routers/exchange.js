import { Router } from 'express'

const exchange = new Router()

exchange.get('/', (req, res) => {
  res.send('Exchange')
})

export default exchange