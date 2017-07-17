(function (eo) {
    'use strict';
    if (typeof module === 'object' && module.exports) {
        module.exports = eo;
    } else if (typeof define === 'function' && define.amd) {
        define(eo);
    } else if (typeof window !== 'undefined') {
        var oldGlobal = window.EventObserver;
        window.EventObserver = eo;
        window.EventObserver.noConflict = function () {
            window.EventObserver = oldGlobal;
            return this;
        };
    }
})(function () {
    var eo = this;
    this.events = {};
    this.resolveEvent = function (name, output) {
        if (eo.events.hasOwnProperty(name)) {
            eo.events[name].resolve(output);
        }
    };
    this.event = function (name) {
        var event = this;
        this.name = name;
        this.resolved = false;
        this.output = null;
        this.observers = [];
        this.addObserver = function (observer) {
            event.observers.push(observer);
        };
        this.resolve = function (output) {
            event.output = output;
            event.resolved = true;
            for (var i = 0, l = event.observers.length; i < l; i++) {
                event.observers[i].notify();
            }
        };
        if (eo.events.hasOwnProperty(name)) {
            if (typeof console.error === "function") {
                console.error('Event (' + name + ') already exists');
            }
        } else {
            eo.events[event.name] = event;
        }
    };
    this.observer = function () {
        var observer = this;
        this.callback = null;
        this.executeOnce = true;
        this.executed = false;
        this.eventsBeignObserved = {};
        this.observe = function (event) {
            if (observer.eventsBeignObserved.hasOwnProperty(event.name) === false) {
                observer.eventsBeignObserved[event.name] = event;
                event.addObserver(observer);
                observer.notify();
            }
        };
        this.notify = function () {
            if (observer.eventsResolved()) {
                if (observer.executeOnce === true) {
                    if (observer.executed === false) {
                        observer.execute();
                        observer.executed = true;
                    }
                } else {
                    observer.execute();
                }
            }
        };
        this.eventsResolved = function () {
            if (observer.eventsBeignObserved !== {}) {
                for (var i in observer.eventsBeignObserved) {
                    if (observer.eventsBeignObserved.hasOwnProperty(i)) {
                        if (observer.eventsBeignObserved[i].resolved === false) {
                            return false;
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        };
        this.execute = function () {
            if (typeof observer.callback === "function") {
                observer.callback(new eo.eventCollection(observer.eventsBeignObserved));
            }
        };
        this.all = function (c) {
            observer.callback = c;
        }
    };
    this.eventCollection = function (events) {
        var ec = this;
        this.events = events;
        this.getOutput = function () {
            var output = {};
            for (var i in ec.events) {
                if (ec.events.hasOwnProperty(i)) {
                    output[ec.events[i]['name']] = ec.events[i]['output'];
                }
            }
            return output;
        }
    }
    this.observe = function (events) {
        var observer = new eo.observer();
        for (var i = 0, l = events.length; i < l; i++) {
            observer.observe(new eo.event(events[i]));
        }
        return observer;
    }
});