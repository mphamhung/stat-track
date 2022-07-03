import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import {ListItemButton} from '@mui/material';
import { Container } from "@mui/system";

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

 export default function AdminPage(props) {

    const [hasFetched, setHasFetched] = useState(false)
    const [adminGames, setAdminGames] = useState([])

    useEffect( () => {
        fetchGames()
    }, [])

    function fetchGames() {
        return fetch(db_url+"/games")
        .then(resp => resp.json())
        .then( data => {  
            let adminList  = data.filter(game => game.versus === 'default').map(game => {
                let query = "?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID
                
                    return <ListItemButton key={"?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID}>
                    <Link to={{
                    pathname:"/summary/"+query,
                    }}
                    >
                    {game.team_name}  versus {game.versus}  game {game.uID} on {game.date}</Link>
                    </ListItemButton>
            })
            
            // console.log(gameList)
            setAdminGames(adminList)
    
            setHasFetched(true)
    
        }
    
        )
      }
      return(
        <Container>

        {hasFetched && adminGames}
        </Container>
      )
 }
 