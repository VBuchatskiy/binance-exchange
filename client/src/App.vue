<template>
  <section>
    <select @change="update" name="market" v-model="selected.options.market.name">
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
    <template v-if="selected.options.interval.value">
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
    <p v-if="data">{{ data }}</p>
  </section>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {
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
    update() {
      console.warn(this.selected);
    },
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
      console.warn(url);
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
      }, 1000);
    },
    notification(respose) {
      if (respose.morningstar) {
        this.audio.play();
      }
    }
  }
};
</script>
