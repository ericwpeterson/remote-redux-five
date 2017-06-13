import {expect} from 'chai';
import {connect, write, read, readNoEffects, SourceDelegator} from '../src/monobject-saga';
import { put, call, take, fork }	from 'redux-saga/effects';
import { SEND_REQUEST, opStarted, opCompleted } from '../modules/monobject';

function printNextValue(gen) {
    console.log(JSON.stringify(gen.next().value, null, 4));
}

describe('monobject saga', () => {

    it('it reads from a event souce and dispatches OP_COMPLETED actions', () => {

        let eventSource = new SourceDelegator(true);

        let msg = {
            data: {
                message: 'opCompleted',
                payload: {
                    monobject: 'mo',
                    'op': 'Get::sites',
                    'value': 123,
                    error: false
                }
            }
        };

        const gen = read(eventSource);
        expect(gen.next().value).to.deep.equal(call(eventSource.nextMessage));
        expect(gen.next(msg).value).to.deep.equal(put(opCompleted(msg.data.payload)));
        expect(gen.next().value).to.deep.equal(call(eventSource.nextMessage));
    });

    it('it writes requests to the socket and dispatches OP_STARTED actions', () => {

        let eventSource = new SourceDelegator(true);

        let action = {
            type: 'SEND_REQUEST',
            payload: {
                message: "Set",
                data: {
                    monobject: 'mo',
                    property: 'color',
                    value: 'blue'
                }
            }
        };

        const gen = write(eventSource);
        expect(gen.next(action).value).to.deep.equal(take(SEND_REQUEST));
        expect(gen.next(action).value).to.deep.equal(put(opStarted(action)));
    });
});
