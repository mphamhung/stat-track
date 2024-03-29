import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom";
import {Typography} from '@mui/material';

import { Container } from "@mui/system";
import {process } from './components/GameSummary'

import Plot from "react-plotly.js";

const db_url = "https://polydactyl-truthful-hyena.glitch.me"

export default function PlayerPage(props) {
    const [searchParams] = useSearchParams() 
    const id = searchParams.get('id')
    
    const [team_name, setTeamName] = useState('default')
    const [name, setName] = useState('Default')
    // const [player_data, setPlayerData] = useState([])
    const [graphs, setGraphs] = useState([])
    useEffect(() => {
        fetch(db_url+"/players/" + id).then( resp=> resp.json()).then( player=>{
            setName(player.name)
            setTeamName(player.team_name)
            fetch(db_url+"/games?team_name=" + player.team_name)
            .then(resp => resp.json())
            .then(data => {
                let player_data = data.filter(game=> game.versus !== 'default' && game.possessions.length>1).map((game)=> {
                    let processed_game = process(game.line,game.possessions)
                    let rows = processed_game[0]
                    let r = null
                    for (let i = 0; i<rows.length; i++){
                        if (rows[i].name === player.name) r = rows[i]
                    }
                    return r
                })
                let dates = data.filter(game=> game.versus !== 'default' && game.possessions.length>1).map((game)=>game.date).filter((d,idx)=> player_data[idx] !== null)
                let player_data_filtered = player_data.filter((d)=> d!==null)
                let stats = []

                

                for (const key in player_data_filtered[0]){ if (key !== 'favTarget' && key !== 'name') stats.push(key)}
                let graphs = []
                for (const i in stats){
                    let stat_data = []
                    for (const j in player_data_filtered){
                        stat_data.push(player_data_filtered[j][stats[i]])
                    }
                    graphs.push(
                        <Plot data = {[
                            {
                                x:dates,
                                y:stat_data,
                                type:'line'
                            }
                        ]} 
                        layout={{ width: 320, height: 240, title: stats[i] }}
                        >

                        </Plot>
                    )
                }
        
                setGraphs(graphs)
            })
        })

    }, [id])
    return (
        <Container>
            <Typography>
                <h4>{name} ({team_name})</h4>
            </Typography>
            {graphs}
            </Container>
    )

}

