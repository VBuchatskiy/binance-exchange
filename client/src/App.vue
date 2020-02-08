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
        <template v-if="!acive">
          <span>Start</span>
        </template>
        <template v-else>
          <span>Stop</span>
        </template>
      </button>
    </template>
    <template v-else>
      <button disabled>
        <span>Start</span>
      </button>
    </template>
    <template v-if="Object.keys(history.orders).length">
      <ul>
        <li :key="timestamp" v-for="(order, timestamp) of history.orders">
          <p>Entry Time: {{ order.timestamp | date }}</p>
          <p>Entry Price {{ order.entry }}</p>
          <p>Stop Loss {{ order.stop }}</p>
          <p>Take Profit {{ order.take }}</p>
        </li>
      </ul>
    </template>
  </section>
</template>

<script>
import axios from "axios";
import Vue from "vue";
export default {
  name: "App",
  data() {
    return {
      history: {
        orders: {}
      },
      data: null,
      timer: "",
      acive: false,
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
  methods: {
    load() {
      const base =
        this.selected.options.market.name === "exchange"
          ? `http://localhost:3000/exchange`
          : `http://localhost:3000/futures`;
      const url = `${base}?symbol=${this.selected.options.symbol.name}&interval=${this.selected.options.interval.value}`;
      if (this.timer) {
        clearInterval(this.timer);
        this.acive = false;
        this.timer = 0;
        return;
      }
      this.acive = true;
      this.timer = setInterval(() => {
        axios
          .get(url)
          .then(respose => {
            const { data } = respose;
            if (data) {
              this.data = data;
              this.notification(data);
            }
          })
          .catch(error => {
            console.error(error.message);
          });
      }, 2000);
    },
    notification(respose) {
      if (respose.order) {
        console.warn(respose.order.timestamp);
        Vue.set(this.history.orders, respose.order.timestamp, respose.order);
        this.audio.play();
      }
    }
  },
  filters: {
    date(timestamp) {
      const date = new Date(timestamp);
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return timestamp
        ? `${hours}
          :${minutes.length === 1 ? `0${minutes}` : `${minutes}`}
          :${seconds.length === 1 ? `0${seconds}` : `${seconds}`}`
        : "";
    }
  }
};
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: 0;
}
</style>>