import React, { Component } from 'react'
import {Button} from '@material-ui/core'

export class SendMessage extends Component {


    render() {
        return (
            <div style = {textInputStyle} >
                <Button 
                variant= "contained" 
                onClick = {this.props.handleClick}
                >
                Send
                </Button>
            </div>
        )
    }
}

const textInputStyle={
    display: 'inline-block',
    top : "8px",
    position : 'relative'
}

export default SendMessage
