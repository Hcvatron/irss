import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './Dashbot.css';


const DashboardBot = ({user}) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 

  const userId = user.id;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        if (userId) {
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            let userTransactions = userData.bankDetails?.transactions || [];

            // Sort transactions by date, latest first
            userTransactions = userTransactions.sort((a, b) => {
              return new Date(b.transactionDate) - new Date(a.transactionDate);
            });

            setTransactions(userTransactions);
          }
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loadingio-spinner-dual-ball-nq4q5u6dq7r">
          <div className="ldio-x2uulkbinbj">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboardbot">
      <h2>Transaction History ↓</h2>
      <div className="transaction-table-wrapper">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction Date</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Transaction Mode</th>
              <th>Transaction Type</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{formatDate(transaction.transactionDate)}</td>
                  <td>{transaction.transactionId}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{transaction.mode}</td>
                  <td className={`transaction-type credited`}>Credited</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No transactions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardBot;
