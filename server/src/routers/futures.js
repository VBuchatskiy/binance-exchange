import { Router } from 'express'
import { Binance, BinanceRest } from '@@/api'
import config from '@/config/config'

const futures = new Router()

futures.get('/', (req, res) => {
  if (!Object.keys(req.query).length) {
    new Binance({ host: config.endpoints.test.futures })
      .indicators()
      .then(response => {
        response
        // res.json(response)
      })
      .catch(error => {
        console.trace(error.message)
      })
    new BinanceRest().account()
      .then(response => {
        response
        res.json(response)
      })
      .catch(error => {
        console.trace(error.message)
      })

  } else {
    new Binance({ host: config.endpoints.test.futures })
      .indicators({ symbol: req.query.symbol, interval: req.query.interval })
      .then(response => {
        res.json(response)
      })
      .catch(error => {
        console.trace(error.stack)
      })
  }
})

export default futures