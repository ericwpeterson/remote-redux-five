import {createStore, applyMiddleware, combineReducers} from 'redux';

import monobjectReducer from './modules/monobject';
import upsReducer from './modules/ups'

import createSagaMiddleware from 'redux-saga';
import upsSaga from './modules/ups-saga'

const sagaMiddleware = createSagaMiddleware();

let monobjects = upsReducer(monobjectReducer)

let app = combineReducers( { monobjects } )

export default function makeStore() {
    let store = createStore(app, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(upsSaga);
    return store;
}
