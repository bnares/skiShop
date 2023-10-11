import React from 'react'
import { useDispatch } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { Grid, Typography } from '@mui/material';
import BasketSummary from '../basket/BusketSummary';
import BasketTable from '../basket/BasketTable';
import { BasketItem } from '../../app/models/basket';

export default function DetailsOfOrder() {
   
    const {item, ordersList} = useAppSelector(state=>state.order);
    const dispatch = useAppDispatch();

    {console.log("item")}
    {console.log(item)}
  return (
    <>
    <Typography variant="h6" gutterBottom>
        Order summary
    </Typography>
        { item!! && 
            <BasketTable items={item?.orderedItems as BasketItem[]} isBasket = {false}/>
        }
      {/* <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid> */}
      </>
  )
}
