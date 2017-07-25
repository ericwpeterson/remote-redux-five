import {createStore, applyMiddleware} from 'redux';
import reducers from '../modules/index';
import rootSaga from './root-saga';

import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default function makeStore() {
    const store = createStore(reducers, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    return store;
}
