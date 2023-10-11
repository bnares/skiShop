import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import { useStoreContext } from "../../app/context/StoreContext";
import { useEffect, useState } from "react";
import { Basket, BasketItem } from "../../app/models/basket";
import { useAppSelector } from "../../app/store/configureStore";
interface Props {
    subtotal:number
}
export default function BasketSummary() {
    const {basket} = useAppSelector(status=>status.basket);
    const [subtotal,setSubtotal] = useState<number>(0);
    const freeDeliveryProce = 100;
    const deliveryFee = 5;
    useEffect(()=>{
        if(basket!.items.length>0 ?? 0)
        {
            const addSum =(sum=0,item:BasketItem)=> sum+=(item.price*item.quantity);
            const sum =  Number(((basket!.items.reduce(addSum,0))/100).toFixed(2));
            setSubtotal(sum);
        }else{
            setSubtotal(0);
        }
        
        
    },[JSON.stringify(basket)])
    
    return (
        <>
            <TableContainer component={Paper} variant={'outlined'}>
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right"> ${subtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Delivery fee*</TableCell>
                            <TableCell align="right">${deliveryFee}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">${subtotal<freeDeliveryProce ? subtotal+deliveryFee : subtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <span style={{fontStyle: 'italic'}}>*Orders over $100 qualify for free delivery</span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
