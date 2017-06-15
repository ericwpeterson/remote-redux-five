import { delay } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import { CALL_METHOD, setProperty, setMethodState, REQUEST } from '../reducers/monobject.js'

export let readConfig = () => {
    return new Promise(resolve => {
        //for this example lets just pretend that we are reading from a file async
        //that takes 2 seconds. But testing async code is easy with redux-saga.

        setTimeout( () => {
            resolve( 'Clint,Eastwood' );
        }, 2000);
    });
}

export function* watchCall() {
    while (true) {
        const action = yield take(CALL_METHOD);
        if ( action.monObject === 'ups' && action.method === 'readConfig' ) {
            try {
                yield put(setMethodState('ups', action.method, REQUEST.IN_PROGRESS));
                let fileContents = yield call(readConfig);
                yield put(setMethodState('ups', action.method, REQUEST.COMPLETED, fileContents));
            } catch(e) {
                console.log( 'err = ', e)
                yield put(setMethodState('ups', action.method, REQUEST.ERROR));
            }
        }
    }
}

export default function* upsSaga() {
  yield [
    watchCall()
  ]

}
