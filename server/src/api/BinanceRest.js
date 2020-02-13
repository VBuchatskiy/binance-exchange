import axios from 'axios'
import CryptoJS from 'crypto-js'
import config from '@/config/config'

export default class BinanceRest {
  constructor({ host = config.endpoints.test.future, key = config.key, secret = config.secret } = {}) {
    this.host = host
    this.key = key
    this.secret = secret
    this.path = {
      account: 'account',
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
  get signature() {
    const timestamp = `timestamp=${Date.now()}`
    return `${timestamp}&signature=${CryptoJS.HmacSHA256(timestamp, this.secret).toString(CryptoJS.enc.Hex)}`
  }
  async account() {
    const url = `${this.host}${this.path.account}?${this.signature}`
    const headers = {
      'X-MBX-APIKEY': `${this.key}`,
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
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