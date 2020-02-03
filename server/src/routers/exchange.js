import { Router } from 'express'
import { Binance } from '@@/api/Binance'
import { endpoints } from '@@/api/constants'

const exchange = new Router()

exchange.get('/', (req, res) => {
  new Binance(endpoints[1])
    .indicators()
    .then(response => {
      res.json(response)
    })
    .catch(error => {
      console.warn(error.message)
    })
})

export default exchange