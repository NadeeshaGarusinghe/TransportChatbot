import React, { Component } from 'react'
import {List} from '@material-ui/core'

import UserMessageBox from './UserMessageBox';
import BotMessageBox from './BotMessageBox';

export class Messages extends Component {
    

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }
      
      componentDidMount() {
        this.scrollToBottom();
      }
      
      componentDidUpdate() {
        this.scrollToBottom();
      }
    
    render() {
        const messagesList = this.props.messages.map((message, index)=>{
            return (message.isBot) ? <BotMessageBox key ={index} message = {message} /> : <UserMessageBox key ={index} message = {message} />
        }
        );
        return (
            <div style ={messagesStyle}>
                <List>
                    {messagesList}
                </List>
                <div style={{ float:"left", clear: "both" }}
                    ref={(el) => { this.messagesEnd = el; }}>
                </div>
            </div>
        )
    }
}

const messagesStyle ={
    padding: '5% 0',
    overflow: 'auto',
    flex: 'auto',
    width: '94%',
    maxHeight: "700px", 
    minHeight: "700px",
}

export default Messages
