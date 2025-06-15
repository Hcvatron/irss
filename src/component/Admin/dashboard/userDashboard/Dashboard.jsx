import React from 'react'
import './Dashboard.css'
import DashboardTop from './DashboardTop'
import DashboardBot from './DashboardBot'

const Dashboard = ({user,onClose}) => {
  return (
    <div className='dashboard modal-overlay topmar'>
      <button onClick={onClose}>Close</button>
     <DashboardTop user={user} />
     <DashboardBot user={user} />
    </div>
  )
}

export default Dashboard