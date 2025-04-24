import React, { useMemo } from "react";

const PeerContext = React.createContext();

export const PeerProvider = (props) =>{
    const peer = useMemo(()=>{
        
    })
    return (
        <PeerContext.Provider value={{}}>
            {props.children}
        </PeerContext.Provider>
    )
}

