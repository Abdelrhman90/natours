import '@babel/polyfill'

import { login , logout } from './login'
import { displayMap } from './mapbox'
import { updateSettings } from './updateSettings'
import {bookTour} from './stripe'
// DOM

const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateDataBtn = document.querySelector('.form-user-data')
const updatePasswordBtn = document.querySelector('.form-user-settings')
const bookBtn = document.getElementById('book-tour')

if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations) 
    displayMap(locations)
}

if (updateDataBtn) {
    updateDataBtn.addEventListener('submit', e => {
        e.preventDefault()
        const form = new FormData()
        form.append('name' , document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo' , document.getElementById('photo').files[0])
        
        updateSettings(form, 'data')
    })
}
if (updatePasswordBtn) {
    updatePasswordBtn.addEventListener('submit', async e => {
        e.preventDefault()
        document.querySelector('.password-save').textContent = 'Updating...'
        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const passwordConfirm = document.getElementById('password-confirm').value
        
        await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password')

        document.querySelector('.password-save').textContent = 'Save password'

        document.getElementById('password-current').value = ''
        document.getElementById('password').value = ''
        document.getElementById('password-confirm').value = ''

    })
}

if (loginForm) {
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        
        login(email, password)
    })
}

if (logoutBtn) logoutBtn.addEventListener('click', logout)

if (bookBtn) {
    bookBtn.addEventListener('click', e => {
        e.target.textContent = 'Processing...'
        const tourId = e.target.dataset.tourId
        bookTour(tourId)
    })
}