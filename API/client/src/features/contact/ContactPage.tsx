import { useDispatch, useSelector } from "react-redux"
//import { CounterState, decrement, increment } from "./counterReducrer"
import { Button, ButtonGroup, Container, Typography } from "@mui/material"
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";
import EmailIcon from '@mui/icons-material/Email';

export default function ContactPage() {
  //const {data, title}=useSelector((state:CounterState)=>state)
  //const dispatch = useDispatch();
  const {data, title}=useAppSelector(state=>state.counter);
  const dispatch = useAppDispatch();
  return (
    <Container sx={{display:'flex', flexDirection:'column', alignItems:'center'}}>
      <Typography variant="h3">
        CREATED BY PIOTR OSTROUCH
      </Typography>
      <Typography sx={{display:'flex', justifyContent:'center'}}>
         <EmailIcon sx={{marginRight:'1rem'}}/> Email: piotr.ostrouch@gmail.com
      </Typography>
    </Container>
    
  )
}
