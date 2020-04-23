import fetch from 'node-fetch'
import crypto from 'crypto'
import querystring from 'querystring'

class Binance {
  constructor({ host = '', key = '', secret = '', recvWindow = 5000 } = {}) {
    this.host = host
    this.key = key
    this.secret = secret
    this.recvWindow = recvWindow
  }

  mandatory(params = {}) {
    const propertys = [];
    for (const [property, value] of Object.entries(params)) {
      if (!value) propertys.push(property);
    }
    throw new Error(`Missed mandatory parameters: ${propertys.toString()}`)
  }

  request(path = '', { method = 'GET' } = {}) {
    return fetch(`${this.host}${path}`, {
      method,
      headers: {
        'X-MBX-APIKEY': this.key,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
      if (!response.ok) {
        throw {
          name: `Error in request to ${path}`,
          code: response.status,
          message: response.statusText
        }
      }

      return response.json()
    })
  }

  sign(query = {}) {
    return crypto
      .createHmac('sha256', this.secret)
      .update(querystring.stringify(query))
      .digest('hex')
  }

  query({ path = '', params = {} } = {}) {
    Object.assign(params, { recvWindow: this.recvWindow, timestamp: Date.now() })
    Object.assign(params, { signature: this.sign(params) })

    return path.concat('?', querystring.stringify(params))
  }
  // Description: test connectivity to the rest API
  // Weight: 1
  async ping() {
    return this.request(
      this.query({
        path: this.ping.name
      })
    )
  }
  // Description: test connectivity to the rest API and get the current server time
  // Weight: 1
  async time() {
    return this.request(
      this.query({
        path: this.time.name
      })
    )
  }
  // Description: get current exchange trading rules and symbol information
  // Weight: 1
  async exchangeInfo() {
    return this.request(
      this.query({
        path: this.exchangeInfo.name
      })
    )
  }
  // Description: adjusted based on the limit
  // Weight: adjusted based on the limit
  async depth({ symbol = '', limit = 50 } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.depth.name,
        params: { symbol, limit }
      })
    )
  }
  // Description: get recent trades (up to last 24h)
  // Weight: 1
  async trades({ symbol = '', limit = 500 } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.depth.name,
        params: { symbol, limit }
      })
    )
  }
  // Description: get older market historical trades
  // Weight: 5
  async historicalTrades({ symbol = '', limit = 500, fromid } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.historicalTrades.name,
        params: { symbol, limit, fromid }
      })
    )
  }
  // Description: get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated
  // Weight: 1
  async aggTrades({ symbol = '', limit = 500, fromId, startTime, endTime } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.aggTrades.name,
        params: { symbol, limit, fromId, startTime, endTime }
      })
    )
  }
  // Description: get kline bars for a symbol. Klines are uniquely identified by their open time
  // Additionally: If startTime and endTime are not sent, the most recent klines are returned
  // Weight: 1
  async klines({ symbol = '', interval = '1h', limit = 500, startTime, endTime } = {}) {
    this.mandatory({ symbol, interval });

    return this.request(
      this.query({
        path: this.klines.name,
        params: { symbol, interval, limit, startTime, endTime }
      })
    )
  }
  // Description: get mark price and funding rate
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1
  async premiumIndex({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: this.premiumIndex.name,
        params: { symbol }
      })
    )
  }
  // Description: get 24 hour rolling window price change statistics
  // Weight: 1 for a single symbol, 40 when the symbol parameter is omitted
  async tickerDay({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: '/ticker/24hr',
        params: { symbol }
      })
    )
  }
  // Description: get latest price for a symbol or symbols
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1 for a single symbol, 2 when the symbol parameter is omitted
  async tickerPrice({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: '/ticker/price',
        params: { symbol }
      })
    )
  }
  // Description: best price/qty on the order book for a symbol or symbols
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1 for a single symbol, 2 when the symbol parameter is omitted
  async bookTicker({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: '/ticker/bookTicker',
        params: { symbol }
      })
    )
  }
  // Description: get all liquidation orders
  // Additionally: If the symbol is not sent, liquidation orders for all symbols will be returned
  // Weight: 5
  async allForceOrders({ symbol = '', limit = 100, startTime, endTime } = {}) {
    return this.request(
      this.query({
        path: this.allForceOrders.name,
        params: { symbol, startTime, endTime, limit }
      })
    )
  }
  // Description: get present open interest of a specific symbol
  // Weight: 1
  async openInterest({ symbol = '' } = {}) {
    ithis.mandatory({ symbol });

    return this.request(
      this.query({
        path: this.openInterest.name,
        params: { symbol }
      })
    )
  }
  // Description: get notional and leverage brackets
  // Weight: 1
  async leverageBracket({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: this.leverageBracket.name,
        params: { symbol }
      })
    )
  }
  // Description: open delete get status of orders
  async order({
    method,
    symbol = '',
    timeInForce = 'GTC',
    reduceOnly = true,
    side,
    type,
    quantity,
    stopPrice,
    price,
    workingType = 'CONTRACT_PRICE',
    callbackRate,
    origClientOrderId,
    orderId,
    activationPrice,
    newClientOrderId
    // positionSide
  } = {}) {
    switch (method) {
      // Description: get order status by id
      case 'GET': {
        this.mandatory({ symbol, orderId, method })

        return this.request(
          this.query({
            path: this.order.name,
            params: { symbol, orderId, origClientOrderId }
          }), { method }
        )
      }
      // Description: open order
      case 'POST': {
        switch (type) {
          case 'LIMIT': {
            this.mandatory({ symbol, side, quantity, price, timeInForce, method })

            return this.request(
              this.query({
                path: this.order.name,
                params: { symbol, side, type, price, quantity, timeInForce, newClientOrderId }
              }), { method }
            )
          }
          case 'STOP':
          case 'TAKE_PROFIT': {
            this.mandatory({ symbol, side, quantity, price, stopPrice, method })

            return this.request(
              this.query({
                path: this.order.name,
                params: { symbol, side, type, price, stopPrice, quantity, reduceOnly, workingType, newClientOrderId }
              }), { method }
            )
          }
          case 'STOP_MARKET':
          case 'TAKE_PROFIT_MARKET': {
            this.mandatory({ symbol, side, quantity, stopPrice, method })

            return this.request(
              this.query({
                path: this.order.name,
                params: { symbol, side, type, stopPrice, quantity, reduceOnly, workingType, newClientOrderId }
              }), { method }
            )
          }
          case 'TRAILING_STOP_MARKET': {
            this.mandatory({ symbol, side, quantity, callbackRate, method })

            return this.request(
              this.query({
                path: this.order.name,
                params: { symbol, quantity, activationPrice, callbackRate }
              }), { method }
            )
          }
        }
      }
        break
      // Description: delete an active order by id
      case 'DELETE': {
        this.mandatory({ symbol, orderId, origClientOrderId, method })

        return this.request(
          this.query({
            path: this.order.name,
            params: { symbol, orderId, origClientOrderId }
          }), { method }
        )
      }
    }
  }
  // Description: delete all open orders
  // Weight: 1
  async allOpenOrders({ symbol = '' }) {
    return this.request(
      this.query({
        path: this.allOpenOrders.name,
        params: { symbol }
      }), { method: 'DELETE' }
    )
  }
  // Description: get query current open order
  // Additionally: either orderIdList or origClientOrderIdList must be sent
  async openOrder({ symbol = '', orderId = '', origClientOrderId } = {}) {
    this.mandatory({ symbol, orderId })

    return this.request(
      this.query({
        path: this.openOrder.name,
        params: { symbol, orderId, origClientOrderId }
      })
    )
  }
  // Description: get current all open orders
  // Weight: 1 for a single symbol, 40 when the symbol parameter is omitted
  async openOrders({ symbol = '' } = {}) {
    return this.request(
      this.query({
        path: this.openOrders.name,
        params: { symbol }
      }))
  }
  // Description: get all account orders; active, canceled, or filled.
  // Additionally: If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned
  async allOrders({ symbol = '', limit = 500, orderId, startTime, endTime } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.allOrders.name,
        params: { symbol, limit, orderId, startTime, endTime }
      })
    )
  }
  // Description: get future account balance
  // Additionally: not available on test
  async balance() {
    return this.request(
      this.query({
        path: this.balance.name
      })
    )
  }
  // Description: get current account information.
  // Weight: 5
  async account() {
    return this.request(
      this.query({
        path: this.account.name
      })
    )
  }
  // Description: change user's initial leverage in the specific symbol market
  // Additionally: for Hedge Mode, LONG and SHORT positions of one symbol use the same initial leverage and share a total notional value
  // Weight: 1
  async leverage({ symbol = '', leverage = 1 } = {}) {
    this.mandatory({ symbol, leverage })

    return this.request(
      this.query({
        path: this.leverage.name,
        params: { symbol, leverage }
      }), { method: 'POST' }
    )
  }
  // Description: Change user's margin type in the specific symbol market. For Hedge Mode, LONG and SHORT positions of one symbol use the same margin type
  // Additionally: With ISOLATED margin type, margins of the LONG and SHORT positions are isolated from each other
  // Weight: 1
  async marginType({ symbol = '', marginType = '' } = {}) {
    this.mandatory({ symbol, marginType })

    return this.request(
      this.query({
        path: this.marginType,
        params: { symbol, marginType }
      }), { method: 'POST' }
    )
  }
  // Description: modify isolated position margin
  // Weight: 1
  // Todo: need test
  async positionMargin({ symbol = '', amount = 0, type = 0, positionSide } = {}) {
    this.mandatory({ symbol, amount, type })

    return this.request(
      this.query({
        path: this.marginType,
        params: { symbol, amount, type, positionSide }
      })
    )
  }
  // Description: get current account information
  // Weight: 5
  // Todo: need test
  async positionRisk() {
    return this.request(
      this.query({
        path: this.marginType
      })
    )
  }
  // Description: get trades for a specific account and symbol
  // Weight: 5
  // Todo: need test
  async userTrades({ symbol = '', limit = 500, fromId, startTime, endTime } = {}) {
    this.mandatory({ symbol })

    return this.request(
      this.query({
        path: this.userTrades.name,
        params: { symbol, limit, fromId, startTime, endTime }
      })
    )
  }
  // Description: get income history
  // Additionally: if incomeType is not sent, all kinds of flow will be returned, if startTime and endTime are not sent, the most recent limit datas will be returned, if the number of data between startTime and endTime is larger than limit, response will be return as startTime with limit.
  // Weight: 1
  // Todo: need test
  async income({ symbol, limit = 1000, incomeType, startTime, endTime } = {}) {
    return this.request(
      this.query({
        path: this.income.name,
        params: { symbol, limit, incomeType, startTime, endTime }
      })
    )
  }
  // Description: get key for socket
  async listenKey(keepAlive = false) {
    return keepAlive
      ? this.request(this.query({ path: this.listenKey.name }), { method: 'PUT' })
      : this.request(this.query({ path: this.listenKey.name }), { method: 'POST' })
  }
}

export default Binance
