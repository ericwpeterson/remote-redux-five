import { Map } from 'immutable';

// Actions
export const SET_PAGE  = 'appReducer/SET_PAGE';
export const SET_AUTH_STATUS = 'appReducer/SET_AUTH_STATUS';
export const SET_CONNECTION_STATUS  = 'appReducer/SET_CONNECTION_STATUS';
export const SET_INSTANCE_ID  = 'appReducer/SET_INSTANCE';
export const SHOW_SERIAL_MODAL  = 'appReducer/SHOW_SERIAL_MODAL';
export const SHOW_INSTANCE_MODAL  = 'appReducer/SHOW_INSTANCE_MODAL';
export const SET_INSTANCE_INFO  = 'appReducer/SET_INSTANCE_INFO';

import { OP_COMPLETED } from './monobject'

const DEFAULT_STATE = Map({
    page: 'LOGIN',
    connected: false,
    authError: false,
    authenticated: false,
    showGetSerialNumberModal: false,
    showGetInstanceModal: false,
    instanceId: undefined,
    instanceInfo: []
});

export default function appReducer(state = DEFAULT_STATE, action) {
    let ret;

    switch (action.type) {

        case SET_AUTH_STATUS:
            ret = state.set('authenticated', !action.authError);
            ret = ret.set('authError', action.authError);
            ret = ret.set('jwt', action.jwt);

            if ( !action.authError ) {
                ret = ret.set('page', "CREATE_OR_LOAD_INSTANCE");
            }

            return ret;

        case SHOW_SERIAL_MODAL:
            ret = state.set('showGetSerialNumberModal', action.show);
            return ret;

        case SET_INSTANCE_INFO:
            ret = state.set('instanceInfo', action.info);
            return ret;

        case SHOW_INSTANCE_MODAL:
            ret = state.set('showGetInstanceModal', action.show);
            return ret;

        case SET_PAGE:
            ret = state.set('page', action.page);
            return ret;

        case SET_INSTANCE_ID:
            ret = state.set('instanceId', action.id);
            return ret;

        case SET_CONNECTION_STATUS:
            ret = state.set('connected', action.status === 'COMPLETED'?true:false);
            return ret;

        default:
            return state;
    }
}

// Action Creators

export function setPage(page) {
    return {
        type: SET_PAGE,
        page: page
    };
}

export function setInstanceId(id) {
    return {
        type: SET_INSTANCE_ID,
        id: id
    };
}

export function setAuthStatus(authError, jwt) {
    return {
        type: SET_AUTH_STATUS,
        authError: authError,
        jwt: jwt
    };
}

export function setConnectionStatus(status) {
    return {
        type: SET_CONNECTION_STATUS,
        status: status
    };
}

export function showSerialModal(show) {
    return {
        type: SHOW_SERIAL_MODAL,
        show: show
    };
}

export function showInstanceModal(show) {
    return {
        type: SHOW_INSTANCE_MODAL,
        show: show
    };
}

export function setInstanceInfo(info) {
    return {
        type: SET_INSTANCE_INFO,
        info: info
    };
}
