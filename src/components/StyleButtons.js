import {Paper, Typography, Stack, Container} from '@mui/material';

export default function StyleButtons(props) {

    function handleClick(e, action){

        if (props.disabled.includes(action)){
            return
        }
        props.handleOnClick(e,action)
    }
    const actions = ['Huck', 'Lefty', 'Upside Down', 'Layout'].map((action) => {
        return <Paper elevation='3' style = {{backgroundColor:(props.disabled.includes(action)) ? 'red':'grey', 
                        color:'white', height:'45px', width:'45px', 
                        display:'flex', alignItems: 'center', justifyContent: 'center',}}
                        onClick = {(e)=> handleClick(e,action)}
                        
                        >
            <Typography>
                {action}
            </Typography>
        </Paper>
    })
  
    return (
        <Container style={{display:'flex', alignItems: 'center', justifyContent: 'center',}}>
            <Stack 
                direction='row'
                spacing='9px'
                mb={1}
                >
                {actions}
            </Stack>
        </Container>           

    )
}