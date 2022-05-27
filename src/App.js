import './App.css';
import {Alert, Button, ButtonGroup, Container} from '@mui/material';
// import ButtonGroup from '@mui/material/ButtonGroup';
// import Alert from '@mui/material/Alert';
import React from 'react'

  const plays = []
  var passList = []


function DisplayPlay(props) {
  if (props.play[props.play.length - 1] ==='Goal')
    return (
      <Alert severity='success'>{props.play}</Alert>
    )
  else {
    return (
      <Alert severity='error'>{props.play}</Alert>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passes : [],
      play: [],
    }
  }


  renderPlays() {
    return this.state.play.map((member) =>
    <DisplayPlay play={member}>{member}</DisplayPlay>
   )
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
    const members = ['Michael', 'Marco', 'Nancy'];
    const actions = ['Goal', 'Throwaway', "D"];
  
    const buttonMembers = members.map((member) =>
      <Button onClick={() => this.buttonClicked({member})}>{member}</Button>
    )
    
    const buttonActions = actions.map((member) =>
    <Button onClick={() => this.buttonClicked({member})}>{member}</Button>
    )
    
    
 
  return (
    <div className="App">
      <Container>
      <ButtonGroup size="large" aria-label="text button group">
        {buttonActions}
      </ButtonGroup>
      <ButtonGroup orientation="vertical" size='medium' variant="contained" aria-label="outlined primary button group">
        {buttonMembers}
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
