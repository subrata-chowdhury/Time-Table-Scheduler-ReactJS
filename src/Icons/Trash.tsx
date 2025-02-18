import React, { JSX } from "react"

interface TrashProps {
    width?: number
    height?: number
    fill?: string
}

const Trash: React.FC<TrashProps> = ({ width, height, fill, ...props }): JSX.Element => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} fill={fill} {...props}>
      <path d="M10 18a1 1 0 001-1v-6a1 1 0 00-2 0v6a1 1 0 001 1zM20 6h-4V5a3 3 0 00-3-3h-2a3 3 0 00-3 3v1H4a1 1 0 000 2h1v11a3 3 0 003 3h8a3 3 0 003-3V8h1a1 1 0 000-2zM10 5a1 1 0 011-1h2a1 1 0 011 1v1h-4zm7 14a1 1 0 01-1 1H8a1 1 0 01-1-1V8h10zm-3-1a1 1 0 001-1v-6a1 1 0 00-2 0v6a1 1 0 001 1z" fill={fill} />
    </svg>
  )
}

export default Trash
