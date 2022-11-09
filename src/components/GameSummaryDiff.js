
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

import {process,goalWeight ,assistWeight ,assist2Weight ,DWeight ,DropWeight ,TAWeight ,passWeight ,styleWeight } from './GameSummary'



export default function GameSummaryDiff(props) {
    // const initialStae = () => [];
    const [sortKey, setSortKey] = useState("Name")    
    const [ascending, setAscending] = useState(true)   

    const styleStats = ['Huck', 'Lefty', "Upside Down", "Layout"]
    const line = props.line
    const line_prev = props.line_prev
    const possessions = props.possessions
    const possessions_prev = props.possessions_prev

    const common_line = line.filter(function(n) {
      return line_prev.map((row)=> row.id === n.id).filter((k)=> k).length>0
    });
    let process_curr = process(common_line, possessions)
    let rows_curr = process_curr[0]
    let process_prev = process(common_line, possessions_prev)
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
    // var t = null
    // let n_rows = rows.map((row)=> [...row.values()].map((e)=>parseFloat(e)))
    // console.log(n_rows)
    // if (n_rows.length>1) {
    //   let totals = n_rows.reduce(function(rows_sum, row,i) {
    //     console.log(rows_sum)
    //     console.log(row)
    //     return Object.values(row).map((item,j)=>{
    //       return item+rows_sum[j]
    //     })
        
    //   }, Array.from({length: Object.values(n_rows[0]).length}, (item, index) => 0))
    //   t = createData(...totals)
    //   }


  
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
            <TableCell align="right"  onClick={() => handleSort('gender_perc')} > % thrown to F</TableCell>
            <TableCell align="right"  onClick={() => handleSort('pickups')} > pickups</TableCell>
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
              <TableCell align="right">{row.get('gender_perc')}</TableCell>
              <TableCell align="right">{row.get('pickups')}</TableCell>
              <TableCell align="right">{row.get('huck')}</TableCell>
              <TableCell align="right">{row.get('lefty')}</TableCell>
              <TableCell align="right">{row.get('hammerscoob')}</TableCell>
              <TableCell align="right">{row.get('layout')}</TableCell>
              <TableCell align="right">{row.get('value')}</TableCell>

            </TableRow>
          ))}
            {/* {t && 
           <TableRow
                         key='totals'
                         style={{backgroundColor: 'white', borderStyle:'solid', borderColor:'black'}}
                         sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
                >
           <TableCell component="th" scope="row" style={{position: 'sticky', left:0, background: 'white', fontWeight: 'bold' }}>
                Total
              </TableCell>   
              <TableCell align="right">{t.goals}</TableCell>
              <TableCell align="right">{t.assists}</TableCell>
              <TableCell align="right">{t.assists2}</TableCell>
              <TableCell align="right">{t.ds}</TableCell>
              <TableCell align="right">{t.tas}</TableCell>
              <TableCell align="right">{t.drops}</TableCell>
              <TableCell align="right">{t.throws}</TableCell>
              <TableCell align="right">{((t.throws)/(t.tas+t.drops+t.throws)).toFixed(2)}</TableCell>
              <TableCell align="right">{t.huck}</TableCell>
              <TableCell align="right">{t.lefty}</TableCell>
              <TableCell align="right">{t.hammerscoob}</TableCell>
              <TableCell align="right">{t.layout}</TableCell>
              <TableCell align="right"> - </TableCell>
             </TableRow>
            } */}
        </TableBody>
      </Table>
    </TableContainer>

    <Typography >
    {/* {t && <div>
                  <p>
                  Average throw per possessions = {(t.throws/t.pickups).toFixed(2)}
                  </p>
                  <p>
                  Possesion to goal percentage = {(t.goals/t.pickups).toFixed(2)}
                  </p>
                  </div>} */}
    </Typography>
    </Container>

      );
  }
  