import '../App.css';
import {Alert} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'


function Possession(props) {
    let text = props.play.join(' => ')
    
    if (props.play[props.play.length - 1] === 'G')
      return (
        <Alert severity='success'>{text}</Alert>
      )
    else if (props.play[props.play.length - 1] === 'TA'){
      return (
      <Alert severity='warning'>{text}</Alert>
      )
    }
    else if (props.play[props.play.length - 1] === 'AG'){
      return (
      <Alert severity='error'>{text}</Alert>
      )
    }
    else {
      return (
        <Alert severity='info'>{text}</Alert>
      )
    }
  }

  export default Possession;