import React from 'react'

export default function UsersTable({ users = [] }) {
  return (
    <div className="users-table-panel">
      <div className="users-table-scroll">
        <table className="users-table">
          <thead>
            <tr><th>User</th><th>Role</th><th>Verified</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map((user) => <tr key={user.id || user._id}><td>{user.name || user.username || user.email}</td><td>{user.role || '—'}</td><td>{user.isVerified ? 'Yes' : 'No'}</td><td>—</td></tr>)}
          </tbody>
        </table>
      </div>
    </div>
  )
}
