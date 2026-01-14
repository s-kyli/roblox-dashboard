

import Table from 'react-bootstrap/Table';
import { Image } from "react-bootstrap"
import Button from './Button'
import React, { useState, useEffect, useRef } from 'react'
import ForceGraph3D from "react-force-graph-3d"
import * as THREE from 'three'


const GraphView = ({ showGraph, setGraphHidden, friendsData, mainUsername }) => {

    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const option = { height: "100%", width: "100%" }
    const fgRef = useRef()

    useEffect(() => {

        if (!friendsData || !mainUsername) {
            setGraphData({ nodes: [], links: [] })
            return
        }


        console.log("friendsData changegd")

        const newNodes = [
            { id: mainUsername, name: mainUsername, val: 7, color: "red" }
        ]

        const newConns = []



        friendsData.forEach((friend) => {
            console.log(friend)
            newNodes.push({ id: friend.id, name: friend.name, val: 5, img: friend.headShotId })
            newConns.push({ source: mainUsername, target: friend.id })

        })


        setGraphData({ nodes: newNodes, links: newConns })

    }, [friendsData])

    // useEffect(() => {
    //     if (fgRef.current) {
    //         fgRef.current.d3Force('charge').strength(-200)
    //         fgRef.current.d3Force('link').distance(100)
    //         fgRef.current.d3ReheatSimulation()
    //     }
    // }, [graphData, showGraph])

    return (
        <div className="m-0" style={{
            display: showGraph ? '' : 'none',
            width: "100%",
            // marginBottom: "15px",
            height: "100%",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
        }}>
            <Button
                buttonType={"outline-dark"}
                onClick={setGraphHidden}
                position={"absolute"}
                zIndex={100}
                padding={"15px"}
            >
                Reset
            </Button>
            {graphData.nodes.length > 0 && (
                <ForceGraph3D

                    ref={fgRef}
                    graphData={graphData}

                    nodeThreeObject={(node) => {
                        const imgTexture = new THREE.TextureLoader().load(node.img)
                        const material = new THREE.SpriteMaterial({ map: imgTexture })
                        const sprite = new THREE.Sprite(material)
                        sprite.scale.set(12, 12)
                        return sprite
                    }}
                />)}
        </div>
    )
}

export default GraphView