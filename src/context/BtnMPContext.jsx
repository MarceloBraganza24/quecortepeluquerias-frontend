import { createContext, useState } from "react"

export const BtnMPContext = createContext(null)

export const BtnMPParent = ({children}) => {

    const [btnBuyVisible, setBtnBuyVisible] = useState(false);

    const handleBtnBuyVisible = (boolean) => {
        setBtnBuyVisible(boolean);
    };

    return (

        <BtnMPContext.Provider value={{ btnBuyVisible, handleBtnBuyVisible}}>
            {children}
        </BtnMPContext.Provider>

    )

}