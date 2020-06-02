import React, { Component } from 'react'
import axios from 'axios';
import jwt_decode from 'jwt-decode';

import MessageTextBox from '../Chatbox_Common/MessageTextBox';
import SendMessage from '../Chatbox_Common/SendMessage';
import Messages from '../Chatbox_Common/Messages';
import '../css/Chat.css';
import Speech from '../Speech';

const SERVER_URL = "https://transportchatbot.herokuapp.com";

export class TransportationChat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            currentMessage: "",
            userId: "1",
            testMessages: [],
            context: { tag: "-1", index: 0, data: "" }

        };
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.addMessage = this.addMessage.bind(this);
        this.saveMessages = this.saveMessages.bind(this);
        this.handleInterim = this.handleInterim.bind(this);
        this.handleFinal = this.handleFinal.bind(this);
    }


    componentDidMount() {
        const token = localStorage.access_token;
        const decoded = jwt_decode(token);
        // axios.get(`${SERVER_URL}/transportation/messages/${decoded.user_id}`)
        // .then(res=> this.setState(
        //     { messages : res.data.messages}
        // ))
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
        this.setState({ currentMessage: e.target.value })
    }

    addMessage(enter_pressed = true) {
        console.log("ssssssssssssssssss");
        const currentMessage = this.state.currentMessage;
        if (this.state.context['tag'] !== "-1") {

            //this.state.context["data"] = this.state.context["data"].concat(currentMessage);
            //this.state.context["data"] = this.state.context["data"].concat(",");
            var data1 = this.state.context["data"].concat(currentMessage);
            data1 = data1.concat(",");
            this.setState({ context: { tag: this.state.context["tag"], index: this.state.context["index"], data: data1 } })
        }

        if (enter_pressed && currentMessage) {
            const currentDate = new Date();
            this.setState({ messages: [...this.state.messages, { id: currentDate, userId: this.state.userId, message: currentMessage, isBot: false }] })
            this.setState({ currentMessage: "" })
            console.log(this.state.messages)

            axios.post(`${SERVER_URL}/transportation`,
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
        console.log("aaaaaaaaaaaaaaaaaaaaaaaa");
        if (data.completed === 0) {
            this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: data.result, isBot: true }] });

            if (data.tag === '5' || data.tag === '6' || data.tag === '7') {
                //this.state.context['tag'] = "-1";
                //this.state.context['index'] = 0;
                //this.state.context['data'] = "";
                var tag1 = "-1";
                var index1 = 0;
                var data1 = "";
                this.setState({ context: { tag: tag1, index: index1, data: data1 } })

            }
            else {
                //this.state.context['tag'] = parseInt(data.tag);
                //this.state.context['index'] = this.state.context['index'] + 1;
                tag1 = parseInt(data.tag);
                index1 = this.state.context['index'] + 1;
                this.setState({ context: { tag: tag1, index: index1, data: this.state.context['data'] } })

            }
        }
        else {
            console.log("&&&&&&&&&&&&&&&");
            var details = this.state.context["data"].split(',');
            console.log(details);
            console.log(data.tag);
            if (details === "") {
                if (data.tag === '1' || data.tag === '3' || data.tag === '9' || data.tag === '11') {
                    //this.state.context['data'] = data.result;
                    data1 = data.result;
                    this.setState({ context: { tag: this.state.context['tag'], index: this.state.context['index'], data: data1 } })

                    // details = this.state.context['data'].split(',');
                    details = data1.split(',');
                }

            }

            if (data.tag === '0') {
                if (details[5] === 'y') {

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
            if (data.tag === '1') {
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

            if (data.tag === '2') {
                if (details[5] === 'y') {
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

            if (data.tag === '3') {
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

            if (data.tag === '4') {
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

            if (data.tag === '5') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "Hello, how can I help you", isBot: true }] })
            }


            if (data.tag === '6') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: "Bye. See you again!", isBot: true }] })
            }

            if (data.tag === '8') {
                if (details[5] === 'y') {

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

            if (data.tag === '9') {
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

            if (data.tag === '10') {
                if (details[5] === 'y') {
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

            if (data.tag === '11') {
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

            if (data.tag === '-1') {
                this.setState({ messages: [...this.state.messages, { id: new Date(), userId: this.state.userId, message: data.result, isBot: true }] })
            }

            //this.state.context['tag'] = "-1";
            //this.state.context['index'] = 0;
            //this.state.context['data'] = "";
            tag1 = "-1";
            index1 = 0;
            data1 = "";
            this.setState({ context: { tag: tag1, index: index1, data: data1 } })
        }

    }

    handleInterim(e) {
        console.log(e)
        this.setState(
            { currentMessage: e }
        )
    }

    handleFinal(e) {
        console.log(e)
        this.setState(
            { currentMessage: e }
        )
    }


    render() {
        return (
            <div>
                <div className="containerNew" >
                    <Messages className="messagesBox" messages={this.state.messages} />
                    <div className="messageInput">
                        <MessageTextBox message={this.state.currentMessage} handleTextInput={this.handleInputChange} handleKeyPress={this.handleKeyPress} /> {' '}
                        <SendMessage handleClick={this.handleClick} />
                        <Speech interim={this.handleInterim} final={this.handleFinal} />
                    </div>
                </div>
            </div>
        )
    }


}




export default TransportationChat
