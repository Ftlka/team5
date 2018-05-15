import React, { Component } from 'react';
import './styles.css';
import LoadingSpinner from '../../components/LoadingSpinner';
const signInString = 'Войти через Github';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.displaySpinner = this.displaySpinner.bind(this);
    }

    displaySpinner() {
        this.setState({ loading: true });
    }

    render() {
        return (<div className='signin__container'>
            {this.state.loading ? <LoadingSpinner /> : null}
            <img className="pony" src={'/static/images/rainbow.png'} alt="rainbowdash"/>
            <div className='sign-in'>
                <h1>The Best Messenger</h1>
                <a className='sign-in__a' href='/auth'
                    onClick={this.displaySpinner}>{signInString}</a>
            </div>
        </div>);
    }
}
