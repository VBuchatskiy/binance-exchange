import { Router } from 'express'
import { BollingerBands, RSI, MACD } from '@@/indicators/TechnicalIndicators'
import { Binance } from '@@/api/Binance'
import { klines } from '@@/api/constants'

const exchange = new Router()
const api = new Binance()

exchange.get('/', (req, res, next) => {
  Promise.all([
    api.klines({ symbol: 'BTCUSDT', interval: '4h', limit: 120, param: klines['CLOSE_PRICE'] }),
    api.trades({ symbol: 'BTCUSDT', limit: 1, param: 'price' })
  ]).then(response => {
    const closePrices = response[0]
    const lastPrice = response[1]
    const rsi = new RSI({
      values: closePrices,
      period: 14
    }).slice(-1)[0]
    const bollingerbands = new BollingerBands({
      values: closePrices,
      period: 20,
      stdDev: 2
    }).slice(-1)[0]
    const macd = new MACD({
      values: closePrices,
      fastPeriod: 5,
      slowPeriod: 8,
      signalPeriod: 3,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).slice(-1)[0]

    res.send(JSON.stringify({
      lastPrice,
      rsi,
      bollingerbands,
      macd
    }))

  }).catch(error => {
    console.error(error.message)
  });
})

export default exchange