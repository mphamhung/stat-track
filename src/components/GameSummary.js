
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
    drops: number,
    taPerc: number,
    assists2: number
  ) {
    return { name, touches, goals, assists, ds, tas, drops, taPerc, assists2 };
  }
  

function ScoreBoard(props) {
    // const initialStae = () => [];
    const [sortKey, setSortKey] = useState("Name")    
    const [ascending, setAscending] = useState(true)   

    const handleSort=(prop)=>
    {
      if (prop === sortKey){
        setAscending(!ascending)
      }
      else{
        setSortKey(prop)
        setAscending(true)
      }
    }

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
    const assists2 = new Map(
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
        assists.set(e[e.length-3], assists.get(e[e.length-3])+1)
        assists2.set(e[e.length-4], assists2.get(e[e.length-4])+1)
      }
      else if (e[e.length-1] === "D") {
          Ds.set(e[e.length-2], Ds.get(e[e.length-2])+1)
        }  
      else if (e[e.length-1] === "TA") {
          TAs.set(e[e.length-2], TAs.get(e[e.length-2])+1)
      }  
      else if (e[e.length-1] === "Drop") {
          Drops.set(e[e.length-2], Drops.get(e[e.length-2])+1)
      }  
      return 0;

    })
 
    const rows = []
    for (const [name,value] of touches.entries()) {
        rows.push(createData(name, 
                    value - goals.get(name) - Ds.get(name) - Drops.get(name),
                    goals.get(name),
                    assists.get(name),
                    Ds.get(name),
                    TAs.get(name),
                    Drops.get(name),
                    (TAs.get(name)/value).toFixed(2),
                    assists2.get(name),
        ))
    }

    rows.sort((a,b) => ascending? b[sortKey] - a[sortKey]:  a[sortKey] - b[sortKey] )

    
    return (
        <TableContainer component={Paper}>
          <Table  sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort('name')}>Name</TableCell>
                <TableCell align="right" onClick={() => handleSort('goals')}>Gs</TableCell>
                <TableCell align="right" onClick={() => handleSort('assists')}>As</TableCell>
                <TableCell align="right" onClick={() => handleSort('assists2')}>2As</TableCell>
                <TableCell align="right" onClick={() => handleSort('ds')}>Ds</TableCell>
                <TableCell align="right" onClick={() => handleSort('tas')}>Tas</TableCell>
                <TableCell align="right" onClick={() => handleSort('drops')}>Drops</TableCell>
                <TableCell align="right" onClick={() => handleSort('touches')}>Passes</TableCell>
                <TableCell align="right" onClick={() => handleSort('taPerc')}>TA %</TableCell>

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
                  <TableCell align="right">{row.assists2}</TableCell>
                  <TableCell align="right">{row.ds}</TableCell>
                  <TableCell align="right">{row.tas}</TableCell>
                  <TableCell align="right">{row.drops}</TableCell>
                  <TableCell align="right">{row.touches}</TableCell>
                  <TableCell align="right">{row.taPerc}</TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button onClick={() => {
              navigator.clipboard.writeText(
                [Object.keys(rows[0]).join('\t')].concat(
                
                rows.map((row) => {
                  return Object.values(row).join('\t')
                })
                )
                .join('\n'))
              }
            }>Output to Clipboard</Button>

        </TableContainer>
      );
  }
  

export default ScoreBoard;