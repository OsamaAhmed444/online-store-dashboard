import React, { useEffect, useState } from 'react'
import { KeyRound, Save, ShieldCheck } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { updateUser } from '../api/users'
import Button from '../components/common/Button'

const firstDefined = (...values) => values.find((value) => value !== undefined && value !== null && value !== '')

export default function SettingsPage() {
  const { user, setUser } = useAuth()
  const userId = firstDefined(user?._id, user?.id)

  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
  })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileApiError, setProfileApiError] = useState('')
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' })
  const [passwordErrors, setPasswordErrors] = useState({})
  const [passwordApiError, setPasswordApiError] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      email: user?.email || '',
    })
  }, [userId])

  const updateProfileField = (event) => {
    const { name, value } = event.target
    setProfileForm((previous) => ({ ...previous, [name]: value }))
    if (profileErrors[name]) setProfileErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const submitProfile = async (event) => {
    event.preventDefault()
    const errors = {}
    if (!profileForm.username.trim()) errors.username = 'Username is required.'
    if (!profileForm.email.trim()) errors.email = 'Email is required.'
    setProfileErrors(errors)
    setProfileApiError('')
    if (Object.keys(errors).length) return

    setSavingProfile(true)
    try {
      const response = await updateUser(userId, profileForm)
      const updatedUser = response.data?.user || response.data
      setUser((previous) => ({ ...previous, ...updatedUser }))
      toast.success('Profile updated successfully.')
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to update profile.'
      setProfileApiError(message)
      toast.error(message)
    } finally {
      setSavingProfile(false)
    }
  }

  const updatePasswordField = (event) => {
    const { name, value } = event.target
    setPasswordForm((previous) => ({ ...previous, [name]: value }))
    if (passwordErrors[name]) setPasswordErrors((previous) => ({ ...previous, [name]: '' }))
  }

  const submitPassword = async (event) => {
    event.preventDefault()
    const errors = {}
    if (passwordForm.password.length < 6) errors.password = 'Use at least 6 characters.'
    if (passwordForm.password !== passwordForm.confirmPassword) errors.confirmPassword = 'Passwords do not match.'
    setPasswordErrors(errors)
    setPasswordApiError('')
    if (Object.keys(errors).length) return

    setSavingPassword(true)
    try {
      await updateUser(userId, { password: passwordForm.password })
      setPasswordForm({ password: '', confirmPassword: '' })
      toast.success('Password updated successfully.')
    } catch (requestError) {
      const message = requestError.response?.data?.message || 'Unable to update password.'
      setPasswordApiError(message)
      toast.error(message)
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = (profileForm.username || 'A').charAt(0).toUpperCase()
  const verified = Boolean(firstDefined(user?.isVerified, user?.verified, false))

  return (
    <div className="settings-page">
      <section className="settings-header">
        <p className="eyebrow">ACCOUNT SETTINGS</p>
        <h1>Settings</h1>
      </section>

      <div className="settings-grid">
        <section className="settings-card">
          <h2>Profile Information</h2>
          <p className="settings-card-desc">Update your personal details.</p>

          <div className="settings-avatar-row">
            <div className="settings-avatar">{initials}</div>
            <div>
              <strong>{profileForm.username || 'Admin'}</strong>
              <span>{profileForm.email || 'No email set'}</span>
            </div>
          </div>

          <form onSubmit={submitProfile} noValidate>
            {profileApiError && <div className="create-api-error" role="alert">{profileApiError}</div>}
            <div className="settings-form-grid">
              <label className="settings-field">
                First Name
                <input name="firstName" value={profileForm.firstName} onChange={updateProfileField} placeholder="First name" />
              </label>
              <label className="settings-field">
                Last Name
                <input name="lastName" value={profileForm.lastName} onChange={updateProfileField} placeholder="Last name" />
              </label>
            </div>

            <label className="settings-field">
              Username
              <input name="username" value={profileForm.username} onChange={updateProfileField} aria-invalid={Boolean(profileErrors.username)} />
              {profileErrors.username && <span className="settings-field-error">{profileErrors.username}</span>}
            </label>

            <label className="settings-field">
              Email
              <input name="email" type="email" value={profileForm.email} onChange={updateProfileField} aria-invalid={Boolean(profileErrors.email)} />
              {profileErrors.email && <span className="settings-field-error">{profileErrors.email}</span>}
            </label>

            <div className="settings-form-actions">
              <Button type="submit" loading={savingProfile} disabled={savingProfile}>
                <Save size={16} /> Save Changes
              </Button>
            </div>
          </form>
        </section>

        <div className="settings-column">
          <section className="settings-card">
            <h2>Account Overview</h2>
            <p className="settings-card-desc">Your current account status.</p>
            <div className="settings-badges">
              <span className="role-badge">{user?.role || 'admin'}</span>
              <span className={`verification-badge ${verified ? 'yes' : 'no'}`}>
                <ShieldCheck size={15} /> {verified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
            {user?.createdAt && (
              <div className="settings-overview-row">
                <span>Member since</span>
                <span>
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            )}
          </section>

          <section className="settings-card">
            <h2>Security</h2>
            <p className="settings-card-desc">Change your account password.</p>

            <form onSubmit={submitPassword} noValidate>
              {passwordApiError && <div className="create-api-error" role="alert">{passwordApiError}</div>}
              <label className="settings-field">
                New Password
                <input
                  name="password"
                  type="password"
                  value={passwordForm.password}
                  onChange={updatePasswordField}
                  placeholder="At least 6 characters"
                  aria-invalid={Boolean(passwordErrors.password)}
                />
                {passwordErrors.password && <span className="settings-field-error">{passwordErrors.password}</span>}
              </label>

              <label className="settings-field">
                Confirm Password
                <input
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={updatePasswordField}
                  placeholder="Re-enter password"
                  aria-invalid={Boolean(passwordErrors.confirmPassword)}
                />
                {passwordErrors.confirmPassword && <span className="settings-field-error">{passwordErrors.confirmPassword}</span>}
              </label>

              <div className="settings-form-actions">
                <Button type="submit" variant="outline" loading={savingPassword} disabled={savingPassword}>
                  <KeyRound size={16} /> Update Password
                </Button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  )
}
