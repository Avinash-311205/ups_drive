import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import LoginEmployee from './pages/LoginEmployee'
import LoginHR from './pages/LoginHR'
import EmployeeDashboard from './pages/EmployeeDashboard'
import TasksPage from './pages/TasksPage'
import LeavePage from './pages/LeavePage'
import LearningPage from './pages/LearningPage'
import DocumentsPage from './pages/DocumentsPage'
import SupportTicketsPage from './pages/SupportTicketsPage'
import HRDashboard from './pages/HRDashboard'
import RegisterPage from './pages/RegisterPage'
import EmployeesPage from './pages/hr/EmployeesPage'
import EmployeeDetailsPage from './pages/hr/EmployeeDetailsPage'
import TaskManagementPage from './pages/hr/TaskManagementPage'
import LearningManagementPage from './pages/hr/LearningManagementPage'
import LeaveRequestsPage from './pages/hr/LeaveRequestsPage'
import SupportTicketsPageHR from './pages/hr/SupportTicketsPageHR'
import KnowledgeBasePage from './pages/hr/KnowledgeBasePage'
import AssetManagementPage from './pages/hr/AssetManagementPage'
import HRDashboardHome from './pages/hr/HRDashboardHome'
import { getCurrentUser } from './services/authService'
import AIChat from './components/AIChat'

export default function App(){
  const user = getCurrentUser()
  if(!user) return (
    <Routes>
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/login/employee" element={<LoginEmployee/>} />
      <Route path="/login/hr" element={<LoginHR/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={user.role === 'hr' ? <HRDashboardHome/> : <EmployeeDashboard/>} />
        <Route path="/tasks" element={<TasksPage/>} />
        <Route path="/leave" element={<LeavePage/>} />
        <Route path="/learning" element={<LearningPage/>} />
        <Route path="/documents" element={<DocumentsPage/>} />
        <Route path="/support" element={<SupportTicketsPage/>} />
        {/* HR routes */}
        <Route path="/hr/employees" element={<EmployeesPage/>} />
        <Route path="/hr/employees/:id" element={<EmployeeDetailsPage/>} />
        <Route path="/hr/tasks" element={<TaskManagementPage/>} />
        <Route path="/hr/learning" element={<LearningManagementPage/>} />
        <Route path="/hr/leave-requests" element={<LeaveRequestsPage/>} />
        <Route path="/hr/support-tickets" element={<SupportTicketsPageHR/>} />
        <Route path="/hr/knowledge" element={<KnowledgeBasePage/>} />
        <Route path="/hr/assets" element={<AssetManagementPage/>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AIChat />
    </>
  )
}
