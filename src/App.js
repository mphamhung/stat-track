import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';


const plays = []
var passList = []

function buttonClicked(name) {
  // alert('Hello', {name})
  if (passList.length == 0 && (name.member == 'Goal' || name.member == 'Throwaway' )) {
  
  }
  if (passList.length > 0 && (name.member == 'D')) {
  
  }
  else if (passList[passList.length - 1] != name.member) {
  passList.push(name.member)
  }

  
  if (passList[passList.length - 1] == 'Goal' || name.member == 'Throwaway' ){
    plays.push(passList)
    console.log(plays)
    alert(plays)
    passList = []
  }
  else {
    console.log(passList)
  }
  
  // passList.append()
}


const members = ['Michael', 'Marco', 'Nancy'];
const actions = ['Goal', 'Throwaway', "D"];
const buttonMembers = members.map((member) =>
  <Button onClick={() => buttonClicked({member})}>{member}</Button>
)

const buttonActions = actions.map((member) =>
<Button onClick={() => buttonClicked({member})}>{member}</Button>
)

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <ButtonGroup orientation="vertical" size='medium' variant="contained" aria-label="outlined primary button group">
        {buttonMembers}
        </ButtonGroup>
        <ButtonGroup size="large" aria-label="text button group">
        {buttonActions}
        </ButtonGroup>

      </header>
    </div>
  );
}

export default App;
