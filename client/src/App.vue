<template>
  <section>
    <select name="market" v-model="selected.options.market.name">
      <option :key="index" v-for="(market, index) of selected.options.market.options">
        <span>{{market}}</span>
      </option>
    </select>
    <template v-if="selected.options.market.name === 'exchange'">
      <select name="symbol" v-model="selected.options.symbol.name">
        <option :key="index" v-for="(symbol, index) of selected.options.symbol.exchange">
          <span>{{symbol}}</span>
        </option>
      </select>
    </template>
    <template v-else-if="selected.options.market.name === 'futures'">
      <select name="symbol" v-model="selected.options.symbol.name">
        <option :key="index" v-for="(symbol, index) of selected.options.symbol.futures">
          <span>{{symbol}}</span>
        </option>
      </select>
    </template>
    <template v-else>
      <select disabled>
        <option>select market</option>
      </select>
    </template>
    <template v-if="selected.options.symbol.name">
      <select name="interval" v-model="selected.options.interval.value">
        <option :key="index" v-for="(interval, index) of selected.options.interval.options">
          <span>{{interval}}</span>
        </option>
      </select>
    </template>
    <template v-else>
      <select disabled>
        <option>
          <span>select symbol</span>
        </option>
      </select>
    </template>
    <template
      v-if="selected.options.interval.value && selected.options.market.name && selected.options.symbol.name"
    >
      <button @click="load">
        <template v-if="!active">
          <span>start</span>
        </template>
        <template v-else>
          <span>stop</span>
        </template>
      </button>
    </template>
    <template v-else>
      <button disabled>
        <span>Start</span>
      </button>
    </template>
    <section class="order-bar">
      <template v-if="Object.keys(orders.history).length">
        <ul class="order-bar__history">
          <li :key="name" v-for="(order, name) of orders.history">
            <p :key="name" v-for="(value, name) of order">{{ name }} {{ value }}</p>
          </li>
        </ul>
      </template>
      <template v-if="orders.active">
        <ul class="order-bar__active">
          <li>
            <p :key="value" v-for="(value , name) of orders.active">{{ name }} : {{ value }}</p>
          </li>
        </ul>
      </template>
    </section>
    <!-- <pre>{{ stream }}</pre> -->
  </section>
</template>

<script>
import { Binance } from "./api/Binance";
import { BinanceWS } from "./api/BinanceWS";

export default {
  name: "App",
  data() {
    return {
      orders: {
        active: {},
        history: {}
      },
      timer: "",
      active: false,
      audio: new Audio("./audio/icq.mp3"),
      selected: {
        options: {
          market: {
            options: ["exchange", "futures"],
            name: ""
          },
          symbol: {
            exchange: ["ATOMUSDT"],
            futures: ["BCHUSDT"],
            name: ""
          },
          interval: {
            options: ["1m", "5m", "1h", "4h"],
            value: ""
          }
        }
      }
    };
  },
  async mounted() {
    const binance = new Binance();
    const binanceWS = new BinanceWS();
    // const params = { params: { symbol: "BTCUSDT" } };
    // const ping = await binance.ping();
    // const time = await binance.time();
    // const exchangeInfo = await binance.exchangeInfo(params);
    // const depth = await binance.depth(params);
    // const trades = await binance.trades(params);
    // const historicalTrades = await binance.historicalTrades(params);
    // const aggTrades = await binance.aggTrades(params);
    // const klines = await binance.klines({
    //   params: { symbol: "BTCUSDT", interval: "1h" }
    // });
    // const leverageBracket = await binance.leverageBracket(params);
    // const premiumIndex = await binance.premiumIndex(params);
    // const tickerDay = await binance.tickerDay(params);
    // const tickerPrice = await binance.tickerPrice(params);
    // const allForceOrders = await binance.allForceOrders(params);
    const { listenKey } = await binance.listenKey();
    binanceWS.userData(listenKey, event => {
      console.warn(event);
    });
  },
  methods: {},
  computed: {},
  watch: {}
};
</script>