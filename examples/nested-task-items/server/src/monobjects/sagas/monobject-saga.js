import { delay } from 'redux-saga';
import { takeEvery, all, take, call, put } from 'redux-saga/effects';
import { CALL_METHOD } from '../reducers/monobject.js'

export const monobjectSagas = [
    takeEvery(CALL_METHOD, callMethod)
]

export function* callMethod(action) {
    action.type = action.monObject+'/'+action.method;
    put(action);
}
