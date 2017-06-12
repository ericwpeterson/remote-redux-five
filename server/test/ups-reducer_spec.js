import {expect} from 'chai';
import makeStore from '../src/store';

import {toJS, Map, List } from 'immutable';
import Immutable from 'immutable';

import { setProperty, callMethod, setMethodState, REQUEST } from '../src/modules/monobject'

//console.log( JSON.stringify( nextState.monobjects.toJS(), null, 4 ));

describe('ups reducer', () => {

    it('takes startPolling actions', () => {
        const store = makeStore();
        store.dispatch(callMethod('ups', 'startPolling', [] ));
        let nextState = store.getState();
        expect(nextState.monobjects.toJS().ups.methods.startPolling.state).to.equal(REQUEST.COMPLETED);
    });

    it('takes setProperty actions', () => {
        const store = makeStore();
        store.dispatch(setProperty('ups', 'inputVoltage', 222));
        let nextState = store.getState();
        expect(nextState.monobjects.toJS().ups.props.inputVoltage).to.equal(222);
    });

    it('takes setMethodStatus to IN_PROGRESS', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.IN_PROGRESS));
        let nextState = store.getState();
        expect(nextState.monobjects.toJS().ups.methods.readConfig.state).to.equal(REQUEST.IN_PROGRESS);
    });

    it('takes setMethodStatus to COMPLETED', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.COMPLETED, 'rval'));
        let nextState = store.getState();
        expect(nextState.monobjects.toJS().ups.methods.readConfig.state).to.equal(REQUEST.COMPLETED);
        expect(nextState.monobjects.toJS().ups.methods.readConfig.ret).to.equal('rval');
    });

    it('takes setMethodStatus to ERROR', () => {
        const store = makeStore();
        store.dispatch(setMethodState('ups', 'readConfig', REQUEST.ERROR, 'rval'));
        let nextState = store.getState();
        expect(nextState.monobjects.toJS().ups.methods.readConfig.state).to.equal(REQUEST.ERROR);
        expect(nextState.monobjects.toJS().ups.methods.readConfig.ret).to.equal('rval');
    });
})
