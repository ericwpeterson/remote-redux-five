import {expect} from 'chai';
import makeStore from '../src/store';

import { put, call, take } from 'redux-saga/effects';

import { watchCall, readConfig } from '../src/modules/ups-saga'

import { setProperty, callMethod, CALL_METHOD, setMethodState, REQUEST } from '../src/modules/monobject'

describe('ups saga', () => {

    it('reads in a config file', () => {

        let action = callMethod('ups', 'readConfig', [] );

        const store = makeStore();

        const gen = watchCall(action);
        expect(gen.next().value).to.deep.equal(take(CALL_METHOD));

        expect(gen.next(action).value).to.deep.equal(put(setMethodState('ups', 'readConfig', REQUEST.IN_PROGRESS)));
        expect(gen.next(action).value).to.deep.equal(call(readConfig));
        let fileContents = "{name: 'some name'}";

        //this is the cool part, we dont need to wait 2 seconds an we could just inject
        //some data, or even better simulate a case where the code throws an error.
        expect(gen.next(fileContents).value).to.deep.equal(put(setMethodState('ups', 'readConfig', REQUEST.COMPLETED, fileContents)));


    });

    it('handles an error when reading the file', () => {

        let action = callMethod('ups', 'readConfig', [] );

        const store = makeStore();

        const gen = watchCall(action);
        expect(gen.next().value).to.deep.equal(take(CALL_METHOD));

        expect(gen.next(action).value).to.deep.equal(put(setMethodState('ups', 'readConfig', REQUEST.IN_PROGRESS)));
        expect(gen.next(action).value).to.deep.equal(call(readConfig));

        expect(gen.throw('error occured').value).to.deep.equal(put(setMethodState('ups', 'readConfig', REQUEST.ERROR)));

    });
})
