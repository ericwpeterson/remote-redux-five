import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import R from 'ramda'

import { connect } from 'react-redux';
import { get, set, call, watch, unwatch } from '../modules/monobject';

import Maybe from '../src/maybe'

class App extends Component {

    componentDidMount() {
        this.props.watchInputVoltage()
    }

    render() {

        let monuxState = this.props.app.toJS();

        console.log( monuxState )

        let monuxCompleteState = (val) => {
            return val.state === "COMPLETED"?val.value:null;
        }

        //let inputVoltage = Maybe.of(monuxState)
          //  .map(R.prop('monobjects'))
            //.map(R.prop('ups')).map(R.prop('props'))
            //.map(R.prop('inputVoltage')).orElse("?").value()


        let inputVoltage = Maybe.of(monuxState)
            .map(R.prop('monobjects'))
            .map(R.prop('ups')).map(R.prop('props'))
            .map(R.prop('inputVoltage'))
            .map(monuxCompleteState).orElse("?").value()


        return (
            <div> input voltage is {inputVoltage}  </div>
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
        }
    }
}

const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
export default AppContainer;
