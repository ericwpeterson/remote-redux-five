import io from 'socket.io-client';
import { takeEvery, fork, take, call, put, cancel } from 'redux-saga/effects';
import { REQUEST,
    opStarted,
    opCompleted,
    CONNECT_REQUEST,
    SEND_REQUEST
} from '../modules/monobject';

import { setConnectionStatus, setAuthStatus } from '../modules/app';
import Immutable from 'immutable'

export const monobjectSagas = [
    takeEvery(CONNECT_REQUEST, watchConnect ),
]


///////////////////////////////////////////////////////////////////
//
// unit test helpers

var MockedSocket = function() {
    let handler;
    let messages = [];

    return {
        addEvent: function(e) {
            if (this.onmessage) {
                this.onmessage(e);
            }
        },
        connect: function() {
            return new Promise(resolve => {
                resolve();
            });
        },
        emit: function(msg, data) {
            messages.push({message: msg, data: data});
            return new Promise(resolve => {
                resolve();
            });
        }
    };
};

//this function is only called from a unit test
function processMessages(source) {
    source.nextMessage().then(function(ret) {
        source.increment();
        processMessages(source);
    });
};

//this function is only called from a unit test
export function* readNoEffects(msgSource) {
    processMessages(msgSource);
}

///////////////////////////////////////////////////////////////////
//
// Production code
//

var Socket = function() {
    let socket;
    let handler;

    return {
        connect: function(port) {

            if (port) {
                let s = io.connect();
                let protocol = s.io.engine.secure ? "https://" : "http://";
                socket = io.connect(protocol + s.io.engine.hostname + ":" + port);
                s.disconnect();
            } else {
                socket = io.connect();
            }

            socket.on('opCompleted', (opCompletedPacket) => {

                if (this.onmessage) {
                    let e = {
                        data: {
                            message: 'opCompleted',
                            payload: opCompletedPacket
                        }
                    };
                    this.onmessage(e);
                }
            });

            return new Promise(resolve => {
                socket.on('connect', () => {
                    resolve();
                });
            });
        },
        emit: function(msg, data) {
            return new Promise(resolve => {
                socket.emit(msg, data);
                resolve();
            });
        }
    };
};

//
//Using a technique as described https://github.com/yelouafi/redux-saga/issues/51
//The main point is
//To integrate external push sources, we'll need to transpose the Event Source from the push model into the
//pull model; i.e. we'll have to build an event iterator from which we can pull the future events from the
//event source.

//Using Delegate pattern so we can easily drop in a mocked source to
//test this technique

export function SourceDelegator(mocked) {

    let count = 0;
    let source;
    if (mocked)  {
        source = new MockedSocket();
    } else {
        source = new Socket();
    }

    let deferred;

    source.onmessage = event => {
        if (deferred) {
            deferred.resolve(event);
            deferred = null;
        }
    };

    return {
        nextMessage: function() {
            if (!deferred) {
                deferred = {};
                deferred.promise = new Promise(resolve => deferred.resolve = resolve);
            }
            return deferred.promise;
        },
        connect: function(port) {
            return source.connect(port);
        },
        emit: function(msg, data) {
            return source.emit(msg,data);
        },
        source: function() {
            return source;
        }
    };
}

var EventSource = (function() {
    var instance;

    function createInstance(mocked) {
        return new SourceDelegator(mocked);
    }

    return {
        getInstance: function(mocked) {

            if (!instance) {
                instance = createInstance(mocked);
            }
            return instance;
        }
    };
})();

export function* read(msgSource) {
    let msg = yield call(msgSource.nextMessage);

    while (msg) {

        yield put(opCompleted(msg.data.payload));

        let payload = Immutable.fromJS(msg.data.payload).toJS();

        let action = {
            type: msg.data.payload.op + '::completed',
            payload: payload
        }

        //console.log( 'putting action', action );
        yield put(action);

        if ( msg.data.payload.op === 'Call::login' ) {
            yield put(setAuthStatus(msg.data.payload.error, msg.data.payload.ret));
        }
        msg = yield call(msgSource.nextMessage);
    }
}

export function* write(msgSource) {
    while (true) {
        const action = yield take(SEND_REQUEST);
        yield put(opStarted(action));
        yield call(msgSource.emit,action.payload.message, action.payload.data);
    }
}



let bgReadTask;
let bgWriteTask;
let bgWriteManyTask;

export function* watchConnect(action) {

    let eventSource = EventSource.getInstance();

    yield put(setConnectionStatus(REQUEST.IN_PROGRESS));

    if (bgReadTask) {
        yield cancel(bgReadTask);
    }

    if (bgWriteTask) {
        yield cancel(bgWriteTask);
    }

    try {
        yield call(eventSource.connect, action.port);
        bgReadTask = yield fork(read, eventSource);
        bgWriteTask = yield fork(write, eventSource);
        yield put(setConnectionStatus(REQUEST.COMPLETED));

    } catch (e) {
        console.log('setting connect error', e);
        yield put(setConnectionStatus(REQUEST.ERROR));
    }
}
