import { useState, useEffect} from 'react';
import { useLocation} from  'react-router-dom'
import GameSummary from './components/GameSummary.js'
import ScoreBoard from './components/ScoreBoard.js';
import {Container, } from '@mui/material'
const db_url = "https://polydactyl-truthful-hyena.glitch.me"


export default function SummaryPage (props) {
    const location = useLocation();
    const [possessions, setPossessions] = useState([])
    const [line, setLine] = useState([]) 
    useEffect( () => {
        fetch(db_url+"/games" + location.search)
        .then(resp => resp.json())
        .then(data => {
          if (!data.length){
                    
          }
    
          else {
            let possessions = data[0].possessions
            let line = data[0].line
            // console.log(possessions)
            if (line){
              setPossessions(possessions)
              setLine(line)
            }
            else {
                setPossessions(possessions)
            }
    
          }
    
          
        })
    }, [location.search])
    
    return  <Container>
        <ScoreBoard isFinal={true} plays={possessions}></ScoreBoard>
        <GameSummary line={line} possessions={possessions}></GameSummary> 
        </Container>
}