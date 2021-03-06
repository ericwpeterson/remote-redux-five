import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import R from 'ramda';
import { connect } from 'react-redux';

import {
  REQUEST,
  connectMonux,
  get,
  set,
  call,
  watch,
  unwatch }
from '../modules/monobject';

import Maybe from '../src/maybe';

class App extends Component {

    componentDidMount() {

        //only defined if we are running from webpack-dev-server
        let port;
        try {
            port = WEBPACK_SAGA_PORT;
        } catch (e) {}

        this.props.connectMonux(port);
    }

    render() {

        let monuxState = this.props.app.toJS();

        let connectionStatus = Maybe.of(monuxState)
            .map(R.prop('connectionState'))
            .orElse(undefined).value();

        if (connectionStatus === REQUEST.COMPLETED && this.lastConnectionStatus !== REQUEST.COMPLETED) {
            this.lastConnectionStatus = connectionStatus;
            this.props.watchInputVoltage();
        } else {
            this.lastConnectionStatus = connectionStatus;
        }

        console.log('monux state', monuxState);

        let monuxCompleteState = (val) => {
            return val.state === "COMPLETED" ? val.value : null;
        };

        let inputVoltage = Maybe.of(monuxState)
            .map(R.prop('monobjects'))
            .map(R.prop('ups')).map(R.prop('props'))
            .map(R.prop('inputVoltage'))
            .map(monuxCompleteState).orElse("?").value();

        return (

            <div style={{margin: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                    <button onClick={this.props.beginPolling.bind(this)}> Call beginPolling method </button>
                    <button onClick={this.props.readConfig.bind(this)}> Call readConfig method </button>
                </div>
                <div>
                    Input voltage is {inputVoltage}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        app: state.monobjectReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        watchInputVoltage: () => {
            dispatch(watch('ups', 'inputVoltage'));
        },
        beginPolling: () => {
            dispatch(call('ups', 'startPolling', ['/dev/ttyS1']));
        },
        readConfig: () => {
            dispatch(call('ups', 'readConfig', []));
        },
        connectMonux: (port) => {
            dispatch(connectMonux(port));
        },
    };
};

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
