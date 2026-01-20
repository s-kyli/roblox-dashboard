import React from 'react'
import "./Button.css"

function Button({ children, buttonType, onClick, hide, position, zIndex, padding, margin, height }) {
    return (
        <button
            style={{
                display: hide ? "none" : "",
                position: position,
                zIndex: zIndex,
                padding: padding,
                margin: margin,
                height: height,
                textAlign: "center"
            }}
            className={`base-btn ${buttonType}`}
            onClick={onClick}

        >
            {children}
        </button>
    )
}

export default Button