import React, { useState, useEffect } from 'react'
import Node from './Node'
import Button from './Button'
import Table from 'react-bootstrap/Table';

const Graph = ({ showGraph, setGraphHidden, friendsData }) => {

    const [newFriends, setNewFriends] = useState([]);

    useEffect(() => {
        if (!friendsData || friendsData.length === 0) {
            console.log("returning")
            return;
        }
        console.log("friendsData changegd")
        setNewFriends(friendsData);
    }, [friendsData])

    return (
        <div className="mt-4" style={{
            display: showGraph ? '' : 'none ',
            width: "100%",
            marginBottom: "15px",
            height: "100%",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "15px"
        }}>


            <h1 style={{ position: "absolute", top: "20px", maxWidth: "50%" }}>hello</h1>

            <Button buttonType={"outline-dark"} onClick={setGraphHidden}> Reset </Button>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                {/* <ListGroup>
                    {newFriends.map(friend => (
                        <ListGroup horizontal>
                            <ListGroup.Item width="30px">user id: {friend.id}</ListGroup.Item>
                            <ListGroup.Item width="30px">username: {friend.name}</ListGroup.Item>
                            <ListGroup.Item width="30px">display name: {friend.displayName}</ListGroup.Item>
                        </ListGroup>
                    ))}
                </ListGroup> */}

                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>user id</th>
                            <th>username</th>
                            <th>display name</th>
                            {/* <th>avatar headshot</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {newFriends.map(friend => (
                            <tr>
                                <td>{friend.id}</td>
                                <td>{friend.name}</td>
                                <td>{friend.displayName}</td>
                                {/* <td>{friend.headShotId}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>


        </div>
    )
}

export default Graph