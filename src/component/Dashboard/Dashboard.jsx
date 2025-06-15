import React from 'react'
import './Dashboard.css'
import DashboardTop from './DashboardTop'
import DashboardBot from './DashboardBot'

const Dashboard = () => {
  return (
    <div className='dashboard topmar'>
     <DashboardTop />
     <DashboardBot />
    </div>
  )
}

export default Dashboard