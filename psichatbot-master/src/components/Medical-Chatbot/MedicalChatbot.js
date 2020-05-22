import React, { Component } from 'react'
// import axios from 'axios';
// import {Link} from 'react-router-dom'
// import { makeStyles } from '@material-ui/core/styles';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

import MessageTextBox from '../Chatbox_Common/MessageTextBox';
import SendMessage from '../Chatbox_Common/SendMessage';
import Messages from '../Chatbox_Common/Messages';
import '../css/Chat.css'

export class MedicalChatbot extends Component {
    constructor(props){
        super(props);
        this.state ={
          messages : [{id: "500", message:"Test" ,userId: "1", isBot: false}],
          currentMessage : "",
          userId : "1",
          testMessages: []
        };
        // this.handleClick = this.handleClick.bind(this);
        // this.handleKeyPress = this.handleKeyPress.bind(this);
        // this.handleInputChange = this.handleInputChange.bind(this);
        // this.addMessage = this.addMessage.bind(this);
        // this.saveMessages = this.saveMessages.bind(this);
    }
    

    // componentDidMount(){
    //     axios.get('http://localhost:3000/messages')
    //       .then(res => this.setState({messages: res.data}))
        
    // }

    
    handleClick(e){
        this.addMessage()
    }

    handleKeyPress(e){
        let enter_pressed = false;
        if(e.key ==="Enter" && this.state.currentMessage){
            enter_pressed = true;
            this.addMessage(enter_pressed);
        }

        
    }

    handleInputChange(e){
        this.setState({currentMessage : e.target.value})
    }

    // addMessage(enter_pressed = true){
    //     const currentMessage = this.state.currentMessage
    //     if(enter_pressed && currentMessage){
    //         const currentDate = new Date();
    //         this.setState({messages: [...this.state.messages, {id : currentDate, userId: this.state.userId, message :currentMessage, isBot: false}]})
    //         this.setState({currentMessage : ""})
    //         console.log(this.state.messages)
    //         axios.post('http://localhost:3000/messages', {
    //             id : currentDate, userId: this.state.userId, message :currentMessage, isBot: false
    //             })
    //             .then(res=>console.log("Done"));

    //         axios.post('http://localhost:5000/telecomchatbot', 
    //             {
    //             id : currentDate, userId: this.state.userId, message :currentMessage, isBot: false
    //             }, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             })
    //             .then(res=>this.saveMessages(res.data));
    //     }
    //     console.log('AddMessage')
    // }

    saveMessages(data){
        console.log(data)
        this.setState({messages: [...this.state.messages, data ]})

    }
    
    render() {
        return (
            <div className = "containerNew" >
                <Messages className="messagesBox" messages = {this.state.messages}/>
                <div>
                <MessageTextBox message={this.state.currentMessage} handleTextInput = {this.handleInputChange} handleKeyPress = {this.handleKeyPress}/> {' '}
                <SendMessage handleClick = {this.handleClick} />
                </div>
            </div>

        )
    }

    
}

// const linkStyle ={
//     color : '#fff',
//     textDecoration : 'none',
//     position : 'absolute',
//     right: '2%'
// }



export default MedicalChatbot
