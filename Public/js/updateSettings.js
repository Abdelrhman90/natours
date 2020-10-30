import axios from 'axios'
import {showAlert} from './alerts'
export const updateSettings = async(data , type) => {
    try {
        const url = type === 'password' ? '/api/v1/users/updatepassword' :
            '/api/v1/users/updateMe'
        
        const res = await axios({
            method: 'PATCH',
            url,
            data
        })
        if (res.data.status === 'Success') {
            showAlert('success' , `${type.toUpperCase()} Updated Successfully`)
        }
    } catch(err) {
        showAlert('error' , err.response.data.message)
    }
}