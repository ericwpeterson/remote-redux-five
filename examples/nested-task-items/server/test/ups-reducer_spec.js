import {expect} from 'chai';
import makeStore from '../src/store';

import {toJS, Map, List } from 'immutable';
import Immutable from 'immutable';

import { setProperty, callMethod, setMethodState, REQUEST } from '../src/monobjects/reducers/monobject';

let printState = (state) => console.log(JSON.stringify(state, null, 4));

describe('ups reducer', () => {

    it('takes startPolling actions', () => {
        const store = makeStore();
        store.dispatch(callMethod('ups', 'startPolling', []));
        let nextState = store.getState();
        expect(nextState.toJS().monobjects.ups.methods.startPolling.state).to.equal(REQUEST.COMPLETED);
    });

    it('takes setProperty actions', () => {
        const store = makeStore();
        store.dispatch(setProperty('ups', 'inputVoltage', 222));
        let nextState = store.getState();
        expect(nextState.toJS().monobjects.ups.props.inputVoltage).to.equal(222);
    });

    it('takes setMethodStatus to IN_PROGRESS', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.IN_PROGRESS));
        let nextState = store.getState();
        expect(nextState.toJS().monobjects.ups.methods.readConfig.state).to.equal(REQUEST.IN_PROGRESS);
    });

    it('takes setMethodStatus to COMPLETED', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.COMPLETED, 'rval'));
        let nextState = store.getState();
        expect(nextState.toJS().monobjects.ups.methods.readConfig.state).to.equal(REQUEST.COMPLETED);
        expect(nextState.toJS().monobjects.ups.methods.readConfig.ret).to.equal('rval');
    });

    it('takes setMethodStatus to ERROR', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.ERROR, 'rval'));
        let nextState = store.getState();
        expect(nextState.toJS().monobjects.ups.methods.readConfig.state).to.equal(REQUEST.ERROR);
        expect(nextState.toJS().monobjects.ups.methods.readConfig.ret).to.equal('rval');
    });
});
