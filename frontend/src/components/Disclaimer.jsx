import React from 'react'
import "bootstrap/dist/js/bootstrap.bundle.min.js"

const Disclaimer = () => {
    return (
        <div style={{ marginTop: "15px" }}>
            <p>
                <button className="btn btn-warning" type="button" data-bs-toggle="collapse" data-bs-target="#text"
                    aria-expanded="false" aria-controls="text">
                    Roblox API limitations
                </button>
            </p>

            <div className="collapse" id="text">
                <div className="card card-body">
                    I don't have any special relationship with Roblox, so they are super strict with me calling their
                    cloud api. Roblox severely limits the amount of requests I can send per minute, so I have to
                    resort to waiting until the rate limit resets or *exponential backoff*. Wait times are usually
                    1-2 minutes, so I apologize for the inconvenience.
                </div>
            </div>
        </div>
    )
}

export default Disclaimer