import { Router } from 'express'
import { BollingerBands, RSI, MACD, SMA } from '@@/indicators/TechnicalIndicators'
import { Binance } from '@@/api/Binance'
import { klines, trades, endpoints } from '@@/api/constants'

const exchange = new Router()
const api = new Binance(endpoints[1])

exchange.get('/', (req, res) => {
  Promise.all([
    api.klines({ symbol: 'BTCUSDT', interval: '4h', limit: 120, param: klines['CLOSE_PRICE'] }),
    api.trades({ symbol: 'BTCUSDT', limit: 1, param: trades[2] })
  ]).then(response => {
    const closePrices = response[0]
    const lastPrice = response[1].pop()
    const ma = {
      fast: new SMA({
        values: closePrices,
        period: 12
      }).pop(),
      slow: new SMA({
        values: closePrices,
        period: 26
      }).pop()
    }
    const rsi = new RSI({
      values: closePrices,
      period: 14
    }).pop()
    const bollingerbands = new BollingerBands({
      values: closePrices,
      period: 20,
      stdDev: 2
    }).pop()
    const macd = new MACD({
      values: closePrices,
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      SimpleMAOscillator: false,
      SimpleMASignal: false
    }).pop()

    res.send(JSON.stringify({
      lastPrice,
      rsi,
      bollingerbands,
      macd,
      ma
    }))

  }).catch(error => {
    console.error(error.message)
  })
})

export default exchange