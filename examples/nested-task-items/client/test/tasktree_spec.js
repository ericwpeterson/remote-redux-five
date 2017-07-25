import {expect} from 'chai';
import makeStore from '../src/store';
import { select, init, next, back, setChecked } from '../modules/tasktree';
import {testTree} from '../testdata'

import {checkTestTree} from './checked-test-data'

describe('testTree reducer', () => {

    it('initializes from a JS object and is converted to an Immutable with the first item selected', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });

    it('deselects last item when selecting an item', () => {
        let store = makeStore();

        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0'));
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(true);
        store.dispatch(select('0/1'));
        s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[1].selected).to.equal(true);
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(false);
    });

    it('select sets the next item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        let s = store.getState().taskTree.toJS();
        //console.log(s)
        expect(s.nextItem).to.equal('0/0/0');
    });

    it('select sets the previous item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        let s = store.getState().taskTree.toJS();
        expect(s.lastItem).to.equal('0');
        //expect(s.selectedItem).to.equal('0/0');
    });

    it('next moves to the next child item', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[0].selected).to.equal(true);
    });

    it('next moves to the parents next sibling when current item has no children', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[1].selected).to.equal(true);
    });

    it('next moves to the roots next sibling when current item has no children', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/1/0/0'));
        store.dispatch(next());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[1].selected).to.equal(true);
    });

    it('next iterates the tree and when it gets to the end starts all over again from beginning', () => {
        let store = makeStore();
        store.dispatch(init(testTree));

        for ( let i = 0; i < 100; i++ ) {
            store.dispatch(next());
        }

        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].children[0].children[1].selected).to.equal(true);
    });

    it('back moves backwards up the tree', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0'));
        store.dispatch(back());
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });

    it('back moves backwards up the tree and dead ends at 0', () => {
        let store = makeStore();
        store.dispatch(init(testTree));
        store.dispatch(select('0/0/0/0'));

        for ( let i = 0; i < 100; i++ ) {
            store.dispatch(back());
        }
        let s = store.getState().taskTree.toJS();
        expect(s.tree.children[0].selected).to.equal(true);
    });


    it('handles SET_CHECK actions ', () => {
        const store = makeStore();
        store.dispatch(init(checkTestTree));
        store.dispatch(setChecked("0/0", 0, true, "eric"));
        let nextState = store.getState().taskTree.toJS();

        expect(nextState.tree.children[0].children[0].taskForm.formTasks[0].checked).to.equal(true);

    });

    it('rolls up check state to parents', () => {
        const store = makeStore();
        store.dispatch(init(checkTestTree));
        store.dispatch(setChecked("0/0",     0, true, "eric"));
        store.dispatch(setChecked("0/0/0",   0, true, "eric"));
        store.dispatch(setChecked("0/0/0",   1, true, "eric"));
        store.dispatch(setChecked("0/0/0/0", 0, true, "eric"));
        let nextState = store.getState().taskTree.toJS();

        expect(nextState.tree.children[0].children[0].taskForm.formTasks[0].checked).to.equal(true);
        expect(nextState.tree.children[0].children[0].checked).to.equal(true);
    });

    it('rolls up check state to parents multi', () => {
        const store = makeStore();

        store.dispatch(init(checkTestTree));
        store.dispatch(setChecked("0/0/0", 0, true,  "eric"));
        store.dispatch(setChecked("0/0/0", 1, false, "eric"));
        let nextState = store.getState().taskTree.toJS();

        expect(nextState.tree.children[0].children[0].children[0].taskForm.formTasks[0].checked).to.equal(true);
        expect(nextState.tree.children[0].children[0].children[0].taskForm.formTasks[1].checked).to.equal(false);
        expect(nextState.tree.children[0].children[0].children[0].checked).to.equal(false);

    });
});
