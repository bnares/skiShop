import { Box, Typography, Pagination } from '@mui/material'
import React, { useState } from 'react'
import { MetaData } from '../models/pagination'

interface Props{
    metaData:MetaData,
    onPageChange:(page:number)=>void;
}

export default function AppPagination({metaData, onPageChange}:Props) {
    const {currentPage, totalCount, totalPages, pageSize} = metaData
    const [pageNumber, setPageNumber] = useState(currentPage);

    function handlePageChange(page: number){
      setPageNumber(page);
      onPageChange(pageNumber);

    }
    return (
    <>
        <Box display ="flex" justifyContent="space-between" alignItems="center">
              <Typography>
                Displaying {(currentPage-1)*pageSize+1}-
                {currentPage*pageSize>totalCount ? totalCount :currentPage*pageSize} 
                of {totalCount} itmes
              </Typography>
              <Pagination 
                color="secondary"
                size="large"
                count={totalPages}
                page={currentPage}
                onChange={(e,page)=>onPageChange(page)}
              />
          </Box>
    </>
  )
}
