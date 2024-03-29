
import '../App.css';
import Button from '@mui/material/Button';
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

const goalWeight = 5000;
const assistWeight = 5000;
const assist2Weight = 3000;
const DWeight = 5000;
const DropWeight = -3000;
const TAWeight = -3500;
const passWeight = 500;

const styleWeight = 0

function createData(
    name: string,
    throws: number,
    goals: number,
    assists: number,
    ds: number,
    tas: number,
    drops: number,
    taPerc: number,
    assists2: number,
    value: number,
    favTarget: string,
    huck: number,
    lefty: number,
    hammerscoob: number,
    layout:number,
    gender_perc: number,
    pickups: number
  ) {
    return { name, throws, goals, assists, ds, tas, drops, taPerc, assists2, value, favTarget, huck, lefty, hammerscoob, layout, gender_perc, pickups };
  }
  
function process(line, possessions) {
    const stats = ['G', 'D', 'Drop', 'TA', 'assist', 'assist2', 'pickups']
    const styleStats = ['Huck', 'Lefty', "Upside Down", "Layout"]
    const otherStats = styleStats.map((stat)=> stat+' TA')
    const genders = new Map(
        line.map((player) => {
           return [player.name, player.gender]})
      )
     
    
      const passedTo = new Map(
        line.map((player) => {
           return [player.name, new Map(
            line.map((player) => {
               return [player.name,0]
            }).concat(
              stats.map((stat) => {
                return [stat,0]
             })
            ).concat(
              styleStats.map((stat) => {
                return [stat,0]
             })
            ).concat(
              otherStats.map((stat) => {
                return [stat,0]
             })
            )
        )]
        })
      )
      
  
      possessions.slice().map((e) => {
  
        if (e[e.length-1] === "G") {
            if (e.length>2) {
            let [person ]  = e[e.length-3].split('+')
            if (passedTo.has(person)) {
              let tempDict = passedTo.get(person)
              tempDict.set('assist', tempDict.get('assist')+1)
            }
          }
          if (e.length>3) {
          let [person2, ] = e[e.length-4].split('+')
          if (passedTo.has(person2)) {
            let tempDict = passedTo.get(person2)
            tempDict.set('assist2', tempDict.get('assist2')+1)
          }
        }
        
        }
          for (let i=0; i<e.length; i++) {
            let [person, actions] = e[i].split('+')
            
            if (passedTo.has(person)){
              let tempDict = passedTo.get(person)
              if (tempDict.has(e[i+1])) {
                tempDict.set(e[i+1], tempDict.get(e[i+1])+1)
              }
              if (actions){
                let actions_ = actions.split('/')
                for (let k=0; k<actions_.length; k++)  {
                  let action = actions_[k]
  
                    tempDict.set(action, tempDict.get(action)+1)
  
                  //Check if throwaway
                  let [next_person] = e[i+1].split('+')
                  if (next_person ==='TA') {
                    tempDict.set(action+' TA', tempDict.get(action+' TA')+1)
                  }
                }
                
              }
              if (e[e.length-1] !== "AG" && e[e.length-1] !== "D" && i === 0){
                tempDict.set('pickups', tempDict.get('pickups')+1)
              }
            }

          }
          return 0;
    
        })
      const favTarget = new Map(
        line.map((player) => {
          return [player.name,'']
        })
      )
      const genderPerc = new Map(
        line.map((player) => {
          return [player.name,0]
        })
      )
      const filterOut = (array, target) => array.filter(element => element[1] === target);
      
      var passes = []
      for (const [name, map] of passedTo.entries()) {
        passes = []
        for (const [name, value] of map.entries()) {
          if (stats.includes(name)) {
            continue
          }
          if (styleStats.includes(name)) {
            continue
          }
          if (otherStats.includes(name)) {
            continue
          }
          passes.push([name, value])
        }
        
        passes.sort((a,b) =>  b[1] -a[1])
        
        if (passes[0][1] !== 0 && passes[0][1] !== passes[1][1]) {
          favTarget.set(name, passes[0][0] + ' ' + passes[0][1])
        }      
        else if (passes[0][1] !== 0) {     
          favTarget.set(name, filterOut(passes, passes[0][1]) 
          .map((e) => e[0]).join('|') + ' '+ passes[0][1])
        }

        let p_to_m = passes.filter((item) => genders.get(item[0]) === 'M' ).reduce((total, num) => {return total+num[1]}, 0)
        let p_to_f = passes.filter((item) => genders.get(item[0]) === 'F' ).reduce((total, num) => {return total+num[1]}, 0)
        genderPerc.set(name, p_to_f/(p_to_m+ p_to_f))
      }
      const rows = []

      const genderPos = {"M":0, "F":0}
      for (const [name,tempDict] of passedTo.entries()) {
        let totalThrows = line.map((player) => {
          return tempDict.get(player.name)
        }).concat(tempDict.get('TA')).reduce((prev, curr) => prev+curr, 0)
  
        genderPos[genders.get(name)] += totalThrows + tempDict.get('G')
      
        let taPerc = (1-(tempDict.get('TA')/totalThrows)).toFixed(2)
  
  
        let styleTA = otherStats.map((action) => tempDict.get(action)).reduce((prev, curr) => prev+curr, 0)
        let styleThrows = styleStats.map((action) => tempDict.get(action)).reduce((prev, curr) => prev+curr, 0)
        var styleSuccess = 0
  
        if(styleThrows) {
          styleSuccess =(1 - (styleTA/styleThrows)).toFixed(2)
  
        }
  
        let salary = goalWeight*tempDict.get('G') + 
                  assistWeight* tempDict.get('assist') +
                  assist2Weight* tempDict.get('assist2') +
                  DWeight* tempDict.get('D') +
                  DropWeight* tempDict.get('Drop') +
                  TAWeight* tempDict.get('TA') +
                  passWeight* totalThrows - tempDict.get('TA') +
                  styleWeight*styleSuccess;
        
        // let gender_perc = p_to_f/(p_to_m+p_to_f)
  
        rows.push(createData(
          name,
          totalThrows,
          tempDict.get('G'),
          tempDict.get('assist'),
          tempDict.get('D'),
          tempDict.get('TA'),
          tempDict.get('Drop'),
          taPerc,
          tempDict.get('assist2'),
          salary,
          favTarget.get(name),
          tempDict.get('Huck'),
          tempDict.get('Lefty'),
          tempDict.get('Upside Down'),
          tempDict.get('Layout'),
          genderPerc.get(name),
          tempDict.get('pickups')
        ))
      }
      return [rows, genderPos]
}

function GameSummary(props) {
    // const initialStae = () => [];
    const [sortKey, setSortKey] = useState("Name")    
    const [ascending, setAscending] = useState(true)   

    const styleStats = ['Huck', 'Lefty', "Upside Down", "Layout"]
    const line = props.line
    const possessions = props.possessions

    let [rows,genderPos] = process(line, possessions)
    
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
            if (isNaN(a[sortKey])) {
              return 1
            }
            else if (isNaN(b[sortKey])) {
              return -1
            }
            else{
              return ascending? b[sortKey] - a[sortKey]:  a[sortKey] - b[sortKey] 

            }
          })
    var t = null
    // if (rows) {
    if (rows.length>1) {
    let totals = rows.reduce(function(rows_sum, row,i) {
      return Object.values(row).map((item,j)=>{
        return item+rows_sum[j]
      })
      
    }, Array.from({length: Object.values(rows[0]).length}, (item, index) => 0))
    t = createData(...totals)
    }

    // }

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
            <TableCell align="right"  onClick={() => handleSort('gender_perc')} > % thrown to F</TableCell>
            <TableCell align="right"  onClick={() => handleSort('pickups')} > pickups</TableCell>
            <TableCell align="right"> Fave Target(s)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rows.map((row, i) => (
            <TableRow
              key={row.name}
              style={{backgroundColor: i%2? '#EEEEEE':'white', borderStyle:(row.name ===highlight)?'solid':'none', borderColor:'red'}}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
              onClick={() => handleHighlight(row.name)}
            >
              <TableCell component="th" scope="row" style={{position: 'sticky', left:0, background: i%2? '#EEEEEE':'white'}}>
                {row.name}
              </TableCell>
              <TableCell align="right">{row.goals}</TableCell>
              <TableCell align="right">{row.assists}</TableCell>
              <TableCell align="right">{row.assists2}</TableCell>
              <TableCell align="right">{row.ds}</TableCell>
              <TableCell align="right">{row.tas}</TableCell>
              <TableCell align="right">{row.drops}</TableCell>
              <TableCell align="right">{row.throws}</TableCell>
              <TableCell align="right">{row.taPerc}</TableCell>
              <TableCell align="right">{row.huck}</TableCell>
              <TableCell align="right">{row.lefty}</TableCell>
              <TableCell align="right">{row.hammerscoob}</TableCell>
              <TableCell align="right">{row.layout}</TableCell>

              <TableCell align="right">{row.value}</TableCell>
              <TableCell align="right">{row.gender_perc.toFixed(2)}</TableCell>
              <TableCell align="right">{row.pickups}</TableCell>
              <TableCell align="right">{row.favTarget}</TableCell>
              
            </TableRow>
          ))}
          {t && 
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
              <TableCell align="right">{(genderPos["F"]/(genderPos["M"] + genderPos["F"])).toFixed(2)*100}%</TableCell>
              <TableCell align="right">{t.pickups}</TableCell>
              <TableCell align="right"> - </TableCell>
             </TableRow>
            }
        </TableBody>
      </Table>
    </TableContainer>

    <Typography >
          Other Stats: 
    </Typography>
    <Typography>
              {t && <div>
                  <div>
                  Average throw per possessions = {(t.throws/t.pickups).toFixed(2)}
                  </div>
                  <div>
                  Possesion to goal percentage = {(t.goals/t.pickups).toFixed(2)}
                  </div>
                  </div>}
    </Typography>
    <Button onClick={() => {
      navigator.clipboard.writeText(window.location.href)
      }
    }>Copy Gamelink to Clipboard</Button>
    </Container>

      );
  }
  

export default GameSummary;

export {process, createData, goalWeight ,assistWeight ,assist2Weight ,DWeight ,DropWeight ,TAWeight ,passWeight ,styleWeight}