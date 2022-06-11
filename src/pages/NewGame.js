import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom";



function NewGame(props) {
    let params = useParams();
    const date = new Date().toDateString()

    const [state, setState] = useState("");
    const [newGameID, setNewGameID] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault()

        setNewGameID("?home="+params.teamId+"&away="+state+"&date="+date)

        console.log(newGameID)
    }

    return (
        <form onSubmit= {e => {handleSubmit(e)}}>
            <label>NewGame</label>

            <input
                name="awayTeam"
                type='text'
                value={state}
                onChange={e => setState(e.target.value)}
            />
            <button variant='contained' name='new'>Generate GameID</button>

            {newGameID &&
            <li>
            <Link to={{
                pathname:"/game/id"+newGameID,
            }}>
                Go to new game</Link>
            </li>
            }
        </form>
    )
}

export default NewGame;