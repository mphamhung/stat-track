import { useEffect, useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom";
import {Typography ,Stack} from '@mui/material';

import { Container } from "@mui/system";

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

 export default function TeamPage(props) {
    const [searchParams] = useSearchParams() 

    const id = searchParams.get('id')
    const [gameList, setGameList] = useState([])
    const [hasFetched, setHasFetched] = useState(false)

    const navigate  = useNavigate ();

    // const [possessions, setPossessions] = useState([])
    // const [line, setLine] = useState([]) 

    // const [hasFetched, setHasFetched] = useState(false)
    // const [adminGames, setAdminGames] = useState([])

    useEffect( () => {
        fetch(db_url+"/teams/"+id)
        .then(resp => resp.json())
        .then(data => data.team_name)
        .then( team_name => {
        fetch(db_url+"/games/")
        .then(resp => resp.json())
        .then( data => {
            let i = 0
            let games = data.filter(game => (game.team_name === team_name && game.versus !== 'default')).map(game => {
                let query = "?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID
                i += 1
                    return (
                        <Stack direction='row' 
                        justifyItems='space-between' 
                        style={{backgroundColor: i%2 ? '#EEEEEE': 'white',
                        maxHeight:"50px", minHeight:"50px"}} 
                        onClick={( ) => navigate('summary/'+query)}
                        >
            
                            <Typography style={{maxWidth:"80px", minWidth:"80px", maxHeight:"60px", minHeight:"60px",
                                }}>
                            {game.date.split("-")[0]} {game.date.split("-")[1]}
                            </Typography>
                            <Stack direction="column" style={{maxWidth:"60%", minWidth:"60%", maxHeight:"60px", minHeight:"60px",
                                textDecoration: "underline"}}>
                                <Typography>
                                    {game.team_name}
                                </Typography>
                                <Typography>
                                    {game.versus}  
                                </Typography>
                            </Stack>

                            <Typography style={{maxWidth:"80px", minWidth:"80px", maxHeight:"60px", minHeight:"60px",
                                }}>
                                {game.uID}  
                            </Typography>
                            
                        </Stack>
                    )
    

            })


            setGameList(games)
            setHasFetched(true)
            }
        )
        }
        )
      }, [id, navigate])


      return(
        <Container>
            <Typography>
                <h4>Load Previous Games</h4>
            </Typography>
            <Stack direction='row' 
                        justifyItems='space-between' 
                        style={{backgroundColor:  '#D9D9D9',
                        maxHeight:"50px", minHeight:"50px"}} 
                        >
         
                            <Typography style={{maxWidth:"80px", minWidth:"80px", maxHeight:"60px", minHeight:"60px",
                                }}>
                            Date
                            </Typography>
       
                            <Typography style={{maxWidth:"60%", minWidth:"60%", maxHeight:"60px", minHeight:"60px",
                                }}>
                                Teams
                            </Typography>
            

                            <Typography style={{maxWidth:"80px", minWidth:"80px", maxHeight:"60px", minHeight:"60px",
                                }}>
                                Game  
                            </Typography>
                            
                        </Stack>
        {hasFetched && gameList} 
        {!hasFetched && <p>Fetching games list</p>}
        </Container>
      )
 }
 