import './App.css';
import {Alert, Button, ButtonGroup, Container, Box} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

  const plays = []
  var passList = []


function DisplayPlay(props) {
  let text = props.play.join(' => ')
  
  if (props.play[props.play.length - 1] === 'Goal')
    return (
      <Alert severity='success'>{text}</Alert>
    )
  else {
    return (
      <Alert severity='error'>{text}</Alert>
    )
  }
}


const NewPlayer = () => {
  const [name, setName] = React.useState('')
  const [gender, setGender] = React.useState('M')

  const handleSubmit = (e) => {
    e.preventDefault();    
    const newplayer = {name, gender}

    if (e.nativeEvent.submitter.name === 'del') {
      // console.log("https://stat-track-db.herokuapp.com/players?name="+name)
      fetch("https://stat-track-db.herokuapp.com/players/"+name, {
      method: 'DELETE',
    }).then(() => {
      console.log('player deleted')
    })
    }

    else if (e.nativeEvent.submitter.name === 'new') {
      fetch("https://stat-track-db.herokuapp.com/players", {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(newplayer)
      }).then(() => {
        console.log('new player added')
      })
    }
    else  {
  
  }

  }

  return (
    <div>
      <form
      onSubmit={handleSubmit}>
        <input
          type = 'text'
          value={name}
          onChange = {(e)=> setName(e.target.value)}
        />
        <select
        value = {gender}
        onChange ={(e) => setGender(e.target.value)}>
          <option value = 'M'>M</option>
          <option value = 'F'>F</option>
        </select>
        <button name='new'>New Player</button>
        <button name='del'>Delete Player</button>
      </form>
    </div>
    )
  }



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passes : [],
      play: [],
      posts: [],
      males: [],
      females: []
    }
  }

  componentDidMount(){

    fetch("https://stat-track-db.herokuapp.com/players?gender=M")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return (player.name)
      }
      )
      this.setState({males:players})
    })
    fetch("https://stat-track-db.herokuapp.com/players?gender=F")
    .then(resp => resp.json())
    .then (data => {
      let players = data.map((player) => {
        return (player.name)
      }
      )
      this.setState({females:players})
    })
  }

  renderPlays() {
    return this.state.play.map((member) =>
    <DisplayPlay play={member}></DisplayPlay>
   )
  }

  handlePlayerClick(props) {
    if (passList[passList.length - 1] !== props.member) {
      passList.push(props.member)
      }
  }
  buttonClicked(name) {
    // alert('Hello', {name})
    if (passList.length === 0 && (name.member === 'Goal' || name.member === 'Throwaway' )) {
    
    }
    else if (passList.length > 0 && (name.member === 'D')) {
    
    }
    else if (passList[passList.length - 1] !== name.member) {
    passList.push(name.member)
    }
  
    
    if (passList.length > 0 && (passList[passList.length - 1] === 'Goal' || name.member === 'Throwaway' )){
      plays.push(passList)
      console.log(plays)
      passList = []
    }
    else {
      console.log(this.state)
    }

    this.setState({
      play: plays,
    })
    
  }



  render() {
    const actions = ['Goal', 'Throwaway', "D"];
  
    const femaleMembers = this.state.females.map((member) =>
    <Box pt={3} m={1}>
      <Button onClick={() => this.buttonClicked({member})} variant="contained" fullWidth color='secondary'>{member}</Button>
    </Box>
    )
    const maleMembers = this.state.males.map((member) =>
    <Box pt={3} m={1}>
      <Button onClick={() => this.buttonClicked({member})} variant="contained" fullWidth color='primary'>{member}</Button>
      </Box>

    )
    
    const buttonActions = actions.map((member) =>
    <Button onClick={() => this.buttonClicked({member})}>{member}</Button>
    )
    
    
 
  return (
    <div className="App">
      <NewPlayer></NewPlayer>
      <Container>
      <ButtonGroup size="large" aria-label="text button group">
        {buttonActions}
      </ButtonGroup>
      </Container>
      <Container>
      <ButtonGroup orientation="vertical" size='medium' variant="contained" aria-label="outlined primary button group">
        {femaleMembers}
      </ButtonGroup>
      <ButtonGroup orientation="vertical" size='medium' variant="contained" aria-label="outlined primary button group">
        {maleMembers}
      </ButtonGroup>
      </Container>
      <Container>
      {this.renderPlays()}

      </Container>

    </div>
  );
  }
}


// function App(props) {


//   return (
//     <div className="App">
//       <header className="App-header">
//       <ButtonGroup size="large" aria-label="text button group">
//         {buttonActions}
//       </ButtonGroup>
//       <ButtonGroup orientation="vertical" size='medium' variant="contained" aria-label="outlined primary button group">
//         {buttonMembers}
//       </ButtonGroup>


//       </header>
//       {displayPlays}
//     </div>
//   );
// }

export default App;
