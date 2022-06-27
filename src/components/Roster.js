
import RosterButton from './RosterButton'
import {ButtonGroup, Container, Button} from '@mui/material'
import { useEffect,useState} from "react"


const db_url = "https://polydactyl-truthful-hyena.glitch.me"

export default function Roster(props) {

    let team = props.team
    let onClick = props.onClick
    let onSaveClick = props.onSaveClick
    let line = props.line


    const [males,setMales] = useState([])
    const [females,setFemales] = useState([])

    const [hasFetched, setHasFetched] = useState(false)
    // const handleSubmit = (e) => {

    const onClearClick = (props) => {

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
      
    const onSaveClick_ = (props) => {
      onSaveClick(props)
    }
    const handlePlayerClick = (props) => {
        console.log(props)

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


    return (
        <div>

            {hasFetched ? 
            <Container>
            <ButtonGroup 
            orientation="vertical" 
            size='large' 
            style={{
              minWidth: "48%",
            }}>
              {females.map((player) =>
            <RosterButton player ={player}  onClick={handlePlayerClick}></RosterButton>
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
            <RosterButton player ={player}  onClick={handlePlayerClick}></RosterButton>
            )}
            {/* {males.map((player)=> player.status ? 1:0).reduce((r,i) => r+i)} males on */}

            </ButtonGroup>
            <Button color='secondary' onClick={() => onClearClick()}> Clear</Button>
            <Button variant='contained' onClick={() => onSaveClick_()}> Save</Button>
            
     
            </Container>         
            :   ''} 
            

        </div>


    )
}