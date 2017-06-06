import {createStore, applyMiddleware, combineReducers} from 'redux';

import monobjectReducer from './modules/monobject';
import upsReducer from './modules/ups'

let monobjects = upsReducer(monobjectReducer)

let app = combineReducers( { monobjects } )

export default function makeStore() {
  return createStore(app);
}
