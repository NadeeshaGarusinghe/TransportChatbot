import React, { Component } from 'react'
import {TextField} from '@material-ui/core'
export class MessageTextBox extends Component {

    constructor(props){
        super(props);
        this.state={}
    }

    render() {
        return (
            <div style = {textInputStyle} >
                <TextField 
                name ="messageInput" 
                value = {this.props.message}
                onKeyPress = {this.props.handleKeyPress}
                onChange = {this.props.handleTextInput} 
                autoFocus= {true} placeholder ='Enter message...' 
                fullWidth = {true} 
                multiline ={false}
                variant = "outlined"
                size = "small"
                 />
            </div>
        )
    }
}

const textInputStyle={
    display: 'inline-block',
    width : '80%'
}

export default MessageTextBox
