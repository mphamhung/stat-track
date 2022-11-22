import { useEffect, useState } from "react"
import { Container } from "@mui/system";
import { useNavigate } from "react-router-dom";
import {TextField, Button, Typography ,Stack} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

 export default function AdminPage(props) {

    const [hasFetched, setHasFetched] = useState(false)
    const [adminGames, setAdminGames] = useState([])
    const navigate  = useNavigate ();
    const [showDelPrompt, setShowDelPrompt] = useState(false)
    const [selectedGameInfo, setSelectedGameInfo] = useState(null)
    const [delPromptVal, setDelPromptVal] = useState('')
    const handleDelClick = (props) => {
        console.log(props)
        console.log(adminGames)
        console.log('deleted game with id {selectedGameInfo.id}')
        console.log(delPromptVal)
        if (delPromptVal === 'delete game '+ selectedGameInfo.id) {
            fetch(db_url+"/games/"+selectedGameInfo.id, {
                method: 'DELETE',
              }).then(resp => {
                    if (resp.ok) {
                        let adminList =  adminGames.filter((game)=> game.id !== selectedGameInfo.id)
                        setAdminGames(adminList)
                    }     
                  }
              )
            setShowDelPrompt(false)

        }
        
      }
    useEffect( () => {
        fetch(db_url+"/games")
        .then(resp => resp.json())
        .then( data => {  
            let i =0 
            let adminList  = data.reverse().map(game => {
                let query = "?home="+game.team_name+"&versus="+game.versus+"&date="+game.date+"&uID="+game.uID
                i += 1
                    let html = (
                        <Stack direction='row' 
                        justifyItems='space-between' 
                        style={{backgroundColor: i%2 ? '#EEEEEE': 'white',
                        maxHeight:"50px", minHeight:"50px"}}
                        key={game.id}
                        >
         
                            <Typography style={{maxWidth:"80px", minWidth:"80px", maxHeight:"60px", minHeight:"60px",
                                }}>
                            {game.date.split("-")[0]} {game.date.split("-")[1]}
                            </Typography>
                            <Stack direction="column" style={{maxWidth:"60%", minWidth:"60%", maxHeight:"60px", minHeight:"60px",
                                textDecoration: "underline"}}
                                onClick={( ) => navigate('/summary/'+query)}>
                                <Typography>
                                    {game.team_name}
                                </Typography>
                                <Typography>
                                    {game.versus}  
                                </Typography>
                            </Stack>
                            <DeleteForeverIcon
                            onClick={() => {setShowDelPrompt(true); setSelectedGameInfo({'id': game.id, 'home':game.team_name, 'away':game.versus})}}
                            />
                            
                        </Stack>
                    )
                    return {html, 'id': game.id, 'home':game.team_name, 'away':game.versus}
            })
            setAdminGames(adminList)
    
            setHasFetched(true)
    
        }
    
        )
    }, [navigate])

    // function fetchGames() {
        
    //   }
      return(
        <Container>
             <h4>Viewing All Previous Games</h4>
            {hasFetched && adminGames.map((game)=> game.html)}
            {showDelPrompt && 
            <Dialog
            open={showDelPrompt}
            onClose={() => setShowDelPrompt(false)}
          >
            
            <Typography>
               <h1>
               Are you sure you want to delete Game {selectedGameInfo.home} vs  {selectedGameInfo.away} with ID {selectedGameInfo.id}? Type "delete game {selectedGameInfo.id}" and confirm if so.
                </h1> 
            </Typography>
            <Stack direction='row' spacing={{ xs: 1, sm: 2, md: 4 }}>
            <TextField id="outlined-basic" variant="outlined" value={delPromptVal} onChange={(e)=> setDelPromptVal(e.target.value)}/>

            <Button onClick={handleDelClick}>
                Yes
            </Button>
            </Stack>
            
          </Dialog>
          }
        </Container>
      )
 }
 