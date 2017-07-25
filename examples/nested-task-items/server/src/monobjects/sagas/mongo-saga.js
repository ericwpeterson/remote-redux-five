import { delay } from 'redux-saga';
import { takeEvery, call, put } from 'redux-saga/effects';
import { CALL_METHOD, setProperty, setMethodState, REQUEST } from '../reducers/monobject.js'
import bcrypt from 'bcrypt-nodejs'
import  jwt from 'jwt-simple';
import Immutable from 'immutable';
import CommandSequencer from '../../commandseq'

 var commandSequencer = new CommandSequencer();

let mongo = require('mongodb').MongoClient;
let objectId = require('mongodb').ObjectID;

let db;
let classesCollection;
let usersCollection;
let instancesCollection;

export const mongoSagas = [
    takeEvery('mongo/init', init),
    takeEvery('mongo/login', login),
    takeEvery('mongo/createInstance', createInstance),
    takeEvery('mongo/loadInstance', loadInstance),
    takeEvery('mongo/getInstanceInfo', getInstanceInfo),
    takeEvery('mongo/setChecked', setChecked),
]

export function filterRecords( records ) {
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// init -- open the database handles

let mongoConnect = (args) => {
    return new Promise((resolve, reject) => {
      mongo.connect('mongodb://' + args.location + ':' + args.port + '/' + args.database, function(err, db) {
          // Some docs for insertion
          if (err) {
            reject(err);
          } else {
            resolve(db);
          }
        });
    });
}

function* init(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));

        yield put(setProperty(action.monObject, 'connectionState', REQUEST.IN_PROGRESS));
        db = yield call(mongoConnect, action.args[0] );

        classesCollection =  db.collection('classes');
        usersCollection =  db.collection('users');
        instancesCollection =  db.collection('instances');

        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, false));
        yield put(setProperty(action.monObject, 'connectionState', REQUEST.COMPLETED));
        yield put(setProperty(action.monObject, 'database', action.args[0].database));
        yield put(setProperty(action.monObject, 'location', action.args[0].location));
        yield put(setProperty(action.monObject, 'port',     action.args[0].port));
    } catch(e) {

        console.log( 'err = ', e)

        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR));
        yield put(setProperty(action.monObject, 'connectionState', REQUEST.ERROR));
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// login -- find the user in the users collection, it it exist return a JWT
// that the client can use for future API calls

let mongoLogin = (user, password) => {
    return new Promise((resolve, reject) => {
          usersCollection.findOne({'user': user}, function(err, doc) {
              if ( !err && doc) {
                  if ( bcrypt.compareSync(password, doc.password) ) {
                      let payload = {
                          user: user
                      }
                      var token = jwt.encode(payload, "SECRET");
                      resolve(token);
                  } else {
                      reject( 'password does not match')
                  }
              } else {
                  reject('user does not exist');
              }
          });
    });
}

function* login(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));
        let jwt = yield call(mongoLogin, action.args[0].user, action.args[0].password );
        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, jwt));
    } catch(e) {
        console.log( 'err = ', e)
        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR, e));
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// createInstance

let mongoCreateInstance = (className, serialno, user) => {
    return new Promise((resolve, reject) => {
        //first find this class in the classes collection
        classesCollection.findOne({'className': className}, function(err, doc) {
            if ( !err && doc) {
                //now create an instance of this class
                delete doc._id; //remove _id, a new will be created for the instance
                doc.serialno = serialno;
                doc.users = [user];
                doc.dateCreated = new Date();
                instancesCollection.insertOne(doc, function(err, result) {
                    if ( !err && result) {
                        resolve(result.insertedId);
                    } else {
                        reject('unable to create instance');
                    }
                });
            } else {
                reject('unable to find class');
            }
        });
    });
}

function* createInstance(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));
        let ret = yield call(mongoCreateInstance, action.args[0].className, action.args[0].serialno, action.args[0].user);
        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, ret));
    } catch(e) {
        console.log( 'err = ', e)
        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR));
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// loadInstance

let mongoLoadInstance = (uuid) => {
    return new Promise((resolve, reject) => {
        //find this instance in the instances collection
        instancesCollection.findOne({'_id': new objectId(uuid)}, function(err, doc) {
            if ( !err && doc) {
                resolve(doc);
            } else {
                reject('unable to find instance');
            }
        });
    });
}

function* loadInstance(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));
        let ret = yield call(mongoLoadInstance, action.args[0].uuid);
        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, ret));
    } catch(e) {
        console.log( 'err = ', e)
        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR));
    }
}


///////////////////////////////////////////////////////////////////////////////////////////////////
// getInstanceInfo -- returns all uuids and there status ( complete or inprogress ), and the date they were created
let mongoGetInstanceInfo = (query, projection) => {
    return new Promise((resolve, reject) => {
        //get all instances from collection
        instancesCollection.find(query, projection).toArray(function(err, docs) {
            if ( !err && docs) {
                resolve(docs);
            } else {
                reject('unable to find instance');
            }
        });
    });
}

function* getInstanceInfo(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));
        let ret = yield call(mongoGetInstanceInfo, action.args[0].query,  action.args[0].projection);
        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, ret));
        yield put(setProperty(action.monObject,'instanceInfo', ret ));
    } catch(e) {
        console.log( 'err = ', e)
        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR));
    }
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//setChecked
//expects a path ending with a number
let _getIndexFromPath = (path) => {
    let pathArray = Immutable.fromJS(path).toJS();
    let index = pathArray.pop();
    return +index;
}

//expects a path ending with a number
let _getParentPath = (path) => {
    let pathArray = Immutable.fromJS(path).toJS();

    if ( pathArray.length === 1 ) {
        pathArray.pop();
    } else {
        pathArray.pop();
        pathArray.pop();
    }
    return pathArray;
}

//pure function setChecked takes an instance of a tree and sets the item checked
//and recursively sets parents to be checked if all tasks below it are checked
let setCheckedPure = (state, path, taskFormIndex, checked, user ) => {
    let tokens = path.split('/');
    let pathArray =  ['children'];
    let ret = state;

    for ( let i=0; i< tokens.length; i++ ) {
        pathArray.push(tokens[i]);
        pathArray.push('children');
    }

    pathArray.pop();

    //set the checked state for this item
    //state.setIn(['tree', 'children', '0', 'children', '4', 'children', '8', 'formIndex', '0', 'checked'], true )
    ret = ret.setIn([...pathArray, ...['taskForm', 'formTasks', taskFormIndex, 'checked']], checked);
    ret = ret.setIn([...pathArray, ...['taskForm', 'formTasks', taskFormIndex, 'user']], user);
    ret = ret.setIn([...pathArray, ...['taskForm', 'formTasks', taskFormIndex, 'dateModified']], new Date());

    while (pathArray.length > 1)  {
        let allChecked = true;

        //are all this task's children checked
        let children = ret.getIn([...pathArray, ...['children']]);
        if (children) {
            for ( let i=0; i<children.size; i++) {
                let map = children.get(i);
                if (map && map.get("checked") !== true) {
                    allChecked = false;
                    break;
                }
            }
        }

        //now check all of the form tasks,
        let v = ret.getIn([...pathArray, ...['taskForm', 'formTasks']]); //this a list of maps
        if (v) {
            for ( let i=0; i<v.size; i++) {
                let map = v.get(i);
                if (map && map.get("type") === 'checkbox' && map.get("checked") !== true) {
                    allChecked = false;
                    break;
                }
            }
        }

        v = ret.getIn([...pathArray, ...['checked']]);

        if (v !== allChecked) {
            ret = ret.setIn([...pathArray, ...['checked']], allChecked);
            ret = ret.setIn([...pathArray, ...['user']], user);
            ret = ret.setIn([...pathArray, ...['dateModified']], new Date());
        }
        pathArray = _getParentPath(pathArray);
    };

    return ret;
}

let mongoSetChecked = (uuid, doc) => {
    return new Promise((resolve, reject) => {
        instancesCollection.replaceOne({'_id': new objectId(uuid)}, doc, function(err) {
            if ( !err ) {
                console.log("successfully updated instance");
                resolve(true);
            } else {
                console.log("unable to set instance");
                reject('unable to set instance');
            }
        });
    });
}

function* setChecked(action) {
    try {
        yield put(setMethodState(action.monObject, action.method, REQUEST.IN_PROGRESS));

        let tree = yield call(mongoLoadInstance, action.args[0].uuid);
        let immmutableTree = Immutable.fromJS(tree);

        immmutableTree = setCheckedPure(immmutableTree, action.args[0].path, action.args[0].taskFormIndex, action.args[0].taskChecked, action.args[0].user);

        let ret = yield call(mongoSetChecked, action.args[0].uuid, immmutableTree.toJS());
        yield put(setMethodState(action.monObject, action.method, REQUEST.COMPLETED, ret));

        //finally lets set a propety to inform any watchers of the check that just happened
        //store.dispatch(setProperty(request.monObject,request.property,request.value));
        yield put(setProperty(action.monObject,'checkState', { uuid: action.args[0].uuid, path: action.args[0].path, taskFormIndex: action.args[0].taskFormIndex, taskChecked: action.args[0].taskChecked} ));

    } catch(e) {
        console.log( 'err = ', e)
        yield put(setMethodState(action.monObject, action.method, REQUEST.ERROR));
    }
}
