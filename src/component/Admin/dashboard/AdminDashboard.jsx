import React, { useState, useEffect } from 'react';
import { useAdminProvider } from '../../../context/AdminContext';
import { db } from '../../../firebase/firebaseConfig';
import { collection, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import UpdateUserModal from './UpdateUserModal';
import TransactionModal from './TransactionModal'; // Import the new TransactionModal
import { toast } from 'react-toastify';
import Dashboard from './userDashboard/Dashboard';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const AdminDashboard = () => {
  const { admin,logout } = useAdminProvider();
  const [users, setUsers] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserData, setShowUserData] = useState(false);
  const [refresh, setRefresh ] = useState(true);

  const handleLogout = ()=>{
    logout();
  }

  const handleDownload = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Users Data');
  
      // Define the columns for the Excel sheet
      worksheet.columns = [
        { header: 'Field', key: 'field', width: 30 },
        { header: 'Value', key: 'value', width: 50 },
      ];
  
      users.forEach(user => {
        const billingAddress = user.billingAddress
          ? `${user.billingAddress.houseNumber} ${user.billingAddress.street}, ${user.billingAddress.city}, ${user.billingAddress.state}, ${user.billingAddress.country}, ${user.billingAddress.zip}`
          : 'N/A';
  
        // Add user information with a grey background for the Name row
        const nameRow = worksheet.addRow({ field: 'Name', value: user.personalInfo?.name || 'N/A' });
  
        // Apply grey background color to the name row
        nameRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D3D3D3' }, // Light Grey color (adjust if needed)
          };
        });
  
        // Add remaining user information as individual rows
        worksheet.addRow({ field: 'Email', value: user.personalInfo?.email || 'N/A' });
        worksheet.addRow({ field: 'Phone', value: user.personalInfo?.phone || 'N/A' });
        worksheet.addRow({ field: 'SSN', value: user.personalInfo?.ssn || 'N/A' });
        worksheet.addRow({ field: 'DOB', value: user.dob || 'N/A' });
        worksheet.addRow({ field: 'Account Number', value: user.bankDetails?.accountNumber || 'N/A' });
        worksheet.addRow({ field: 'Account Balance', value: user.bankDetails?.accountBalance || 0 });
        worksheet.addRow({ field: 'Account Opening Date', value: user.bankDetails?.accountOpeningDate || 'N/A' });
        worksheet.addRow({ field: 'Billing Address', value: billingAddress });
  
        // Add a space before transactions
        worksheet.addRow({});
  
        // Add a header row for transactions
        worksheet.addRow({ field: 'Transactions' });
        worksheet.addRow({
          field: 'Transaction ID',
          value: 'Amount | Mode | Date'
        });
  
        // Add each transaction as a separate row
        if (user.bankDetails?.transactions && user.bankDetails.transactions.length > 0) {
          user.bankDetails.transactions.forEach(txn => {
            worksheet.addRow({
              field: txn.transactionId,
              value: `${txn.amount} | ${txn.mode} | ${txn.transactionDate}`
            });
          });
        } else {
          worksheet.addRow({ field: 'No transactions', value: '' });
        }
  
        // Add an empty row between users for better separation
        worksheet.addRow({});
      });
  
      // Generate Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'AllUsersData.xlsx');
  
      toast.success("All users' data downloaded successfully!");
    } catch (error) {
      console.error('Error downloading users data:', error);
      toast.error("Failed to download users data.");
    }
  };
  
  

  const handleDownloadUserData = async (user) => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('User Data');
  
      // Define the main columns for the user's data
      worksheet.columns = [
        { header: 'Field', key: 'field', width: 30 },
        { header: 'Value', key: 'value', width: 50 },
      ];
  
      const billingAddress = user.billingAddress
        ? `${user.billingAddress.houseNumber} ${user.billingAddress.street}, ${user.billingAddress.city}, ${user.billingAddress.state}, ${user.billingAddress.country}, ${user.billingAddress.zip}`
        : 'N/A';
  
      // Add user information as individual rows
      worksheet.addRow({ field: 'Name', value: user.personalInfo?.name || 'N/A' });
      worksheet.addRow({ field: 'Email', value: user.personalInfo?.email || 'N/A' });
      worksheet.addRow({ field: 'Phone', value: user.personalInfo?.phone || 'N/A' });
      worksheet.addRow({ field: 'SSN', value: user.personalInfo?.ssn || 'N/A' });
      worksheet.addRow({ field: 'DOB', value: user.dob || 'N/A' });
      worksheet.addRow({ field: 'Account Number', value: user.bankDetails?.accountNumber || 'N/A' });
      worksheet.addRow({ field: 'Account Balance', value: user.bankDetails?.accountBalance || 0 });
      worksheet.addRow({ field: 'Account Opening Date', value: user.bankDetails?.accountOpeningDate || 'N/A' });
      worksheet.addRow({ field: 'Billing Address', value: billingAddress });
  
      // Add a header row for transactions
      worksheet.addRow({});
      worksheet.addRow({ field: 'Transactions' });
      worksheet.addRow({
        field: 'Transaction ID',
        value: 'Amount | Mode | Date'
      });
  
      // Add each transaction as a separate row
      if (user.bankDetails?.transactions && user.bankDetails.transactions.length > 0) {
        user.bankDetails.transactions.forEach(txn => {
          worksheet.addRow({
            field: txn.transactionId,
            value: `${txn.amount} | ${txn.mode} | ${txn.transactionDate}`
          });
        });
      } else {
        worksheet.addRow({ field: 'No transactions', value: '' });
      }
  
      // Generate the Excel file and trigger download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${user.personalInfo?.name || 'User'}_Data.xlsx`);
  
      toast.success("User data downloaded successfully!");
    } catch (error) {
      console.error('Error downloading user data:', error);
      toast.error("Failed to download user data.");
    }
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        setRefresh(false)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [refresh]);


  const handleUpdateClick = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  const handleTransactionClick = (user) => {
    setSelectedUser(user);
    setShowTransactionModal(true);
  };

  const handleShowUser = (user) =>{
    setSelectedUser(user);
    setShowUserData(true);
  }

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setShowTransactionModal(false);
    setSelectedUser(null);
    setShowUserData(false)
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      // Reference to the user document
      const userDocRef = doc(db, 'users', userId);
      
      // Fetch current user data
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      
      // Extract existing data
      const currentData = userDoc.data();
      console.log(currentData);
      
      // Prepare updated data while preserving previous transactions and accountOpeningDate
      const updatedUserData = {
        ...currentData,
        personalInfo: {
          ...currentData.personalInfo,
          ...updatedData.personalInfo,
        },
        dob: updatedData.dob,
        bankDetails: {
          ...currentData.bankDetails,
          accountNumber: updatedData.accountNumber,
          accountOpeningDate: currentData.bankDetails.accountOpeningDate, // Preserve accountOpeningDate
          accountBalance: parseFloat(updatedData.accountBalance),
          transactions: currentData.bankDetails?.transactions || [],
        },
      };
      
      // Update the document in Firestore
      await updateDoc(userDocRef, {
        personalInfo: updatedUserData.personalInfo,
        dob: updatedUserData.dob,
        bankDetails: {
          accountNumber: updatedUserData.bankDetails.accountNumber,
          accountBalance: updatedUserData.bankDetails.accountBalance,
          accountOpeningDate: updatedUserData.bankDetails.accountOpeningDate, // Ensure accountOpeningDate is updated
          transactions: updatedUserData.bankDetails.transactions,
        },
      });
      
      // Update local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, ...updatedData, bankDetails: { ...user.bankDetails, transactions: currentData.bankDetails.transactions } }
            : user
        )
      );
      
      toast.success("Updated successfully!");
      setRefresh(true);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error("Failed to update user.");
    }
  };

  const handleTransaction = async (userId, { amount, mode, date }) => {
    try {
      const user = users.find(user => user.id === userId);
      const currentBalance = user.bankDetails?.accountBalance || 0;
      const newBalance = currentBalance + amount;

      if (newBalance < 0) {
        toast.error("Insufficient funds.");
        return;
      }

      const transactionId = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      const transactionDate = date;

      const newTransaction = {
        transactionId,
        amount,
        mode,
        transactionDate,
      };

      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        'bankDetails.accountBalance': newBalance,
        'bankDetails.transactions': [...user.bankDetails.transactions, newTransaction],
      });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? {
                ...user,
                bankDetails: {
                  ...user.bankDetails,
                  accountBalance: newBalance,
                  transactions: [...user.bankDetails.transactions, newTransaction],
                },
              }
            : user
        )
      );

      toast.success(`Transaction successful! New balance: $${newBalance}`);
      handleCloseModal();
      setRefresh(true);
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast.error("Failed to process transaction.");
    }
  };

  return (
    <div className='admin-dashboard'>
      <header>
        <h1>Admin Dashboard</h1>
        <div>
          <h2>Hi {admin.name}</h2>
          <h3>Role: {admin.role}</h3>
        </div>
        <div className="download">
          <button onClick={handleDownload}>Download</button>
        </div>
        <div className="logout">
          <button onClick={handleLogout} >Logout</button>
        </div>
      </header>
      <main>
        <h2>User Details</h2>
        <table>
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Email</th>
              <th>Account Number</th>
              <th>Account Balance</th>
              <th>DOB</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                {/* <td>{user.id}</td> */}
                <td>{user.personalInfo?.name || 'N/A'}</td>
                <td>{user.personalInfo?.email || 'N/A'}</td>
                <td>{user.bankDetails?.accountNumber || 'N/A'}</td>
                <td>{user.bankDetails?.accountBalance || 0}</td>
                <td>{user.dob || 'N/A'}</td>
                <td>
                  <button onClick={() => handleUpdateClick(user)}>Update</button>
                  <button onClick={() => handleTransactionClick(user)}>Add Money</button>
                  <button onClick={()=> handleShowUser(user)}>Show User</button>
                  <button onClick={()=>handleDownloadUserData(user)}>Download User Data</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showUpdateModal && selectedUser && (
          <UpdateUserModal
            user={selectedUser}
            onClose={handleCloseModal}
            onUpdate={handleUpdateUser}
          />
        )}

        {showTransactionModal && selectedUser && (
          <TransactionModal
            user={selectedUser}
            onClose={handleCloseModal}
            onTransaction={handleTransaction}
          />
        )}

        {showUserData && selectedUser &&(
         <Dashboard 
           user={selectedUser}
           onClose={handleCloseModal}
         />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
