import * as React from 'react';

import {Stack, Container, Paper, Typography} from '@mui/material';

const positiveActions = ["G", ]
const otherActions = ["D","TA", "Drop", "Huck"];
const negativeActions = ["AG"];


export default function ActionBar(props) {
    let handleAction = props.handleAction
     
    return (
      <Container>
        <Stack
        direction='row'
        justifyContent='space-evenly'      
        mt={1} mb={1}  >
        <Stack 
        direction='row'
        spacing='9px'

        >
        {positiveActions.map((action) =>
            <Paper style = {{backgroundColor:'#257300', 
                            color:'white', height:'45px', width:'45px', 
                            display:'flex', alignItems: 'center', justifyContent: 'center',}}
                            onClick={() => handleAction({action})}>
                <Typography>
                    {action}
                </Typography>
            </Paper>
            // <Button onClick={() => handleAction({action})} fullWidth id={action} key={action}>{action}</Button>
        )
        }
        </Stack>

        <Stack 
        direction='row'
        spacing='9px'

        >
        {otherActions.map((action) =>
            <Paper style = {{backgroundColor:'gray', 
            color:'white', height:'45px', width:'45px', 
            display:'flex', alignItems: 'center', justifyContent: 'center',}}
            onClick={() => handleAction({action})}>
                <Typography>
                    {action}
                </Typography>
            </Paper>
            // <Button onClick={() => handleAction({action})} fullWidth id={action} key={action}>{action}</Button>
        )
        }
        </Stack>

        <Stack 
        direction='row'
        spacing='9px'

        >
        {negativeActions.map((action) =>
            <Paper style = {{backgroundColor:'#AF0000', 
            color:'white', height:'45px', width:'45px', 
            display:'flex', alignItems: 'center', justifyContent: 'center',}}
            onClick={() => handleAction({action})}>
                <Typography>
                    {action}
                </Typography>
            </Paper>
            // <Button onClick={() => handleAction({action})} fullWidth id={action} key={action}>{action}</Button>
        )
        }
        </Stack>
        </Stack>

      </Container>
    );
}