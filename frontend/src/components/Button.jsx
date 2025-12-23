import React from 'react'
import "./Button.css"

function Button({ children, buttonType, onClick }) {
    return (
        <button className={`base-btn ${buttonType}`} onClick={onClick} >{children}</button>
    )
}

export default Button