import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from '../components/App.js';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../modules/index'
import rootSaga from './monobject-saga';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <Provider store={store}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
