// https://stackoverflow.com/questions/38064054/vue-js-global-event-bus
import Vue from 'vue'

// order-created-gevent, order-changed-gevent,
// card-created-gevent, customer-creaed-gevent
// card-transaction-created-gevent
export const EventBus = new Vue()
