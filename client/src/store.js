import {createStore, applyMiddleware} from 'redux';
import reducer from '../modules/index';
import rootSaga from './monobject-saga';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

export default function makeStore() {
    const store = createStore(reducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);
    return store;
}
