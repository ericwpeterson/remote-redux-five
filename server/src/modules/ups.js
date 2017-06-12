

import {Map, List } from 'immutable';
import Immutable from 'immutable';

import { SET_PROP, CALL_METHOD, REQUEST } from './monobject.js'

//add your props and methods here
const DEFAULT_STATE = Map({
    ups: Map({
        props: Map({
            inputVoltage: 114,
            outputVoltage: 120,
            configFile: ''
        }),
        methods: Map({
            startPolling: Map({

            }),
            readConfig: Map({

            })
        })
    })
});

//console.log(JSON.stringify(DEFAULT_STATE.toJS(), null, 4));

export default function(wrapped) {

    let ret = function(state = DEFAULT_STATE, action) {

        switch (action.type) {

            //NOTE: just showing we could always handle this instead of the wrapped generic reducer
            //case SET_PROP:
            //    if ( action.monObject === 'ups') {
            //        return setProperty(state, action);
            //    }

            case CALL_METHOD:
                if ( action.monObject === 'ups' && action.method === 'startPolling' ) {
                    return startPoll(state, action);
                }
        }
        return wrapped(state, action);
    };

    return ret;
}

let setProperty = (state, action) => {
    return state;
}

let startPoll = (state, action) => {
    let path = [action.monObject, 'methods', action.method];

    if ( state.getIn(path)) {
        let path = [action.monObject, 'methods', action.method];
        //normally this would get set in a async "saga" function but for this demo we pretending like
        //the method is synchnous

        //NOTE: it is really important to set ret before setting state
        //because watcher gets fired when state changes
        let ret = state.setIn([...path, ...['ret']], 'return code');
        ret = ret.setIn([...path, ...['state']], REQUEST.COMPLETED);

        return ret;
    } else {
        console.log( 'method does not exisdt')
        return state;
    }
}
