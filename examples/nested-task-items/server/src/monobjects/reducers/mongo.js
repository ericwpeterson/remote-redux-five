import {Map, List } from 'immutable';

//add your props and methods here
const DEFAULT_STATE = Map({
    name: 'mongo',
    props: Map({
        connectionState: '',
        instanceInfo: '',
        location: '',
        port: 0,
        database: '',
        classCollection: 'classes',
        instanceCollection: 'instances',
        checkState: ''  //this is property the client will watch and use to updated the client side tree instance
    }),
    methods: Map({
        init: Map({}),
        setChecked: Map({}),
        loadInstance: Map({}),
        createInstance: Map({}),
        login: Map({}),
        getInstanceInfo: Map({}),
    })
});

export default function (state = DEFAULT_STATE, action) {
    switch (action.type) {
        default:
            return state;
    }
}
