import React from 'react'
import { useState } from 'react';
import Button from './Button'
import Disclaimer from './Disclaimer';
import { RotatingLines } from "react-loader-spinner"

const StartingScreen = ({ handleSearch, username, setUsername, showGraph, loading }) => {

  return (
    <div className='container' style={{
      display: showGraph ? 'none ' : 'flex',
      flexDirection: "column",
      width: "50%",
      marginBottom: "15px",
      height: "100vh",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center"
    }}>

      <h1 htmlFor="username-search">Roblox Friends Social Graph</h1>
      <p htmlFor="username-search">Type in your (or anyone else's) username, then click search!</p>
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <input style={{ borderRadius: "7px", padding: "5px" }} type="search" id="username-search" value={username}
          onChange={(e) => setUsername(e.target.value)}></input>
        <Button onClick={handleSearch} buttonType="outline-dark" hide={loading}>Search</Button>
        <RotatingLines
          visible={loading}
          height="50"
          width="50"
          color="grey"
          strokeWidth="5"
          animationDuration="0.75"
          ariaLabel="rotating-lines-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>

      <Disclaimer />

    </div>

  )
}

export default StartingScreen