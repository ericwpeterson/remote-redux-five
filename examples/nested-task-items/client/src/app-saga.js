import { takeEvery, call, put } from 'redux-saga/effects';
import Immutable from 'immutable';
import { callMethod,  watch,  unwatch } from '../modules/monobject';
import { init, setChecked } from '../modules/tasktree';
import { setPage, showSerialModal, showInstanceModal, setInstanceId, setInstanceInfo } from '../modules/app';

export const appSagas = [
    takeEvery('Call::createInstance::completed', createInstanceCompleted ),
    takeEvery('Call::loadInstance::completed', loadInstanceCompleted ),
    takeEvery('Watch::checkState::completed', checkStateCompleted ),
    takeEvery('Call::getInstanceInfo::completed', getInstanceInfoCompleted ),
]

let instanceId;

export function* createInstanceCompleted(action) {
    if ( !action.payload.error ) {
        instanceId = action.payload.ret;
        yield put(setInstanceId(instanceId));
        yield put(callMethod('mongo', 'loadInstance', [{uuid: action.payload.ret}])  )
    }
}

export function* loadInstanceCompleted(action) {
    if ( !action.payload.error ) {
        yield put(init(action.payload.ret));
        yield put(setInstanceId(action.payload.ret._id));
        yield put(setPage('TASK_TREE'));
        yield put(showSerialModal(false));
        yield put(watch('mongo', 'checkState'))
    }
}

export function* checkStateCompleted(action) {
    if ( !action.payload.error ) {
        if ( action.payload.value.instanceId === instanceId ) {
            var value = action.payload.value;
            yield put(setChecked( value.path, value.taskFormIndex, value.taskChecked, value.user ));
        }
    }
}

export function* getInstanceInfoCompleted(action) {
    if ( !action.payload.error ) {
        yield put(setInstanceInfo(action.payload.ret));
        yield put(showInstanceModal(true));
    }
}
