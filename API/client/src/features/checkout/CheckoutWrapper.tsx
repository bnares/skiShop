import { Elements } from "@stripe/react-stripe-js";
import CheckoutPage from "./CheckoutPage";
import { loadStripe } from "@stripe/stripe-js";
import { useAppDispatch } from "../../app/store/configureStore";
import { useEffect, useState } from "react";
import agent from "../../app/api/agent";
import { setBasket } from "../basket/basketSlice";
import LoadingComponent from "../../app/layout/LoadingComponent";

const stripePromise= loadStripe('pk_test_51NnJ6EEgeAo7lvLpWX4z3kSjZdfqH0ZKf2Y0oQzD957Ax6MDuwa9mZVCnT4a7ygI27CgibQNzPMi8vAKDXHhoUK200AZUPo8UR')
export default function CheckoutWrapper(){
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        agent.Payments.createPaymentIntent()
            .then(basket=> dispatch(setBasket(basket)))
            .catch(error=>console.log(error))
            .finally(()=>setLoading(false));
    },[dispatch])

    if(loading) return <LoadingComponent message = "Loading Checkout..."/>
    return(
        <Elements stripe={stripePromise}>
            <CheckoutPage />
        </Elements>
    )
}