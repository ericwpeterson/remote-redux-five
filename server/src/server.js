import Server from 'socket.io';

import monObjectServer from './monobjectserver';
import { setStore, unReqisterAllPropWatchers, unReqisterAllMethodWatchers } from './monobjectserver';
import { callMethod } from './monobjects/reducers/monobject';

import makeStore from './store';
export const store = makeStore();

//this gives the monobjectserver a reference to the store
setStore(store);

let lastState;

store.subscribe(()=> {
    let newState = store.getState();
    if (newState !== lastState) {
        console.log('store changed ', JSON.stringify(store.getState(), null, 4));
        lastState = newState;
    }
});

//NOTE: this is what kickstarts the monitoring of the UPS
//store.dispatch(callMethod('ups', 'startPolling', [{location: '/dev/ttyS1'}]));

export default function startServer() {

    const actionServer = new Server().attach(8091);
    actionServer.on('connection', function(socket) {

        socket.on('action', function(action) {
            console.log('got an action', action);
            store.dispatch(action);
        });
    });

    const io = new Server().attach(8090);

    io.on('connection', function(socket) {

        socket.on('disconnect', function() {
            unReqisterAllPropWatchers(socket.id);
            unReqisterAllMethodWatchers(socket.id);
        });

        socket.on('Get', function(request) {
            monObjectServer.get(request, (msg, payload) => { socket.emit(msg, payload); });
        });

        socket.on('Set', function(request) {
            monObjectServer.set(request);
        });

        socket.on('Watch', function(request) {
            monObjectServer.watch(request, socket, (msg, payload) => { socket.emit(msg, payload); });
        });

        socket.on('UnWatch', function(request) {
            monObjectServer.unWatch(request, socket);
        });

        socket.on('Call', function(request) {
            monObjectServer.call(request, socket);
        });
    });

}
