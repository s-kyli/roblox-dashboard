
import Button from './Button'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import ForceGraph3D from "react-force-graph-3d"
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


const GraphView = ({ showGraph, setGraphHidden, friendsData, mainUsername }) => {

    const [graphData, setGraphData] = useState({ nodes: [], links: [] });
    const option = { height: "100%", width: "100%" }
    const fgRef = useRef()
    const selectedNode = useRef(null)
    const renderer = useMemo(() => [new CSS2DRenderer()], [])

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force("charge").strength(-1000)
            fgRef.current.d3Force("link").distance(300)
            console.log("spacing out")
        }
    }, [graphData])

    useEffect(() => {

        if (!friendsData || !mainUsername) {
            setGraphData({ nodes: [], links: [] })
            return
        }


        console.log("friendsData changegd")

        const mainUser = friendsData[friendsData.length - 1]
        const newNodes = [{
            id: mainUser.id,
            name: mainUsername,
            val: 7,
            color: "red",
            img: mainUser.headShotId,
            displayName: mainUser.displayName,
            verified: mainUser.hasVerifiedBadge
        }]

        const newConns = []

        friendsData.forEach((friend) => {

            if (friend.name != mainUsername) {
                newNodes.push({
                    id: friend.id,
                    name: friend.name,
                    val: 5,
                    img: friend.headShotId,
                    displayName: friend.displayName,
                    verified: friend.hasVerifiedBadge
                })
                newConns.push({ source: mainUser.id, target: friend.id })
            }
        })

        setGraphData({ nodes: newNodes, links: newConns })

    }, [friendsData])

    const findPath = (node) => {

    }

    const resetNode = (node) => {
        const oldData = node.nodeData
        node.innerHTML = generateHtml(oldData)
        node.style.zIndex = "1"
        node.style.userSelect = "none"
        node.style.cursor = "pointer"
        node.onpointerdown = null
    }

    // generate html for each node
    const generateHtml = (node) => {
        return `
            <div style="text-align: center; transition: all 0.2s;">
                ${node.img ? `<img src="${node.img}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid white;">` : ''}
                <div style="color: ${'white'}; font-size: 12px; font-weight: bold; text-shadow: 0 1px 3px black;">
                    ${node.name}
                </div>
            </div>
        `
    }

    const generateExpandedHtml = (node) => {
        return `
            <div style="background: rgba(0, 0, 0, 0.8); padding: 15px; border-radius: 12px; border: 1px solid #444; width: 200px; text-align: center; backdrop-filter: blur(4px);">
                <img src="${node.img}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px; border: 1px solid #ffffff;">
                <h3 style="color: white; margin: 0 0 5px 0; font-size: 18px;">
                    ${node.displayName}
                </h3>
                <p style="color: #ffffff; font-size: 12px; margin: 0 0 10px 0; cursor: text;">
                    username: ${node.name}
                </p>
                <p style="color: #ffffff; font-size: 12px; margin: 0 0 10px 0; cursor: text;">
                    ID: ${node.id}
                </p>
                <button id="close-btn-${node.id}"" style="padding: 5px 10px; cursor: pointer; border: none; border-radius: 4px;">
                    Close
                </button>
            </div>
        `
    }

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
                padding={"5px"}
                margin="10px"
            >
                Reset
            </Button>
            {graphData.nodes.length > 0 && (
                <ForceGraph3D

                    ref={fgRef}
                    graphData={graphData}
                    extraRenderers={renderer}
                    nodeThreeObject={(node) => {
                        const nodeEl = document.createElement("div")

                        nodeEl.innerHTML = generateHtml(node)
                        nodeEl.style.pointerEvents = "auto"
                        nodeEl.style.cursor = "pointer"

                        nodeEl.onclick = () => {

                            if (selectedNode.current == nodeEl) { return }

                            if (selectedNode.current) {
                                resetNode(selectedNode.current)
                            }

                            nodeEl.innerHTML = generateExpandedHtml(node)
                            nodeEl.style.zIndex = "10000"
                            nodeEl.style.userSelect = "text"
                            // nodeEl.style.cursor = "auto"

                            selectedNode.current = nodeEl
                            nodeEl.onpointerdown = (event) => {
                                event.stopPropagation()
                            }

                            setTimeout(() => {
                                const closeBtn = document.getElementById(`close-btn-${node.id}`)
                                if (closeBtn) {
                                    closeBtn.onclick = (e) => {
                                        e.stopPropagation()
                                        resetNode(nodeEl)
                                        selectedNode.current = null;
                                    }
                                }
                            }, 0)
                        }


                        // const button = document.createElement("button")
                        // button.style.textAlign = "center"
                        // button.textContent = node.name
                        // button.onclick = () => {alert}

                        nodeEl.nodeData = node
                        return new CSS2DObject(nodeEl)
                    }}
                    nodeThreeObjectExtend={false}


                />)}
        </div>
    )
}

export default GraphView