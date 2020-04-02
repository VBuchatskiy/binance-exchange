import { Router } from 'express'
import { Binance, BinanceRest, BinanceWS } from '@@/api'
import { Indicators } from '@@/Indicators'
// import chalk from 'chalk'
import config from '@/config/config'

const futures = Router()

futures.all('/', async (req, res) => {
  const binanceWS = new BinanceWS({ host: config.endpoints.test.ws })

  binanceWS.onDepthUpdate('BTC', data => {
    res.json(data)
  })

  if (!Object.keys(req.query).length) {
    const binanceRest = new BinanceRest({ host: config.endpoints.test.future, key: config.key, secret: config.secret })
    const active = await binanceRest.active({ symbol: 'BTCUSDT' })
    if (!Object.keys(active).length) {
      const binance = new Binance({ host: config.endpoints.test.future })
      const klines = await binance.klines({
        params: { symbol: 'BTCUSDT', interval: '4h', limit: 120 }
      })
      const indicators = new Indicators({ klines }).calculate()
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