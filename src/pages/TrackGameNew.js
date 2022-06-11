import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import PlayerButton from '../components/PlayerButton';

import RosterAdmin from "../components/RosterAdmin";
const db_url = "https://stat-track-db.herokuapp.com"


export default function TrackGame(props) {
    const function = props.function
    const [searchParams] = useSearchParams();
    const homeTeam = searchParams.get('home')

    const [roster, setRoster] = useState(null)
    const [loading, setLoading] = useState(true)
    let  [,setState]=useState();

    useEffect(() => {
        console.log(db_url+"/players?team_name="+homeTeam+'&_sort=name')
        fetch(db_url+"/players?team_name="+homeTeam+'&_sort=name')
        .then(resp => resp.json())
        .then((data) => {

            setRoster(data)
            setLoading(false)
        })
        console.log(roster)
        setState({});
        function()
    }, [''])


    return(
        <div>
        <RosterAdmin homeTeam={homeTeam}/>
        {/* {
        loading ? <div>Loading...</div> : <div>{roster.map((player) => player)} </div>

        } */}
        </div>


    )
}