import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { yupResolver } from "@hookform/resolvers/yup"
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { validationSchema } from "./CheckoutValidation";
import agent from "../../app/api/agent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { clearBasket } from "../basket/basketSlice";
import { LoadingButton } from "@mui/lab";
import { StripeElementType } from "@stripe/stripe-js";
import { CardNumberElement, useElements, useStripe } from "@stripe/react-stripe-js";

const steps = ['Shipping address', 'Review your order', 'Payment details'];



export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [orderNumber, setOrderNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    const [cardState, setCardState] = useState<{elementError: {[key in StripeElementType]?: string}}>({elementError:{}})
    const [cardComplete, setCardComplete] = useState<any>({cardNumber:false, cardExpiry: false, cardCvc: false});
    const [paymentMessage, setPaymentMessage] = useState('');
    const [paymentSucceeded, setPaymentSucceeded] = useState(false);
    const {basket} = useAppSelector(state=>state.basket);
    const stripe = useStripe();
    const elements = useElements();

    function onCardInputChange(event: any){
        setCardState({
            ...cardState,
            elementError: {
                ...cardState.elementError,
                [event.elementType]: event.error?.message
            }
        })
        setCardComplete({ ...cardComplete, [event.elementType]: event.complete })
    }

    function getStepContent(step: number) {
        switch (step) {
            case 0:
                return <AddressForm/>;
            case 1:
                return <Review/>;
            case 2:
                return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange}/>;
            default:
                throw new Error('Unknown step');
        }
    }

    const currentValidationShema = validationSchema[activeStep];
    const methods = useForm({
      mode: 'all',
      resolver: yupResolver(currentValidationShema),
    });

    useEffect(()=>{
        agent.Account.fetchAddress()
            .then(response=>{
                if(response){
                    methods.reset( //using the rect-hook-form library we can reset all data from form using rest method an get all the value using getValues 
                        {...methods.getValues(), ...response, saveAddress:false}
                    )
                }
            })
    },[methods])

    async function submitOrder(data : FieldValues){
        setLoading(true);
        const {nameOnCard, saveAddress, ...shippingAddress} = data;
        if(!stripe || !elements) return; //stripe not ready
        try{
            const cardElement = elements.getElement(CardNumberElement);
            const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!,{
                payment_method:{
                    card: cardElement!,
                    billing_details:{
                        name:nameOnCard
                    }
                }
            });
            console.log(paymentResult);
            if(paymentResult.paymentIntent?.status ==='succeeded'){
                const orderNumber = await agent.Orders.create({saveAddress, shippingAddress});
                setActiveStep((prev)=>prev+1);
                setOrderNumber(orderNumber);
                setPaymentSucceeded(true);
                setPaymentMessage("Thank You - We have recived your payment");
                dispatch(clearBasket());
                setLoading(false);
            }else{
                setPaymentMessage(paymentResult.error?.message!);
                setPaymentSucceeded(false);
                setLoading(false);
                setActiveStep(activeStep+1);
            }
        }catch(error){
            console.log(error);
            setLoading(false);
        }
    }

    const handleNext = async (data : FieldValues) => {
        //const {nameOnCard, saveAddress, ...shippingAddress} = data;
        if(activeStep==steps.length-1){
            // setLoading(true);
            // try{
            //     await subtmitOrder()
            // }catch(error){
            //     console.log(error)
            //     setLoading(false);
            // }
            await submitOrder(data);
        }else{
            setActiveStep(activeStep + 1);
        }
        
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    function submitDisabled(): boolean {
        console.log("start SubmoitDisabled");

        if(activeStep === steps.length - 1){
            console.log("inside if");
            console.log(cardComplete.cardCvc);
            console.log(cardComplete.cardExpiry);
            console.log(cardComplete.cardNumber);
            console.log(methods.formState.isValid);
            return (!cardComplete.cardCvc || !cardComplete.cardExpiry || !cardComplete.cardNumber || !methods.formState.isValid);
        }else{
            console.log("inside else");
            return !methods.formState.isValid;
        }
    }

    return (
      <FormProvider {...methods}>
        <Paper variant="outlined" sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}}>
            <Typography component="h1" variant="h4" align="center">
                Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <>
                {activeStep === steps.length ? (
                    <>
                        <Typography variant="h5" gutterBottom>
                            {paymentMessage}
                        </Typography>
                        {paymentSucceeded ? (
                            <Typography variant="subtitle1">
                            Your order number is {orderNumber}. We have <b>NOT</b> emailed your order
                            confirmation, and will NOT send you an update when your order has
                            shipped as this is a <b>FAKE STORE</b>.
                        </Typography>
                        ) : (
                            <Button variant = "contained" onClick={handleBack}>Go Back and try again</Button>
                        )}
                        
                    </>
                ) : (
                    <form onSubmit={methods.handleSubmit(handleNext)}>
                        {getStepContent(activeStep)}
                        <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{mt: 3, ml: 1}}>
                                    Back
                                </Button>
                            )}
                            <LoadingButton
                                variant="contained"
                                type="submit"
                                sx={{mt: 3, ml: 1}}
                                disabled = {submitDisabled()}
                                loading = {loading}
                            >
                                {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                            </LoadingButton>
                        </Box>
                    </form>
                )}
            </>
        </Paper>
      </FormProvider>
    );
}
