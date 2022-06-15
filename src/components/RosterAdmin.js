


export default function RosterAdmin(props) {
    return (
        <div>
          <form
          onSubmit={this.handleSubmit}>
            <input
              type = 'text'
              value={this.state.inputName}
              onChange = {this.handleChange}
              name="inputName"
            />
            <select
            value = {this.state.inputGender}
            onChange ={this.handleChange}
            name="inputGender">
              <option value = 'M'>M</option>
              <option value = 'F'>F</option>
            </select>
            <button variant='contained' name='new'>New</button>
            <button variant='contained' name='del'>Remove</button>
            <button variant='contained' name='pop'>Populate</button>
            <button variant='contained' name='del_plays'>Del Plays</button>
          </form>
        </div>
        )

}


