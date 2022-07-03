import '../App.css';
import {Box,Stack} from '@mui/material';

import { Checkbox } from '@mui/material';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ClearIcon from '@mui/icons-material/Clear';// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

const padding = 0.2

function RosterButton(props) {
    let name = props.player.name
    let func = props.onClick
    let id = props.player.id
    let status = props.player.status
    let gender = props.player.gender
    let editMode = props.editMode
    return (
      <Box style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left'
      }} 
        onClick={() => func({name, id, gender})} m={padding} >
          <Stack direction="row" style={{maxHeight:'40px',minHeight:'40px', alignItems:'center'}} spacing={1}>
          {!editMode ? <Checkbox  label={name} checked={status}></Checkbox> : 
          <Box style={{alignItems:'center'}}>
            <ClearIcon /> 
            </Box>
            }
          {name} 
          </Stack>
      </Box>
    )
  }

export default RosterButton;