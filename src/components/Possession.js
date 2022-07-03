import '../App.css';
import {Typography} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'


function Possession(props) {
    let text = props.play.join(' => ')
    let format={color:'#80B2FF', text:''}
    switch (props.play[props.play.length - 1]) {
      case "G":
        format.text='Goal!!'
        format.color='#CEECC1'
      break;
      case "TA":
        format.text='Throwaway'
        format.color='#FFF495'

      break;
      case "Drop":
        format.text='Drop!'
        format.color='#FFF495'

      break;
      case "AG":
        format.text='Away Goal :('
        format.color='#ECCEC1'

      break;
      case "D":
        format.text='Nice D'
        format.color='#80B2FF'

      break;
      default:
        format.text=''
        format.color='#80B2FF'
    }
    
    return (
      <Accordion style={{backgroundColor:format.color}}>
        <AccordionSummary
        style={{textAlign:'left'}}
        >
        <Typography>
        {format.text}
        </Typography>
        </AccordionSummary>
        <AccordionDetails>
        {text}
        </AccordionDetails>
      </Accordion>
      // <Paper style={{textAlign:'left'}}>
      
      // </Paper>
    )
    
  }

  export default Possession;