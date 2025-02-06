import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import './App.css'
import Header from "./Components/Header/Header";
import Login from "./Components/Login/Login";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./Actions/User";

function App() {

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
    <Router>
    <Header/>
    <Routes>
      <Route path="/" element={<Login/>}/>
    </Routes>
    </Router>
    
    </>
  )
}

export default App
