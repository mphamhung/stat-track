
import '../App.css';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React from 'react'

function createData(
    name: string,
    touches: number,
    goals: number,
    assists: number,
    ds: number,
    tas: number,
  ) {
    return { name, touches, goals, assists, ds, tas };
  }
  
function ScoreBoard(props) {
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
    var last = ""
    var last2 = ""
    props.possessions.slice().flat().map((e) => {
        if (touches.has(e)) {
            touches.set(e, touches.get(e)+1)
        }

        else if (e === "G") {
            goals.set(last, goals.get(last)+1)
            assists.set(last2,goals.get(last2)+1)
        }       

        else if (e === "D") {
            Ds.set(last, Ds.get(last)+1)
        }  
        else if (e === "TAs") {
            TAs.set(last, TAs.get(last)+1)
        }  
        last = e
        last2 = last
        return 0;
    })
 
    const rows = []
    for (const [name,value] of touches.entries()) {
        rows.push(createData(name, 
                    value,
                    goals.get(name),
                    assists.get(name),
                    Ds.get(name),
                    TAs.get(name)
        ))
    }

    
    return (
        <TableContainer component={Paper}>
          <Table  sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Gs</TableCell>
                <TableCell align="right">As</TableCell>
                <TableCell align="right">Ds</TableCell>
                <TableCell align="right">Tas</TableCell>
                <TableCell align="right">Touches</TableCell>

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