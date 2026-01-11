import React from 'react'
import StartingScreen from './components/StartingScreen'
import Graph from './components/Graph'
import { useState } from 'react'


const App = () => {

  const [showGraph, setShowGraph] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(81);
  const [username, setUsername] = useState("");
  const [mainUsername, setMainUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [friendsData, setFriendsData] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    console.log("SEARCHING FOR USER:", username);
    setMainUsername(username);

    setTimeLeft(timeLeft => timeLeft - 1);
    // setShowAlert(true);
    console.log(loading);


    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      });

      const returnedData = await response.json();
      if (returnedData.error) {
        alert(returnedData.error);
      } else {
        setFriendsData(returnedData);
        console.log(returnedData);
      }

    } catch (error) {
      console.error(error);
    }
    setShowGraph(true);
    setLoading(false);
  }

  const hideGraph = () => {
    setShowGraph(false);
    setUsername("");
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
      <Graph showGraph={showGraph} setGraphHidden={hideGraph} friendsData={friendsData} />
      <StartingScreen handleSearch={handleSearch} username={username}
        setUsername={setUsername} showGraph={showGraph} loading={loading} />

    </div>
  )
}

export default App