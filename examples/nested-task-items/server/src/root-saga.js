import { monobjectSagas } from './monobjects/sagas/monobject-saga';
import { mongoSagas } from './monobjects/sagas/mongo-saga';

import { all } from 'redux-saga/effects';

export default function* rootSaga() {
    yield all([
      ...monobjectSagas,
      ...mongoSagas
    ])
}
