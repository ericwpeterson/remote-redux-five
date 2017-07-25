import {expect} from 'chai';
import makeStore from '../src/store';

import { Map, List } from 'immutable';
import Immutable from 'immutable';

import {
    CONNECT_REQUEST,
    SEND_REQUEST,
    REQUEST,
    opStarted,
    opCompleted,
    setConnectionState
} from '../modules/monobject';

let printState = (state) => console.log(JSON.stringify(state.monobjectReducer.toJS(), null, 4));

describe('monobject-reducer', () => {

    it('handles opStarted Set actions', () => {
        const store = makeStore();
        let action = {
            type: SEND_REQUEST,
            payload: {
                message: "Set",
                data: {
                    monObject: 'mo',
                    property: 'color',
                    value: 'blue'
                }
            }
        };

        store.dispatch(opStarted(action));
        let path = ['monobjects', 'mo', 'props', 'color', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal(REQUEST.IN_PROGRESS);
    });

    it('handles opStarted Get actions', () => {
        const store = makeStore();

        let action = {
            type: SEND_REQUEST,
            payload: {
                message: "Get",
                data: {
                    monObject: 'mo',
                    property: 'color'
                }
            }
        };

        store.dispatch(opStarted(action));
        let path = ['monobjects', 'mo', 'props', 'color', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal(REQUEST.IN_PROGRESS);
    });

    it('handles opStarted Call actions', () => {
        const store = makeStore();

        let action = {
            type: SEND_REQUEST,
            payload: {
                message: "Call",
                data: {
                    monObject: 'mo',
                    method: 'bark',
                    args: []
                }
            }
        };

        store.dispatch(opStarted(action));
        let path = ['monobjects', 'mo', 'methods', 'bark', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal(REQUEST.IN_PROGRESS);
    });

    it('handles opCompleted Get actions', () => {
        const store = makeStore();

        let payload = {'op': "Get::color", 'monObject': 'mo', 'value': 'blue', 'error': false};
        store.dispatch(opCompleted(payload));

        let path = ['monobjects', 'mo', 'props', 'color', 'value'];
        let path2 = ['monobjects', 'mo', 'props', 'color', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal('blue');
        expect(store.getState().monobjectReducer.getIn(path2)).to.equal(REQUEST.COMPLETED);
    });

    it('handles opCompleted Call actions', () => {
        const store = makeStore();

        let payload = {'op': "Call::bark", 'monObject': 'mo', 'ret': 'arroof', 'error': false};
        store.dispatch(opCompleted(payload));

        let path = ['monobjects', 'mo', 'methods', 'bark', 'value'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal('arroof');

        let path2 = ['monobjects', 'mo', 'methods', 'bark', 'state'];
        expect(store.getState().monobjectReducer.getIn(path2)).to.equal(REQUEST.COMPLETED);
    });

    it('handles opCompleted Call with error actions', () => {
        const store = makeStore();

        let payload = {'op': "Call::bark", 'monObject': 'mo', 'ret': 'arroof', 'error': true};
        store.dispatch(opCompleted(payload));

        let path = ['monobjects', 'mo', 'methods', 'bark', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal(REQUEST.ERROR);
    });

    it('handles opCompleted Get with error actions', () => {
        const store = makeStore();

        let payload = {'op': "Get::color", 'monObject': 'mo', 'value': 'blue', 'error': true};
        store.dispatch(opCompleted(payload));

        let path = ['monobjects', 'mo', 'props', 'color', 'state'];
        expect(store.getState().monobjectReducer.getIn(path)).to.equal(REQUEST.ERROR);
    });

    it('handles setConnectionStatus actions', () => {
        const store = makeStore();

        store.dispatch(setConnectionState(REQUEST.ERROR));
        expect(store.getState().monobjectReducer.toJS().connectionState).to.equal(REQUEST.ERROR);

        store.dispatch(setConnectionState(REQUEST.IN_PROGRESS));
        expect(store.getState().monobjectReducer.toJS().connectionState).to.equal(REQUEST.IN_PROGRESS);

        store.dispatch(setConnectionState(REQUEST.COMPLETED));
        expect(store.getState().monobjectReducer.toJS().connectionState).to.equal(REQUEST.COMPLETED);
    });


});
