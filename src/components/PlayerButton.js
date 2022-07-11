import '../App.css';
import {Button, Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react'

const padding = 0.2

function PlayerButton(props) {
    let name = props.player.name
    let func = props.onClick
    let id = props.player.id
    // let status = props.player.status
    let isDisabled = props.isDisabled
    let color = ((props.player.gender === "M" ) ? 'primary' : 'secondary')
    let gender = props.player.gender

    const [selected, setSelected] = useState(false)

    const diff = useRef({x:null, y:null})
    function handleOnClick(){
      func({name, id, gender})
    }


    useEffect( () => {
      console.log(selected)

    }, [selected])
    
    function handleOnMouseDown(e) {
      
      // console.log(e.nativeEvent.clientX)
      setSelected(true)
      
    }
    function handleOnMouseUp(e) {

      setSelected(false)
    }

    function handleOnTouchStart(e) {
      
      diff.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }

      setSelected(true)
      
    }
    function handleOnTouchEnd(e) {

      diff.current = {
        x: diff.current.x-e.changedTouches[0].clientX,
        y: diff.current.y-e.changedTouches[0].clientY

      }
      console.log(diff)

      setSelected(false)
    }

    const handlers={
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
  }

    return (
      <Box m={padding} style={{position:'relative'}}>
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
            {selected ?
            <div>
              <Button style={{position:'absolute', left:-50, zIndex:100}}>
              Test
            </Button>
            </div>
             :
            ''
            }

      </Box>
    )
  }

export default PlayerButton;