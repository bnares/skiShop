import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const {state } = useLocation(); //react hook used to get the error data send from agent.tsx page with navigatefunction. state is the name of property from agent.ts page
    
    return (
    <Container component={Paper}>
        <Typography variant="h5" gutterBottom>
            {state?.error ? (
                <>
                    <Typography gutterBottom variant="h3" color={'secondary'}>
                        {state.error.title}
                    </Typography>
                    <Divider />
                    <Typography variant="body1">
                        {state.error.detail || "Internal Server Error"}
                    </Typography>
                </>
            ) : <Typography gutterBottom variant="h5">Server Error</Typography>}
            
        </Typography>
    </Container>
  )
}
