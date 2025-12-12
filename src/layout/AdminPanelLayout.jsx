import React from 'react'
import { Outlet } from 'react-router'

export const AdminPanelLayout = () => {
  return (
    <div>
        <Outlet />
    </div>
  )
}
