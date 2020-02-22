import { Router } from 'express'
import { Binance } from '@@/api'
import config from '@/config/config'

const exchange = new Router()

exchange.get('/', (req, res) => {
  if (!Object.keys(req.query).length) {
    new Binance()
      .indicators()
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        console.trace(error.message)
      })
  } else {
    new Binance({ host: config.endpoints.production.exchange })
      .indicators({ symbol: req.query.symbol, interval: req.query.interval })
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        console.trace(error.message)
      })
  }
})

export default exchange