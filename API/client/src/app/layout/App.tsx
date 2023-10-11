import { Container, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Header from "./Header";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync, setBasket } from "../../features/basket/basketSlice";
import { getCurrentUser } from "../../features/account/accountSlice";

function App() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  

  const initApp = useCallback(async ()=>{
    //useCallback memorize the result of this function and restert this function only if dependencies wil be changed 
    try{
      await dispatch(getCurrentUser());
      await dispatch(fetchBasketAsync());
    }catch(error){
      console.log(error)
    }
  },[dispatch])

  useEffect(()=>{
    initApp().then(()=>setLoading(false));
  },[initApp])

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode ? 'dark' : 'light';
  const theme = createTheme({
    palette:{
      mode:paletteType,
      background:{
        default: paletteType =='light' ? "#eaeaea" : "#121212"
      }
    }
  });

  const handleSwitchChange = ()=>{
    setDarkMode(prev=>!prev);
  }

  if(loading) return <LoadingComponent message="Initialising App..."/>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored"/>
      <CssBaseline />
      <Header darkMode={darkMode} setDarkMode={handleSwitchChange}/>
      <Container sx={{mt:4}}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}

export default App;
