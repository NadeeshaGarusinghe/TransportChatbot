import React, { Component } from 'react'
import {Avatar, ListItem, ListItemIcon, ListItemText} from '@material-ui/core'

import '../css/Message.css'

export class BotMessageBox extends Component {
    render() {
        return (
            <div className ="messageContainer justifyStart" >
                <ListItem className="messageBox backgroundLight" alignItems = 'flex-start' style={listItemStyle} >
                <ListItemIcon><Avatar>B</Avatar></ListItemIcon>
                <ListItemText className="messageText colorDark" primary = {this.props.message.message}/>
                </ListItem>
            </div>
        )
    }
}

const listItemStyle = {
    float:'right'
}

export default BotMessageBox
