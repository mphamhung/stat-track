import {ButtonGroup, Container, Stack, Typography, Paper} from '@mui/material';
import PlayerButton from './PlayerButton';

import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';


export default function CurrentPlayers(props) {
    let handleRosterButtonClick = props.handleRosterButtonClick
    let handlePlayerClick = props.handlePlayerClick
    let line = props.line

    const m_line = line.filter((player)=> player.gender ==="M").map((player) => <PlayerButton player ={player} onClick={handlePlayerClick}></PlayerButton>)
    const f_line = line.filter((player)=> player.gender ==="F").map((player) => <PlayerButton player ={player} onClick={handlePlayerClick}></PlayerButton>)
    
    return (
        <Paper elevation='0' style={{minHeight: 400, overflow: 'auto',}}>
            
                    <Container >
                    <Container >
                    <Stack mt={1} direction='row' justifyContent="space-between">
                    <Typography>
                        Players:
                    </Typography>
                    <PersonAddRoundedIcon onClick={handleRosterButtonClick} fontSize='large'/>
                    </Stack>
                    </Container>
                    </Container>

                    <Container>
                    {
                    (m_line.length+f_line.length) ?  
                    <div><ButtonGroup 
                    orientation="vertical" 
                    size='large' 
                    variant="contained" 
                    style={{
                    border: "solid",
                    minWidth: "48%",
                    }}>
                    {f_line}
                    </ButtonGroup>
                    <ButtonGroup 
                    orientation="vertical" 
                    size='large' 
                    variant="contained" 
                    style={{
                    border: "solid",
                    minWidth: "48%",
                    }}>
                    {m_line}
                    </ButtonGroup></div> : 
                    <Typography>
                    No Players Currently Selected!
                    </Typography>
                    }

                    </Container>
            
            </Paper>
    )
}
