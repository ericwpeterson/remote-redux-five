import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Immutable, { Map } from 'immutable';
import {Button} from 'react-bootstrap'
import {Glyphicon} from 'react-bootstrap'
import {connect} from 'react-redux';
import {pathToString} from '../modules/tasktree'
import { next, back } from '../modules/tasktree';

import TaskFormCheckBoxItem from '../components/TaskFormCheckBoxItem';

class TaskForm extends Component {

    constructor(props) {
        super(props);
        this.goBack = this._goBack.bind(this);
        this.goNext = this._goNext.bind(this);
    }

    _goNext() {
        this.props.dispatch(next(this.props.id));
    }

    _goBack() {
        this.props.dispatch(back(this.props.id));
    }

    render() {
        let taskItems = this.props.form.formTasks.map((taskItem, idx) => {

            let pathArray = Immutable.fromJS(this.props.path).toJS();
            pathArray.pop();

            let jsx = <TaskFormCheckBoxItem
                        taskItem={taskItem}
                        taskFormIndex={idx}
                        path={pathToString(pathArray)}
                        uuid={this.props.instanceId}
                        checked={taskItem.checked}
                        label={taskItem.label}
                    />
            return jsx;
        });

        return (
            <div className='taskForm'>
                <div className = 'taskFormTitle' >
                    {this.props.form.formTitle}
                </div>
                <div className = 'taskFormItemContainer'>
                    {taskItems}
                </div>

                <div className='taskFormNavBar' >
                    <div className='taskFormBackButton' >
                        <Button onClick={this.goBack}><Glyphicon glyph="arrow-left" /></Button>
                    </div>
                    <div className='taskFormNextButton' >
                        <Button onClick={this.goNext}><Glyphicon glyph="arrow-right" /></Button>
                    </div>
                </div>
            </div>
        );
    }
}

TaskForm.propTypes = {
    form: PropTypes.object.isRequired,
};

const TaskFormContainer = connect()(TaskForm);

export default TaskFormContainer;
