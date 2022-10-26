import '../App.css';
import {Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'
import HapticButton from 'react-haptic-button';
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
          <HapticButton  
                  isHapticFeedbackEnabled={true}
                  hapticFeedbackDuration={100}
                  variant="contained" fullWidth 
                  color={color} 
                  name={id} 
                  key={id}
                  disabled={isDisabled}
                  // onClick={()=>handleOnClick()}
                  {... handlers}
                  >
                  {name}
            </HapticButton>

      </Box>
    )
  }

export default PlayerButton;