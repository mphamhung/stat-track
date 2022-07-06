import {Paper, Typography, Stack, Container} from '@mui/material';

export default function StyleButtons(props) {

    function handleClick(e, action){

        if (props.disabled.includes(action)){
            return
        }
        props.handleOnClick(e,action)
    }
    const actions = ['Huck', 'Lefty', 'Hammer Scoobs', 'Layout'].map((action) => {
        console.log(props.disabled.includes(action))
        return <Paper elevation='3' style = {{backgroundColor:(props.disabled.includes(action)) ? 'red':'orange', 
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

                >
                {actions}
            </Stack>
        </Container>           

    )
}