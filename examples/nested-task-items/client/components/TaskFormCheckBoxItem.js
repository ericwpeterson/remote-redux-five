import React, { Component } from 'react';
import { Checkbox } from 'react-bootstrap';

import {connect} from 'react-redux';

import {
  REQUEST,
  connectMonux,
  get,
  set,
  call,
  watch,
  unwatch }
from '../modules/monobject';

import PropTypes from 'prop-types';
//import {Button} from 'react-bootstrap'
//import {Glyphicon} from 'react-bootstrap'

class CheckboxTaskItem extends Component {
    setChecked() {
       let map = {
         path: this.props.path,
         uuid: this.props.uuid,
         taskFormIndex: this.props.taskFormIndex,
         taskChecked: !this.props.checked,
       }
       this.props.dispatch(call('mongo', 'setChecked', [map]));
    }

    render() {
        return (
            <div className='checkboxTaskItem'>
                <Checkbox inputRef={ref => { this.input = ref; }} onClick={this.setChecked.bind(this)} checked={this.props.checked?true:false}>{this.props.label}</Checkbox>
            </div>
        );
    }
}

CheckboxTaskItem.propTypes = {
    label: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    uuid: PropTypes.string.isRequired,
    taskFormIndex: PropTypes.number.isRequired
};

//const AppContainer = connect(mapStateToProps,mapDispatchToProps)(App);
//export default AppContainer;

const CheckboxTaskItemContainer = connect()(CheckboxTaskItem);
export default CheckboxTaskItemContainer;
