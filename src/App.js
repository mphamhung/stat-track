import './App.css';
import {Alert, Button, ButtonGroup, Container, Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'


const db_url = "https://stat-track-db.herokuapp.com"

const actions = ['G', 'TA', "D", "Undo"];

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
]

function DisplayPlay(props) {
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
  else {
    return (
      <Alert severity='info'>{text}</Alert>
    )
  }
}

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
    this.handleTextField = this.handleTextField.bind(this);
    this.handleGender = this.handleGender.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleTextField(e) {
    this.setState({inputName: e.target.value})
  }

  handleGender(e) {
    this.setState({inputGender: e.target.value})
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
            onChange = {this.handleTextField}
            name="name"
          />
          <select
          value = {this.state.inputGender}
          onChange ={this.handleGender}>
            <option value = 'M'>M</option>
            <option value = 'F'>F</option>
          </select>
          <button variant='contained' name='new'>New</button>
          <button variant='contained' name='del'>Remove</button>
          <button variant='contained' name='pop'>Populate</button>
        </form>
      </div>
      )
  }
  
  fetch_players() {
    fetch(db_url+"/players?gender=M")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return (player.name)
      }
      )
      this.setState({males:players})
    })
    fetch(db_url+"/players?gender=F")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return (player.name)
      }
      )
      this.setState({females:players})
    })
  }

  componentDidMount(){   
    this.fetch_players()
  }
  renderPlays() {
    return this.state.play.reverse().map((member) =>
    <DisplayPlay play={member}></DisplayPlay>
   )
  }


  buttonClicked(props) {
    console.log(props)
    let currList = this.state.passes.slice()
    currList.push(props.name)
    this.setState({
      passes: currList
    })
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
    }

    else if (currList.length > 0 && props.action === "Undo") {
      currList.pop()
      this.setState({
        passes:currList
      })
    }

    else if (currList.length === 0 && props.action === "Undo" && this.state.play.length >0) {
      currList = currPlays.pop()
      console.log(currPlays)
      this.setState({
        play:currPlays,
        passes:currList
      })
    }

    else if (props.action === "D" && currList.length === 1 ){
    currList.push(props.action)
    currPlays.push(currList)
    this.setState({
      play: currPlays,
      passes:[]
    })

    }
    
  }


  render() {

    
    const padding = 0.3
    
    const femaleMembers = this.state.females.map((name) =>
    <Box m={padding}>
      <Button onClick={() => this.buttonClicked({name})} variant="contained" fullWidth color='secondary'>{name}</Button>
    </Box>
    )

    const maleMembers = this.state.males.map((name) =>
    <Box m={padding}>
      <Button onClick={() => this.buttonClicked({name})} variant="contained" fullWidth color='primary'>{name}</Button>
      </Box>

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
      <ButtonGroup 
        
        size="large" 
        style={{
        border: "none",
        minWidth: "48%",
      }}
      >
        {buttonActions}
      </ButtonGroup>
      </Box>
      </Container>
      <Container
   >
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
      <DisplayPlay play={this.state.passes}></DisplayPlay>

      {this.renderPlays()}

      </Container>

    </div>
  );
  }
}


export default App;
