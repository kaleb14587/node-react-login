import React, { Component } from 'react';
import ContainerTabs from './components/ContainerTabs';
import './App.css';
import LoginPage from './components/login/LoginPage';
import axios from 'axios';

class App extends Component {
    constructor(props){
        super(props);
        var token  = this.getTokenAuthentication();
        if(!token){
            this.state ={login:false};
        }else{
            this.state = {header:[]};
        }

        this.LoggerIn = this.LoggerIn.bind(this);

    }

    getTokenAuthentication = () => {

        if(typeof(Storage)!=="undefined")
        {
            return (localStorage.getItem("authentication"));

        }else{
            var name = "authentication=",
                ca = document.cookie.split(';'),
                i,
                c,
                ca_length = ca.length;
            for (i = 0; i < ca_length; i += 1) {
                c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) !== -1) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }
    };

    LoggerIn = ()=>{
        this.setState({login:true});
    };

  render() {
      var isLogin = this.state.login;
      if(isLogin){
          return (<div> usuario esta logado!</div>);
      }else return (
            <div className="App">
                <LoginPage  onLogin={this.LoggerIn}/>
            </div>
      );
  }
}

export default App;
