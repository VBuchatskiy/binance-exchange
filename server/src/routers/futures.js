import { Router } from 'express'
import { Binance, BinanceRest } from '@@/api'
import { Indicators } from '@@/Indicators'
import config from '@/config/config'

const futures = new Router()

futures.all('/', async (req, res) => {
  if (!Object.keys(req.query).length) {
    const binanceRest = new BinanceRest({ host: config.endpoints.test.futures })
    const active = await binanceRest.active({ symbol: 'BTCUSDT' })
    if (!Object.keys(active).length) {
      const binance = new Binance({ host: config.endpoints.test.futures })
      const klines = await binance.klines()
      const indicators = new Indicators({ klines }).calculate()
      // const order = await binanceRest.order({
      //   params: {
      //     symbol: 'BTCUSDT',
      //     side: 'BUY',
      //     type: 'LIMIT',
      //     timeInForce: 'GTC',
      //     price: 9000,
      //     quantity: 0.001
      //   },
      //   method: 'POST'
      // })
      res.json(Object.assign({}, indicators))
    } else {
      const stop = await binanceRest.order({
        params: {
          symbol: 'BTCUSDT',
          side: 'BUY',
          type: 'LIMIT',
          timeInForce: 'GTC',
          price: 9000,
          quantity: 0.001
        },
        method: 'POST'
      })
      res.json(Object.assign({}, stop))
    }
  }
})

export default futures