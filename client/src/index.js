import React from 'react';
import ReactDOM from 'react-dom';
import AppContainer from '../components/App.js';
import {Provider} from 'react-redux';

import makeStore from './store';

ReactDOM.render(
    <Provider store={makeStore()}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
