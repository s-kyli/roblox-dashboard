import React from 'react'
import "./Button.css"

function Button({ children, buttonType, onClick, hide }) {
    return (
        <button style={{ display: hide ? "none" : "" }} className={`base-btn ${buttonType}`} onClick={onClick}>
            {children}
        </button>
    )
}

export default Button