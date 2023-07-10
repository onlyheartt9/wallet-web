import React from 'react';
import './LoginPage.css';
import HeaderBar from '../elements/HeaderBar';
import {Navigate} from 'react-router-dom';
import {Server} from '../../server/server';
import AlertModal from '../modals/AlertModal';
import {Config} from "../../server/config";
const polygonConfig = require('../config/polygon.json');

interface LoginPageState {
  username: string;
  password: string;
  navigate: string;
  alert: string;
}

class LoginPage extends React.Component<{}, LoginPageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
      navigate: '',
      alert: '',
    }

    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  onUsernameChange(e: any) {
    this.setState({username: e.currentTarget.value});
  };

  onPasswordChange(e: any) {
    this.setState({password: e.currentTarget.value});
  };

  componentDidMount(): void {
  }

  async onLogin() {
    let aakey    = localStorage.getItem('aakey');
    let loginkey = localStorage.getItem('loginkey');

    let str = this.state.username + this.state.password + aakey;
    // console.log(window.atob(str))
    let tryLogin = window.btoa(str); // encrypt

    if (tryLogin === loginkey) {
      Server.account.loggedIn();
      let key = window.atob(aakey);
      key = key.substring(this.state.username.length + this.state.password.length,key.length);
      await Server.account.initWalletAndContractAddress(key);

      this.setState({navigate: '/home'});
    }
    else
      this.setState({alert: 'Username or Password incorrect.'});
  }

  render() {
    if (this.state.navigate != '') 
      return <Navigate to={this.state.navigate} />;

    return (
      <div className="login-page">
        <HeaderBar text='Login' />

        <br/>
        <div>Username</div>
        <input value={this.state.username} onChange={this.onUsernameChange}/>
        <br/>
        <div>Password</div>
        <input type="password" value={this.state.password} onChange={this.onPasswordChange}/>
        <br/><br/>
        <button className='login-page-button' onClick={async () => await this.onLogin()}>Login</button>

        <AlertModal message={this.state.alert} button="OK" onClose={()=>this.setState({alert: ''})}/>
      </div>
    );
  }
}

export default LoginPage;