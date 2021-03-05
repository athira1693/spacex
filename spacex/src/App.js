import logo from "./logo.svg";
import "./App.css";
import SpaceXLogo from "./SpaceXLogo.svg";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Launches from "./components/Launches";
import LoadingIndicator from "./components/LoadingIndicator";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={SpaceXLogo} style={{ width: "28vw" }}></img>
      </header>
      <div className="content">
        <Router>
          <Switch>
            <Route exact path={["/", "/spacex"]}>
              {/* <Redirect to="/spacex?start=&end=&type=" component={Launches} /> */}
              <Launches />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
