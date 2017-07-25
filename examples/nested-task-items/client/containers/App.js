import React, { Component } from 'react';
import { connect } from 'react-redux';
import Tree from '../components/Tree';
import TaskForm from '../components/TaskForm';
import Login from '../components/Login';
import Header from '../components/Header';
import Maybe from '../src/maybe';
import { testTree } from '../testdata'
import InstanceLoader from '../components/InstanceLoader';

import {
  REQUEST,
  connectMonux,
  get,
  set,
  call,
  watch,
  unwatch }
from '../modules/monobject';


require('../app.scss');

let mainContainerStyle = {
    minHeight: window.innerHeight,
    height: window.height,
    display: 'flex',
    flexDirection: 'row'
};

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

        let taskTree = this.props.taskTree.toJS()
        let appState = this.props.appState.toJS();
        let monuxState  = this.props.monobjects.toJS();

        if ( appState.connected === false ) {
            return (
                <div style={mainContainerStyle}>
                    <div>
                        Establish Connection...
                    </div>
                </div>
            );
        } else if ( appState.authenticated === false ) {
            return (
                <div style={mainContainerStyle}>
                    <div>
                        <Header />
                        <Login error={appState.authError} />
                    </div>
                </div>
            );
        } else {

            if ( appState.page === "CREATE_OR_LOAD_INSTANCE" ) {
                return (
                    <div>
                        <Header />
                        <div style={mainContainerStyle}>
                            <InstanceLoader
                                monux={monuxState}
                                jwt={appState.jwt}
                                showGetSerialNumberModal={appState.showGetSerialNumberModal}
                                showGetInstanceModal={appState.showGetInstanceModal}
                                instanceInfo={appState.instanceInfo}
                            />
                        </div>
                    </div>
                );
            } else {
                if ( taskTree.tree ) {
                    let form = this.props.taskTree.getIn(taskTree.taskFormPath).toJS();
                    return (
                        <div>
                            <Header />
                            <div style={mainContainerStyle}>
                                <Tree tasks={taskTree.tree} />
                                <TaskForm
                                    instanceId={appState.instanceId}
                                    jwt={appState.jwt}
                                    form={form}
                                    path={taskTree.taskFormPath}
                                    uuid={appState.instanceId}
                                />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div style={mainContainerStyle}>
                        </div>
                    );
                }
            }
        }
    }
}

function mapStateToProps(state) {
    return {
        taskTree: state.taskTree,
        appState: state.appReducer,
        monobjects: state.monobjectReducer
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        connectMonux: (port) => {
           dispatch(connectMonux(port));
       }
    };
};

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
