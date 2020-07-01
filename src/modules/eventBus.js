export default {
  $eventBus: null,

  install(Vue, options) {
    this.$eventBus = new Vue();
  },

  /**
   * register an event handler
   * @param {Object} eventClass some event class, defined in appEvents.js
   * @param {*} handler
   */
  listen(eventClass, handler) {
    this.$eventBus.$on(eventClass.name, handler);
  },

  /**
   * publish an event
   * @param {Object} eventClass some event class, defined in appEvents.js
   */
  publish(eventClass) {
    this.$eventBus.$emit(eventClass.constructor.name, eventClass);
  }
};
