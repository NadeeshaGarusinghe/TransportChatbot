import React, {useState} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { TelecomHome } from './components/Telecommunication-Chatbot/TelecomHome';
import BankingHome from './components/Banking-Chatbot/BankingHome';
import MedicalHome from './components/Medical-Chatbot/MedicalHome';
import { TransportHome } from './components/Transportation-Chatbot/TransportHome';
import Home from './components/Home';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import AuthenticatedRoute from "./utils/AuthenticatedRoute";
import UnauthenticatedRoute from "./utils/UnauthenticatedRoute";

export function App() {

  const[authed, setAuthed] = useState(false);

  return (
    <Router basename = "/psichatbot/" >
    <div className = "App">
        <Route exact path= "/" render={props => (<Landing setAuthenticated = {setAuthed} />)} />
        <Route exact path= "/home" render={props => (<Home setAuthenticated = {setAuthed} />)} />
        <AuthenticatedRoute authed={authed} exact path= "/profile" render={props => (<Profile setAuthenticated = {setAuthed}/>)} />
        <AuthenticatedRoute authed={authed} exact path = "/telecomchatbot" render ={props => (
          <TelecomHome/>
        )} />
        <AuthenticatedRoute  authed={authed} exact path = "/bankingchatbot" render ={props => (
          <BankingHome setAuthenticated = {setAuthed}/>
        )} />
        <AuthenticatedRoute authed={authed} exact path = "/medicalchatbot" render ={props => (
          <MedicalHome setAuthenticated = {setAuthed}/>
        )} />
        <AuthenticatedRoute authed={authed} exact path = "/transportchatbot" render ={props => (
          <TransportHome setAuthenticated = {setAuthed}/>
        )} />
        {/* <AuthenticatedRoute authed={authed} path='/telecomchatbot' component={TelecomHome} />
        <AuthenticatedRoute authed={authed} path='/bankingchatbot' component={BankingHome} />
        <AuthenticatedRoute authed={authed} path='/medicalchatbot' component={MedicalHome} />
        <AuthenticatedRoute authed={authed} path='/transportchatbot' component={TransportHome} />
        <AuthenticatedRoute authed={authed} path='/profile' component={Profile} setAuthenticated = {setAuthed}/> */}
        <Route exact path = "/login" render ={props => (
          <Login setAuthenticated = {setAuthed} />
        )} />
        <UnauthenticatedRoute exact path = "/register" render ={props => (
          <Register/>
        )} />
    </div>
    </Router>
    
  )

}

function checkAuthed(){
  console.log("authenticating")
  if(localStorage.getItem("access_token")){
    return true
  }
  else{
    return false
  }
}

export default App

