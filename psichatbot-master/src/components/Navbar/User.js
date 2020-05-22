import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import Button from '@material-ui/core/Button';

export class User extends Component {

    constructor(props){
        super(props)

        this.logout = this.logout.bind(this);

    }
    
    logout(e){
        e.preventDefault();
        localStorage.removeItem('access_token');
        localStorage.setItem("logged", false);
        this.props.setAuthenticated(false)
        this.props.history.push('/')
      }
    render() {
        const loginLink = (
            <Link style={linkStyle} to="/login"><Button color="inherit">Login</Button></Link>
          );
          const userLink = (
            <div>
            <Link style={linkStyle} to="/profile"><Button color="inherit">Profile</Button></Link>
            <Button color="inherit" onClick={this.logout.bind(this)}>Logout</Button>
            </div>
          );
        
        return (
            <div>
                {localStorage.access_token ? userLink : loginLink}
            </div>
        )
    }
}

const linkStyle ={
    color : '#fff',
    textDecoration : 'none',
    // position : 'absolute',
    // right: '2%'
}

export default withRouter(User)
