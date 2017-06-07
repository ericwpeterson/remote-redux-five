import {expect} from 'chai';
import makeStore from '../src/store';

import { setProperty, callMethod } from '../src/modules/monobject'

describe('ups reducer', () => {

    it('sets properties', () => {
        const store = makeStore();

        store.dispatch(setProperty('ups', 'inputVoltage', 123));
        const nextState = store.getState();

        expect(nextState.monobjects.ups.props.inputVoltage).to.equal(123);
    });


    it('handles startPoll calls', () => {
        const store = makeStore();

        store.dispatch(callMethod('ups', 'startPolling', [{location: '/dev/ttyS1'}]));

        const nextState = store.getState();
        //expect(nextState.monobjects.ups.inputVoltage).to.equal(123);

        //console.log('next state', nextState);
    });
})
