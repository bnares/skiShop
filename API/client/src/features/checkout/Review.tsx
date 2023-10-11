import { Typography, List, ListItem, ListItemText, Grid, Button } from '@mui/material';
import { Fragment } from 'react';
import { useAppSelector } from '../../app/store/configureStore';
import BasketTable from '../basket/BasketTable';
import BasketSummary from '../basket/BusketSummary';
import { Link } from 'react-router-dom';



export default function Review() {
  const {basket} = useAppSelector((state)=>state.basket);
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      {basket && 
      <BasketTable items={basket.items} isBasket = {false}/>}
      <Grid container>
        <Grid item xs={6}/>
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </>
  );
}
