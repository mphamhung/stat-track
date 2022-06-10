
import '../App.css';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { useState } from 'react'

function createData(
    name: string,
    touches: number,
    goals: number,
    assists: number,
    ds: number,
    tas: number,
    drops: number
  ) {
    return { name, touches, goals, assists, ds, tas, drops };
  }
  

function ScoreBoard(props) {
    // const initialStae = () => [];
    const [sortKey, setSortKey] = useState("Name")    


    const touches = new Map(
        props.m_players.map((player) => {
           return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )
    const goals = new Map(
        props.m_players.map((player) => {
           return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )
    const assists = new Map(
        props.m_players.map((player) => {
           return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )
    const Ds = new Map(
        props.m_players.map((player) => {
           return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )
    const TAs = new Map(
        props.m_players.map((player) => {
           return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )

    const Drops = new Map(
        props.m_players.map((player) => {
          return [player.name,0]
        }).concat(
        props.f_players.map((player) => {
            return [player.name,0]
        }))
    )

    props.possessions.slice().flat().map((e) => {
        if (touches.has(e)) {
            touches.set(e, touches.get(e)+1)
        }
        return 0;
    })

    props.possessions.slice().map((e) => {
      if (e[e.length-1] === "G") {
        goals.set(e[e.length-2], goals.get(e[e.length-2])+1)
        assists.set(e[e.length-3],goals.get(e[e.length-3])+1)
      }
      else if (e[e.length-1] === "D") {
          Ds.set(e[e.length-2], Ds.get(e[e.length-2])+1)
        }  
      else if (e[e.length-1] === "TA") {
          TAs.set(e[e.length-2], TAs.get(e[e.length-2])+1)
      }  
      else if (e[e.length-1] === "Drop") {
          Drops.set(e[e.length-2], TAs.get(e[e.length-2])+1)
      }  
      return 0;

    })
 
    const rows = []
    for (const [name,value] of touches.entries()) {
        rows.push(createData(name, 
                    value,
                    goals.get(name),
                    assists.get(name),
                    Ds.get(name),
                    TAs.get(name),
                    Drops.get(name)
        ))
    }

    rows.sort((a,b) => b[sortKey] - a[sortKey] )

    console.log(sortKey)
    return (
        <TableContainer component={Paper}>
          <Table  sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell onClick={() => setSortKey('name')}>Name</TableCell>
                <TableCell align="right" onClick={() => setSortKey('goals')}>Gs</TableCell>
                <TableCell align="right" onClick={() => setSortKey('assists')}>As</TableCell>
                <TableCell align="right" onClick={() => setSortKey('ds')}>Ds</TableCell>
                <TableCell align="right" onClick={() => setSortKey('tas')}>Tas</TableCell>
                <TableCell align="right" onClick={() => setSortKey('drops')}>Drops</TableCell>
                <TableCell align="right" onClick={() => setSortKey('touches')}>Touches</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.goals}</TableCell>
                  <TableCell align="right">{row.assists}</TableCell>
                  <TableCell align="right">{row.ds}</TableCell>
                  <TableCell align="right">{row.tas}</TableCell>
                  <TableCell align="right">{row.drops}</TableCell>
                  <TableCell align="right">{row.touches}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={() => {navigator.clipboard.writeText(rows)}}>Output to Clipboard</Button>

        </TableContainer>
      );
  }
  

export default ScoreBoard;