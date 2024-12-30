import React from "react"

interface FilterProp {
    size: number,
}

const Filter: React.FC<FilterProp> = ({ size, ...props }) => {
    return (
        <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="var(--textColor)" width={size} height={size} {...props}>
            <path d="m487.976 0h-463.948c-21.318 0-32.075 25.866-16.97 40.971l184.942 184.97v206.059c0 7.831 3.821 15.17 10.237 19.662l80 55.98c15.783 11.048 37.763-.149 37.763-19.662v-262.039l184.947-184.97c15.074-15.075 4.391-40.971-16.971-40.971z" />
        </svg>
    )
}

export default Filter