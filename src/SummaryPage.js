import { useState, useEffect} from 'react';
import { useLocation} from  'react-router-dom'
import GameSummary from './components/GameSummary.js'
import ScoreBoard from './components/ScoreBoard.js';
import {Container, } from '@mui/material'
import GameSummaryDiff from './components/GameSummaryDiff.js'
import {useSearchParams} from  'react-router-dom'
import {Tab, Tabs} from '@mui/material';

const db_url = "https://polydactyl-truthful-hyena.glitch.me"


export default function SummaryPage (props) {
    const location = useLocation();
    const [possessions, setPossessions] = useState([])
    const [possessions_prev, setPossessionsPrev] = useState([])
    const [searchParams] = useSearchParams() 
    let home = searchParams.get('home')
    let away = searchParams.get('versus')
    let uID = searchParams.get('uID')
    let date = searchParams.get('date')

    const [page, setPage] = useState(0)
    const [line, setLine] = useState([]) 
    const [line_prev, setLinePrev] = useState([]) 

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
        fetch(db_url+"/games?team_name=" + home)
        .then(resp => resp.json())
        .then(data => {
          console.log(data)
          
          if (data.length && data.length>1){
            for (var i = 0; i<data.length; i++){
              if (data[i].versus ===away && data[i].uID ===uID && data[i].date === date) break
            }
            let possessions = data[i-1].possessions
            let line = data[i-1].line
            if (line){
              setLinePrev(line)
            }
            setPossessionsPrev(possessions)

          }
    
          
        })
    }, [location.search, home, away, date, uID])
    
    return  <Container>
      <Tabs
        value={page}
        onChange={(e, newPage) => {
          setPage(newPage)
        }}
      >
        <Tab label="Summary"  />
        <Tab label="Diff from last game" />
      </Tabs>
      {(page === 0) &&
      <div>
        <ScoreBoard isFinal={true} plays={possessions}></ScoreBoard>
        <GameSummary line={line} possessions={possessions}></GameSummary> 
        </div>
      }
      {(page ===1 ) &&
        <GameSummaryDiff line={line} line_prev={line_prev} possessions={possessions} possessions_prev={possessions_prev}></GameSummaryDiff> 
      }
        </Container>
}