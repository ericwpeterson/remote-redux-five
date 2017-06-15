import {createStore, applyMiddleware } from 'redux';

import {
  combineReducers
} from 'redux-immutable';

import createSagaMiddleware from 'redux-saga';
import upsSaga from './monobjects/sagas/ups-saga';

const sagaMiddleware = createSagaMiddleware();

import monobjectReducer from './monobjects/reducers/monobject';
import upsReducer from './monobjects/reducers/ups';
import dogReducer from './monobjects/reducers/dog';

let monobjects = combineReducers({ups: upsReducer, dog: dogReducer});

//Making a higher order reducer so all of our monobjects can share the same logic.
let monobjectParent = monobjectReducer(monobjects);

let app = combineReducers({monobjects: monobjectParent});

export default function makeStore() {
    let store = createStore(app, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(upsSaga);
    return store;
}
