const stripe = Stripe('pk_test_51HJ0mqDAUx3o4e7ixVsvsGUcDi5UODgRSfcsD10OKAaMuKn7d8OSFxvFqwZdxLv7jdGeNqCHR5e2Nf8ptE2I8aRq00l32z2j34')
import axios from 'axios'
import {showAlert} from './alerts'


export const bookTour = async tourId => {
    try {
        
        const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`)
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err)  {
        console.log(err);
        showAlert('error' , err)
    }

}