import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {TextField, Button,  ButtonGroup, Typography ,Stack, Box} from '@mui/material';
import { Container } from "@mui/system";

const db_url = "https://polydactyl-truthful-hyena.glitch.me"
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];




function LandingPage(props) {
    const date = new Date()
    const dateId = months[date.getMonth()]+ '-'+ date.getDate() + '-' + date.getFullYear()
    const [home, setHome] = useState("What the Huck?");
    const [away, setAway] = useState("");

    const [gameList, setGameList] = useState('')
    // const [uID, setUID] = useState(0)

    const [hasFetched, setHasFetched] = useState(false)

    const navigate  = useNavigate ();
    
    const handleSubmit = (e) => {
        e.preventDefault()
        let query = "?home="+home+"&versus="+away
        fetch(db_url+ "/games/" +query)
        .then(resp => resp.json())
        .then(data => {
            // setUID(data.length+1)
            let team_name = home
            let versus = away
            let possessions = []
            let date = dateId
            let uID = data.length+1
            fetch(db_url+"/games/", {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({team_name, versus, date, possessions, uID})
                }).then(
                    navigate("/game/?home="+home+"&versus="+away+"&date="+dateId+"&uID="+uID)
            )
        })
    }

   
    useEffect( () => {
        fetch(db_url+"/games")
        .then(resp => resp.json())
        .then( data => {
            let i = 0
            let gameList = data.filter(game => game.versus !== 'default').map(game => {
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
            // console.log(gameList)
            setGameList(gameList)

            setHasFetched(true)
    
        }
    
        )
    }, [navigate])

    return (
        <div>
        
        <Container>
            <Stack direction='column'>
            <Typography>
                <h4>New Game</h4>
            </Typography>
            <Box mb={1.7} >
            <ButtonGroup >
                <TextField 
                variant="outlined"
                label="Home Team"
                title='Home'
                name="awayTeam"
                type='text'
                value={home}
                onChange={e => setHome(e.target.value)}
                padding={1}
            />
            <TextField
                variant="outlined"
                name="awayTeam"
                type='text'
                label='Away Team'
                value={away}
                onChange={e => setAway(e.target.value)}
            />
            </ButtonGroup>
            </Box>
            
            <Button size='small' color='primary' variant='contained' onClick={e => handleSubmit(e)} style={{width:'128px',height:'45px', backgroundColor:'#6200EE'}} >                
                    Start Game
            </Button>
            </Stack>
        </Container>
            
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

        </div>

    )
}

export default LandingPage;