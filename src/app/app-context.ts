import React, { Context } from "react";

export type AppContextType = {
    dragging: boolean;
    setDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext: Context<AppContextType> = React.createContext<AppContextType>({} as AppContextType);


export default AppContext;
