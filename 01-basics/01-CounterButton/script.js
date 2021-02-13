import Vue from './vue.esm.browser.js';

// const app = ...
// Рекомендуется использовать МЕТОД в качестве обработчика события
const app = new Vue({
    data: function () {
      return {
        count: 0
      }
    },
    template: '<button @click="increment">{{ count }}</button>',
    methods: {
      increment() {
        this.count += 1;
      }
    }
});

app.$mount('#app');
