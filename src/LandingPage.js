import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import {TextField, Button,  ButtonGroup, ListItemButton} from '@mui/material';
import { Container } from "@mui/system";

import {AddBox} from "@mui/icons-material"
const db_url = "https://polydactyl-truthful-hyena.glitch.me"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];




function LandingPage(props) {
    const date = new Date()
    const dateId = months[date.getMonth()]+ '-'+ date.getDate() + '-' + date.getFullYear()
    const [home, setHome] = useState("What the Huck?");
    const [away, setAway] = useState("default");

    const [gameList, setGameList] = useState('')
    const [uID, setUID] = useState(0)

    const [hasFetched, setHasFetched] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        let query = "?home="+home+"&versus="+away
        fetch(db_url+ "/games/" +query)
        .then(resp => resp.json())
        .then(data => {
            setUID(data.length+1)
        })

    }
    function fetchGames() {
        return fetch(db_url+"/games")
        .then(resp => resp.json())
        .then( data => {
            let gameList = data.map(game => {
                let query = "?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID

                return <ListItemButton key={"?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID}>
                    <Link to={{
                    pathname:"/game/"+query,
                    }}
                    >
                    {game.team_name}  versus {game.versus}  game {game.uID} on {game.date}</Link>
                </ListItemButton>
                    
                    
            })
            // console.log(gameList)
            setGameList(gameList)
            setHasFetched(true)
    
        }
    
        )
      }

      
    function createGame() {
        let team_name = home
        let versus = away
        let possessions = []
        let date = dateId
        return fetch(db_url+"/games/", {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({team_name, versus, date, possessions, uID})
            })
    }


    useEffect( () => {
        fetchGames()
    }, [])

    return (
        <div>
        
        <Container>
        <h1> Create a New Game </h1>
            <ButtonGroup>
                <TextField 
                variant="standard"
                label="Home Team"
                title='Home'
                name="awayTeam"
                type='text'
                value={home}
                onChange={e => setHome(e.target.value)}
                padding={1}
            />
            <TextField
                variant="standard"
                name="awayTeam"
                type='text'
                label='Away Team'
                value={away}
                onChange={e => setAway(e.target.value)}
            />
            <Button size='small' color='primary'>                
                <AddBox fontSize='large' name='new' onClick={e => handleSubmit(e)}></AddBox>
            </Button>
            </ButtonGroup>
            {uID ? 
                <ListItemButton color="primary" key='gameid'>
                <Link to={{
                pathname:"/game/?home="+home+"&versus="+away+"&date="+dateId+"&uID="+uID,
                }}
                onClick={e => createGame()}
                >
                Go to new game ({home} vs {away} {uID})</Link>
                </ListItemButton> : <p></p>
            }
        </Container>
            
        <Container>
        <h1> Previous Games: </h1>
        {hasFetched && gameList} 
        {!hasFetched && <p>Fetching games list</p>}
        </Container>

        </div>

    )
}

export default LandingPage;