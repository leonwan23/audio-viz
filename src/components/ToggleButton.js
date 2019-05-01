import React from 'react'

export default function ToggleButton({name, isActive, handleToggle}) {
  return (
    <div 
    className={isActive ? "toggle-active" : "toggle-button"}
    onClick={isActive ? null : () => handleToggle(name)}
    >
      {name}
    </div>
  )
}
