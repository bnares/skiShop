import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import ProductList from "./ProductList";
import { useEffect } from "react";
import { fetchFilters, fetchProductsAsync, productsSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Pagination, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckBoxButtons from "../../app/components/CheckBoxButtons";
import AppPagination from "../../app/components/AppPagination";

const sortOptions = [
  {value:'name', label:'Alphabetical'},
  {value:'priceDesc', label:'Price-High to low'},
  {value:'price', label:'Price-Low to high'},
]

export default function Catalog(){

  const products = useAppSelector(productsSelectors.selectAll);
  const {productsLoaded, status,filtersLoaded, brands, types,productParams, metaData} = useAppSelector(state=>state.catalog);
  const dispatch = useAppDispatch();
  
  useEffect(()=>{
    if(!productsLoaded) dispatch(fetchProductsAsync());
    
  },[productsLoaded, dispatch])

  useEffect(()=>{
    if(!filtersLoaded) dispatch(fetchFilters())
  },[dispatch, filtersLoaded])

  //if(status.includes("pending")) return <LoadingComponent  />
  if(!filtersLoaded) return <LoadingComponent  />
    return (
      <Grid container columnSpacing={4}>
        <Grid item xs = {3}>
          <Paper sx={{mb:2}}>
            <ProductSearch />
          </Paper>
          <Paper sx={{mb:2, p:2}}>
            <RadioButtonGroup 
              options={sortOptions}
              selectedValue={productParams.orderBy}
              onChange={(e)=>dispatch(setProductParams({orderBy:e.target.value}))} 
            />
          </Paper>
          <Paper sx={{p:2, mb:2}}>
            <CheckBoxButtons 
              items = {brands} 
              checked={productParams.brands}
              onChange={(items:string[])=>dispatch(setProductParams({brands:items}))} 
            />
          </Paper>
          <Paper sx={{p:2, mb:2}}>
          <CheckBoxButtons 
              items = {types} 
              checked={productParams.types}
              onChange={(items:string[])=>dispatch(setProductParams({types:items}))} 
            />
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProductList products={products}/>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={9} sx={{mb:2}}>
          {metaData &&
            <AppPagination
              metaData={metaData}
              onPageChange={(page:number)=>dispatch(setPageNumber({pageNumber:page}))}
            />
          }
        </Grid>
      </Grid>
    )
}