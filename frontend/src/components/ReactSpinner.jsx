import React from 'react'
import { RingLoader } from "react-spinners"

const ReactSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm z-50">
            <RingLoader color="#0b8bd5" size={60} />
        </div>
    )
}

export default ReactSpinner