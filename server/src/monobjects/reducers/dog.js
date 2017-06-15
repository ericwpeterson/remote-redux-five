import {Map, List } from 'immutable';
import Immutable from 'immutable';

import { SET_PROP, CALL_METHOD, REQUEST } from './monobject.js';

//add your props and methods here
const DEFAULT_STATE = Map({
    props: Map({
        color: 'brown'
    }),
    methods: Map({
        bark: Map({

        })
    })
});

export default function dogReducer(state = DEFAULT_STATE, action) {    

    switch (action.type) {      

        case CALL_METHOD:
            if (action.monObject === 'dog' && action.method === 'bark') {
                return bark(state, action);
            }

        default:
            return state;
    }    
}

let bark = (state, action) => {
    let path = [action.monObject, 'methods', action.method];

    if (state.getIn(path)) {
        let path = [action.monObject, 'methods', action.method];
        let ret = state.setIn([...path, ...['ret']], REQUEST.IN_PROGRESS);

        //normally this would get set in a async "saga" function but for this demo we pretending like
        //the method is synchnous

        //NOTE: it is really important to set ret before setting state
        //because watcher gets fired when state changes
        ret = state.setIn([...path, ...['ret']], 'woof woof');
        ret = ret.setIn([...path, ...['state']], REQUEST.COMPLETED);

        return ret;
    } else {
        console.log('method does not exist');
        return state;
    }
};
