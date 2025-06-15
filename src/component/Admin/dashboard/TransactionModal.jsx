import React, { useState } from 'react';
// import './TransactionModal.css'; 

const TransactionModal = ({ user, onClose, onTransaction }) => {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('Cash'); 
  const [date, setDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = {
      amount: parseFloat(amount),
      mode,
      date,
    };
    onTransaction(user.id, transactionData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Transaction for {user.personalInfo?.name}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Amount:
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='Enter Amount'
              required
            />
          </label>
          <label>
            Transaction Mode:
            <div className='select-container'>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className='select' required>
              <option value="Cash">Cash</option>
              <option value="Online">Online</option>
            </select>
            </div>
          </label>
          <label>
            Transaction Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
