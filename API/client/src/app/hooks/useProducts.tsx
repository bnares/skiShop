import React, { useEffect } from 'react'
import { productsSelectors, fetchProductsAsync, fetchFilters } from '../../features/catalog/catalogSlice';
import { useAppSelector, useAppDispatch } from '../store/configureStore';

export default function useProducts() {
    const products = useAppSelector(productsSelectors.selectAll);
    const {productsLoaded, status,filtersLoaded, brands, types, metaData} = useAppSelector(state=>state.catalog);
    const dispatch = useAppDispatch();
    
    useEffect(()=>{
      if(!productsLoaded) dispatch(fetchProductsAsync());
      
    },[productsLoaded, dispatch])
  
    useEffect(()=>{
      if(!filtersLoaded) dispatch(fetchFilters())
    },[dispatch, filtersLoaded])
    return {
        products,
        productsLoaded,
        filtersLoaded,
        brands,
        types,
        metaData
    }
}
