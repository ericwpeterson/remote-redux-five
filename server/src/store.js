import {createStore, applyMiddleware, combineReducers} from 'redux';

import monobjectReducer from './monobjects/reducers/monobject';
import upsReducer from './monobjects/reducers/ups';

import createSagaMiddleware from 'redux-saga';
import upsSaga from './monobjects/sagas/ups-saga';

const sagaMiddleware = createSagaMiddleware();

let monobjects = upsReducer(monobjectReducer);

let app = combineReducers({monobjects});

export default function makeStore() {
    let store = createStore(app, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(upsSaga);
    return store;
}
