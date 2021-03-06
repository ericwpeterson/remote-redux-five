import {Map, List } from 'immutable';
import Immutable from 'immutable';

import { SET_PROP, CALL_METHOD, REQUEST } from './monobject.js';

//add your props and methods here
const DEFAULT_STATE = Map({
    name: 'ups',
    props: Map({
        inputVoltage: 114,
        outputVoltage: 120,
        configFile: ''
    }),
    methods: Map({
        startPolling: Map({}),
        readConfig: Map({})
    })
});

export default function (state = DEFAULT_STATE, action) {

    if (state.get('name') !== action.monObject) {
        return state;
    }

    switch (action.type) {

        case CALL_METHOD:
            if (action.method === 'startPolling') {
                return startPoll(state, action);
            }

        default:
            return state;
    }

}

let setProperty = (state, action) => {
    return state;
};

let startPoll = (state, action) => {
    let path = ['methods', action.method];

    if (state.getIn(path)) {
        let path = ['methods', action.method];

        let ret = state.setIn([...path, ...['ret']], REQUEST.IN_PROGRESS);
        //normally this would get set in a async "saga" function but for this demo we pretending like
        //the method is synchnous

        //NOTE: it is really important to set ret before setting state
        //because watcher gets fired when state changes
        ret = state.setIn([...path, ...['ret']], 'return code');
        ret = ret.setIn([...path, ...['state']], REQUEST.COMPLETED);

        return ret;
    } else {
        console.log('method does not exist');
        return state;
    }
};
