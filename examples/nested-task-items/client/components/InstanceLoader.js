import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import PropTypes from 'prop-types';
import {Button} from 'react-bootstrap'
import {Glyphicon} from 'react-bootstrap'
import {connect} from 'react-redux';
import { showSerialModal, showInstanceModal, setInstanceId } from '../modules/app';
import {Modal, FormControl, FormGroup, FieldGroup, ControlLabel} from 'react-bootstrap'

import { call } from '../modules/monobject';


class InstanceLoader extends Component {

    constructor(props) {
        super(props);
        this.createInstance = this._createInstance.bind(this);
        this.loadInstance = this._loadInstance.bind(this);
        this.applyCreate = this._applyCreate.bind(this);
        this.applyLoad = this._applyLoad.bind(this);
        this.cancelCreate = this._cancelCreate.bind(this);
        this.cancelLoad = this._cancelLoad.bind(this);
    }

    _createInstance() {
        this.props.dispatch(showSerialModal(true));
    }

    _loadInstance() {
        this.props.dispatch(call('mongo', 'getInstanceInfo', [{query: { className: 'test-rev1' }, projection: {serialno: 1, className: 1, title: 1}}]));
    }

    _applyCreate() {
        this.props.dispatch(call('mongo', 'createInstance', [{className: ReactDOM.findDOMNode(this.productClass).value, serialno: this.serialNo.value, user: this.props.jwt }] ))
    }

    _applyLoad() {
        this.props.dispatch(call('mongo', 'loadInstance', [{uuid: ReactDOM.findDOMNode(this.instances).value}]))
    }

    _cancelCreate() {
        this.props.dispatch(showSerialModal(false));
    }

    _cancelLoad() {
        this.props.dispatch(showInstanceModal(false));
    }

    render() {
        let modal;

        if (this.props.showGetSerialNumberModal) {
            modal =
            <div className="serialNoModal">
                <Modal.Dialog>
                      <Modal.Header>
                        <Modal.Title>Enter the Product Class and Serial Number</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                          <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Product Class</ControlLabel>
                            <FormControl
                                ref={ref => { this.productClass = ref }}
                                componentClass="select" placeholder="select">
                                <option value="test-rev1">test-rev1</option>
                            </FormControl>
                            <ControlLabel>Serial Number</ControlLabel>
                            <FormControl
                                inputRef={ref => { this.serialNo = ref }}
                                type="text"
                                placeholder="serial number"
                            />
                          </FormGroup>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button onClick={this.cancelCreate}>Cancel</Button>
                        <Button onClick={this.applyCreate} bsStyle="primary">Create</Button>
                      </Modal.Footer>
                </Modal.Dialog>
            </div>
        } else if (this.props.showGetInstanceModal) {

            let instances = this.props.instanceInfo.map((instance, index) => {
                let jsx = <option value={instance._id}> {instance.serialno} </option>
                return jsx;
            });

            modal =
            <div className="serialNoModal">
                <Modal.Dialog>
                      <Modal.Header>
                        <Modal.Title>Choose An Already Created Instance</Modal.Title>
                      </Modal.Header>

                      <Modal.Body>
                          <FormGroup controlId="formControlsSelect">
                            <ControlLabel>Instance</ControlLabel>
                            <FormControl
                                ref={ref => { this.instances = ref }}
                                componentClass="select" placeholder="select">
                                {instances}
                            </FormControl>

                          </FormGroup>
                      </Modal.Body>

                      <Modal.Footer>
                        <Button onClick={this.cancelLoad}>Cancel</Button>
                        <Button onClick={this.applyLoad} bsStyle="primary">Load</Button>
                      </Modal.Footer>
                </Modal.Dialog>
            </div>
        }

        return (
            <div>
                {modal}
                <div className='loginFormContainer' >
                    <div className='instanceLoaderContainer'>
                        <div className='instanceLoaderButtonContainer'>
                            <div>
                                <Button bsSize="lg" onClick={this.createInstance}> <Glyphicon glyph="plus" />  </Button>
                            </div>
                            <div>
                                <Button bsSize="lg" onClick={this.loadInstance}> <Glyphicon glyph="cloud" /></Button>
                            </div>
                        </div>
                        <div className='instanceLoaderFooter'>
                            Press plus to create a new instance or the cloud to load an already created instance.
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

InstanceLoader.propTypes = {
    monux: PropTypes.object.isRequired,
    jwt: PropTypes.string.isRequired,
};

const InstanceLoaderContainer = connect()(InstanceLoader);


export default InstanceLoaderContainer;
