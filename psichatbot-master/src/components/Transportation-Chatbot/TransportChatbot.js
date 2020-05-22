import React, { Component } from 'react';
import axios from 'axios';                       //to generate requests
import jwt_decode from 'jwt-decode';

import MessageTextBox from '../Chatbox_Common/MessageTextBox';
import SendMessage from '../Chatbox_Common/SendMessage';
import Messages from '../Chatbox_Common/Messages';
import '../css/Chat.css';

const SERVER_URL = "https://arcane-springs-17786.herokuapp.com";

export class TransportChatbot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [{ id: "500", message: "Test", userId: "1", isBot: false }],
            currentMessage: "",
            userId: "",
            testMessages: [],
            context: { tag: "-1", index: 0, data: "" }
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.saveMessages = this.saveMessages.bind(this);
    }

    componentDidMount() {
        const token = localStorage.access_token;
        const decoded = jwt_decode(token);
        this.setState({
            userId: decoded.user_id
        })
    }

    handleClick(e) {
        this.addMessage()
    }

    handleKeyPress(e) {
        let enter_pressed = false;
        if (e.key === "Enter" && this.state.currentMessage) {
            enter_pressed = true;
            this.addMessage(enter_pressed);
        }
    }

    handleInputChange(e) {
        this.setState({ currentMessage: e.target.value });
    }

    addMessage(enter_pressed = true) {
        const currentMessage = this.state.currentMessage;
        if (this.state.context['tag'] != "-1") {
            this.state.context["data"] = this.state.context["data"].concat(currentMessage);
            this.state.context["data"] = this.state.context["data"].concat(",");
        }

        if (enter_pressed && currentMessage) {
            const currentDate = new Date();
            this.setState({ messages: [...this.state.messages, { id: currentDate, userId: this.state.userId, message: currentMessage, isBot: false }] });
            this.setState({ currentMessage: "" });
            console.log(this.state.messages);

            axios.post(`${SERVER_URL}/predicttag`,
                {
                    msg: currentMessage,
                    tag: this.state.context['tag'],
                    index: this.state.context['index']
                }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                }
            })
                .then(res => {
                    this.saveMessages(res.data)
                });
        }
        console.log('AddMessage');
    }

    saveMessages(data) {

        if (data.completed == 0) {
            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: data.result, isBot: true }] });

            if (data.tag == '5' || data.tag == '6' || data.tag == '7') {
                this.state.context['tag'] = "-1";
                this.state.context['index'] = 0;
                this.state.context['data'] = "";
            }
            else {
                this.state.context['tag'] = parseInt(data.tag);
                this.state.context['index'] = this.state.context['index'] + 1;
            }
        }

        else {
            const details = this.state.context["data"].split(',');
            if (data.tag == '0') {
                if (details[5] == 'y') {

                    axios.post(`${SERVER_URL}/buscomplaint`,
                        {
                            bus_number: details[0],
                            route_number: details[1],
                            date: details[2],
                            time: details[3],
                            description: details[4]

                        }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                        .then(res => {
                            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                        });
                }
                else {
                    this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "cancelled the complaint!", isBot: true }] })
                }
            }
            if (data.tag == '1') {
                axios.get(`${SERVER_URL}/busfee`,
                    {
                        params: {
                            origin: details[0],
                            destination: details[1]
                        }
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                })
                    .then(res => {
                        this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                    });
            }

            if (data.tag == '2') {
                if (details[5] == 'y') {
                    axios.post(`${SERVER_URL}/busbooking`,
                        {
                            origin: details[0],
                            destination: details[1],
                            date: details[2],
                            time: details[3],
                            bus_type: details[4]
                        }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }

                    })
                        .then(res => {
                            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                        });
                }
                else {
                    this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "cancelled the booking", isBot: true }] })
                }
            }

            if (data.tag == '3') {
                axios.get(`${SERVER_URL}/bustimes`,
                    {
                        params: {
                            origin: details[0],
                            destination: details[1]
                        }
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                })
                    .then(res => {
                        this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                    });
            }

            if (data.tag == '4') {
                axios.get(`${SERVER_URL}/distance`,
                    {
                        params: {
                            media: details[0],
                            origin: details[1],
                            destination: details[2],
                        }
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }
                })
                    .then(res => {
                        this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                    });
            }

            if (data.tag == '5') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "Hello, how can I help you", isBot: true }] })
            }


            if (data.tag == '6') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "Bye. See you again!", isBot: true }] })
            }

            if (data.tag == '8') {
                if (details[5] == 'y') {

                    axios.post(`${SERVER_URL}/traincomplaint`,
                        {
                            complaint_number: details[0],
                            railway_station: details[1],
                            date: details[2],
                            time: details[3],
                            description: details[4]
                        }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                        .then(res => {
                            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                        });
                }
                else {
                    this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "cancelled the complaint!", isBot: true }] })
                }
            }

            if (data.tag == '9') {
                console.log(details)
                axios.get(`${SERVER_URL}/trainfee`,
                    {
                        params: {
                            origin_station: details[0],
                            destination_station: details[1]
                        }
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }

                })
                    .then(res => {
                        console.log(res)
                        this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                    });
            }

            if (data.tag == '10') {
                if (details[5] == 'y') {
                    axios.post(`${SERVER_URL}/trainbooking`,
                        {
                            origin: details[0],
                            destination: details[1],
                            date: details[2],
                            time: details[3],
                            seat_type: details[4]
                        }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                        .then(res => {
                            console.log(res)
                            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                        });
                }
                else {
                    this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: data.result, isBot: true }] })
                }
            }

            if (data.tag == '11') {
                axios.get(`${SERVER_URL}/traintimes`,
                    {
                        params: {
                            origin: details[0],
                            destination: details[1]
                        }
                    }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    }

                })
                    .then(res => {
                        this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: res.data.result, isBot: true }] })
                    });
            }

            if (data.tag == '-1') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: data.result, isBot: true }] })
            }

            this.state.context['tag'] = "-1";
            this.state.context['index'] = 0;
            this.state.context['data'] = "";
        }
    }

    render() {
        return (
            <div>
                <div className="containerNew" >
                    <Messages className="messagesBox" messages={this.state.messages} />
                    <div>
                        <MessageTextBox message={this.state.currentMessage} handleTextInput={this.handleInputChange} handleKeyPress={this.handleKeyPress} /> {' '}
                        <SendMessage handleClick={this.handleClick} />
                    </div>
                </div>
            </div>
        )
    }


}

export default TransportChatbot
