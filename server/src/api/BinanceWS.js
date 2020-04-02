import WebSocket from 'ws'

export default class BinanceWS {

  constructor({ host = null } = {}) {
    this._sockets = {}
    this.host = host
    this.streams = {
      depth: (symbol) => `${symbol.toLowerCase()}@depth`,
      depthLevel: (symbol, level) => `${symbol.toLowerCase()}@depth${level}`,
      kline: (symbol, interval) => `${symbol.toLowerCase()}@kline_${interval}`,
      aggTrade: (symbol) => `${symbol.toLowerCase()}@aggTrade`,
      trade: (symbol) => `${symbol.toLowerCase()}@trade`,
      ticker: (symbol) => `${symbol.toLowerCase()}@ticker`,
      allTickers: () => '!ticker@arr'
    }
  }

  _setupWebSocket(eventHandler, path) {
    if (this._sockets[path]) {
      return this._sockets[path]
    }

    if (this._sockets[path]) {
      return this._sockets[path]
    }

    const ws = new WebSocket(this.host)

    ws.on('message', (message) => {
      let event
      try {
        event = JSON.parse(message)
      } catch (e) {
        event = message
      }

      eventHandler(event)
    })

    ws.on('error', () => {

    })

    return ws
  }

  onDepthUpdate(symbol, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.depth(symbol))
  }

  onDepthLevelUpdate(symbol, level, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.depthLevel(symbol, level))
  }

  onKline(symbol, interval, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.kline(symbol, interval))
  }

  onAggTrade(symbol, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.aggTrade(symbol))
  }

  onTrade(symbol, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.trade(symbol))
  }

  onTicker(symbol, eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.ticker(symbol))
  }

  onAllTickers(eventHandler) {
    return this._setupWebSocket(eventHandler, this.streams.allTickers())
  }

  onUserData(binanceRest, eventHandler, interval = 60000) {
    return binanceRest.startUserDataStream()
      .then((response) => {
        setInterval(() => {
          binanceRest.keepAliveUserDataStream(response)
        }, interval)
        return this._setupWebSocket(eventHandler, response.listenKey)
      })
  }

  onCombinedStream(streams, eventHandler) {
    return this._setupWebSocket(eventHandler, streams.join('/'), true)
  }

}