import { createContext,useContext,useState } from "react";

const LocalContext = createContext();


export const LocalProvider = ({children})=>{
    const [data, setData] = useState({
        name: 'IRS',
        // email:'support@hcvatron.com',
        // phone: "+1 (888) 681-4978",
        // phonecall: "+18886814978",
    });
   return(
    <LocalContext.Provider value={{data,setData}}>
        {children}
    </LocalContext.Provider>
   )
} 


export const useLocalContext = ()=> useContext(LocalContext)