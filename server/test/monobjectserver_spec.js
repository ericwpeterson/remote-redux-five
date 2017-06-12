

import {expect} from 'chai';
import makeStore from '../src/store';
import { setProperty, callMethod, setMethodState } from '../src/modules/monobject'

import {
    setStore,
    reqisterPropWatcher,
    reqisterMethodWatcher,
    unReqisterPropWatcher,
    propWatchers,
    clearPropWatchers,
    clearMethodWatchers,
    unReqisterAllPropWatchers,
    unReqisterMethodWatcher,
    unReqisterAllMethodWatchers

} from '../src/monobjectserver'

describe('monobjectserver', () => {

    it('reqisters many propWatchers but does not allow duplicate handlers', () => {
        clearPropWatchers();
        const store = makeStore();
        setStore(store);

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                expect(w.id).to.equal(123);
            }
        });

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                expect(w.id).to.equal(123);
            }
        });

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 124,
            onChange: (w, value, objectPath) => {
                expect(w.id).to.equal(124);
            }
        });

        expect(propWatchers['ups.props.inputVoltage'].length).to.equal(2);
        expect(propWatchers['ups.props.inputVoltage'][0].id).to.equal(123);
        expect(propWatchers['ups.props.inputVoltage'][1].id).to.equal(124);
    });

    it('calls prop handlers when state changes', () => {
        let onChanged123 = false;
        let onChanged124 = false;

        clearPropWatchers();
        const store = makeStore();
        setStore(store);

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                expect(w.id).to.equal(123);
                onChanged123 = true;
            }
        });
        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 124,
            onChange: (w, value, objectPath) => {
                expect(w.id).to.equal(124);
                onChanged124 = true;
            }
        });

        store.dispatch(setProperty('ups', 'inputVoltage', 110));
        expect(onChanged123).to.equal(true);
        expect(onChanged124).to.equal(true);
    })

    it('calls method handlers when state changes', () => {
        let onChanged123 = false;

        clearMethodWatchers();
        const store = makeStore();
        setStore(store);

        reqisterMethodWatcher('ups', 'startPolling', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChanged123 = true;
                expect(w.id).to.equal(123);
            }
        });

        store.dispatch(callMethod('ups', 'startPolling', [{'location': '/dev/ttyS1' }]));

        expect(onChanged123).to.equal(true);

    })

    it('unregisters method watchers', () => {
        let onChanged123 = false;

        clearMethodWatchers();
        const store = makeStore();
        setStore(store);

        reqisterMethodWatcher('ups', 'startPolling', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChanged123 = true;
                expect(w.id).to.equal(123);
            }
        });

        store.dispatch(callMethod('ups', 'startPolling', [{'location': '/dev/ttyS1' }]));

        expect(onChanged123).to.equal(true);

        onChanged123 = false;

        unReqisterMethodWatcher('ups', 'startPolling', 123 );

        store.dispatch(callMethod('ups', 'startPolling', [{'location': '/dev/ttyS1' }]));

        expect(onChanged123).to.equal(false);

    })


    it('unregisters propWatchers', () => {
        let onChanged123 = false;
        let onChanged124 = false;

        clearPropWatchers();
        const store = makeStore();
        setStore(store);

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChanged123 = true;
                expect(w.id).to.equal(123);
            }
        });

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 124,
            onChange: (w, value, objectPath) => {
                onChanged124 = true;
                expect(w.id).to.equal(124);
            }
        });

        store.dispatch(setProperty('ups', 'inputVoltage', 117));

        expect(onChanged123).to.equal(true);
        expect(onChanged124).to.equal(true);

        onChanged123 = false;
        onChanged124 = false;

        unReqisterPropWatcher('ups', 'inputVoltage', 123 );

        expect(propWatchers['ups.props.inputVoltage'].length).to.equal(1);

        store.dispatch(setProperty('ups', 'inputVoltage', 0.3));

        expect(onChanged123).to.equal(false);
        expect(onChanged124).to.equal(true);
    })

    it('unregisters all propWatchers by id', () => {
        let onChangeInputVoltage = false;
        let onChangeInputVoltage_124 = false;
        let onChangedOutputVoltage = false;

        clearPropWatchers();
        const store = makeStore();
        setStore(store);

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChangeInputVoltage = true;
                expect(w.id).to.equal(123);
            }
        });

        reqisterPropWatcher('ups', 'inputVoltage', {
            id: 124,
            onChange: (w, value, objectPath) => {
                onChangeInputVoltage_124 = true;
                expect(w.id).to.equal(124);
            }
        });

        reqisterPropWatcher('ups', 'outputVoltage', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChangedOutputVoltage = true;
                expect(w.id).to.equal(123);
            }
        });

        store.dispatch(setProperty('ups', 'inputVoltage', 0.2));
        store.dispatch(setProperty('ups', 'outputVoltage', 5));

        expect(onChangeInputVoltage).to.equal(true);
        expect(onChangeInputVoltage_124).to.equal(true);
        expect(onChangedOutputVoltage).to.equal(true);

        onChangeInputVoltage = false;
        onChangeInputVoltage_124 = false;
        onChangedOutputVoltage = false;

        unReqisterAllPropWatchers(123);

        store.dispatch(setProperty('ups', 'inputVoltage', 0.3));
        store.dispatch(setProperty('ups', 'outputVoltage', 7));

        expect(onChangeInputVoltage).to.equal(false);
        expect(onChangeInputVoltage_124).to.equal(true);
        expect(onChangedOutputVoltage).to.equal(false);
    });

    it('unregisters all methodWatchers by id', () => {
        let onChanged123 = false;
        let onChanged124 = false;

        clearMethodWatchers();
        const store = makeStore();
        setStore(store);

        reqisterMethodWatcher('ups', 'startPolling', {
            id: 123,
            onChange: (w, value, objectPath) => {
                onChanged123 = true;
                expect(w.id).to.equal(123);
            }
        });

        reqisterMethodWatcher('ups', 'startPolling', {
            id: 124,
            onChange: (w, value, objectPath) => {
                onChanged124 = true;
                expect(w.id).to.equal(124);
            }
        });

        store.dispatch(callMethod('ups', 'startPolling', [{'location': '/dev/ttyS1' }]));

        expect(onChanged123).to.equal(true);
        expect(onChanged124).to.equal(true);

        store.dispatch(setMethodState('ups', 'startPolling', undefined ));

        onChanged123 = false;
        onChanged124 = false;

        unReqisterAllMethodWatchers(123);

        store.dispatch(callMethod('ups', 'startPolling', [{'location': '/dev/ttyS1' }]));

        expect(onChanged123).to.equal(false);
        expect(onChanged124).to.equal(true);
    });
});
