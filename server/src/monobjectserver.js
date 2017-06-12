import { setProperty, callMethod, REQUEST } from './modules/monobject'
import watch from 'redux-watch'
import R from 'ramda'
import _ from 'underscore'


let store;
export let propWatchers = {};
export let methodWatchers = {};

export function clearPropWatchers() {
    propWatchers = {}
}

export function clearMethodWatchers() {
    methodWatchers = {}
}

export function setStore(s) {
    store = s;
}

export function unReqisterAllPropWatchers(id) {
    R.forEach((path) => {
        let filtered = R.reject(R.where({id: R.equals(id)}), propWatchers[path])
        propWatchers[path] = filtered;
    }, R.keys(propWatchers));
}

//NOTE: unReqisterPropWatcher just removes the notification on the underlying socket from happening.
// It does not unSubscribe from the store.
export function unReqisterPropWatcher(monObject, property, id ) {
    let path = monObject + '.props.' + property;

    if (propWatchers[path].length > 0 ) {
        let filtered = R.reject(R.where({id: R.equals(id)}), propWatchers[path])
        propWatchers[path] = filtered;
    }
}

const compare = (a, b) => {
    return _.isEqual(a, b);
};

export function reqisterPropWatcher(monObject, property, handler ) {
    let path = monObject + '.props.' + property;

    if (!propWatchers[path]) {
        propWatchers[path] = [];
    }
    //just making sure that it does not registered twice
    if ( R.find((_handler) => _handler.id === handler.id, propWatchers[path] )) {
        //console.log('already registered', monObject + '.' + property );
        return true;
    } else {
        propWatchers[path].push(handler);
        //in order to scale, we only subscribe to the store once per property
        if (propWatchers[path].length === 1 ) {

            const watcher = watch(() => { return store.getState().monobjects.toJS(); }, path, compare);

            store.subscribe(watcher( (newVal, oldVal, objectPath) => {
                R.forEach( (w)=> { w.onChange(watcher, newVal, objectPath) }, propWatchers[objectPath] );
            }));
        }
        return false;
    }
}

export function unReqisterAllMethodWatchers(id) {
    R.forEach((path) => {
        let filtered = R.reject(R.where({id: R.equals(id)}), methodWatchers[path])
        methodWatchers[path] = filtered;
    }, R.keys(methodWatchers));
}

export let unReqisterMethodWatcher = (monObject, method, id ) => {
    let path = monObject + '.methods.' + method + '.state';

    if (methodWatchers[path].length > 0 ) {
        let filtered = R.reject(R.where({id: R.equals(id)}), methodWatchers[path])
        methodWatchers[path] = filtered;
    }
}

export let reqisterMethodWatcher = (monObject, method, handler ) => {
    let path = monObject + '.methods.' + method + '.state';

    if (!methodWatchers[path]) {
        methodWatchers[path] = [];
    }
    //just making sure that it does not registered twice
    if ( R.find((_handler) => _handler.id === handler.id, methodWatchers[path] )) {
        //console.log('already registered', monObject + '.' + method );
        return true;
    } else {
        methodWatchers[path].push(handler);

        //in order to scale, we only subscribe to the store once per property
        if (methodWatchers[path].length === 1 ) {
            const watcher = watch(() => { return store.getState().monobjects.toJS() }, path, compare);

            store.subscribe(watcher( (newVal, oldVal, objectPath) => {
                R.forEach( (w)=> { w.onChange(watcher, newVal, objectPath) }, methodWatchers[objectPath] );
            }));
        }
        return false;
    }
}

function validRequest(requestName, request) {

    console.log(requestName, JSON.stringify(request,null,4));

    try {
        if (!request.monObject) {
            throw new Error(requestName + ' error: no monObject supplied');
        }

        //call requires a method name and args
        if (requestName === 'call') {
            if (!request.args) {
                throw new Error(requestName + "error: no args");
            }
            if (!request.method) {
                throw new Error(requestName + "error: no method");
            }

        } else {

            //all other requests require a property
            if (!request.property) {
                throw new Error(requestName + "error: no property");
            }

            //this one requires a value
            if (request.property === 'set') {
                if (!request.value) {
                    throw new Error(requestName + "error: no value");
                }
            }
        }
    } catch (e) {
        console.log(e, requestName, request);
        return false;
    }

    return true;
}

let socketWatchNotifier = (w, value, objectPath) => {
    try {
        w.socket.emit("opCompleted", {'op': "Watch::" + w.property, 'monObject': w.monObject, 'value': value, 'error': false});
    } catch (e) {
        console.log(e);
    }
}

let socketCallNotifier = (w, value, objectPath) => {
    let ret;
    let methodState = value;

    if ( value === REQUEST.COMPLETED || value === REQUEST.ERROR ) {

        //NOTE: When the request is finished no longer need to watch its state
        unReqisterMethodWatcher(w.monObject, w.method, w.id );

        let state = store.getState();

        if ( state.monobjects &&
                      state.monobjects[w.monObject] &&
                      state.monobjects[w.monObject].methods &&
                      state.monobjects[w.monObject].methods[w.method] &&
                      state.monobjects[w.monObject].methods[w.method].ret ) {
            ret = state.monobjects[w.monObject].methods[w.method].ret;
        }

        try {

            w.socket.emit("opCompleted", {'op': "Call::" + w.method, 'monObject': w.monObject, 'ret': ret, 'error': value===REQUEST.COMPLETED?false:true   });
        } catch (e) {
            console.log(e);
        }
    }
}

let monObjectServer = {

    get: (request, socket) => {
        let ret;
        if (validRequest('get', request)) {
            let state = store.getState();
            if ( state.monobjects &&
                            state.monobjects[request.monObject] &&
                            state.monobjects[request.monObject].props  &&
                            state.monobjects[request.monObject].props[request.property] ) {

                socket.emit("opCompleted", {'op': "Watch::" + request.property, 'monObject': request.monObject, 'value': state.monobjects[request.monObject].props[request.property], 'error': false});
            } else {
                ret = 'MISSING_PROP';
            }
        } else {
            ret = 'INVALID_ARGS';
        }

        return ret;
    },

    set: (request) => {
        let ret;

        if (validRequest('set', request)) {
            store.dispatch(setProperty(request.monObject,request.property,request.value));
        } else {
            ret = 'INVALID_ARGS';
        }

        return ret;
    },

    watch: (request, socket) => {
        let ret;
        if (validRequest('watch', request)) {
            //socket.emit("opCompleted", {'op': "Watch::" + request.property, 'monObject': request.monObject, 'error': false});

            let state = store.getState();

            if ( state.monobjects &&
                            state.monobjects[request.monObject] &&
                            state.monobjects[request.monObject].props  &&
                            state.monobjects[request.monObject].props[request.property] ) {
                socket.emit("opCompleted", {'op': "Watch::" + request.property, 'monObject': request.monObject, 'value': state.monobjects[request.monObject].props[request.property], 'error': false});
            } else {
                socket.emit("opCompleted", {'op': "Watch::" + request.property, 'monObject': request.monObject, 'error': false});
            }

            reqisterPropWatcher(request.monObject, request.property, {
                id: socket.id,
                socket: socket,
                monObject: request.monObject,
                property: request.property,
                onChange: socketWatchNotifier
            });

        } else {
            ret = 'INVALID_ARGS';
        }

        return ret;
    },

    unWatch: (request, socket) => {
        let ret;
        if (validRequest('unwatch', request)) {
            unReqisterPropWatcher(request.monObject, request.property, socket.id );
        } else {
            ret = 'INVALID_ARGS';
        }
    },

    call: (request, socket) => {
        let ret;
        if (validRequest('call', request)) {

            //NOTE: an implicit watcher is installed on the method state to remove boilerplate in client

            reqisterMethodWatcher(request.monObject, request.method, {
                  id: socket.id,
                  socket: socket,
                  monObject: request.monObject,
                  method: request.method,
                  onChange: socketCallNotifier
            });


            store.dispatch(callMethod(request.monObject,request.method,request.args));
        } else {
            ret = 'INVALID_ARGS';
        }

        return ret;
    }
};


export default monObjectServer;
