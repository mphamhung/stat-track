
import '../App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react'
import { Container } from '@mui/system';
import {Typography} from '@mui/material'

import {process, goalWeight ,assistWeight ,assist2Weight ,DWeight ,DropWeight ,TAWeight ,passWeight ,styleWeight } from './GameSummary'



export default function GameSummaryDiff(props) {
    // const initialStae = () => [];
    const [sortKey, setSortKey] = useState("Name")    
    const [ascending, setAscending] = useState(true)   

    const styleStats = ['Huck', 'Lefty', "Upside Down", "Layout"]
    const line = props.line
    const possessions = props.possessions
    const possessions_prev = props.possessions_prev
    let process_curr = process(line, possessions)
    let rows_curr = process_curr[0]
    let process_prev = process(line, possessions_prev)
    let rows_prev = process_prev[0]
    let rows = rows_curr.map((row, i) => {
        let r = new Map (
            Object.keys(row).filter((key) => key !== 'name' && key !== 'favTarget').map((key)=> {
                return [key, (rows_curr[i][key] - rows_prev[i][key] > 0)? '+'+parseFloat((rows_curr[i][key] - rows_prev[i][key]).toFixed(2)): parseFloat((rows_curr[i][key] - rows_prev[i][key]).toFixed(2))]
        })
        )
        r.set("name",row['name'])
        return r
    })

    // let rows = rows_curr-rows_prev

    const [highlight, setHighlight] = useState("")    
  
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

    const handleHighlight=(prop)=>
    {
      if (prop === highlight) {
        setHighlight('')
      }
      else{
        setHighlight(prop)

      }
    }
    rows.sort((a,b) => 
          {
            if (isNaN(a.get(sortKey))) {
              return 1
            }
            else if (isNaN(b.get(sortKey))) {
              return -1
            }
            else{
              return ascending? b.get(sortKey) - a.get(sortKey):  a.get(sortKey) - b.get(sortKey) 

            }
          })
    
    return (
      <Container>

      <TableContainer component={Paper}>
      <Table  sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead style={{backgroundColor:'#D9D9D9'}}>
          <TableRow>
            <TableCell onClick={() => handleSort('name')} style={{position: 'sticky', left:0, background: "#D9D9D9"}}>Name</TableCell>
            <TableCell align="right" onClick={() => handleSort('goals')}>Gs</TableCell>
            <TableCell align="right" onClick={() => handleSort('assists')}>As</TableCell>
            <TableCell align="right" onClick={() => handleSort('assists2')}>2As</TableCell>
            <TableCell align="right" onClick={() => handleSort('ds')}>Ds</TableCell>
            <TableCell align="right" onClick={() => handleSort('tas')}>Tas</TableCell>
            <TableCell align="right" onClick={() => handleSort('drops')}>Drops</TableCell>
            <TableCell align="right" onClick={() => handleSort('throws')}>Throws</TableCell>
            <TableCell align="right" onClick={() => handleSort('taPerc')}>Pass %</TableCell>
            {styleStats.map((action) => {
                return <TableCell align="right" onClick={() => handleSort(action)}>{action}</TableCell>
            })}
            <Tooltip title={"Computed by: " + 
            goalWeight +"*Gs +"+
            assistWeight+"*As +" +
            assist2Weight+"*2As +"+ 
            DWeight+"*Ds +" +
            DropWeight +"*Drops +"+ 
            TAWeight+"*Tas +"+
            passWeight+"*passes + " +
            styleWeight+ "*style success"}
            ><TableCell align="right" onClick={() => handleSort('value')}>  
                Net $
            </TableCell></Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, i) => (
            <TableRow
              key={row.get('name')}
              style={{backgroundColor: i%2? '#EEEEEE':'white', borderStyle:(row.name ===highlight)?'solid':'none', borderColor:'red'}}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
              onClick={() => handleHighlight(row.get('name'))}
            >
              <TableCell component="th" scope="row" style={{position: 'sticky', left:0, background: i%2? '#EEEEEE':'white'}}>
                {row.get('name')}
              </TableCell>
              <TableCell align="right">{row.get('goals')}</TableCell>
              <TableCell align="right">{row.get('assists')}</TableCell>
              <TableCell align="right">{row.get('assists2')}</TableCell>
              <TableCell align="right">{row.get('ds')}</TableCell>
              <TableCell align="right">{row.get('tas')}</TableCell>
              <TableCell align="right">{row.get('drops')}</TableCell>
              <TableCell align="right">{row.get('throws')}</TableCell>
              <TableCell align="right">{row.get('taPerc')}</TableCell>
              <TableCell align="right">{row.get('huck')}</TableCell>
              <TableCell align="right">{row.get('lefty')}</TableCell>
              <TableCell align="right">{row.get('hammerscoob')}</TableCell>
              <TableCell align="right">{row.get('layout')}</TableCell>

              <TableCell align="right">{row.get('value')}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Typography >
          Other Stats: 
    </Typography>
    </Container>

      );
  }
  