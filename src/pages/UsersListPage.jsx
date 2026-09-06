import React, { useEffect, useMemo, useState } from 'react'
import { Check, Pencil, Search, Shield, ShieldCheck, Trash2, UserCheck, UserPlus, Users, UserRound, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { changeRole } from '../api/auth'
import { addUser, deleteUser, getUsers, updateUser } from '../api/users'
import ConfirmDialog from '../components/common/ConfirmDialog'
import { getUsersFromResponse } from '../components/dashboard/dashboardData'

const PAGE_SIZE = 8
const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')
const normalizeUser = (user) => ({ ...user, id: firstDefined(user?._id, user?.id, user?.userId), name: firstDefined(user?.name, user?.fullName, user?.username, 'Unnamed user'), email: firstDefined(user?.email, 'No email'), phone: firstDefined(user?.phone, ''), role: String(firstDefined(user?.role, 'customer')).toLowerCase(), verified: Boolean(firstDefined(user?.isVerified, false)), avatar: firstDefined(user?.avatar, user?.image, user?.profileImage) })
const addForm = { username: '', email: '', password: '', phone: '' }
const editForm = (user) => ({ username: user?.username || '', phone: user?.phone || '', avatar: user?.avatar || '' })

function UserModal({ mode, user, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(mode === 'edit' ? editForm(user) : addForm)
  const updateField = (event) => setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }))
  return <div className="users-modal-backdrop"><section className="users-modal" role="dialog" aria-modal="true"><div className="users-modal-heading"><div><p className="eyebrow">USER MANAGEMENT</p><h2>{mode === 'edit' ? 'Edit User' : 'Add User'}</h2></div><button type="button" onClick={onClose} aria-label="Close"><X size={20} /></button></div><form onSubmit={(event) => { event.preventDefault(); onSubmit(form) }} className="user-form"><label>Username<input name="username" value={form.username} onChange={updateField} required /></label>{mode === 'add' && <label>Email<input name="email" type="email" value={form.email} onChange={updateField} required /></label>}{mode === 'add' && <label>Password<input name="password" type="password" value={form.password} onChange={updateField} required /></label>}<label>Phone<input name="phone" value={form.phone} onChange={updateField} placeholder="+201234567890" /></label>{mode === 'edit' && <label>Avatar URL<input name="avatar" value={form.avatar} onChange={updateField} placeholder="https://example.com/avatar.png" /></label>}<div className="users-modal-actions"><button type="button" className="modal-cancel" onClick={onClose}>Cancel</button><button type="submit" className="modal-submit" disabled={loading}>{loading ? 'Saving...' : mode === 'edit' ? 'Save Changes' : 'Add User'}</button></div></form></section></div>
}

function UserAvatar({ user }) { return user.avatar ? <img className="user-avatar" src={user.avatar} alt="" /> : <div className="user-avatar user-avatar-fallback">{user.name.charAt(0).toUpperCase()}</div> }

export default function UsersListPage() {
  const [users, setUsers] = useState([]); const [query, setQuery] = useState(''); const [page, setPage] = useState(1); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [modal, setModal] = useState(null); const [mutationLoading, setMutationLoading] = useState(false); const [deleteTarget, setDeleteTarget] = useState(null); const [roleTarget, setRoleTarget] = useState(null)
  const fetchUsers = async () => { setLoading(true); setError(''); try { const response = await getUsers(); setUsers(getUsersFromResponse(response).map(normalizeUser)) } catch (requestError) { setError(requestError.response?.status === 401 || requestError.response?.status === 403 ? 'You are not authorized to manage users.' : requestError.response?.data?.message || 'Unable to load users.') } finally { setLoading(false) } }
  useEffect(() => { fetchUsers() }, []); useEffect(() => { setPage(1) }, [query])
  const filteredUsers = useMemo(() => { const value = query.trim().toLowerCase(); return value ? users.filter((user) => `${user.name} ${user.username || ''} ${user.email}`.toLowerCase().includes(value)) : users }, [users, query]); const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE)); const visibleUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const cards = [['Total Users', users.length, Users], ['Admins', users.filter((user) => user.role === 'admin').length, Shield], ['Customers', users.filter((user) => user.role === 'customer').length, UserRound], ['Verified', users.filter((user) => user.verified).length, UserCheck]]
  const submitUser = async (form) => {
    setMutationLoading(true)
    try {
      if (modal.mode === 'edit') {
        const fields = ['username', 'phone', 'avatar']
        const payload = Object.fromEntries(fields.map((field) => [field, form[field]]).filter(([, value]) => value !== ''))
        await updateUser(modal.user.id, payload)
      } else {
        const fields = ['username', 'email', 'password', 'phone']
        const payload = Object.fromEntries(fields.map((field) => [field, form[field]]).filter(([, value]) => value !== ''))
        await addUser(payload)
      }
      toast.success(modal.mode === 'edit' ? 'User updated successfully.' : 'User added successfully.')
      setModal(null)
      await fetchUsers()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'User mutation is not supported by the API.')
    } finally {
      setMutationLoading(false)
    }
  }
  const removeUser = async () => { if (!deleteTarget) return; setMutationLoading(true); try { await deleteUser(deleteTarget.id); toast.success('User deleted successfully.'); setDeleteTarget(null); await fetchUsers() } catch (requestError) { toast.error(requestError.response?.data?.message || 'Unable to delete this user.') } finally { setMutationLoading(false) } }
  const confirmRoleChange = async () => {
    if (!roleTarget) return
    const nextRole = roleTarget.role === 'admin' ? 'customer' : 'admin'
    setMutationLoading(true)
    try {
      await changeRole(roleTarget.id, nextRole)
      toast.success(`${roleTarget.name} is now ${nextRole === 'admin' ? 'an admin' : 'a customer'}.`)
      setRoleTarget(null)
      await fetchUsers()
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || 'Unable to change this user\'s role.')
    } finally {
      setMutationLoading(false)
    }
  }
  return <div className="users-page"><section className="users-header"><div><p className="eyebrow">USER MANAGEMENT</p><h1>Manage Users</h1></div><div className="users-header-actions"><label className="users-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search users..." aria-label="Search users" /></label><button className="add-user-button" type="button" onClick={() => setModal({ mode: 'add' })}><UserPlus size={18} /> Add User <span>⌄</span></button></div></section>{loading ? <div className="users-state">Loading users...</div> : error ? <div className="users-state users-error"><p>{error}</p><button type="button" onClick={fetchUsers}>Try Again</button></div> : <><section className="user-stats-grid" aria-label="User statistics">{cards.map(([label, value, Icon]) => <article className="user-stat-card" key={label}><div><p>{label}</p><strong>{value}</strong></div><span><Icon size={23} /></span></article>)}</section><section className="users-table-panel"><div className="users-table-scroll"><table className="users-table"><thead><tr><th>User</th><th>Role</th><th>Verified</th><th>Actions</th></tr></thead><tbody>{visibleUsers.map((user) => <tr key={user.id}><td><div className="user-cell"><UserAvatar user={user} /><div><strong>{user.name}</strong><span>{user.email}</span></div></div></td><td><span className="role-badge">{user.role}</span></td><td><span className={`verification-badge ${user.verified ? 'yes' : 'no'}`}>{user.verified ? <Check size={16} /> : <X size={16} />} {user.verified ? 'Yes' : 'No'}</span></td><td><div className="user-actions"><button className="edit-action" type="button" onClick={() => setModal({ mode: 'edit', user })} aria-label={`Edit ${user.name}`}><Pencil size={17} /></button><button className="verify-action" type="button" onClick={() => setRoleTarget(user)} aria-label={user.role === 'admin' ? `Demote ${user.name} to customer` : `Promote ${user.name} to admin`} title={user.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}><ShieldCheck size={17} /></button><button className="delete-action" type="button" onClick={() => setDeleteTarget(user)} aria-label={`Delete ${user.name}`}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div>{visibleUsers.length === 0 && <div className="users-empty">No users found.</div>}{filteredUsers.length > 0 && <div className="users-pagination"><span>Page {page} of {totalPages}</span><div><button type="button" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>Previous</button><button type="button" disabled={page === totalPages} onClick={() => setPage((value) => value + 1)}>Next</button></div></div>}</section></>} {modal && <UserModal mode={modal.mode} user={modal.user} onClose={() => setModal(null)} onSubmit={submitUser} loading={mutationLoading} />}<ConfirmDialog isOpen={Boolean(deleteTarget)} title="Delete user" message={`Delete ${deleteTarget?.name || 'this user'}? This action cannot be undone.`} confirmText="Delete" loading={mutationLoading} onCancel={() => setDeleteTarget(null)} onConfirm={removeUser} /><ConfirmDialog isOpen={Boolean(roleTarget)} title="Change user role" message={roleTarget ? `Make ${roleTarget.name} ${roleTarget.role === 'admin' ? 'a customer' : 'an admin'}?` : ''} confirmText="Confirm" loading={mutationLoading} onCancel={() => setRoleTarget(null)} onConfirm={confirmRoleChange} /></div>
}
