
import '../App.css';
import {Paper, Stack, Typography, Container,Divider} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

import {SentimentVerySatisfied, MoodBad} from '@mui/icons-material/';

function ScoreBoard(props) {
    let isFinal = props.isFinal
    let plays = props.plays.slice()
    let home = plays.reduce((total, play) => {
      let toAdd = (play[play.length - 1] === "G") ? 1 : 0
      return total + toAdd
    }, 0)
    let away = plays.reduce((total, play) => {
      let toAdd = (play[play.length - 1] === "AG") ? 1 : 0
      return total + toAdd
    }, 0)

    let diff = home-away
    
    return (

    <Container>
    <Stack direction='row' justifyContent="space-between" mt={1} mb={1}>
      <Paper elevation={0} style={{display:'flex', alignItems: 'center', justifyContent: 'center', }}>
      {isFinal ? 
          <Typography >
          Final Score:
        </Typography>
        :
        <Typography >
          Current Score:
        </Typography>
      }
      </Paper>
      
      <Stack 
        direction = "row"
        spacing = '5px'
        >
        <Paper  elevation={0}  style={{backgroundColor: '#257300', color:'white', 
                                    width: '38px', height:'38px', display:'flex', borderRadius:'100%',
                                  alignItems: 'center', justifyContent: 'center', }}>
        <Typography >
        {home}
        </Typography>

        </Paper>
        <Paper elevation={0}  style={{backgroundColor: '#AF0000', color:'white',
                                    width: '38px', height:'38px', display:'flex', borderRadius:'100%',
                                    alignItems: 'center', justifyContent: 'center',}}>
        <Typography>
        {away}
        </Typography>        
        </Paper>
        </Stack>
      <Paper elevation={0}  style={{display:'flex', alignItems: 'center', justifyContent: 'center',}}>

      {(diff > 0) ? <SentimentVerySatisfied fontSize="large"/> : <MoodBad fontSize="large"/>}
      </Paper>

    </Stack>
    <Divider/>

    </Container>
     
    )
  }
  

export default ScoreBoard;