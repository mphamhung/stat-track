import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom";

const db_url = "https://stat-track-db.herokuapp.com"


export default function Team(props) {
    let params = useParams();
    const player_list = props.player_list
    const team_name = params.teamId
    const vs = props.versus
    var game_list = []

    const [games, setGames] = useState(game_list)
    const date = new Date().toDateString()


    function fetchGames() {
        fetch(db_url+"/games?name="+team_name)
        .then(resp => resp.json())
        .then ((data) => {
          let fetched_games = data.map((game) => {
            return  {id:game.id, date:game.date, name:game.name}
          }
          )
          setGames(fetched_games)
        })
    }
    useEffect(() => {
        fetchGames();

    }, [""])

    return(
        <div>
            Hello { team_name}
            {games.map((g) => {
        return (
            <li key={g.id}>{g.date}</li>
        )
    })
    }
            <li>
            <Link to={{
                pathname:"game/track_new",
            }}>
                Track new game</Link>
            </li>

        </div>

        )

}