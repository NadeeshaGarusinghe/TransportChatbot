import axios from 'axios';


axios.defaults.baseURL="http://localhost:5000"

export const register = newUser => {
    return axios
    .post('api/auth/register', {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password
    })
    .then(response =>{
        console.log("Registered " + newUser.first_name)
    })
}

export const login = user => {
    console.log("Logging in 2")
    return axios
    .post('api/auth/login', {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        password: user.password
    })
    .then(response =>{
        console.log("Logged in as " + user.name);
        localStorage.setItem('usertoken', response.data)
        console.log(localStorage.usertoken)
        return response.data
    })
    .catch(err=>{
        console.log(err);
    })
}
