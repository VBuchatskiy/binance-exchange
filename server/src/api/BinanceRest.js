import axios from 'axios'
import config from '@/config/config'

export default class BinanceRest {
  constructor({ host = config.endpoints.test.future, key = config.key, secret = config.secret } = {}) {
    this.host = host
    this.key = key
    this.secret = secret
    this.path = {
      account: 'balance',
      risk: 'positionRisk',
      margin: {
        type: 'marginType',
        position: 'positionMargin',
        history: 'positionMargin/history'
      },
      orders: {
        open: 'allOpenOrders',
        batch: 'batchOrders'
      }
    }
  }
  async account() {
    const url = `${this.host}${this.path.account}`
    const headers = {
      'X-MBX-APIKEY': `${this.key}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    const instance = axios.create({ url, headers })
    try {
      const { data } = await instance.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
  async orders() {
    const url = `${this.host}${this.path.orders.open}`
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
}