import logo from './logo.svg';
import React from 'react';
import './App.css';
import logCSS from './Login.css';
import refresh from './index';
import { useState } from 'react';

var chatLog = [{date: "7/8/23", name: "BigBungus", chat:"Hey Guys"}, {date: "7/8/23", name: "CheeseLicker342", chat:"Yo whaddup son"}, {date: "7/8/23", name: "xxcringexx", chat:"Stfu"}];
var accounts = [{user: "john", pass: "john"}];
let username = "";




function formChatTable() {
  const chatArr = [];
  for(let str in chatLog) {
    chatArr.push(<div><tr className = "header2">{chatLog[str].date + " "}{chatLog[str].name + ": "} <b>{chatLog[str].chat}</b></tr><br></br></div>);
    //console.log(chatLog[str]);
  }
  //console.log(chatArr);
  return chatArr;
}


function LogIn() {
  const[logInfo, setLogInfo] = useState({user : "" , pass : ""});
  const[createInfo, setCreateInfo] = useState({user : "" , pass : ""});
  const[errorMsg, setErrorMsg] = useState({log: "" , create: ""});

  async function Loadtexts(e) {
    //e.preventDefault();
    let arrayUse = await fetch("http://localhost:5050/chatlog", {
      method: "GET"
    })
    .catch(error => {
      window.alert(error);
      return;
    });
    chatLog = await arrayUse.json();
    
  }

  async function LoadAccount(e) {
    //e.preventDefault();
    const acc = await fetch("http://localhost:5050/chatlog/" + logInfo.user, {
      method: "GET"
    })
    .catch(error => {
      //window.alert(error);
      console.log("Couldn't find");
      return null;
    });
    
    return acc;
  }


  const PassType = event => {
    if (event.target.id == "LogPass") {
      setLogInfo({user: logInfo.user, pass: event.target.value});
      //console.log(logInfo.passPassFake);
    } else {
      setCreateInfo({user: createInfo.user, pass: event.target.value});
    }
  }

  const UserType = event => {
    if (event.target.id == "LogUser") {
      setLogInfo({user: event.target.value, pass: logInfo.pass});
    } else {
      setCreateInfo({user: event.target.value, pass: createInfo.pass});
    }
  }

  async function LogInto(e) {
    e.preventDefault();
    const acc = await fetch("http://localhost:5050/chatlog/" + logInfo.user, {
      method: "GET"
    })
    .catch(error => {
      //window.alert(error);
      console.log("Couldn't find");
      //LogCreateFailed(1);
    });
    console.log(logInfo.user);
    let result;
    try {
      result = await acc.json();
      console.log(result);
    } catch (e){
      LogCreateFailed(1);
      return;
    }
    if (result.pass == logInfo.pass) {
      username = logInfo.user;
      //Loadtexts();
      await Loadtexts();
      refresh(<App />);
      
    } else {
      LogCreateFailed(1);
    }

  }

  function LogCreateFailed(num) {
    if (num == 1) {
      setErrorMsg({log:"*Username or Password is Incorrect*", create: ""});
    } else if (num == 2) {
      setErrorMsg({log:"", create: "*Username or password is Too Short*"});
    } else {
      setErrorMsg({log:"", create: "*Username is Already Taken*"});
    }
  }

  async function CreateAccount(e) {
    //username and password must be 3 chars long
    
    if (createInfo.user.length < 3 || createInfo.pass.length < 3) {
      LogCreateFailed(2);
      return;
    } 

    e.preventDefault();
    const acc = await fetch("http://localhost:5050/chatlog/" + createInfo.user, {
      method: "GET"
    })
    .catch(error => {
      //window.alert(error);
      console.log("Couldn't find (error)");
      //LogCreateFailed(1);
    });
    console.log(acc);
    let result;
    try {
      result = await acc.json();
      console.log("does exist (bad)" + result);
      LogCreateFailed(3);
      return;
    } catch (e){
      console.log("doesnt exist (good)");
    }

    username = createInfo.user;

    e.preventDefault();
    await fetch("http://localhost:5050/chatlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({user: username, pass : createInfo.pass}),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
    await Loadtexts();
    refresh(<App key = "TypingChat"/>);
    //console.log(accounts);

    
  }


  return (
    <div className='whole'>
      <h1 className = "title">AOL Chatroom</h1>
      <div className="box">
        <div>
          <h1 className = "header">Log In</h1>
        </div>
        <div className = "form">
          <label className = "Label">Username </label><br></br>
          <input id = "LogUser" onChange = {UserType} ></input><br></br>
          <label className = "Label">Password </label><br></br>
          <input id = "LogPass" type = "password" onChange = {PassType} ></input><br></br>
          <button className = "button" type = "form" onClick={LogInto}>Log In</button>
        </div>
        <div>
          <h3 className = "error" >{errorMsg.log}</h3>
        </div>
        <br></br>
        <div> 
          <h1 className = "header2">Or</h1><br></br>
          <h1 className = "header">Create Account</h1>
        </div>
        <div className = "form">
          <label className = "Label">Username </label><br></br>
          <input  id = "CreaType" onChange={UserType} ></input><br></br>
          <label className = "Label">Password </label><br></br>
          <input id = "CreaPass" type = "password" onChange = {PassType}></input><br></br>
          <button  className = "button" type = "form" onClick={CreateAccount}>Create</button>
        </div>
        <div>
          <h3 className = "error" >{errorMsg.create}</h3>
        </div>
      </div><br></br><br></br>
      <div className='credits'>
        <h3>Made by Amanuel Seifu</h3>
      </div>
    </div>

  );
}


function App() {

  const[texts, setTexts] = useState("");

  const submitMessage = event => {
    setTexts(event.target.value);
  };

  const textMessage = <textarea id = "message" onChange = {submitMessage} value = {texts}></textarea>;

  function LogOut() {
    username = ""
    refresh(<LogIn />);
  }

  async function post(e) {
    const dateObj = new Date();
    const newPost = {date : dateObj.getDay()+"/"+dateObj.getMonth()+"/"+ dateObj.getFullYear(), name: username, chat: texts}
    chatLog.push(newPost);

    e.preventDefault();
    await fetch("http://localhost:5050/chatlog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
    console.log(chatLog[chatLog.length - 1]);
    setTexts("");
    refresh(<App />);
    
  }

  return (
    <div className = "app">
      <div>
        <h1 className = "title" >Start Chatting!</h1>
        <h3 className = "header">Type and post your thoughts!</h3>
      </div>
      <div className='box'>
        <table>
          {formChatTable()}
        </table>
        <div>
          {textMessage}
        </div><br></br>
        <div>
          <button className = "button" onClick = {post}>
            Send
          </button>
        </div><br></br><br></br>
        <div>
          <button className = "button" onClick = {LogOut}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogIn; 
//login page form