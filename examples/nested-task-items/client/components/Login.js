import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, FormGroup, FormControl} from 'react-bootstrap'

import { select } from '../modules/tasktree';


import {
  REQUEST,
  connectMonux,
  get,
  set,
  call,
  watch,
  unwatch }
from '../modules/monobject';


class Login extends Component {

    constructor(props) {
        super(props);
        this.login = this._login.bind(this);
    }

    _login() {
        this.props.dispatch(call('mongo', 'login', [{user: this.username.value, password: this.password.value }] ));
    }

    render() {

        let label;

        if ( this.props.error === true) {
            label =
            <div className='loginLabelFailed'>
                Login failed... Try again.
            </div>
        } else {
            label =
            <div className='loginLabel'>
                Enter your credentials.
            </div>
        }

        return (
            <div className='loginFormContainer' >
                <div className='loginForm' >
                    {label}
                    <div className='loginFormUser' >
                        <FormGroup>
                            <FormControl
                                inputRef={ref => { this.username = ref; }}
                                type="text"
                                value = 'eric'
                                placeholder="username"
                            />
                        </FormGroup>
                    </div>

                    <div className='loginFormPassword' >
                        <FormControl
                            inputRef={ref => { this.password = ref; }}
                            type="text"
                            placeholder="password"
                            value = "Eric123"
                        />
                    </div>
                    <div className='loginFormSubmit' >
                        <Button onClick={this.login}> Login </Button>
                    </div>
                </div>
            </div>
        );
    }
}

const loginContainer = connect()(Login);

export default loginContainer;
