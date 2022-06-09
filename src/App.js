import './App.css';
import {Button, ButtonGroup, Container, Box} from '@mui/material';

import Possession from './components/Possession'
import PlayerButton from './components/PlayerButton';
import ScoreBoard from './components/ScoreBoard'
import GameSummary from './components/GameSummary'

// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

const db_url = "https://stat-track-db.herokuapp.com"

const actions = ['G', 'TA', "D", "Undo", "AG"];
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    console.log(db_url+"/players?name="+name+"&gender="+gender)
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
  add_player(name, gender) {
    if (name) {     
      fetch(db_url+"/players", {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({name, gender})
      }).then(() => {
        this.fetch_players()
      }) 
    }
  }

  del_plays() {

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
      this.setState(
        {play: []}
        )
    
      sessionStorage.setItem("possesions", JSON.stringify([]));
    }
    else if (e.nativeEvent.submitter.name === 'pop') {
    fetch(db_url+"/players")
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
    fetch(db_url+"/players?gender=M&_sort=name")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return  {name:player.name, gender:player.gender, id: player.id, status: false}
      }
      )
      this.setState({males:players})
    })
    fetch(db_url+"/players?gender=F&_sort=name")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return {name:player.name, gender:player.gender, id: player.id, status: false}
      }
      )
      this.setState({females:players})
    })
  }

  componentDidMount(){   
    this.fetch_players()
    var possesions = sessionStorage.getItem("possesions")
    // console.log(JSON.parse(possesions))
    if (possesions !== null) {
      this.setState(
        {play: JSON.parse(possesions)}
        )
    }
    

    
  }
  
  renderPlays() {
    let plays = this.state.play.slice()
    return plays.reverse().map((member) =>
        <Possession play={member}></Possession>
   )
  }

  handleAction(props) {
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
      {this.renderRosterAdmin()}
      </Box>
      <Container>
      <Box m={1}>
      <ButtonGroup >

      <ScoreBoard plays={this.state.play}></ScoreBoard>

      </ButtonGroup>


      <ButtonGroup 
        
        size="medium" 
        style={{
        border: "none",
        minWidth: "45%",
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
