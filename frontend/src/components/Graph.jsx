import React, { useState } from 'react'
import Node from './Node'
import Button from './Button'

const Graph = ({ showGraph, setGraphHidden }) => {



    return (
        <div className="container" style={{
            display: showGraph ? '' : 'none ',
            width: "100%",
            marginBottom: "15px",
            height: "100vh",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "15px"
        }}>


            <h1 style={{ position: "absolute", top: "20px", maxWidth: "50%" }}>hello</h1>

            <Button buttonType={"outline-dark"} onClick={setGraphHidden}> Reset </Button>
        </div>
    )
}

export default Graph