import axios from 'axios'
import config from '@/config/config'

export default class BinanceRest {
  constructor({ host = config.endpoints.test.future, key = config.key, secret = config.secret } = {}) {
    this.host = host
    this.key = key
    this.secret = secret
    this.path = {
      margin: {
        type: 'marginType',
        position: 'positionMargin',
        history: 'positionMargin/history'
      },
      risk: 'positionRisk',
      orders: {
        open: 'allOpenOrders',
        batch: 'batchOrders'
      }
    }
  }
  async orders() {
    const url = `${this.host}${this.path.orders.open}${this.key}${this.secret}`
    try {
      const { data } = await axios.get(url)
      return data
    } catch (error) {
      console.trace(error.stack)
    }
  }
}