import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
class LoginPage extends Component{
    static propTypes = {
        onLogin : PropTypes.func.isRequired,
    };

    constructor(props){
        super(props);

        this.state={inputs:{},errorMessage:""};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post('http://localhost:3000/login',
            {
                username:this.state.inputs.username,
                password:this.state.inputs.password
            }
        ).then(res => {
            if(res.data.access_token){
                localStorage.setItem("access_token",res.data.access_token);
                this.props.onLogin();
            }else{
                this.setState({errorMessage:res.data.message});
            }
            }).catch(error => {
            this.setState({errorMessage:"usuario ou senha incorretos"});
        });
    }


    handleChange(event){
        console.log(event.target.name);
        if(event.target.name==="username"){
            this.state.inputs.username = event.target.value;
        }else if(event.target.name==="password"){
            this.state.inputs.password =  event.target.value;
        }
    }

    render(){
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" name="username" value={this.state.username} onChange={this.handleChange}/>
                    <input type="password" name="password" value={this.state.password} onChange={this.handleChange}/>
                    <label className="error-msg">{this.state.errorMessage}</label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}


export default LoginPage;