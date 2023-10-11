
import { UseControllerProps } from 'react-hook-form';
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useController } from 'react-hook-form'
import { FormControl, FormHelperText, Typography } from '@mui/material';
import { UploadFile } from '@mui/icons-material';

interface Props extends UseControllerProps{}
export default function AppDropzone(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue:null});
    const dzStyles = {
        display:'flex',
        border:'dashed 3px #eee',
        borderColor:'#eee',
        borderRadius:'5px',
        paddingTop:'30px',
        alignItems:'center',
        height:200,
        width:400,
    };

    const dzActive={
        borderColor:'green'
    }
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    acceptedFiles[0] = Object.assign(acceptedFiles[0],
        {preview:URL.createObjectURL(acceptedFiles[0])}); //thanks to this line we are going to have a preview of the image on the page
    field.onChange(acceptedFiles[0]);
  }, [field])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()}>
      <FormControl style={isDragActive ? {...dzStyles, ...dzActive}: dzStyles} error={!!fieldState.error}>
        <input {...getInputProps()} />
        <UploadFile sx={{fontSize:'100px'}} />
        <Typography variant='h4'>
            Drop Image here
        </Typography>
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
      </FormControl>
    </div>
  )
}