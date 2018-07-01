export default {
  install(Vue) {
    const { EventBus } = require('../components/EventBus')
    Vue.prototype.$bus = EventBus
  }
}
