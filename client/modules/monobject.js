import {Map, List } from 'immutable';
import Immutable from 'immutable';

export const REQUEST = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

// Actions
export const OP_COMPLETED  = 'monobject/OP_COMPLETED';
export const OP_STARTED    = 'monobject/OP_STARTED';
export const SEND_REQUEST  = 'monobject/SEND_REQUEST';
export const CONNECT_REQUEST = 'monobject/CONNECT';
export const SET_CONNECTION_STATE  = 'monobject/SET_CONNECTION_STATE';

const DEFAULT_STATE = Map({});

export default function monobjectReducer(state = DEFAULT_STATE, action) {
    let ret;

    switch (action.type) {

        case SET_CONNECTION_STATE:
            ret = state.setIn(['connectionState'], action.connectionState);
            return ret;

        case OP_COMPLETED:
            ret = _opCompleted(state, action.payload);
            return ret;

        case OP_STARTED:
            ret = _opStarted(state, action.payload);
            return ret;

        default:
            return state;
    }
}

function _opStarted(state, action) {
    let path;

    if (action.payload.message === 'Call') {
        path = [
            'monobjects',
            action.payload.data.monObject,
            'methods',
            action.payload.data.method
        ];
    } else {
        path = [
            'monobjects',
            action.payload.data.monObject,
            'props',
            action.payload.data.property
        ];
    }

    return state.setIn(path, Map({state: REQUEST.IN_PROGRESS}));
}

function _opCompleted(state, payload) {
    let tokens = payload.op.split('::');
    let cmd = tokens[0];
    let arg = tokens[1]; //may be a property or method name
    let method;
    let prop;
    let key;

    if (cmd === 'Call') {
        key = 'methods';
    } else {
        key = 'props';
    }

    let ret = state;

    if (payload.error) {
        ret = state.setIn(['monobjects', payload.monObject, key, arg, 'state'], REQUEST.ERROR);
    } else {
        if (cmd === "Get" || cmd === 'Call' || cmd === 'Watch') {
            let vkey = 'value';
            if (cmd === 'Call') {
                vkey = 'ret';
            }

            ret = state.setIn(['monobjects', payload.monObject, key, arg],
                Map({value: payload[vkey], state: REQUEST.COMPLETED}));
        }
    }

    return ret;
}

// Action Creators

export function connectMonux(port) {
    return {
        type: CONNECT_REQUEST,
        port: port
    };
}

export function setConnectionState(connnectionState) {
    return {
        type: SET_CONNECTION_STATE,
        connectionState: connnectionState
    };
}

export function opStarted(action) {
    return {
        type: OP_STARTED,
        payload: action
    };
}

export function opCompleted(payload) {
    return {
        type: OP_COMPLETED,
        payload: payload
    };
}

export function get(monobject, property) {
    return {
        type: SEND_REQUEST,
        payload: {
            message: "Get",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}

export function set(monobject, property, value) {
    return {
        type: SEND_REQUEST,
        payload: {
            message: "Set",
            data: {
                monObject: monobject,
                property: property,
                value: value
            }
        }
    };
}

export function call(monobject, method, args) {
    return {
        type: SEND_REQUEST,
        payload: {
            message: "Call",
            data: {
                monObject: monobject,
                method: method,
                args: args
            }
        }
    };
}

export function watch(monobject, property) {
    return {
        type: SEND_REQUEST,
        payload: {
            message: "Watch",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}

export function unwatch(monobject, property) {
    return {
        type: SEND_REQUEST,
        payload: {
            message: "UnWatch",
            data: {
                monObject: monobject,
                property: property
            }
        }
    };
}
