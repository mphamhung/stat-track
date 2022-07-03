import {Paper,Container, Typography, Grid, Button} from '@mui/material';
import Possession from './Possession';
import UndoIcon from '@mui/icons-material/Undo';

export default function Possesions(props) {
    let currentPossessions = props.currentPossessions
    let prevPossessions = props.prevPossessions
    let handleUndoClick = props.handleUndoClick
    let text = currentPossessions.join(' => ')
    return (
        <Container>
        <Paper style={{minHeight:60}}>
        <Grid container spacing={1}>
            <Grid item xs={10}>
                <Typography>
                    {text}
                </Typography>
            </Grid>
            <Grid item xs={2} style={{display:'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button onClick={handleUndoClick}>
                <UndoIcon></UndoIcon>
                    </Button>
            </Grid>
        </Grid>

        </Paper>

        <Paper style={{maxHeight: 200, overflow: 'auto'}}>

        {
        prevPossessions.map((e) => {
        return <Possession play={e}/>
        })}

        </Paper>
        </Container>
        
    )
}