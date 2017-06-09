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

const DEFAULT_STATE = {};

export default function monobjectReducer(state = DEFAULT_STATE, action) {
    let ret;

    switch (action.type) {

        case SET_PROP:
            if (state[action.monObject] && state[action.monObject].props && state[action.monObject].props.hasOwnProperty(action.property)) {
                let clone = Object.assign({}, state[action.monObject]);
                clone.props[action.property] = action.value;
                let newObject = {};
                newObject[action.monObject] = clone;
                return Object.assign({}, state, newObject );
            } else {
                console.log("failed to set prop", action)
                return state;
            }

        case SET_METHOD_STATE:
            if (state[action.monObject] && state[action.monObject].methods && state[action.monObject].methods.hasOwnProperty(action.method)) {
                let clone = Object.assign({}, state[action.monObject]);
                clone.methods[action.method].state = action.state;
                clone.methods[action.method].ret = action.ret;
                let newObject = {};
                newObject[action.monObject] = clone;
                return Object.assign({}, state, newObject );
            } else {
                console.log("failed to set prop", action)
                return state;
            }


        default:
            return state;
    }
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
