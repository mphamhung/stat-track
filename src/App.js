import './App.css';
import React, { useEffect, useState } from 'react'
import {useSearchParams} from  'react-router-dom'
import useFetch from "react-fetch-hook";

import ScoreBoard from './components/ScoreBoard'
import Possessions from './components/Possessions';
import CurrentPlayers from './components/CurrentPlayers'
import ActionBar from './components/ActionBar';
import Roster from './components/Roster'
import StyleButtons from './components/StyleButtons';
import GameSummary from './components/GameSummary';

import {Container,Dialog, Tab, Tabs} from '@mui/material';

const db_url = "https://polydactyl-truthful-hyena.glitch.me"


function App(prop) {
  const [searchParams] = useSearchParams() 
  let home = searchParams.get('home')
  let away = searchParams.get('versus')
  let uID = searchParams.get('uID')
  let date = searchParams.get('date')

  const gameDataFetchResult = useFetch(db_url+"/games?team_name="+home+"&versus="+away+"&date="+date+"&uID="+uID)
  
  const [currentPossession,setCurrentPossession] = useState([])
  const [possessions, setPossesions] = useState([])
  const [line, setLine] = useState([])
  const [showRosterAdmin, setShowRosterAdmin] = useState(false)
  const [currSelected, setCurrSelected] = useState('')
  const [id, setID] = useState(null)
  const [currMods, setCurrMods] = useState([])


  const [page, setPage] = useState(0);


  useEffect(() => {
    if (!gameDataFetchResult.isLoading) {
      setPossesions(gameDataFetchResult.data[0].possessions)
      setID(gameDataFetchResult.data[0].id)
      if (gameDataFetchResult.data[0].line !== undefined) {
        setLine(gameDataFetchResult.data[0].line)
      }
    }
  }, [gameDataFetchResult])


  useEffect(() => {
    let team_name = home
    let versus = away
    if (id != null) {
      fetch(db_url+"/games/"+id, 
            {
            method: 'PUT',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({team_name, versus, date, possessions, uID, line})
            })
      
    }
  }, [possessions, line, home, away, date, uID, id])



  function handlePlayerClick(props){
    let currentPossessionTmp = currentPossession.slice()
    currentPossessionTmp.push(props.name)
    setCurrSelected(props.name)
    setCurrentPossession(currentPossessionTmp)
    setCurrMods([])
  }

  function handleStyle(e, action) {
    let currentPossessionTmp = currentPossession.slice()
    let currModsTmp = currMods.slice()
    let person = currentPossessionTmp.pop()
    if (person){
      if (person.split('+').length>1){
        currentPossessionTmp.push(person+'/'+action)
      }
      else {
        currentPossessionTmp.push(person+'+'+action)

      }
      currModsTmp.push(action)
    setCurrentPossession(currentPossessionTmp)
    setCurrMods(currModsTmp)

  }
    
  }

  function handleActions(props) {
    let currentPossessionTmp = currentPossession.slice()
    let possessionsTmp = possessions.slice()

    if (currentPossessionTmp.length > 0 && (props.action === 'G' || props.action ==='TA' || props.action ==='Drop')) {
      currentPossessionTmp.push(props.action)
      possessionsTmp.push(currentPossessionTmp)

      setCurrentPossession([])
      setPossesions(possessionsTmp)
      setCurrSelected('')
    }

    if (currentPossessionTmp.length > 0 && props.action === "Undo") {
      currentPossessionTmp.pop()
      if (currentPossessionTmp.length>=1) {
        if (currentPossessionTmp[currentPossessionTmp.length-1].split('+').length > 1) {
          let [tmpPlayer, tmpMods] = currentPossessionTmp[currentPossessionTmp.length-1].split('+')
          setCurrSelected(tmpPlayer)
          setCurrMods(tmpMods)
        }
        else{
          setCurrSelected(currentPossessionTmp[currentPossessionTmp.length-1])
          setCurrMods([])

        }
      }
      else {
        setCurrSelected('')
        setCurrMods([])
      }
      setCurrentPossession(currentPossessionTmp)
    }

    else if (currentPossessionTmp.length === 0 && props.action === "Undo" && possessionsTmp.length >0) {
      setCurrentPossession(possessionsTmp.pop())
      setPossesions(possessionsTmp)
      setCurrSelected('')
    }

    else if (props.action === "D" && currentPossessionTmp.length === 1 ){
      currentPossessionTmp.push(props.action)
      possessionsTmp.push(currentPossessionTmp)
      setCurrentPossession([])
      setPossesions(possessionsTmp)
      setCurrSelected('')
    }

    else if (props.action === "AG") {
      currentPossessionTmp = []
      currentPossessionTmp.push(props.action)
      possessionsTmp.push(currentPossessionTmp)
      setCurrentPossession([])
      setPossesions(possessionsTmp)
      setCurrSelected('')
      }
  }

  function onRosterClick(male, female) {
    // console.log(male, female)
    let line = male.filter(player => player.status)
    .concat(
      female.filter(player => player.status)
    ).map((player) => {
      player.status=true
      return player
    })
    setLine(line)
  }

  return(
    <div>
        <Tabs
        value={page}
        onChange={(e, newPage) => {
          setPage(newPage)
        }}
      >
        <Tab label="Track"  />
        <Tab label="Summary" />
      </Tabs>
      { gameDataFetchResult.isLoading && "Fetching Data From Server" }
      {(page ===0) &&
            <Container>
            <Dialog onClose={() => setShowRosterAdmin(false)} open={showRosterAdmin}>
            <Roster onClick={onRosterClick} onSaveClick={() => setShowRosterAdmin(false)} team={home} line={line}></Roster>
            </Dialog>
            <ScoreBoard plays={possessions}></ScoreBoard>
            <CurrentPlayers 
                handleRosterButtonClick={() => setShowRosterAdmin(!showRosterAdmin)} 
                handlePlayerClick={handlePlayerClick} 
                line={line}
                disabled={currSelected}
                />
            <ActionBar handleAction={handleActions}/>
            <StyleButtons disabled={currMods} handleOnClick={handleStyle}></StyleButtons>
      
            <Possessions currentPossessions = {currentPossession} prevPossessions={possessions.slice().reverse()} handleUndoClick={() => handleActions({action:'Undo'})}/>
            </Container>
      }
      {(page ===1) &&       
      <GameSummary line={line} possessions={possessions}></GameSummary> 
      }

    </div>

  )
}

export default App;
