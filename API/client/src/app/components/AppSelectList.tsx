import { FormControl, InputLabel, Select, MenuItem, useControlled, FormHelperText } from "@mui/material";
import { UseControllerProps, useController } from "react-hook-form";
interface Props extends UseControllerProps {
    label: string;
    items: string[];
}
export default function AppSelectList(props:Props){
    const {fieldState, field} = useController({...props, defaultValue:""});
    return (
        <FormControl fullWidth error={!!fieldState.error}>
            <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
            <Select
                value={field.value}
                label={props.label}
                onChange={field.onChange}
            >
                {props.items.map((item, idx)=>(
                    <MenuItem value={item} key={idx}>{item}</MenuItem>
                ))}
                
                
            </Select>
            <FormHelperText>{fieldState.error?.message}</FormHelperText>
        </FormControl>
    )
}