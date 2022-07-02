import './App.css';
import {Button, ButtonGroup, Container, Box,Grid,Dialog, Accordion, AccordionSummary, AccordionDetails, Paper, List} from '@mui/material';
import { Link } from "react-router-dom";

import Possession from './components/Possession'
import PlayerButton from './components/PlayerButton';
import ScoreBoard from './components/ScoreBoard'
import GameSummary from './components/GameSummary'
import Roster from './components/Roster'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import UndoRoundedIcon from '@mui/icons-material/UndoRounded';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'
import {useSearchParams} from  'react-router-dom'
import { Undo } from '@mui/icons-material';

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

const actions = ['TA', "D", "Drop", "Huck"];

const player_list = [
  {name: "Michael", gender: "M"},
  {name: "Marco", gender: "M"},
  {name: "Shawn", gender: "M"},
  {name: "David", gender: "M"},
  {name: "Keith", gender: "M"},
  {name: "John", gender: "M"},
  {name: "Rocco", gender: "M"},
  {name: "Matt", gender: "M"},
  {name: "Nancy", gender: "F"},
  {name: "Cynthia", gender: "F"},
  {name: "Kiki", gender: "F"},
  {name: "Carina", gender: "F"},
  {name: "Abby", gender: "F"},
  {name: "Erika", gender: "F"},
  {name: "Hanna", gender: "F"},
  {name: "Viv", gender: "F"},
];


function App(prop) {
  const [searchParams] = useSearchParams() 
  let home = searchParams.get('home')
  let away = searchParams.get('versus')
  let uID = searchParams.get('uID')
  let date = searchParams.get('date')
  
  return(
    <div>
    <TrackStats home={home} versus={away} date={date} uID={uID}></TrackStats>
    </div>

  )
}

class TrackStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: (props.home)? props.home : "wth",
      date: (props.date)? props.date : 'January-01-2022',
      away: (props.versus)? props.versus : "default_away_name",
      game_id: (props.uID)? props.uID : 0,
      line: [],
      db_id: 0,
      passes : [],
      play: [],
      posts: [],
      males: [],
      females: [],
      inputName: "",
      inputGender: "M",
      showRosterAdmin: false, 
      showAllPossessions: false,
      showSummary: false,
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlayerClick = this.handlePlayerClick.bind(this);
    this.onRosterClick =this.onRosterClick.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);

  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }


  delete_player(name, gender) {
    console.log(db_url+"/players?name="+name+"&gender="+gender+"&team_name="+this.state.team)
    fetch(db_url+"/players?name="+name+"&gender="+gender+"&team_name="+this.state.team)
      .then(resp => resp.json())
      .then (data => {
        let id = data.map((player) => {
          return (player.id)
        }
        )[0]
        fetch(db_url+"/players/"+id, {
          method: 'DELETE',
        }).then(() => {
          this.fetch_players()
        })
      })
  }
  add_player(name, gender) {
    let team_name = this.state.team
    if (name) {     
      fetch(db_url+"/players", {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({name, gender, team_name})
      }).then(() => {
        this.fetch_players()
      }) 
    }
  }

  handleSubmit(e) {
    e.preventDefault();    
    if (e.nativeEvent.submitter.name === 'del') {
      console.log('deleted player')
    this.delete_player(this.state.inputName, this.state.inputGender)
    }

    else if (e.nativeEvent.submitter.name === 'new') {
    console.log('added player')

    this.add_player(this.state.inputName, this.state.inputGender)
    }

    else if (e.nativeEvent.submitter.name === 'del_plays') {
      console.log('delete plays!')
      let team_name = this.state.team
      let versus = this.state.away
      let possessions = []
      let date = this.state.date
      let id = this.state.db_id
      let uID = this.state.game_id
      fetch(db_url+"/games/"+id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({team_name, versus, date, possessions, uID})
      })
      this.setState({play:[]})

    
      // sessionStorage.setItem("possesions", JSON.stringify([]));
    }

    else if (e.nativeEvent.submitter.name === 'push_plays') {
      this.pushPlaytoDB()
      
    
      // sessionStorage.setItem("possesions", JSON.stringify([]));
    }
    else if (e.nativeEvent.submitter.name === 'pop') {
    fetch(db_url+"/players?team_name="+this.state.team)
    .then(resp => resp.json())
    .then(data => {
      if (!data.length) {
        player_list.map((player) => {
         return this.add_player(player.name,player.gender)
        })
      this.fetch_players()
      }
    })
    }
   }

  renderRosterAdmin() {
    return (
      <div>
        <Container>
        <form
        onSubmit={this.handleSubmit}>
          <input
            type = 'text'
            value={this.state.inputName}
            onChange = {this.handleChange}
            name="inputName"
          />
          <select
          value = {this.state.inputGender}
          onChange ={this.handleChange}
          name="inputGender">
            <option value = 'M'>M</option>
            <option value = 'F'>F</option>
          </select>
          <button variant='contained' name='new'>New</button>
          <button variant='contained' name='del'>Remove</button>
          <button variant='contained' name='pop'>Populate</button>
          <button variant='contained' name='del_plays'>Del Plays</button>
        </form>
        </Container>

      </div>
      )
  }
  
  fetch_players() {
    fetch(db_url+"/players?gender=M&team_name="+this.state.team+"&_sort=name")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return  {name:player.name, gender:player.gender, id: player.id, status: false}
      }
      )
      this.setState({males:players})
    })
    fetch(db_url+"/players?gender=F&_sort=name&team_name="+this.state.team)
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return {name:player.name, gender:player.gender, id: player.id, status: false}
      }
      )
      this.setState({females:players})
    })
  }

  fetchGame(team, versus, date, uid) {
    fetch(db_url+"/games?team_name="+team+"&versus="+versus+"&date="+date+"&uID="+uid)
    .then(resp => resp.json())
    .then(data => {
      if (!data.length){
        
        
      }

      else {
        let possessions = data[0].possessions
        let date = data[0].date
        let id = data[0].id
        // console.log(possessions)
        this.setState({play: possessions, date:date, db_id:id})

      }

      
    })

  }

  
  componentDidMount(){   
    this.fetch_players()
    // await this.fetch_plays()
    this.fetchGame(this.state.team, this.state.away, this.state.date, this.state.game_id)
  }

  pushPlaytoDB() {
    let team_name = this.state.team
    let versus = this.state.away
    let possessions = this.state.play.slice()
    let date = this.state.date
    let id = this.state.db_id
    let uID = this.state.game_id
    // console.log(possessions)

    fetch(db_url+"/games/"+id, {
      method: 'PUT',
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({team_name, versus, date, possessions, uID})
    })
    console.log('updated plays!')

    
  }
  
  handleActions(props) {
    let currList = this.state.passes.slice()
    let currPlays = this.state.play.slice()
    console.log(props.action)
    if (currList.length > 0 && (props.action === 'G' || props.action ==='TA')) {
      currList.push(props.action)
      currPlays.push(currList)
      this.setState({
        play: currPlays,
        passes:[]
      })
      this.setAllStatus(0)

    }

    else if (currList.length > 0 && (props.action ==='Drop')) {
      currList.push(props.action)
      currPlays.push(currList)
      this.setState({
        play: currPlays,
        passes:[]
      })
      this.setAllStatus(0)

    }

    else if (currList.length > 0 && props.action === "Undo") {
      currList.pop()
      this.setState({
        passes:currList
      })
      this.setAllStatus(0)

    }

    else if (currList.length === 0 && props.action === "Undo" && this.state.play.length >0) {
      currList = currPlays.pop()
      currList.pop()
      this.setState({
        play:currPlays,
        passes:currList
      })
      this.setAllStatus(0)

    }

    else if (props.action === "D" && currList.length === 1 ){
    currList.push(props.action)
    currPlays.push(currList)
    this.setState({
      play: currPlays,
      passes:[]
    })
    this.setAllStatus(0)

    }

    else if(props.action === "AG") {
      currList = []
      currList.push(props.action)
      currPlays.push(currList)
      this.setState({
        play: currPlays,
        passes:[]
      })
    this.setAllStatus(0)
    }
    else if(props.action === "Huck") {
      currList.push(props.action)
      this.setState({
        passes:currList
      })
    this.setAllStatus(0)
    }
  }
  async handleAction(props) {
    await this.handleActions(props)
    this.pushPlaytoDB() 
    // console.log(props)

    // sessionStorage.setItem("possesions", JSON.stringify(currPlays));
  }

  setAllStatus(id) {
    let male_roster = this.state.males.slice() 
    let female_roster = this.state.females.slice()
    for (let i = 0; i<male_roster.length; i++ ) {
      male_roster[i].status = (male_roster[i].id === id) ? true : false
    }

    for (let i = 0; i<female_roster.length; i++ ) {
      female_roster[i].status = (female_roster[i].id === id) ? true : false
    }

    this.setState({
      females: female_roster,
      males: male_roster
    })
  }

  handlePlayerClick(props) {
    let currList = this.state.passes.slice()
    currList.push(props.name)

    this.setAllStatus(props.id)

    this.setState({
      passes: currList,
    })
    
    
  }

  onSaveClick(props) {
    // console.log(this.state.showRosterAdmin)
    this.setState({showRosterAdmin:false})
  }
  onRosterClick(male, female) {
    // console.log(male, female)
    let line = male.filter(player => player.status)
    .concat(
      female.filter(player => player.status)
    ).map((player) => {
      player.status=true
      return player
    })
    console.log(line)
    this.setState({
      line:line
    })
  }

  render() {


    const m_line = this.state.line.filter((player)=> player.gender ==="M").map((player) => <PlayerButton player ={player} onClick={this.handlePlayerClick}></PlayerButton>)
    const f_line = this.state.line.filter((player)=> player.gender ==="F").map((player) => <PlayerButton player ={player} onClick={this.handlePlayerClick}></PlayerButton>)
    
    const buttonActions = actions.map((action) =>
    <Box m={1}>
      <Button onClick={() => this.handleAction({action})} fullWidth id={action} key={action}>{action}</Button>
    </Box>
    )   
    const plays = this.state.play.slice()

    
  return (
    <div className="App">

      <Dialog onClose={() => this.setState({showRosterAdmin:false})} open={this.state.showRosterAdmin}>
      <Roster onClick={this.onRosterClick} onSaveClick={this.onSaveClick} team={this.state.team} line={this.state.line}></Roster>
      {this.renderRosterAdmin()}
      </Dialog>
      
      
      <Grid container spacing ={2}>
     
      <Grid item xs={2}>
        
        <Link to={{
                pathname:"/",
                }}
                ><HomeRoundedIcon fontSize='large'> </HomeRoundedIcon>
        </Link>
          
      </Grid>


      <Grid item xs={8}>


      <Box>
      game {this.state.game_id} vs {this.state.away} on {this.state.date} 
      </Box>
      </Grid>
      <Grid item xs={2}>
          <PersonAddRoundedIcon onClick={() => this.setState({showRosterAdmin:!this.state.showRosterAdmin})} fontSize='large'>
          </PersonAddRoundedIcon>

      </Grid>
      </Grid>

      

      <Container>
      <ButtonGroup >
      <Box m={1}>
      <Button onClick={() => this.handleAction({action:"G"})} fullWidth key="G">G</Button>
      </Box>
      <Box m={1}>
      <ScoreBoard plays={this.state.play}></ScoreBoard>
      </Box>

      <Box m={1}>
      <Button onClick={() => this.handleAction({action:"AG"})} fullWidth key="AG">AG</Button>
      </Box>
      </ButtonGroup>
      
      </Container>
      <Container>
      <Grid container spacing ={2}>
        <Grid item xs={8}>
        <ButtonGroup 
          size="medium" 
        style={{
        border: "none",
      }}
      >
        {buttonActions}
        <Box m={1}>
        <Button onClick={() => this.handleAction({action:'Undo'})} fullWidth id='Undo' key='Undo'><UndoRoundedIcon/></Button>
        </Box>
        
      </ButtonGroup>
        </Grid>
      
      </Grid>
      
      </Container>

      <Container>
      {
        (m_line.length+f_line.length) ?  <div><ButtonGroup 
        orientation="vertical" 
        size='large' 
        variant="contained" 
        style={{
          border: "solid",
          minWidth: "48%",
        }}>
          {f_line}
        </ButtonGroup>
        <ButtonGroup 
        orientation="vertical" 
        size='large' 
        variant="contained" 
        style={{
          border: "solid",
          minWidth: "48%",
        }}>
          {m_line}
        </ButtonGroup></div> : 
        <div> 
            <Button variant='contained' onClick={() => this.setState({showRosterAdmin:true})}>
            Select everyone from your roster that is playing today!
            </Button> 
        </div> 
      }
      
      </Container>
      <Container>
     
      {/* <Paper style={{maxHeight: 200, overflow: 'auto'}}> */}
        <List>
        <Possession play={this.state.passes}/> 
        </List>
        <Paper style={{maxHeight: 200, overflow: 'auto'}}>
        <List>
          {
            plays.reverse().map((e) => {
            return <Box>
              <Possession play={e}/>
              </Box>
          })}
                      </List>

        </Paper>
          
      </Container>

      <Container>

        {this.state.showSummary ?
        <div>
      <GameSummary m_players = {this.state.males} f_players = {this.state.females} possessions={this.state.play}></GameSummary> 
      <Button onClick={() => this.setState({showSummary:false})}>
            Close Summary
          </Button>    

        </div>


      :
          <Button onClick={() => this.setState({showSummary:true})}>
            Show Summary
          </Button>
        }

      </Container>


    </div>
  );
  }
}


export default App;
