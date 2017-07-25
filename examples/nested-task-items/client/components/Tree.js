import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TreeNode from '../components/TreeNode';

class Tree extends Component {

    render() {

        let treeNodes;
        let tasks =  this.props.tasks.children;

        treeNodes = tasks.map((task, index) => {
            let jsx = <TreeNode
                key = {'' + index}
                checked = {task.checked}
                children = {task.children}
                selected = {task.selected}
                taskForm = {task.taskForm}
                title = {task.title}
                id = {''+index}
                level = {1}
            />;
            return jsx;
        });


        return (
            <div className='tree'>
                {treeNodes}
            </div>
        );
    }
}

Tree.propTypes = {
    tasks: PropTypes.object.isRequired
};

export default Tree;
