DYC.factory('event', function() {
        /**
         * EventBus
         * @constructor
         */
        var EventBus = function() {
            /**
             * _listeners
             * @type {object}
             * @private
             */
            this._listeners = {};
        };
        EventBus.prototype = {
            /**
             * Add event listener.
             * @param {string} type
             * @param {function} listener
             * @param {*} [context]
             * @param {boolean} [once=false]
             * @param {*} [data]
             */
            on: function(type, listener, context, once, data) {
                if (typeof type !== 'string' || typeof listener !== 'function') {
                    return;
                }

                var listeners = this._listeners;

                var arr = listeners[type];
                if (arr) {
                    // remove same listener.
                    this.off(type, listener);
                }

                var o = {
                    listener: listener,
                    context: context || this,
                    once: !!once,
                    data: data,
                    remove: false,
                };

                arr = listeners[type]; // 移除之前相同事件时有可能会删除该数组
                if (!arr) {
                    listeners[type] = [o];
                } else {
                    arr.push(o);
                }
            },

            /**
             * Emit a event.
             * @param {string} type
             * @param {...T} [data]
             */
            emit: function(type, data) {
                var listener = this._listeners;
                var arr = listener[type];
                if (!arr) {
                    return;
                }

                var i, il;
                var args;
                var argsLen = arguments.length;
                if (argsLen === 1) {
                    args = [];
                } else if (argsLen > 1) {
                    args = new Array(argsLen - 1);
                    i = argsLen;
                    while (i-- > 1) {
                        args[i - 1] = arguments[i];
                    }
                }

                arr = arr.slice(); // 为了避免事件处理回调中，items 被删除或有添加
                for (i = 0, il = arr.length; i < il; i++) {
                    var o = arr[i];
                    var callbackArgs = args.concat(o.data);
                    try {
                        o.listener.apply(o.context, callbackArgs);
                    } catch (e) {
                        console.error('[EventBus] emit callback Uncaught ReferenceError', e);
                    }

                    o.once && (o.remove = true);
                }

                if (listener[type]) {
                    listener[type] = listener[type].filter(function(item) {
                        return !item.remove;
                    });
                }
            },

            /**
             * Remove listener.
             * @param {string} type
             * @param {function} listener
             */
            off: function(type, listener) {
                var listeners = this._listeners;
                var arr = listeners[type];
                if (!arr) {
                    return;
                }

                for (var i = 0, il = arr.length; i < il; i++) {
                    if (arr[i].listener === listener) {
                        if (il === 1) {
                            // 为了更快检查
                            delete listeners[type];
                        } else {
                            arr.splice(i, 1);
                        }
                        break;
                    }
                }
            },

            /**
             * 检查是否有指定的 event listener.
             * @param {string} type
             * @param {function=} listener
             * @return {boolean}
             */
            has: function(type, listener) {
                var arr = this._listeners[type];
                if (arr) {
                    var i = arr.length;
                    if (listener === undefined) {
                        return i > 0;
                    }

                    while (i--) {
                        var o = arr[i];
                        if (o.listener === listener) {
                            return true;
                        }
                    }
                }
                return false;
            },
        };

        /**
         * Create a eventBus instance.
         * @return {EventBus}
         */
        EventBus.createEventBus = function() {
            return new EventBus();
        };

        return EventBus.createEventBus();
    })
    .run(function(service, event) {
        service.expand('event', function() {
            return event;
        });
    });