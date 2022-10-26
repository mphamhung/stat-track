import '../App.css';
import {Button, Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

const padding = 0.2
const buttonJSS = {
  "&.active": {
      animation: "MoveUpDown 0.1s linear",
      animationFillMode: "forwards"
  },

  "@keyframes MoveUpDown": {
      "0%, 100%": {
          transform: "translateY(0)"
      },
      "50%": {
          transform: "translateY(5px)"
      }
  }
};
function PlayerButton(props) {
    let name = props.player.name
    let func = props.onClick
    let id = props.player.id
    // let status = props.player.status
    let isDisabled = props.isDisabled
    let color = ((props.player.gender === "M" ) ? 'primary' : 'secondary')
    let gender = props.player.gender
    const [active, setActive] = React.useState(false);

    function handleOnClick(){
      func({name, id, gender})
      
    }

    function handleOnTouchStart(){
      setActive(true);
      setTimeout(() => {
          setActive(false);
      }, 300)
    }
    const handlers={
      onClick: handleOnClick,
      onTouchStart: handleOnTouchStart,
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
                  {... handlers}
                  sx={buttonJSS}
                  className={active ? 'active' : ''}
                  >
                  {name}
            </Button>

      </Box>
    )
  }

export default PlayerButton;