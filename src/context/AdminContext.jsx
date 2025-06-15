import { createContext,useState,useEffect, useContext } from "react";
import { auth } from '../firebase/firebaseConfig';
const AdminContext = createContext();


export const AdminProvider = ({children})=>{

    const getDataFromStorage = (key, defaultValue) => {
        try {
          const item = localStorage.getItem(key);
          const parsedItem = item ? JSON.parse(item) : defaultValue;
          
         
          if (key === 'antivCart' && !Array.isArray(parsedItem)) {
            console.error(`Data from localStorage for ${key} is not an array`);
            return defaultValue;
          }
          
          return parsedItem;
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage`, error);
          return defaultValue;
        }
      };



    const [admin, setAdmin] = useState(() => getDataFromStorage('admin', ''));
    const [token, setToken] = useState(() => localStorage.getItem('token'));


    useEffect(() => {
        localStorage.setItem('admin', JSON.stringify(admin));
        localStorage.setItem('token', JSON.stringify(token));
      }, [admin,token]);

    

      useEffect(() => {
        const handleTokenExpiration = () => {
       
          const expirationTime = Date.now() + 3600 * 1000; 
          const logoutTimeout = setTimeout(() => {
            logout(); 
          }, expirationTime - Date.now());
    
          return () => clearTimeout(logoutTimeout);
        };
    
        if (admin) {
          handleTokenExpiration();
        }
      }, [admin]);

      const logout = () =>{
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        window.location.reload();
      }
      

    return(
        <AdminContext.Provider value={{admin,setAdmin,token, setToken,logout}}>
            {children}
        </AdminContext.Provider>
    )
}


export const useAdminProvider = () => useContext(AdminContext)