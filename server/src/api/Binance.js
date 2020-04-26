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

  mandatory({ path = '', params = {} }) {
    const properties = Object.keys(params).reduce((properties, property) =>
      !params[property] ? [...properties, property] : [...properties], [])

    if (properties.length) {
      throw new Error(`Missed mandatory parameters: ${properties.toString()} in ${path}`)
    }
  }

  sign(query = {}) {
    return crypto
      .createHmac('sha256', this.secret)
      .update(querystring.stringify(query))
      .digest('hex')
  }

  query({ path = '', params = {} } = {}) {
    const clear = Object.keys(params).reduce((properties, property) =>
      params[property] ? { ...properties, [property]: params[property] } : { ...properties }, {})

    Object.assign(clear, { recvWindow: this.recvWindow, timestamp: Date.now() })
    Object.assign(clear, { signature: this.sign(clear) })

    return path.concat('?', querystring.stringify(clear))
  }

  async request(path = '', { method = 'GET' } = {}) {
    const response = await fetch(`${this.host}${path}`, {
      method,
      headers: {
        'X-MBX-APIKEY': this.key,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (!response.ok) {
      throw {
        name: `Error in request to ${path}`,
        code: response.status,
        message: response.statusText
      }
    }

    return response.json()
  }
  // Description: test connectivity to the rest API
  // Weight: 1
  async ping() {
    const path = this.ping.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: test connectivity to the rest API and get the current server time
  // Weight: 1
  async time() {
    const path = this.time.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: get current exchange trading rules and symbol information
  // Weight: 1
  async exchangeInfo() {
    const path = this.exchangeInfo.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: adjusted based on the limit
  // Weight: adjusted based on the limit
  async depth({ symbol = '', limit = 50 } = {}) {
    const path = this.depth.name

    this.mandatory({
      path,
      params: { symbol }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, limit }
      })
    )
  }
  // Description: get recent trades (up to last 24h)
  // Weight: 1
  async trades({ symbol = '', limit = 500 } = {}) {
    const path = this.trades.name

    this.mandatory({
      path,
      params: { symbol }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, limit }
      })
    )
  }
  // Description: get older market historical trades
  // Weight: 5
  async historicalTrades({ symbol = '', limit = 500, fromid = '' } = {}) {
    const path = this.historicalTrades.name

    this.mandatory({
      path,
      params: { symbol }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, limit, fromid }
      })
    )
  }
  // Description: get compressed, aggregate trades. Trades that fill at the time, from the same order, with the same price will have the quantity aggregated
  // Weight: 1
  async aggTrades({ symbol = '', limit = 500, fromId = '', startTime = '', endTime = '' } = {}) {
    const path = this.aggTrades.name

    this.mandatory({
      path,
      params: { symbol }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, limit, fromId, startTime, endTime }
      })
    )
  }
  // Description: get kline bars for a symbol. Klines are uniquely identified by their open time
  // Additionally: If startTime and endTime are not sent, the most recent klines are returned
  // Weight: 1
  async klines({ symbol = '', interval = '1h', limit = 500, startTime = '', endTime = '' } = {}) {
    const path = this.klines.name

    this.mandatory({
      path,
      params: { symbol, interval }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, interval, limit, startTime, endTime }
      })
    )
  }
  // Description: get mark price and funding rate
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1
  async premiumIndex({ symbol = '' } = {}) {
    const path = this.premiumIndex.name

    return this.request(
      this.query({
        path,
        params: { symbol }
      })
    )
  }
  // Description: get 24 hour rolling window price change statistics
  // Weight: 1 for a single symbol, 40 when the symbol parameter is omitted
  async tickerDay({ symbol = '' } = {}) {
    const path = '/ticker/24hr'

    return this.request(
      this.query({
        path,
        params: { symbol }
      })
    )
  }
  // Description: get latest price for a symbol or symbols
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1 for a single symbol, 2 when the symbol parameter is omitted
  async tickerPrice({ symbol = '' } = {}) {
    const path = '/ticker/price'

    return this.request(
      this.query({
        path,
        params: { symbol }
      })
    )
  }
  // Description: best price/qty on the order book for a symbol or symbols
  // Additionally: If the symbol is not sent, tickers for all symbols will be returned in an array
  // Weight: 1 for a single symbol, 2 when the symbol parameter is omitted
  async bookTicker({ symbol = '' } = {}) {
    const path = '/ticker/bookTicker'

    return this.request(
      this.query({
        path,
        params: { symbol }
      })
    )
  }
  // Description: get all liquidation orders
  // Additionally: If the symbol is not sent, liquidation orders for all symbols will be returned
  // Weight: 5
  async allForceOrders({ symbol = '', limit = 100, startTime = '', endTime = '' } = {}) {
    const path = this.allForceOrders.name

    return this.request(
      this.query({
        path,
        params: { symbol, startTime, endTime, limit }
      })
    )
  }
  // Description: get present open interest of a specific symbol
  // Weight: 1
  async openInterest({ symbol = '' } = {}) {
    const path = this.klines.name

    this.mandatory({
      path,
      params: { symbol }
    })

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
    const path = this.leverageBracket.name

    return this.request(
      this.query({
        path,
        params: { symbol }
      })
    )
  }
  // Description: open delete get status of orders
  async order({
    method = '',
    symbol = '',
    timeInForce = 'GTC',
    reduceOnly = true,
    workingType = 'CONTRACT_PRICE',
    side = '',
    type = '',
    origClientOrderId = '',
    orderId = '',
    newClientOrderId = '',
    quantity = 0,
    stopPrice = 0,
    price = 0,
    callbackRate = 0,
    activationPrice = 0
    // positionSide
  } = {}) {
    const path = this.order.name

    switch (method) {
      // Description: get order status by id
      case 'GET': {
        this.mandatory({
          path,
          params: { symbol, orderId, method }
        })

        return this.request(
          this.query({
            path,
            params: { symbol, orderId, origClientOrderId }
          }), { method }
        )
      }
      // Description: delete an active order by id
      case 'DELETE': {
        this.mandatory({
          path,
          params: { symbol, orderId, method }
        })

        return this.request(
          this.query({
            path,
            params: { symbol, orderId, origClientOrderId }
          }), { method }
        )
      }
      // Description: open order
      case 'POST': {
        switch (type) {
          case 'LIMIT': {
            this.mandatory({
              path,
              params: { symbol, side, type, quantity, price, timeInForce, method }
            })

            return this.request(
              this.query({
                path,
                params: { symbol, side, type, price, quantity, timeInForce, newClientOrderId }
              }), { method }
            )
          }
          case 'STOP':
          case 'TAKE_PROFIT': {
            this.mandatory({
              path,
              params: { symbol, side, type, quantity, price, stopPrice, method }
            })

            return this.request(
              this.query({
                path,
                params: { symbol, side, type, price, stopPrice, quantity, reduceOnly, workingType, newClientOrderId }
              }), { method }
            )
          }
          case 'STOP_MARKET':
          case 'TAKE_PROFIT_MARKET': {
            this.mandatory({
              path,
              params: { symbol, side, type, quantity, stopPrice, method }
            })

            return this.request(
              this.query({
                path,
                params: { symbol, side, type, stopPrice, quantity, reduceOnly, workingType, newClientOrderId }
              }), { method }
            )
          }
          case 'TRAILING_STOP_MARKET': {
            this.mandatory({
              path,
              params: { symbol, side, type, quantity, callbackRate, method }
            })

            return this.request(
              this.query({
                path,
                params: { symbol, quantity, type, activationPrice, callbackRate }
              }), { method }
            )
          }
        }
      }
    }
  }
  // Description: delete all open orders
  // Weight: 1
  async allOpenOrders({ symbol = '' }) {
    const path = this.allOpenOrders.name

    return this.request(
      this.query({
        path,
        params: { symbol }
      }), { method: 'DELETE' }
    )
  }
  // Description: get query current open order
  // Additionally: either orderIdList or origClientOrderIdList must be sent
  async openOrder({ symbol = '', orderId = '', origClientOrderId = '' } = {}) {
    const path = this.openOrder.name

    this.mandatory({
      path,
      params: {
        symbol, orderId
      }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, orderId, origClientOrderId }
      })
    )
  }
  // Description: get current all open orders
  // Weight: 1 for a single symbol, 40 when the symbol parameter is omitted
  async openOrders({ symbol = '' } = {}) {
    const path = this.openOrders.name

    return this.request(
      this.query({
        path,
        params: { symbol }
      }))
  }
  // Description: get all account orders; active, canceled, or filled.
  // Additionally: If orderId is set, it will get orders >= that orderId. Otherwise most recent orders are returned
  async allOrders({ symbol = '', limit = 500, orderId = '', startTime = 0, endTime = 0 } = {}) {
    const path = this.allOrders.name

    this.mandatory({
      path,
      params: { symbol }
    })

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
    const path = this.balance.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: get current account information.
  // Weight: 5
  async account() {
    const path = this.account.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: change user's initial leverage in the specific symbol market
  // Additionally: for Hedge Mode, LONG and SHORT positions of one symbol use the same initial leverage and share a total notional value
  // Weight: 1
  async leverage({ symbol = '', leverage = 1 } = {}) {
    const path = this.leverage.name

    this.mandatory({
      path,
      params: { symbol, leverage }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, leverage }
      }), { method: 'POST' }
    )
  }
  // Description: Change user's margin type in the specific symbol market. For Hedge Mode, LONG and SHORT positions of one symbol use the same margin type
  // Additionally: With ISOLATED margin type, margins of the LONG and SHORT positions are isolated from each other
  // Weight: 1
  async marginType({ symbol = '', marginType = '' } = {}) {
    const path = this.marginType.name

    this.mandatory({
      path,
      params: { symbol, marginType }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, marginType }
      }), { method: 'POST' }
    )
  }
  // Description: modify isolated position margin
  // Weight: 1
  // Todo: need test
  async positionMargin({ symbol = '', amount = 0, type = 0, positionSide = '' } = {}) {
    const path = this.positionMargin.name

    this.mandatory({
      path,
      params: { symbol, amount, type }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, amount, type, positionSide }
      })
    )
  }
  // Description: get current account information
  // Weight: 5
  // Todo: need test
  async positionRisk() {
    const path = this.positionRisk.name

    return this.request(
      this.query({
        path
      })
    )
  }
  // Description: get trades for a specific account and symbol
  // Weight: 5
  // Todo: need test
  async userTrades({ symbol = '', limit = 500, fromId = '', startTime = '', endTime = '' } = {}) {
    const path = this.userTrades.name

    this.mandatory({
      path,
      params: { symbol }
    })

    return this.request(
      this.query({
        path,
        params: { symbol, limit, fromId, startTime, endTime }
      })
    )
  }
  // Description: get income history
  // Additionally: if incomeType is not sent, all kinds of flow will be returned, if startTime and endTime are not sent, the most recent limit datas will be returned, if the number of data between startTime and endTime is larger than limit, response will be return as startTime with limit.
  // Weight: 1
  // Todo: need test
  async income({ symbol, limit = 1000, incomeType = '', startTime = '', endTime = '' } = {}) {
    const path = this.income.name

    return this.request(
      this.query({
        path,
        params: { symbol, limit, incomeType, startTime, endTime }
      })
    )
  }
  // Description: get key for socket
  async listenKey({ method }) {
    const path = this.listenKey.name

    return this.request(this.query({
      path
    }), { method }
    )
  }
}

export default Binance
