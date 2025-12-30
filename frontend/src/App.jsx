import React from 'react'
import StartingScreen from './components/StartingScreen'
import Graph from './components/Graph'
import { useState } from 'react'

const App = () => {

  const [showGraph, setShowGraph] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(81);
  const [username, setUsername] = useState("");

  const handleSearch = () => {
    console.log(username);

    setTimeLeft(timeLeft => timeLeft - 1);
    setShowAlert(true);// later change this to conditional
    setShowGraph(true); // change this later
  }

  const hideGraph = () => {
    setShowGraph(false);
  }



  return (

    <div>

      {showAlert && (
        <div className="alert alert-primary alert-dismissible fade show" role="alert" style={{
          position: "fixed",
          display: showGraph ? "none" : '',
          alignSelf: "center",
          top: "20px",
          left: "50%",
          maxWidth: "50%",
          zIndex: "676767",
          transform: "translateX(-50%)",
        }}>

          Sorry, {timeLeft}s until rate limit resets.

          <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}
      {/* <button onClick={hideGraph} >click</button> */}
      <Graph showGraph={showGraph} setGraphHidden={hideGraph} />
      <StartingScreen handleSearch={handleSearch} username={username} setUsername={setUsername} showGraph={showGraph} />

    </div>
  )
}

export default App