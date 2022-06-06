
import '../App.css';
import {Chip, Stack} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

function ScoreBoard(props) {
    let plays = props.plays.slice()
    let home = plays.reduce((total, play) => {
      let toAdd = (play[play.length - 1] === "G") ? 1 : 0
      return total + toAdd
    }, 0)
    let away = plays.reduce((total, play) => {
      let toAdd = (play[play.length - 1] === "AG") ? 1 : 0
      return total + toAdd
    }, 0)

    
    return (
    <Stack direction = "row">
        <Chip label={home} color='success' />
        <Chip label={away} color='error'/>
    </Stack>
      
    )
  }
  

export default ScoreBoard;