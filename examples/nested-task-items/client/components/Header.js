import React, { Component } from 'react';
import {connect} from 'react-redux';
import {Button, FormGroup, FormControl} from 'react-bootstrap'
import { select } from '../modules/tasktree';


import Logo from '../images/powervar-logo4.png'

class Header extends Component {

    constructor(props) {
        super(props);
        this.login = this._login.bind(this);
    }

    _login() {
        //this.props.dispatch(call(this.props.id));
    }

    render() {
        return (
            <div className='header' >
                <div className='nav' >

                    <h1> Production Passport </h1>

                    <img style={{width: 455, height: 51}} src={Logo} />
                </div>
            </div>
        );
    }
}

const headerContainer = connect()(Header);

export default headerContainer;
