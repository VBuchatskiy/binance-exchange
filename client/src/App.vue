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
  </section>
</template>

<script>
import axios from "axios";
import Vue from "vue";
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
  methods: {
    load() {
      const entry = [
        "http://localhost:3000/exchange",
        "http://localhost:3000/futures"
      ];
      const base =
        this.selected.options.market.name === "exchange" ? entry[0] : entry[1];
      const url = `${base}?symbol=${this.selected.options.symbol.name}&interval=${this.selected.options.interval.value}`;
      this.active = true;
      if (this.timer) {
        clearInterval(this.timer);
        this.active = false;
        this.timer = 0;
        return;
      }
      this.timer = setInterval(() => {
        axios
          .get(url)
          .then(respose => {
            const { data } = respose;
            this.addOrder(data);
            this.addHistory(data);
          })
          .catch(error => {
            console.error(error.message);
          });
      }, 2000);
    },
    notification() {
      this.audio.play();
    },
    addOrder(respose) {
      if (!Object.keys(this.orders.active).length && respose.order) {
        this.orders.active = respose.order;
      }
    },
    addHistory(respose) {
      if (Object.keys(this.orders.active).length) {
        const open = this.orders.active.timestamp;
        const close = respose.timestamp;
        const entry = this.orders.active.entry;
        const take = this.orders.active.take;
        const stop = this.orders.active.stop;
        const profit = this.orders.active.take - this.orders.active.entry;
        const price = parseFloat(respose.trade.price);
        const type = this.orders.active.type;
        const data = {
          open,
          close,
          entry,
          price,
          take,
          stop,
          profit,
          type
        };

        if (this.orders.active.type === "long") {
          if (this.orders.active.take <= price) {
            Vue.set(this.orders.history, respose.timestamp, data);
            this.orders.active = {};
          }
          if (this.orders.active.stop >= price) {
            Vue.set(this.orders.history, respose.timestamp, data);
            this.orders.active = {};
          }
        }
        if (this.orders.active.type === "short") {
          if (this.orders.active.take >= price) {
            Vue.set(this.orders.history, respose.timestamp, data);
            this.orders.active = {};
          }
          if (this.orders.active.stop <= price) {
            Vue.set(this.orders.history, respose.timestamp, data);
            this.orders.active = {};
          }
        }
      }
    }
  },
  computed: {
    history() {
      return this.orders.history;
    }
  },
  watch: {
    history() {
      this.notification();
    }
  }
};
</script>

<style lang="css" scoped>
ul {
  padding: 0;
  margin: 0;
  list-style: none;
}
button {
  height: 2em;
}
select {
  height: 2em;
  width: 16em;
}
.order-bar {
  display: flex;
  justify-content: space-between;
  padding-top: 1em;
}

span::first-letter {
  text-transform: uppercase;
}

.order-bar__history,
.order-bar__active {
  width: 50%;
}
</style>