
import Button from './Button'
import React, { useState, useEffect, useRef, useMemo } from 'react'
import ForceGraph3D from "react-force-graph-3d"
import { ObjectLoader } from 'three';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { useImmer } from "use-immer"


const GraphView = ({ showGraph, setGraphHidden, friendsData, setFriendsData, newFriends, setNewFriends,
    usernameSearchingFor, mainUsername, searchFromNode, onStartPage, setOnStartPage, rootNodes, setRootNodes }) => {

    const [graphData, setGraphData] = useImmer({ nodes: [], links: [] });
    const mutableGraphData = useMemo(() => {
        if (!graphData) return { nodes: [], links: [] };
        return structuredClone(graphData);
    }, [graphData]);

    const option = { height: "100%", width: "100%" }
    const fgRef = useRef()
    const selectedNode = useRef(null)
    const renderer = useMemo(() => [new CSS2DRenderer()], [])

    const addToDictionary = (setFunc, key, value) => {
        setFunc(draft => {
            draft[key] = value;
        });
    };

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
            console.log(friendsData[usernameSearchingFor].id, friend.id)
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
            return
        }

        if (Object.keys(friendsData).length === 0) {
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
                                console.log("search")
                                await searchFromNode(node.name)
                                unexpandNode(e)
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