import TrackGame from './pages/TrackGame'

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Nav from "./pages/Nav";
import Team from "./pages/Team"
import Home from "./pages/Home";
import NewGame from "./pages/NewGame"
// import Blogs from "./pages/Blogs";
// import Contact from "./pages/Contact";
// import NoPage from "./pages/NoPage";
const player_list = [
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

const player_list2 = [
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

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Nav />}>
        <Route index element={<Home />} />
          <Route path="Team">
            <Route path=":teamId" element={<Team/>}/>
            <Route path=":teamId/game/track_new" element={<NewGame/>}/>
          </Route>
          <Route path="game/id" element={<TrackGame/>}/>

          <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
      </Routes>
    </BrowserRouter>
  );
}