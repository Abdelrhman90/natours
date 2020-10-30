import axios from 'axios'
import {showAlert} from './alerts'

export const login = async (email, password) => { 
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        if (res.data.status === 'Success') {
            showAlert('success' , 'Logged In Successfully');
            window.setTimeout(() => {
                location.assign('/')
            }, 1000)
        }
    } catch (err) {
        showAlert('error' , err.response.data.message)
    }
}

export const logout = async () => {
    try {
        const res = await axios({
            method: 'POST',
            url: '/api/v1/users/logout'
        })
        if(res.data.status === 'success') location.reload(true)
    } catch (error) {
        showAlert('error' , 'Somthing went wrong! Please try again')
    }
}
    

