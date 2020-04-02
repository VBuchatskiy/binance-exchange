import { Router } from 'express'
import { Binance } from '@@/api'
import { Indicators } from '@@/Indicators'
// import chalk from 'chalk'
import config from '@/config/config'

const futures = Router()

futures.all('/', async (req, res) => {
  if (!Object.keys(req.query).length) {
    const binance = new Binance({ host: config.endpoints.test.future, key: config.key, secret: config.secret })
    const klines = await binance.klines({
      params: { symbol: 'BTCUSDT', interval: '4h', limit: 120 }
    })
    const indicators = new Indicators({ klines }).calculate()
    res.json(Object.assign({}, indicators))
  }
})

export default futures