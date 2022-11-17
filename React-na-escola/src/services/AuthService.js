import axios from 'axios'

const API_URL = 'http://localhost:5147/api/home/'

const login = async (username, senha) => {
    const response = await axios
        .post(API_URL + 'login', {
            username,
            senha,
        })
    console.log('response: ' + JSON.stringify(response.data.token))
    if (response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data))
    return response.data
}

const logout = () => {
    localStorage.removeItem('user')
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}

const AuthService = {
    login,
    logout,
    getCurrentUser,
}

export default AuthService