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
    const [playerList, setPlayerList] = useState([])
    const navigate  = useNavigate ();
    
    useEffect( () => {
        fetch(db_url+"/teams/"+id)
        .then(resp => resp.json())
        .then(data => data.team_name)
        .then( team_name => {
        fetch(db_url+"/players?team_name="+team_name)
        .then(resp => resp.json())
        .then( data => {
            setPlayerList(data)
        })

        fetch(db_url+"/games/")
        .then(resp => resp.json())
        .then( data => {
            let i = 0
            let games = data.reverse().filter(game => (game.team_name === team_name && game.versus !== 'default' && game.possessions.length>1)).map(game => {
                let query = "?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID
                let plays = game.possessions.slice()
                let home = plays.reduce((total, play) => {
                    let toAdd = (play[play.length - 1] === "G") ? 1 : 0
                    return total + toAdd
                  }, 0)
                let away = plays.reduce((total, play) => {
                    let toAdd = (play[play.length - 1] === "AG") ? 1 : 0
                return total + toAdd
                }, 0)

                i += 1
                    return (
                        <Stack direction='row' 
                        justifyItems='space-between' 
                        style={{backgroundColor: i%2 ? '#EEEEEE': 'white',
                        maxHeight:"50px", minHeight:"50px"}} 
                        onClick={( ) => navigate('/summary/'+query)}
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
                                {home} : {away} 
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

    //   console.log(playerList)

      return(
        <Container>
            <Typography>
                <h4>Roster</h4>
            </Typography>
            {playerList.map((player)=> {
                return(
                <Stack
                onClick={( ) => navigate('/player/?id='+player.id)}
                >
                {player.name}
                </Stack>
                )
                
            })}
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
                                Score  
                            </Typography>
                            
                        </Stack>
        {hasFetched && gameList} 
        {!hasFetched && <p>Fetching games list</p>}
        </Container>
      )
 }
 