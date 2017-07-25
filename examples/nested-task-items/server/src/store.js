import {createStore, applyMiddleware } from 'redux';

import {
  combineReducers
} from 'redux-immutable';

import createSagaMiddleware from 'redux-saga';
import rootSaga from './root-saga';

const sagaMiddleware = createSagaMiddleware();

import monobjectReducer from './monobjects/reducers/monobject';
import mongoReducer from './monobjects/reducers/mongo';

let monobjects = combineReducers({mongo: mongoReducer});

//Making a higher order reducer so all of our monobjects can share the same logic.
let monobjectParent = monobjectReducer(monobjects);

let app = combineReducers({monobjects: monobjectParent});

export default function makeStore() {
    let store = createStore(app, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    return store;
}
