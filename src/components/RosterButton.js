import '../App.css';
import {Box} from '@mui/material';

import { Checkbox } from '@mui/material';

// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

const padding = 0.2

function RosterButton(props) {
    let name = props.player.name
    let func = props.onClick
    let id = props.player.id
    let status = props.player.status
    let gender = props.player.gender
    return (
      <Box style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left'
      }} 
        onClick={() => func({name, id, gender})} m={padding} >
          <Box>
          <Checkbox  label={name} checked={status}></Checkbox> {name} 
          </Box>
      </Box>
    )
  }

export default RosterButton;