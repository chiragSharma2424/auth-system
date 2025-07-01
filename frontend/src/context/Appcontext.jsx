import { createContext } from "react";


export const Appcontext = createContext();

export const AppcontextProvider = (props) => {
    const value = {
        // any values to share globally
    };

    return (
        <Appcontext.Provider value={value}>
            {props.children}
        </Appcontext.Provider>
    );
};
