import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import './Dashbot.css';
import { useLoginProvider } from '../../context/LoginContext';

const DashboardBot = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { user } = useLoginProvider();

  const userId = user?.uid; // Handle cases where user may not be defined

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
    return date.toLocaleDateString(); // Formats date based on user's locale
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loadingio-spinner">
          <div className="spinner-animation">
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
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>Type</th>
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
                  <td className={`transaction-type ${transaction.type === 'withdraw' ? 'withdraw' : 'credited'}`}>
                    {transaction.type === 'withdraw' ? 'Withdrawn' : 'Credited'}
                  </td>
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
