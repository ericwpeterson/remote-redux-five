import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'react-bootstrap'
import {Glyphicon} from 'react-bootstrap'
import { select } from '../modules/tasktree';

class TreeNode extends Component {

    constructor(props) {
        super(props);
        this.select = this._select.bind(this);
    }

    _select() {
        this.props.dispatch(select(this.props.id));
    }

    render() {
        let treeNodes = this.props.children.map((task, index) => {
            let jsx = <TreeNodeContainer
                key = {this.props.id + '/' + index}
                checked = {task.checked}
                children = {task.children}
                selected = {task.selected}
                taskForm = {task.taskForm}
                title = {task.title}
                id = {this.props.id + '/' + index}
                level = {this.props.level + 1}
            />;
            return jsx;
        });
        let cn = 'treeNode ';
        cn += 'treeNodeLevel' + this.props.level;

        let glyph;

        if ( this.props.checked ) {
            glyph = <Glyphicon glyph="ok" />
        }

        return (
            <div className={cn} >
                <Button active={this.props.selected} onClick={this.select}> {glyph} {this.props.title}</Button>
                {treeNodes}
            </div>
        );
    }
}

//TreeNode.propTypes = {
//    children: PropTypes.array.isRequired,
//};


const TreeNodeContainer = connect()(TreeNode);

export default TreeNodeContainer;
