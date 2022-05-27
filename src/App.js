import logo from './logo.svg';
import './App.css';
import Button from '@mui/material/Button';


const plays = []
var passList = []

function buttonClicked(name) {
  // alert('Hello', {name})
  if (passList.length == 0 && (name.member == 'Goal' || name.member == 'Throwaway' )) {
  
  }
  else if (passList[passList.length - 1] != name.member) {
  passList.push(name.member)
  }

  
  if (passList[passList.length - 1] == 'Goal' || name.member == 'Throwaway' ){
    plays.push(passList)
    console.log(plays)

    passList = []
  }
  else {
    console.log(passList)
  }
  
  // passList.append()
}


const members = ['Michael', 'Marco', 'Nancy', 'Goal', 'Throwaway', "D"];

const buttonMembers = members.map((member) =>
  <Button onClick={() => buttonClicked({member})}>{member}</Button>
)

function App() {
  return (
    <div className="App">
      <header className="App-header">

        {buttonMembers}


      </header>
    </div>
  );
}

export default App;
