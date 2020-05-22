import React, { Component } from 'react'
import Navbar from './Navbar/Navbar'

export class Landing extends Component {
    
    render() {
        return (
            <div>
                <Navbar title="Landing" setAuthenticated = {this.props.setAuthenticated}/>
            </div>
        )
    }
}

export default Landing
