import axios from 'axios'

//https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md

const Binance = class {
  constructor() {
    this.host = 'https://api.binance.com'
    this.path = {
      ping: '/api/v3/ping',
      time: '/api/v3/time',
      info: '/api/v3/exchangeInfo',
      depth: '/api/v3/depth',
      trades: '/api/v3/trades',
      klines: '/api/v3/klines'
    }
  }

  async klines({ symbol = 'BTCUSDT', interval = '4h', limit = 120, param } = {}) {
    const base = `${this.host}${this.path.klines}`
    const query = `?symbol=${symbol}&interval=${interval}&limit=${limit}`
    const url = base.concat(query)
    try {
      if (!isNaN(param)) {
        const { data } = await axios.get(url)
        return data.map(kline => parseFloat(kline[param]))
      } else {
        const { data } = await axios.get(url)
        return data;
      }
    } catch (error) {
      console.warn(error.message)
    }
  }
  async trades({ symbol = 'BTCUSDT', limit = 1, param = 'price' } = {}) {
    const base = `${this.host}${this.path.trades}`
    const query = `?symbol=${symbol}&limit=${limit}`
    const url = base.concat(query)

    try {
      if (param) {
        const { data } = await axios.get(url)
        return data.map(item => parseFloat(item[param]))
      } else {
        const { data } = await axios.get(url)
        return data;
      }
    } catch (error) {
      console.warn(error.message)
    }
  }
}

export {
  Binance
}