import Server from 'socket.io';

import monObjectServer from './monobjectserver';
import { setStore, reqisterMethodWatcher, reqisterPropWatcher, unReqisterAllPropWatchers, unReqisterAllMethodWatchers } from './monobjectserver';
import { callMethod } from './monobjects/reducers/monobject';

import makeStore from './store';
export const store = makeStore();

//this gives the monobjectserver a reference to the store
setStore(store);

let lastState;

store.subscribe(()=> {
    let newState = store.getState();
    if (newState !== lastState) {
        //console.log('store changed ', JSON.stringify(store.getState(), null, 4));
        lastState = newState;
    }
});


store.dispatch(callMethod('mongo', 'init', [{location: '10.86.1.37', port: 27020, database: 'passport', instancesCollection: 'instances', classCollection: 'classes'}]));


reqisterMethodWatcher('mongo', 'login', {
    id: 123,
    onChange: (w, value, objectPath) => {
        console.log( 'method state =', value );
    }
});

reqisterPropWatcher('mongo', 'connectionState', {
    id: 123,
    onChange: (w, value, objectPath) => {

        console.log( 'connectionState =', value );

        if ( value === 'COMPLETED' ) {
            //we are connected, lets login

            //store.dispatch(callMethod('mongo', 'login', [{user: 'eric', password: 'Eric123' }]));
            //store.dispatch(callMethod('mongo', 'createInstance', [{className: 'test-rev1', serialno: '123456', user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'loadInstance', [{uuid: "5970f21d07ec3a318ce94fda"}]));
            //store.dispatch(callMethod('mongo', 'getInstanceInfo', [{query: { className: 'test-rev1' }, projection: {serialno: 1, className: 1, title: 1}}]));

            //get the instance
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 0, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 2, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 1, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 3, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 0, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 0, taskChecked: true, user: 'eric'}]));
            //store.dispatch(callMethod('mongo', 'setChecked', [{uuid: "59720d7792917b327c9b34c3", path: "0/0/0", taskFormIndex: 0, taskChecked: true, user: 'eric'}]));

        }

        //expect(w.id).to.equal(123);
    }
});


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
