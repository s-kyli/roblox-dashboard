
import Button from './Button'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import ForceGraph3D from "react-force-graph-3d"
import { ObjectLoader } from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { useImmer } from "use-immer"


const GraphView = ({ showGraph, setGraphHidden, friendsData, setFriendsData, newFriends, setNewFriends,
    usernameSearchingFor, mainUsername, searchFromNode, onStartPage, setOnStartPage, rootNodes, setRootNodes }) => {

    const [graphData, setGraphData] = useImmer({ nodes: [], links: [] });
    const [nodeMoveTo, setNodeMoveTo] = useState("")
    const mutableGraphData = useMemo(() => {
        if (!graphData) return { nodes: [], links: [] };
        return structuredClone(graphData);
    }, [graphData]);
    const [loading, setLoading] = useState(false)
    const fgRef = useRef()
    const selectedNode = useRef(null)
    const renderer = useMemo(() => [new CSS2DRenderer()], [])
    const [componentKey, setComponentKey] = useState(0)

    useEffect(() => {
        if (fgRef.current) {
            fgRef.current.d3Force("charge").strength(-1000)
            fgRef.current.d3Force("link").distance(300)
        }
    }, [graphData])

    useEffect(() => {
        if (!newFriends || !usernameSearchingFor) {
            return
        }

        if (Object.keys(newFriends).length === 0) {
            return
        }

        const sourceUser = friendsData[usernameSearchingFor];
        if (!sourceUser) {
            console.error("Source user not found in dictionary:", usernameSearchingFor);
            return;
        }


        const newNodes = []
        const newConns = []

        for (const [name, friend] of Object.entries(newFriends)) {

            if (name == mainUsername) { continue }
            if (!friendsData[name]) {
                newNodes.push({
                    id: friend.id,
                    name: name,
                    val: 5,
                    img: friend.headShotId,
                    displayName: friend.displayName,
                    verified: friend.hasVerifiedBadge
                })
            }
            // console.log(friendsData[usernameSearchingFor].id, friend.id)
            newConns.push({ source: friendsData[usernameSearchingFor].id, target: friend.id })
        }

        setRootNodes(draft => {
            draft[usernameSearchingFor] = friendsData[usernameSearchingFor]
        })

        setGraphData(draft => {
            draft.nodes.push(...newNodes)
            draft.links.push(...newConns)
        })
        setFriendsData(draft => {
            Object.assign(draft, newFriends)
        })
        setNewFriends({})



    }, [newFriends])

    useEffect(() => {

        if (!onStartPage) {
            console.log(graphData.nodes, graphData.links)
            console.log("returning onstartpage")
            return
        }

        if (!friendsData || !mainUsername) {
            setGraphData({ nodes: [], links: [] })
            setComponentKey(prev => prev + 1)
            return
        }

        if (Object.keys(friendsData).length === 0) {
            setGraphData({ nodes: [], links: [] })
            setNodeMoveTo("")
            setLoading(false)
            selectedNode.current = null
            if (selectedNode.current) {
                selectedNode.current = null
            }
            setComponentKey(prev => prev + 1)
            return
        }

        const mainUser = friendsData[mainUsername]

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

        for (const [name, friend] of Object.entries(friendsData)) {
            if (name != mainUsername) {
                newNodes.push({
                    id: friend.id,
                    name: name,
                    val: 5,
                    img: friend.headShotId,
                    displayName: friend.displayName,
                    verified: friend.hasVerifiedBadge
                })
                newConns.push({ source: mainUser.id, target: friend.id })
            }
        }

        setRootNodes(draft => {
            draft[mainUsername] = mainUser
        })

        setGraphData(draft => {
            draft.nodes.push(...newNodes)
            draft.links.push(...newConns)
        })

        setGraphData({ nodes: newNodes, links: newConns })
        setOnStartPage(false)

    }, [friendsData])

    const moveToNode = () => {

        const node = mutableGraphData.nodes.find(n => n.name.toLowerCase() === nodeMoveTo.toLowerCase())
        if (!node) { return }
        const distance = 100
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z)
        const newPos = node.x || node.y || node.z
            ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
            : { x: 0, y: 0, z: distance }

        console.log(node.x, node.y, node.z)
        fgRef.current.cameraPosition(
            newPos,
            node,
            3000,
        )
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

    // generate html for when you click on one specific node
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
                ${!rootNodes[node.name]
                ? `<button id="search-btn-${node.id}"" style="background: #0077ffb5; color:white; padding: 5px 10px; cursor: pointer; border: none; border-radius: 4px;">
                            Search Friends
                        </button>`
                : ""
            }
                <button id="close-btn-${node.id}"" style="background: #ff0000b3; color:white; padding: 5px 10px; margin-top: 10px; cursor: pointer; border: none; border-radius: 4px;">
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
            <div
                className='search-container'
                style={{
                    display: "flex",
                    transform: "translateX(-50%)",
                    zIndex: 1000,
                    padding: "5px",
                    margin: "auto",
                    position: "absolute",
                    left: "50%",
                    alignItems: "center",
                    gap: "10px",
                    width: "fit-content",
                }}
            >
                <Button
                    buttonType={"outline-dark"}
                    onClick={setGraphHidden}
                    height={"4vh"}
                    padding={"0px"}
                >
                    Reset
                </Button>

                <p
                    style={{
                        htmlFor: "search-container",
                        color: "white",
                        margin: "0"
                    }}
                >
                    Search for node:
                </p>

                <input style={{ borderRadius: "7px", width: "40%", margin: 0 }} type="search" id="search-container" value={nodeMoveTo}
                    onChange={(e) => setNodeMoveTo(e.target.value)}></input>

                <Button padding={"0px"} height={"4vh"} onClick={moveToNode} buttonType="outline-dark">Search</Button>
            </div>


            {graphData.nodes.length > 0 && (
                <ForceGraph3D
                    key={componentKey}
                    ref={fgRef}
                    graphData={mutableGraphData}
                    extraRenderers={renderer}
                    nodeThreeObject={(node) => {
                        const nodeEl = document.createElement("div")

                        const unexpandNode = (e) => {
                            e.stopPropagation()
                            resetNode(nodeEl)
                            selectedNode.current = null;
                        }

                        nodeEl.innerHTML = generateHtml(node)
                        nodeEl.style.pointerEvents = "auto"
                        nodeEl.style.cursor = "pointer"

                        nodeEl.onclick = async (e) => {

                            e.stopPropagation()

                            if (e.target.closest(`#close-btn-${node.id}`)) {
                                console.log("pressing close button")
                                unexpandNode(e)
                                return
                            }

                            if (e.target.closest(`#search-btn-${node.id}`)) {
                                if (loading) { return }
                                setLoading(true)
                                console.log("search")
                                await searchFromNode(node.name)
                                unexpandNode(e)
                                setLoading(false)
                                return
                            }

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
                        }

                        nodeEl.nodeData = node
                        return new CSS2DObject(nodeEl)
                    }}
                    nodeThreeObjectExtend={false}


                />)}
        </div>
    )
}

export default GraphView