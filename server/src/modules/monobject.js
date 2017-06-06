// Action Types
export const SET_PROP     = 'example1/monobject/SET_PROP';
export const CALL_METHOD  = 'example1/monobject/CALL_METHOD';

const DEFAULT_STATE = {};

export default function monobjectReducer(state = DEFAULT_STATE, action) {
    let ret;

    switch (action.type) {

        case SET_PROP:
            if (state[action.monObject] && state[action.monObject].props && state[action.monObject].props[action.property]) {
                let clone = Object.assign({}, state[action.monObject]);
                clone.props[action.property] = action.value;
                let newObject = {};
                newObject[action.monObject] = clone;
                return Object.assign({}, state, newObject );
            } else {
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
