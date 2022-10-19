
import RosterButton from './RosterButton'
import {ButtonGroup, Container, Button, Paper, Stack, Typography, Divider, TextField, ToggleButton, ToggleButtonGroup} from '@mui/material'
import { useEffect,useState,useRef} from "react"
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';


const db_url = "https://polydactyl-truthful-hyena.glitch.me"

export default function Roster(props) {

    let team = props.team
    let onClick = props.onClick
    let onSaveClick = props.onSaveClick
    
    let line = props.line

    const [newPlayer, setNewPlayer] = useState(false)

    const [name, setName] = useState("")
    const [gender, setGender] = useState("M")
    const [males, setMales] = useState([])
    const [females,setFemales] = useState([])

    const [hasFetched, setHasFetched] = useState(false)

    const [editMode, setEditMode] = useState(false)
    // const handleSubmit = (e) => {
    const [allSelected, setAllSelected] = useState(false)

    const test = useRef(false);

    const handleEditClick = (props) => {
      // let name = props.name
      let id = props.id
      // let gender = props.gender
      fetch(db_url+"/players/"+id, {
        method: 'DELETE',
      }).then(resp => {

        if (resp.ok) {
          if (props.gender === "M") {
            let malesTmp = males.slice().filter(player => player.id !== id)
            setMales(malesTmp)
          }
          else if (props.gender === "F") {
            let femalesTmp = females.slice().filter(player => player.id !== id)
            setFemales(femalesTmp)
          }
        }
      }

      )

    }

    const onClearClick = (props) => {
      setAllSelected(false)
      let temp = males.slice()
      for (let i=0; i< temp.length; i++) {
              temp[i].status = false
      }
      setMales(temp)
      temp = females.slice()
      for (let i=0; i< temp.length; i++) {
              temp[i].status = false
      }
      setFemales(temp)
      onClick(males, females)
    }

    const onSelectAllClick = (props) => {
      setAllSelected(true)
      let temp = males.slice()
      for (let i=0; i< temp.length; i++) {
              temp[i].status = true
      }
      setMales(temp)
      temp = females.slice()
      for (let i=0; i< temp.length; i++) {
              temp[i].status = true
      }
      setFemales(temp)
      onClick(males, females)
    }


    const onSaveClick_ = (props) => {
      onSaveClick(props)
    }

    const handlePlayerClick = (props) => {
        // console.log(props)
        if (!editMode) {
        setAllSelected(false)
        if (props.gender === "M") {
            let temp = males.slice()
            for (let i=0; i< temp.length; i++) {
                if (temp[i].name === props.name) {
                    temp[i].status = !temp[i].status
                }
            }
            setMales(temp)
        }
        else if (props.gender === "F") {
            let temp = females.slice()
            for (let i=0; i< temp.length; i++) {
                if (temp[i].name === props.name) {
                    temp[i].status = !temp[i].status
                }
            }
            setFemales(temp)
        }
        // line.push(props.name)
        onClick(males, females)
      }

      else {
        // console.log(props)
        handleEditClick(props)
      }
    }

  
    useEffect( () => {
      fetch(db_url+"/players?gender=M&team_name="+team+"&_sort=name")
      .then(resp => resp.json())
      .then (data => {
        let players = data.map((player) => {

        let status = false
          for (let i=0; i< line.length; i++) {
            if (line[i].name === player.name) {
                status = true
            }
        }
          return  {name:player.name, gender:player.gender, id: player.id, status: status}
        }
        )
        setMales(players)
      })
      fetch(db_url+"/players?gender=F&_sort=name&team_name="+team)
      .then(resp => resp.json())
      .then (data => {
        let players = data.map((player) => {
          let status = false
          for (let i=0; i< line.length; i++) {
            if (line[i].name === player.name) {
                status = true
            }
        }

          return {name:player.name, gender:player.gender, id: player.id, status: status}
        }
        )
        setFemales(players)
      })
    }, [line, team])


    useEffect( () => {
        if (males.length>0 && females.length>0) {
            setHasFetched(true)
        }

    }, [males, females])


    const handleSubmit = (props) => {
        let team_name = team

        if (name && gender) {     
          fetch(db_url+"/players", {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({name, gender, team_name})
          }).then(resp => {
            console.log(resp)
            test.current = !test.current
          }).finally(resp => {
            fetch(db_url+"/players?gender=M&team_name="+team+"&_sort=name")
      .then(resp => resp.json())
      .then (data => {
        let players = data.map((player) => {

        let status = false
          for (let i=0; i< line.length; i++) {
            if (line[i].name === player.name) {
                status = true
            }
        }
          return  {name:player.name, gender:player.gender, id: player.id, status: status}
        }
        )
        setMales(players)
      })
      fetch(db_url+"/players?gender=F&_sort=name&team_name="+team)
      .then(resp => resp.json())
      .then (data => {
        let players = data.map((player) => {
          let status = false
          for (let i=0; i< line.length; i++) {
            if (line[i].name === player.name) {
                status = true
            }
        }

          return {name:player.name, gender:player.gender, id: player.id, status: status}
        }
        )
        setFemales(players)
      })
          })
        }
      
    }
    return (
      <Paper>
          <Container>
            <Stack mt={2} mb={2} direction='row' spacing={10}>
            <Typography>
              Add Players:
            </Typography>
            
            {
              allSelected ?
              <Typography onClick={() => onClearClick()} style={{textDecoration: "underline"}}>
              Deselect All
            </Typography>
              :
              <Typography onClick={() => onSelectAllClick()} style={{textDecoration: "underline"}}>
              Select All
            </Typography>
            }
            
            </Stack>

             </Container>

          {hasFetched ? 
            <div>
              <Container>
              <Stack direction='row' justifyContent="space-around">
              <Stack direction='row' justifyContent="space-evenly" 
              >
              <Typography>
                Female: 
              </Typography>
              <Paper style={{backgroundColor: '#6200EE', color:'white',
                                    width: '28px', height:'20px', display:'flex', borderRadius:'40%',
                                    alignItems: 'center', justifyContent: 'center',}}>
              {females.map((player)=> player.status ? 1:0).reduce((r,i) => r+i)}
              </Paper>
              </Stack>
              <Stack direction='row' justifyContent="space-evenly" 
              >
              <Typography>
                Male: 
              </Typography>
              <Paper style={{backgroundColor: '#6200EE', color:'white',
                                    width: '28px', height:'20px', display:'flex', borderRadius:'40%',
                                    alignItems: 'center', justifyContent: 'center',}}>
              {males.map((player)=> player.status ? 1:0).reduce((r,i) => r+i)}
              </Paper>
              </Stack>
              </Stack>
              </Container>

            <Container style={{
              minHeight:"400px", maxHeight:"500px",overflow:'auto'
            }}>
            <ButtonGroup 
            orientation="vertical" 
            size='large' 
            style={{
              minWidth: "48%",
            }}>
              
              {females.map((player) =>
            <RosterButton player ={player}  editMode={editMode} onClick={handlePlayerClick}></RosterButton>
            )}
            {/* {females.map((player)=> player.status ? 1:0).reduce((r,i) => r+i)} females on */}
            </ButtonGroup>
            <ButtonGroup 
            orientation="vertical" 
            size='large' 
            style={{
              minWidth: "48%",
            }}>
              
              {males.map((player) =>
            <RosterButton player ={player}  editMode={editMode} onClick={handlePlayerClick}></RosterButton>
            )}

            </ButtonGroup>


     
            </Container>     
            </div>

            :   ''} 
              
            <Divider/>
            {
              !newPlayer ?
              <Container >
              <Stack direction='row' mb={2} mt={2} onClick={() => setNewPlayer(!newPlayer)}> 
              <AddIcon/>
                <Typography>
                  Add a new player
                </Typography>
              </Stack> 
              </Container>
                :
                <Container>
                <Stack direction='row' mb={2} mt={2} onClick={() => setNewPlayer(!newPlayer)}>
                <RemoveIcon/>
                <Typography>
                  New player
                </Typography>
              </Stack> 
              <Stack direction='row' mb={2} mt={2}>
                <TextField style={{width:"60%"}} value={name} onChange={(e) => setName(e.target.value)}>
                </TextField>
                <ToggleButtonGroup
                  value={gender}
                  exclusive
                  onChange={(e, g) => setGender(g)}
                  aria-label="text alignment"
                >
                  <ToggleButton value="M" aria-label="left aligned">
                    <Typography>
                      M
                      </Typography>
                  </ToggleButton>
                  <ToggleButton value="F" aria-label="centered">
                  <Typography>
                      F
                      </Typography>                  
                    </ToggleButton>
                </ToggleButtonGroup>

                <Button onClick={(e) => handleSubmit(e)}>
                <CheckIcon/>
                </Button>
              </Stack>
              </Container>
            }
            

            
            <Divider/>
            

          <Container>
          <Stack direction='row' justifyContent='space-evenly' mb={2} mt={2}>
          <Button variant='contained' onClick={() => onSaveClick_()}
          style={{backgroundColor: '#6200EE', color:'white',
          width: '140px', height:'40px', display:'flex',
          alignItems: 'center', justifyContent: 'center',}}
          > 
          Save
          </Button>
          <Button onClick={() => setEditMode(!editMode)}
          style={{backgroundColor: editMode ? 'red': 'white', color:editMode? 'white': 'black',
          width: '140px', height:'40px', display:'flex',
          alignItems: 'center', justifyContent: 'center',}}
          > 
          Edit
          </Button>
          </Stack>
        
            </Container>  

      </Paper>



    )
}