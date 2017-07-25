import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import AppContainer from '../containers/App';
import {Provider} from 'react-redux';
import makeStore from './store';

class Foo extends Component {

    render() {
        return (
            <div className='tree'>
                FOO
            </div>
        );
    }
}


ReactDOM.render(
    <Provider store={makeStore()}>
        <AppContainer />
    </Provider>,
    document.getElementById('app')
);
