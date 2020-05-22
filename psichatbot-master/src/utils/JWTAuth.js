import axios from 'axios';


//const SERVER_URL = "https://psichatbot-server.herokuapp.com";

const SERVER_URL = "http://127.0.0.1:5000/";

const login = async (data) => {
    const LOGIN_ENDPOINT = `${SERVER_URL}/api/auth/login`;

    console.log("Trying to log in")
    try {
        console.log("Line above")
        let response = await axios.post(LOGIN_ENDPOINT, data);
        console.log("Test")
        console.log(response.data.message)
        if(response.status === 200 && response.data.jwt_token){
            let jwt = response.data.jwt_token;
            // let expire_at = response.data.expireAt;
            console.log(response.data.message);
            localStorage.setItem("access_token", jwt);
            localStorage.setItem("logged", true);
            // localStorage.setItem("expire_at", expire_at);
            return "Logged in"
        }


    } catch(e){
        console.log(e);
    }
}

const register = async (data) => {
    const SIGNUP_ENDPOINT = `${SERVER_URL}/api/auth/register`;
    try {
        let response = await axios({
            method: 'post',
            responseType: 'json',
            url: SIGNUP_ENDPOINT,
            data: data
          });
        console.log(response)
    } catch(e){
        console.log(e);
    }
}

const logout = () => {
    localStorage.removeItem("access_token");
    // localStorage.removeItem("expire_at");
}

export { login, register, logout } 