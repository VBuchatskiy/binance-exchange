import { Router } from 'express'
import { Binance, BinanceRest } from '@@/api'
import { Indicators } from '@@/Indicators'
import config from '@/config/config'

const futures = new Router()

futures.all('/', async (req, res) => {
  if (!Object.keys(req.query).length) {
    const binanceRest = new BinanceRest({ host: config.endpoints.test.futures })
    const active = await binanceRest.active({ symbol: 'BTCUSDT' })
    if (Object.keys(active).length) {
      res.json(active)
    } else {
      const binance = new Binance({ host: config.endpoints.test.futures })
      const klines = await binance.klines()
      const indicators = new Indicators({ klines }).calculate()
      // trigger
      const order = await binanceRest.order({ symbol: 'BTCUSDT', side: 'BUY', timeInForce: 'GTC', type: 'LIMIT', quantity: 0.1, price: 9000 })
      res.json(Object.assign({}, indicators, order))
    }
  } else {
    console.warn('...')
  }
})

export default futures