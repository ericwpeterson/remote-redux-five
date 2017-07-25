import { combineReducers } from 'redux';

import monobjectReducer from './monobject';
import taskTreeReducer from './tasktree';
import appReducer from './app';

let reducers = combineReducers({
    taskTree: taskTreeReducer,
    monobjectReducer: monobjectReducer,
    appReducer: appReducer
});

export default reducers;
