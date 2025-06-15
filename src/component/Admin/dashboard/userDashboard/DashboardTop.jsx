import { useEffect, useState } from 'react';
import { db } from '../../../../firebase/firebaseConfig'; 
import { doc, getDoc } from 'firebase/firestore';


const DashboardTop = ({user}) => {
  const [bankDetails, setBankDetails] = useState(null);
  const [personalInfo, setPersonalInfo] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.id) {
        console.log(user);
        const userRef = doc(db, 'users', user.id); 
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          console.log("name-->", data);
          setBankDetails(data.bankDetails);
          setPersonalInfo({
            name: data.personalInfo.name,
            email: data.personalInfo.email,
            phone: data.personalInfo.phone,
            dob: data.dob,
            address: data.billingAddress
          });
        } else {
          console.log("No such document!");
        }
      }
    };

    fetchUserData();
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  if (!bankDetails || !personalInfo) {
    return (
      <div className="loading-container">
        <div className="loadingio-spinner-dual-ball-nq4q5u6dq7r">
          <div className="ldio-x2uulkbinbj">
            <div></div><div></div><div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='dashboard-top'>
      <div className="dashboard-card personal-info">
        <h2>Hi, {personalInfo.name}</h2>
        <p><span>Email</span>: <span>{personalInfo.email}</span></p>
        <p><span>Phone Number</span>: <span>+{personalInfo.phone}</span></p>
        <p><span>DOB</span>: <span>{formatDate(personalInfo.dob)}</span></p>
        <p><span>Address</span>: <span>{personalInfo.address.street}, {personalInfo.address.city}, {personalInfo.address.state}, {personalInfo.address.country}, Zip-{personalInfo.address.zip}</span></p>
      </div>

      <div className="dashboard-card bank-info">
        <h2><span>Bal:</span> ${Number(bankDetails.accountBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
        <p><span>Account Number</span>: <span>{bankDetails.accountNumber}</span></p>
        <p><span>Account Type</span>: <span>Saving</span></p>
        <p><span>Mode</span>: <span>Contactless</span></p>
        <p><span>Account Opening Date</span>: <span>{formatDate(bankDetails.accountOpeningDate)}</span></p>
      </div>
    </div>
  );
};

export default DashboardTop;
