import React from 'react'
import "./Button.css"

function Button({ children, buttonType, onClick, hide, position, zIndex, padding }) {
    return (
        <button
            style={{
                display: hide ? "none" : "",
                position: position,
                zIndex: zIndex,
                padding: padding
            }}
            className={`base-btn ${buttonType}`}
            onClick={onClick}

        >
            {children}
        </button>
    )
}

export default Button