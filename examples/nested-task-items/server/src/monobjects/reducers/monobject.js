import {Map, List } from 'immutable';
import Immutable from 'immutable';

// Action Types
export const SET_PROP           = 'example1/monobject/SET_PROP';
export const CALL_METHOD        = 'example1/monobject/CALL_METHOD';
export const SET_METHOD_STATE   = 'example1/monobject/SET_METHOD_STATE';

export const REQUEST = {
    IDLE: 'IDLE',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    ERROR: 'ERROR'
};

const DEFAULT_STATE = Map({});

export default function(wrapped) {

    let ret = function(state = DEFAULT_STATE, action) {

        let path;

        switch (action.type) {

            case SET_PROP:

                path = [action.monObject, 'props', action.property];

                if (state.hasIn(path)) {
                    return state.setIn(path,action.value);
                } else {
                    console.log("failed to set prop", action);
                    return state;
                }

            case SET_METHOD_STATE:

                path = [action.monObject, 'methods', action.method];

                if (state.hasIn(path)) {
                    ret = state.setIn([...path, ...['ret']], action.ret);
                    ret = ret.setIn([...path, ...['state']], action.state);
                    return ret;
                } else {
                    console.log("failed to set method state", action);
                    return state;
                }
        }

        return wrapped(state, action);
    };

    return ret;
}

// Action Creators

export function setProperty(monObject, property, value) {
    return {
        'type': SET_PROP,
        'monObject': monObject,
        'property': property,
        'value': value
    };
}

export function callMethod(monObject, method, args) {
    return {
        'type': CALL_METHOD,
        'monObject': monObject,
        'method': method,
        'args': args
    };
}

export function setMethodState(monObject, method, state, retCode) {
    return {
        'type': SET_METHOD_STATE,
        'monObject': monObject,
        'method': method,
        'state': state,
        'ret': retCode
    };
}
