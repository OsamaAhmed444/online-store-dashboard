import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ArrowRight, BarChart3, Box, Eye, EyeOff, ShieldCheck, Users } from 'lucide-react'

import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import { resetPasswordWithOtp, sendPasswordResetOtp } from '../api/auth'
import { useAuth } from '../context/AuthContext'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isResetOpen, setIsResetOpen] = useState(false)
  const [resetStep, setResetStep] = useState('email')
  const [resetForm, setResetForm] = useState({ email: '', otp: '', newPassword: '' })
  const [resetError, setResetError] = useState('')
  const [isResetting, setIsResetting] = useState(false)

  const validateField = (name, value) => {
    switch (name) {
      case 'email': {
        if (!value.trim()) return 'Email is required.'
        if (!EMAIL_REGEX.test(value.trim())) return 'Please enter a valid email address.'
        return ''
      }
      case 'password': {
        if (!value.trim()) return 'Password is required.'
        return ''
      }
      default:
        return ''
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    const fieldError = validateField(name, value)
    setErrors((previous) => ({
      ...previous,
      [name]: fieldError,
    }))

    if (submitError) {
      setSubmitError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const nextErrors = {
      email: validateField('email', formData.email),
      password: validateField('password', formData.password),
    }

    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    try {
      await login(formData.email.trim(), formData.password)
      navigate('/dashboard')
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Login failed. Please try again.'

      setSubmitError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openReset = () => {
    setResetForm({ email: formData.email.trim(), otp: '', newPassword: '' })
    setResetStep('email')
    setResetError('')
    setIsResetOpen(true)
  }

  const handleResetSubmit = async (event) => {
    event.preventDefault()
    setResetError('')

    if (resetStep === 'email') {
      if (!EMAIL_REGEX.test(resetForm.email.trim())) {
        setResetError('Enter a valid email address.')
        return
      }
    } else if (!resetForm.otp.trim() || resetForm.newPassword.length < 6) {
      setResetError('Enter the OTP and a password with at least 6 characters.')
      return
    }

    setIsResetting(true)
    try {
      if (resetStep === 'email') {
        await sendPasswordResetOtp(resetForm.email.trim())
        setResetStep('otp')
        toast.success('The password reset OTP was sent to your email.')
      } else {
        await resetPasswordWithOtp({
          email: resetForm.email.trim(),
          otp: resetForm.otp.trim(),
          newPassword: resetForm.newPassword,
        })
        setIsResetOpen(false)
        setFormData((previous) => ({ ...previous, email: resetForm.email.trim(), password: '' }))
        toast.success('Password reset successfully. You can sign in now.')
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Password reset failed.'
      setResetError(message)
      toast.error(message)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-shell">
        <section className="login-promo">
          <img className="login-promo-image" src="/login_image.jpeg" alt="Nexora store display" />
          <div className="login-brand"><span className="login-brand-mark">N</span><span><strong>Nexora</strong><small>STORE MANAGEMENT</small></span></div>
          <div className="login-promo-copy"><p className="login-eyebrow"><span /> SELL SMARTER</p><h1>Manage Your Store<br />Like a <em>Pro</em></h1><p>Control products, orders, users, carts and analytics from a modern dashboard experience.</p></div>
          <div className="login-features"><div><span><Box /></span><p><strong>Product Management</strong><small>Add, edit and organize your products.</small></p></div><div><span><BarChart3 /></span><p><strong>Order Tracking</strong><small>Monitor orders in real-time.</small></p></div><div><span><Users /></span><p><strong>Customer Insights</strong><small>Understand your customers better.</small></p></div></div>
          <div className="login-promo-foot"><strong>Build Bigger</strong><span>ONE ORDER AT A TIME</span></div>
        </section>
        <section className="login-form-panel">
          <div className="login-access-label">ADMIN ACCESS <span /></div>
          <div className="login-form-header"><h2>Welcome <em>Back</em></h2><p>Sign in to your admin dashboard</p></div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="login-label">Email Address</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@nexora.com"
              autoComplete="email"
              className="login-input"
            />
          </div>

          <div>
            <label className="login-label">Password</label>
            <div className="login-password-wrap">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="login-input"
            />
            <button type="button" className="login-password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff /> : <Eye />}</button></div>
          </div>

          <div className="login-options"><label><input type="checkbox" /> <span>Remember me</span></label><button type="button" onClick={openReset}>Forgot password?</button></div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="login-submit"
          >
            Sign In
          </Button>
        </form>

        <div className="login-divider"><span>OR</span></div>
<button type="button" className="login-google">
  <strong style={{ color: 'orange' }}>G</strong> Continue with Google <ArrowRight />
</button>
<div className="login-secure"><ShieldCheck /> Secure Admin Access</div>
        </section>
      </div>
      <Modal isOpen={isResetOpen} onClose={() => setIsResetOpen(false)} title="Reset password" className="login-reset-modal">
        <form onSubmit={handleResetSubmit} className="login-reset-form" noValidate>
          <p className="login-reset-copy">
            {resetStep === 'email' ? 'Enter your email and we will send you a one-time password.' : 'Enter the OTP from your email and choose a new password.'}
          </p>
          <Input
            label="Email Address"
            type="email"
            value={resetForm.email}
            onChange={(event) => setResetForm((previous) => ({ ...previous, email: event.target.value }))}
            disabled={resetStep === 'otp'}
            autoComplete="email"
          />
          {resetStep === 'otp' && <>
            <Input label="OTP" value={resetForm.otp} onChange={(event) => setResetForm((previous) => ({ ...previous, otp: event.target.value }))} inputMode="numeric" autoComplete="one-time-code" />
            <Input label="New Password" type="password" value={resetForm.newPassword} onChange={(event) => setResetForm((previous) => ({ ...previous, newPassword: event.target.value }))} autoComplete="new-password" />
          </>}
          {resetError && <p className="error-text">{resetError}</p>}
          <Button type="submit" loading={isResetting} className="login-submit">{resetStep === 'email' ? 'Send OTP' : 'Reset Password'}</Button>
        </form>
      </Modal>
    </div>
  )
}
