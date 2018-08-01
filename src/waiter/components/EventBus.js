// https://stackoverflow.com/questions/38064054/vue-js-global-event-bus
import Vue from 'vue'

// order-created-gevent, order-changed-gevent,
// card-created-gevent, customer-creaed-gevent
// deposit-order-created-gevent
// session-expired-gevent
// user-entry-created-gevent
export const EventBus = new Vue()
