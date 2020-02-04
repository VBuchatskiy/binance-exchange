import { Router } from 'express'
import { Binance } from '@@/api/Binance'
import { endpoints } from '@@/api/constants'

const exchange = new Router()

exchange.get('/', (req, res) => {
  if (!Object.keys(req.query).length) {
    new Binance({ host: endpoints[1] })
      .indicators()
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        console.warn(error.message)
      })
  } else {
    new Binance({ host: endpoints[1] })
      .indicators({ symbol: req.query.symbol, interval: req.query.interval })
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        console.warn(error.message)
      })
  }
})

export default exchange