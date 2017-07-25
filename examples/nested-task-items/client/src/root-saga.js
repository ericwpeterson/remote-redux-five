
import { monobjectSagas } from './monobject-saga';
import { appSagas } from './app-saga';
import { all } from 'redux-saga/effects';

export default function* rootSaga() {
    yield all([
      ...monobjectSagas,
      ...appSagas
    ])
}
