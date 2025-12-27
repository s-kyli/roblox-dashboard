import React from 'react'
import { useState } from 'react';
import Button from './Button'
import Disclaimer from './Disclaimer';

const StartingScreen = () => {

  const [username, setUsername] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(81)

  const handleSearch = () => {
    console.log(username);

    setTimeLeft(timeLeft => timeLeft - 1);
    setShowAlert(true);

  }

  return (
    <div className='container' style={{
      display: 'flex',
      flexDirection: "column",
      width: "50%",
      marginBottom: "15px",
      height: "100vh",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center"
    }}>

      {showAlert && (
        <div className="alert alert-primary alert-dismissible fade show" role="alert" style={{ position: "absolute", top: "20px", maxWidth: "50%" }}>

          Sorry, {timeLeft}s until rate limit resets.

          <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowAlert(false)}></button>
        </div>
      )}

      <h1 htmlFor="username-search">Roblox Friends Social Graph</h1>
      <p htmlFor="username-search">Type in your (or anyone else's) username, then click search!</p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input style={{ borderRadius: "7px", padding: "5px" }} type="search" id="username-search" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <Button onClick={handleSearch} buttonType="outline-dark" >Search</Button>
      </div>

      <Disclaimer />

    </div>

  )
}

export default StartingScreen