import '../App.css';
import {Button, Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

const padding = 0.2

function PlayerButton(props) {
    let name = props.player.name
    let func = props.onClick
    let id = props.player.id
    // let status = props.player.status
    let isDisabled = props.isDisabled
    let color = ((props.player.gender === "M" ) ? 'primary' : 'secondary')
    let gender = props.player.gender

    function handleOnClick(){
      func({name, id, gender})
    }


    const handlers={
      onClick: handleOnClick,
      // onMouseDown: handleOnMouseDown,
      // onMouseUp: handleOnMouseUp,
  }

    return (
      <Box m={padding}>
          <Button  
                  variant="contained" fullWidth 
                  color={color} 
                  name={id} 
                  key={id}
                  disabled={isDisabled}
                  // onClick={()=>handleOnClick()}
                  {... handlers}
                  >
                  {name}
            </Button>

      </Box>
    )
  }

export default PlayerButton;