import React from 'react'
import  logo from '../../assets/img/irslogo.png'
import  tax from '../../assets/img/tax.png'
import handshake from '../../assets/img/handshake.png'
import './Header.css'
import { useLoginProvider } from '../../context/LoginContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'


const Header = () => {

  const {user, logout} = useLoginProvider();
  const navigate = useNavigate();

  const handleLogout = () =>{
    logout();
    navigate('/');
    toast.success("You Have Been Logged Out");
  }

  return (
    <div className='header'>
        <div className="headertop">
            <div className="headerlogo">
              <img src={logo} alt="" />
            </div>
            <div className="headerright">
                <ul className="headerrightnav">
                    <li><a href="https://www.irs.gov/help/let-us-help-you">Help</a></li>
                    <li><a href="https://www.irs.gov/newsroom">News</a></li>
                    <li><a href="#">English</a></li>
                    <li><a href="https://www.irs.gov/charities-and-nonprofits"><img src={handshake} alt="" /><span>Charities and Nonprofits</span></a></li>
                    <li><a href="#"><img src={tax} alt="" /><span>Tax Pros</span></a></li>
                </ul>
            </div>
        </div>
        <div className="headerbot">
         <div className="headerbot-left">
          <nav>
           <a href="https://www.irs.gov/filing">File</a>
           <a href="#" className='active'>Banking</a>
           <a href="https://www.irs.gov/payments">Pay</a>
           <a href="https://www.irs.gov/credits-and-deductions">Credits & Deductions</a>
           <a href="https://www.irs.gov/forms-instructions">Forms & Instructions</a>
         </nav>
        </div>
  
        <div className="headerbot-right">
  <div className="search-bar">
    <input type="text" placeholder="Search" />
    <button>🔍</button>
  </div>
  
  {/* Only show logout button if user is logged in */}
  {user && (
    <div className="logout">
      <p onClick={handleLogout}> Logout →</p>
    </div>
  )}
</div>

     </div>
    </div>
  )
}

export default Header