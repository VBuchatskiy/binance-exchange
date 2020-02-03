import axios from 'axios'
//https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md
//https://binance-docs.github.io/apidocs/futures/en/#change-log
const Binance = class {
  constructor(host = 'https://api.binance.com/api/v3/') {
    this.host = host
    this.path = {
      ping: 'ping',
      time: 'time',
      info: 'exchangeInfo',
      depth: 'depth',
      trades: 'trades',
      klines: 'klines'
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
        return data
      }
    } catch (error) {
      console.error(error.message)
    }
  }
  async trades({ symbol = 'BTCUSDT', limit = 1, param } = {}) {
    const base = `${this.host}${this.path.trades}`
    const query = `?symbol=${symbol}&limit=${limit}`
    const url = base.concat(query)
    try {
      if (param) {
        const { data } = await axios.get(url)
        return data.map(item => parseFloat(item[param]))
      } else {
        const { data } = await axios.get(url)
        return data
      }
    } catch (error) {
      console.error(error.message)
    }
  }
}

export {
  Binance
}