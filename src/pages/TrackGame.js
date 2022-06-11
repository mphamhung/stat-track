import '../App.css';
import {Button, ButtonGroup, Container, Box} from '@mui/material';

import Possession from '../components/Possession'
import PlayerButton from '../components/PlayerButton';
import ScoreBoard from '../components/ScoreBoard'
import GameSummary from '../components/GameSummary'
import RosterAdmin from "../components/RosterAdmin";

// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'
import { useParams, useSearchParams } from 'react-router-dom';

const db_url = "https://stat-track-db.herokuapp.com"

const actions = ["D", 'TA',  "Drop", "Undo"];

function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class TrackGame extends React.Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.player_list = props.player_list
    this.state = {
      team: props.team_name,
      game_id: props.game_id,
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
  
  componentDidMount(){   
    this.fetch_players()
    console.log(this.props.params)
    console.log(this.props.location)
    var possesions = sessionStorage.getItem("possesions")
    // console.log(JSON.parse(possesions))
    if (possesions !== null) {
      this.setState(
        {play: JSON.parse(possesions)}
        )
    }
    

    
  }

  handleChange(e) {
    this.setState({[e.target.name]: e.target.value})
  }


  delete_player(name, gender) {
    // console.log(db_url+"/players?name="+name+"&gender="+gender)
    fetch(db_url+"/players?name="+name+"&gender="+gender)
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
  add_player(name, gender, team_name) {
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

    this.add_player(this.state.inputName, this.state.inputGender, this.state.team)
    }

    else if (e.nativeEvent.submitter.name === 'del_plays') {
      console.log('delete plays!')
      this.setState(
        {play: []}
        )
    
      sessionStorage.setItem("possesions", JSON.stringify([]));
    }
    else if (e.nativeEvent.submitter.name === 'push_plays') {
      console.log('pushed plays!')
      const name = this.state.team

      const plays = this.state.play.slice()
      const date = new Date().toDateString()
      fetch(db_url+"/games", {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({name, plays, date})
      }).then(() => {
        this.fetch_players()
      })     
    }

    else if (e.nativeEvent.submitter.name === 'pop') {
      console.log(this.player_list)
    fetch(db_url+"/players?team_name="+this.state.team)
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
      if (!data.length) {
        this.player_list.map((player) => {
         return this.add_player(player.name,player.gender, this.state.team)
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
          <button variant='contained' name='push_plays'>Push Plays</button>

        </form>
      </div>
      )
  }
  
  fetch_players() {
    console.log('hello')
    // console.log(db_url+"/players?gender=M&_sort=name&team="+this.state.team)
    fetch(db_url+"/players?gender=M&_sort=name&team_name="+this.state.team)
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

    sessionStorage.setItem("possesions", JSON.stringify(currPlays));
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
      <Button onClick={() => this.handleAction({action})} fullWidth>{action}</Button>
    </Box>
    )
    
    
 
  return (
    <div className="App">
      <Box m={1}>      
      <RosterAdmin function={this.fetch_players}/>
      </Box>
      <Container>

      <ButtonGroup >
      <Box m={1}>
      <Button onClick={() => this.handleAction({action:"G"})} fullWidth>G</Button>
      </Box>
      <Box m={1}>
      <ScoreBoard plays={this.state.play}></ScoreBoard>
      </Box>

      <Box m={1}>
      <Button onClick={() => this.handleAction({action:"AG"})} fullWidth>AG</Button>
      </Box>
      </ButtonGroup>
      </Container>

      <Container>
      <ButtonGroup 
        
        size="medium" 
        style={{
        border: "none",
      }}
      >
        {buttonActions}
      </ButtonGroup>
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


export default withParams(TrackGame);
