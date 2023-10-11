import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  function getValidationError(){
    agent.TestErrors.getValidationError()
      .then(()=>console.log("should not see this"))
      .catch(error=>setValidationErrors(error));
  }

  return (
    <Container sx={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
      <Typography gutterBottom variant="h2">
        Announcement
      </Typography>
      <Typography variant="h5">
        {(`this is a fake e-commerce shop please do not add your true credit card data and do not expect to get your purchase from this shop.`).toUpperCase()} 
      </Typography>
    </Container>
    
  )
}
