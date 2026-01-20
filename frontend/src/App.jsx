import React from 'react'
import StartingScreen from './components/StartingScreen'
import Graph from './components/GraphView'
import { useState } from 'react'
import { useImmer } from "use-immer"



const App = () => {

  const [timeLeft, setTimeLeft] = useState(81);
  const [showGraph, setShowGraph] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState(""); // main username (root node)
  const [usernameSearchingFor, setUsernameSearchingFor] = useState("") // username when searching from node (not root)
  const [loading, setLoading] = useState(false);
  const [friendsData, setFriendsData] = useImmer({});
  const [newFriends, setNewFriends] = useImmer({});
  const [rootNodes, setRootNodes] = useImmer({})
  const [onStartPage, setOnStartPage] = useState(true)

  const hideGraph = () => {
    setShowGraph(false);
    setUsername("");
    setUsernameSearchingFor("")
    setFriendsData({});
    setNewFriends({})
    setRootNodes({})
    setLoading(false)
    setUsernameSearchingFor("")
    setOnStartPage(true)
  }

  const apiRequestPy = async (usernameToSearch) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/get-friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameToSearch }),
      });

      const returnedData = await response.json();
      console.log(returnedData)
      return returnedData

    } catch (error) {
      console.error(error);
    }
  }

  const handleSearchFromNode = async (nodeUsername) => {
    setLoading(true);
    console.log("SEARCHING FOR USER FROM NODE:", nodeUsername)
    setUsernameSearchingFor(nodeUsername)

    const returnedData = await apiRequestPy(nodeUsername)

    if (returnedData.error) {
      if (returnedData.error == 429) {
        alert("Hit rate limit. Please wait around 2 minutes for the rate limit to reset. Sorry for the inconvenience.")
      } else {
        alert(returnedData.error);
      }
    } else {
      setNewFriends(returnedData);
    }

    setLoading(false)
  }

  const handleSearch = async () => {
    setLoading(true);
    console.log("SEARCHING FOR USER:", username);

    // setTimeLeft(timeLeft => timeLeft - 1);
    const returnedData = await apiRequestPy(username)
    if (returnedData.error) {
      alert(returnedData.error);
    } else {
      if (!returnedData[username]) {
        for (const [name, friend] of Object.entries(returnedData)) {
          if (username.toLowerCase() === name.toLowerCase()) {
            setUsername(name)
            break
          }
        }
      } else {
        setUsername(username)
      }

      setFriendsData(returnedData);
      setShowGraph(true);
    }
    setLoading(false);
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
      <Graph
        showGraph={showGraph}
        setGraphHidden={hideGraph}
        friendsData={friendsData}
        setFriendsData={setFriendsData}
        mainUsername={username}
        usernameSearchingFor={usernameSearchingFor}
        searchFromNode={handleSearchFromNode}
        newFriends={newFriends}
        setNewFriends={setNewFriends}
        onStartPage={onStartPage}
        setOnStartPage={setOnStartPage}
        rootNodes={rootNodes}
        setRootNodes={setRootNodes}
      />
      <StartingScreen handleSearch={handleSearch} username={username}
        setUsername={setUsername} showGraph={showGraph} loading={loading} />

    </div>
  )
}

export default App