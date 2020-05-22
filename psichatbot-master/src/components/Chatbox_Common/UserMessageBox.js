import React, { Component } from 'react'
import {ListItem, ListItemText} from '@material-ui/core'

import '../css/Message.css'

export class UserMessageBox extends Component {

    render() {
        return (
            <div className = "messageContainer justifyEnd" >
                <ListItem className ="messageBox backgroundBlue" alignItems = 'flex-start' >
                <ListItemText className ="messageText colourWhite" primary = {this.props.message.message} />
                </ListItem>

            </div>
        )
    }
}


export default UserMessageBox
