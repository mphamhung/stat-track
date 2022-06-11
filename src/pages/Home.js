import { Outlet, Link } from "react-router-dom";

const Home = () => {
    return    (   
        <div>
            <li>
            <Link to="/Team/wth">Stat Track for What the Huck?</Link>
            </li>
            <li>
            <Link to="/Team/team2">Stat Track for team2</Link>
            </li>
        </div>    
        )
    ;
  };
  
  export default Home;