import { useState, useEffect } from "react";

const db_url = "https://stat-track-db.herokuapp.com"

const default_player_list = [
    {name: "Michael", gender: "M"},
    {name: "Marco", gender: "M"},
    {name: "Shawn", gender: "M"},
    {name: "David", gender: "M"},
    {name: "Keith", gender: "M"},
    {name: "John", gender: "M"},
    {name: "Rocco", gender: "M"},
    {name: "Matt", gender: "M"},
    {name: "Nancy", gender: "F"},
    {name: "Cynthia", gender: "F"},
    {name: "Kiki", gender: "F"},
    {name: "Carina", gender: "F"},
    {name: "Abby", gender: "F"},
    {name: "Erika", gender: "F"},
    {name: "Hanna", gender: "F"},
    {name: "Viv", gender: "F"},
  ]

export default function RosterAdmin(props) {
    const onClick = props.function

    const team = props.homeTeam

    const [inputName, setInputName] = useState("")
    const [inputGender, setInputGender] = useState("M")
    const [,setState] = useState('')

    function delete_player(name, gender) {
        // console.log(db_url+"/players?name="+name+"&gender="+gender)
        fetch(db_url+"/players?name="+name+"&gender="+gender)
          .then(resp => resp.json())
          .then (data => {
            let id = data.map((player) => {
              return (player.id)
            }
            )[0]
            fetch(db_url+"/players/"+id, {
              method: 'DELETE',
            })
          })
      }
      function add_player(name, gender, team_name) {
        if (name) {     
          fetch(db_url+"/players", {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({name, gender, team_name})
          })
        }
      }
    
      const handleSubmit = (e) => {
        e.preventDefault();    
        if (e.nativeEvent.submitter.name === 'del') {
          console.log('deleted player')
          delete_player(inputName, inputGender)
        }
    
        else if (e.nativeEvent.submitter.name === 'new') {
    
            add_player(inputName, inputGender, team)
        }
        
        else if (e.nativeEvent.submitter.name === 'pop') {
        fetch(db_url+"/players?team_name="+team)
        .then(resp => resp.json())
        .then(data => {
          console.log(data)
          if (!data.length) {
            default_player_list.map((player) => {
             return add_player(player.name,player.gender, team)
            })
          }
        })
        }
        setState({})
        onClick()
       }
    
    return (
          <div>
            <form
            onSubmit={handleSubmit}>
              <input
                type = 'text'
                value={inputName}
                onChange = {e => setInputName(e.target.value)}
                name="inputName"
              />
              <select
              value = {inputGender}
              onChange ={e => setInputGender(e.target.value)}
              name="inputGender">
                <option value = 'M'>M</option>
                <option value = 'F'>F</option>
              </select>
              <button variant='contained' name='new'>New</button>
              <button variant='contained' name='del'>Remove</button>
              <button variant='contained' name='pop'>Populate</button>
            </form>
          </div>
          )
}

