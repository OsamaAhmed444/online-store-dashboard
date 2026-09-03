import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import Input from '../components/common/Input'
import Button from '../components/common/Button'
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fff7ed] px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#ffedd5] bg-white p-7 shadow-[0_24px_60px_rgba(249,115,22,0.12)] md:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff7ed] ring-1 ring-[#fed7aa]">
            <div className="relative h-8 w-8">
              <span className="absolute left-0 top-0 h-3 w-3 rotate-45 rounded-sm bg-[#f59e0b]" />
              <span className="absolute right-0 top-0 h-3 w-3 rotate-45 rounded-sm bg-[#fb923c]" />
              <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 rounded-sm bg-[#f97316]" />
            </div>
          </div>
          <h2 className="text-3xl font-black tracking-[-0.05em] text-[#1f2937]">Welcome Back</h2>
          <p className="mt-2 text-sm text-[#6b7280]">Sign in to your admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#374151]">Email Address</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="admin@koda.com"
              autoComplete="email"
              className="h-12 rounded-xl border border-[#fed7aa] bg-[#fffaf5] px-4 text-base text-[#1f2937] placeholder:text-[#9ca3af] focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#374151]">Password</label>
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-12 rounded-xl border border-[#fed7aa] bg-[#fffaf5] px-4 text-base text-[#1f2937] placeholder:text-[#9ca3af] focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20"
            />
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {submitError}
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="mt-2 h-12 w-full rounded-xl bg-[#f97316] text-base font-bold text-white shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:bg-[#ea580c]"
          >
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-xs font-medium uppercase tracking-[0.2em] text-[#9ca3af]">
          Secure Admin Access
        </div>
      </div>
    </div>
  )
}