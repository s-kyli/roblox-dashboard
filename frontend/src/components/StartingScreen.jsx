import React from 'react'
import { useState } from 'react';
import Button from './Button'

const StartingScreen = () => {

  const [username, setUsername] = useState("");
  const handleSearch = () => {
    console.log(username);
  }

  return (
    <div className='container' style={{
      display: 'flex',
      flexDirection: "column",
      width: "100%",
      height: "100vh",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1 htmlFor="username-search">Roblox Friends Social Graph</h1>
      <p htmlFor="username-search">Type in your (or anyone else's) username, then click search!</p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input style={{ borderRadius: "7px", padding: "5px" }} type="search" id="username-search" value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <Button onClick={handleSearch} buttonType="outline-dark" >Search</Button>
      </div>
    </div>

  )
}

export default StartingScreen