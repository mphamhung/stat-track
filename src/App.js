import './App.css';
import {Button, ButtonGroup, Container, Box} from '@mui/material';

import Possession from './components/Possession'
import PlayerButton from './components/PlayerButton';
import ScoreBoard from './components/ScoreBoard'
import GameSummary from './components/GameSummary'

// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'
import {useSearchParams} from  'react-router-dom'

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

const actions = ['TA', "D", "Drop", "Undo"];
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
]

function App(prop) {
  const [searchParams] = useSearchParams() 
  let home = searchParams.get('home')
  let away = searchParams.get('away')
  let date = searchParams.get('date')
  return(
    <TrackStats home={home} away={away} date={date}></TrackStats>
  )
}

class TrackStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      team: (props.home)? props.home : "wth",
      date: (props.date)? props.date : new Date().toISOString(),
      away: (props.away)? props.away : "default_away_name",
      game_id: 0,
      passes : [],
      play: [],
      posts: [],
      males: [],
      females: [],
      inputName: "",
      inputGender: "M"
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePlayerClick = this.handlePlayerClick.bind(this);

    
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
      let id = this.state.game_id
      fetch(db_url+"/games/"+id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({team_name, versus, date, possessions})
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

  fetch_plays() {
    fetch(db_url+"/games?team_name="+this.state.team+"&versus="+this.state.away+"&_sort=date")
    .then(resp => resp.json())
    .then (data => {
      console.log(data)

      if (data.length) {
      let possessions = data[0].possessions
      let date = data[0].date
      let id = data[0].id
      console.log(possessions)

      this.setState({play: possessions, date:date, game_id:id})
      }

    })

  }

  componentDidMount(){   
    this.fetch_players()
    this.fetch_plays()
   
  }

  pushPlaytoDB() {
    let team_name = this.state.team
    let versus = this.state.away
    let possessions = this.state.play.slice()
    let date = this.state.date
    let id = this.state.game_id
    console.log(possessions)
    if (id) {
      fetch(db_url+"/games/"+id, {
        method: 'PUT',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({team_name, versus, date, possessions})
      })
      console.log('updated plays!')

    }

    else {
      fetch(db_url+"/games/", {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({team_name, versus, date, possessions})
      })
      console.log('pushed plays!')

    }
  }
  
  renderPlays() {
    let plays = this.state.play.slice()
    return plays.reverse().map((member) =>
        <Possession play={member}></Possession>
   )
  }

  handleAction(props) {
    console.log(props)
    let currList = this.state.passes.slice()
    let currPlays = this.state.play.slice()
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

    this.pushPlaytoDB();

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


  render() {

    const femaleMembers = this.state.females.map((player) =>
    <PlayerButton player ={player} onClick={this.handlePlayerClick}></PlayerButton>
    )

    const maleMembers = this.state.males.map((player) =>
    <PlayerButton player ={player}  onClick={this.handlePlayerClick}></PlayerButton>
    )
    
    const buttonActions = actions.map((action) =>
    <Box m={1}>
      <Button onClick={() => this.handleAction({action})} fullWidth id={action}>{action}</Button>
    </Box>
    )
    
    
    var timestamp = Date.parse(this.state.date)
    var readableDate = new Date(timestamp).toDateString()
    
  return (
    <div className="App">
      <Box m={1}>      
      {this.renderRosterAdmin()}
      </Box>
      <Box>
      game vs {this.state.away} on {readableDate}
      </Box>
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

      <Box m={1}>
      <ButtonGroup 
          size="medium" 
        style={{
        border: "none",
      }}
      >
        {buttonActions}
      </ButtonGroup>
      </Box>
      </Container>

      <Container>
      <ButtonGroup 
      orientation="vertical" 
      size='large' 
      variant="contained" 
      style={{
        border: "solid",
        minWidth: "48%",
      }}>
        {femaleMembers}
      </ButtonGroup>
      <ButtonGroup 
      orientation="vertical" 
      size='large' 
      variant="contained" 
      style={{
        border: "solid",
        minWidth: "48%",
      }}>
        {maleMembers}
      </ButtonGroup>
      </Container>
      <Container>

      <Possession play={this.state.passes}></Possession>
      {this.renderPlays()}

      </Container>

      <Container>
      <GameSummary m_players = {this.state.males} f_players = {this.state.females} possessions={this.state.play}></GameSummary> 

      </Container>


    </div>
  );
  }
}


export default App;
