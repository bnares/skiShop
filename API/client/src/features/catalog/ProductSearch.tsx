import { TextField, debounce } from '@mui/material'
import React, { useState } from 'react'
import { useAppSelector } from '../../app/store/configureStore'
import { useDispatch } from 'react-redux';
import { setProductParams } from './catalogSlice';

export default function ProductSearch() {
    const {productParams} = useAppSelector(state=>state.catalog);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);

    const debounceSearch = debounce((event:any)=>{
        dispatch(setProductParams({searchTerm:event.target.value}))
    }, 1000);
  return (
    <>
        <TextField 
            label="Search products"
            variant="outlined"
            fullWidth
            value={searchTerm || ""}
            onChange={
                (event:any)=>{
                    setSearchTerm(event.target.value)
                    debounceSearch(event);
                }
            }
        />
    </>
  )
}
