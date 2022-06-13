
import PlayerButton from './PlayerButton'
import {ButtonGroup} from '@mui/material'
import { useEffect} from "react"


export default function Roster(props) {

    let male_players = props.males
    let female_players = props.females
    // let onClick = props.onClick

    let statuses = new Map(
        male_players.map((player) => {
           return [player.name,false]
        }).concat(
            female_players.map((player) => {
            return [player.name,false]
        }))
    )
    // function handleClick()
    useEffect( () => {
        
    }, [])


    const handleClick = (props) => {
        // statuses.get(props.name)
        console.log(props)
        // statuses.set(props.name, !statuses.get(props.name))
       
        console.log(statuses)

    }


    const femaleMembers = (props.females) ? <ButtonGroup 
    orientation="vertical" 
    size='large' 
    variant="contained" 
    style={{
        border: "solid",
        minWidth: "48%",
    }}>
        { female_players.map((player) =>
    <PlayerButton player ={player} onClick={handleClick}></PlayerButton>
    )}
    </ButtonGroup> : []

    const maleMembers =   (props.males) ? <ButtonGroup 
    orientation="vertical" 
    size='large' 
    variant="contained" 
    style={{
        border: "solid",
        minWidth: "48%",
    }}>
        { male_players.map((player) =>
    <PlayerButton player ={player} onClick={handleClick}></PlayerButton>
    )}
    </ButtonGroup> : []

    return (
        <div>
            {femaleMembers}
            {maleMembers}
        </div>


    )
}