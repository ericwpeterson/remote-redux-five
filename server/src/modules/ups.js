import { SET_PROP, CALL_METHOD, REQUEST } from './monobject.js'

//add your props and methods here
const DEFAULT_STATE = {
    ups: {
        props: {
            inputVoltage: 113,
            outputVoltage: 120
        },
        methods: {
            startPolling: {

            }
        }
    }
};

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
    if (state[action.monObject] && state[action.monObject].methods && state[action.monObject].methods[action.method]) {
        let clone = Object.assign({}, state[action.monObject]);

        // ... do something for this method

        //normally this would get set in a async "saga" function but for this demo we pretending like
        //the method is synchnous

        //NOTE: it is really important to set ret before setting state
        clone.methods[action.method].ret = 'return code';

        //set the state to complete
        clone.methods[action.method].state = REQUEST.COMPLETED;

        let newObject = {};
        newObject[action.monObject] = clone;
        return Object.assign({}, state, newObject );
    } else {
        return state;
    }
}
