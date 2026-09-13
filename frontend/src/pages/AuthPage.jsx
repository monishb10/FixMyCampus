import { useState } from 'react'
import {
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Lock,
  Mail,
  User,
  Building,
  BadgeAlert,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { api } from '../services/api'
import { DEPARTMENTS } from '../services/roles'

export default function AuthPage({ onLoginSuccess }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
    department: 'Computer Science & Engineering',
    idNumber: '',
  })

  const demoAccounts = [
    {
      role: 'STUDENT',
      label: 'Student Account',
      email: 'student@fixmycampus.edu',
      password: 'student123',
      name: 'Monish B',
      badge: 'Student CSE',
      icon: GraduationCap,
      color: '#225cff',
      bgColor: '#eef3ff',
    },
    {
      role: 'TEACHER',
      label: 'Teacher Account',
      email: 'teacher@fixmycampus.edu',
      password: 'teacher123',
      name: 'Prof. Sarah Jenkins',
      badge: 'Faculty ECE',
      icon: Briefcase,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
    },
    {
      role: 'ADMIN',
      label: 'Admin Account',
      email: 'admin@fixmycampus.edu',
      password: 'admin123',
      name: 'Operations Director',
      badge: 'Facilities Lead',
      icon: ShieldCheck,
      color: '#e34b55',
      bgColor: '#fef2f2',
    },
  ]

  async function handleLogin(e) {
    e?.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const user = await api.login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      })
      setSuccess('Login successful! Redirecting to campus workspace...')
      setTimeout(() => {
        onLoginSuccess(user)
      }, 400)
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  async function handleQuickDemoLogin(account) {
    setError('')
    setSuccess('')
    setLoading(true)
    setLoginForm({ email: account.email, password: account.password })

    try {
      const user = await api.login({
        email: account.email,
        password: account.password,
      })
      setSuccess(`Signed in as ${account.name} (${account.role})...`)
      setTimeout(() => {
        onLoginSuccess(user)
      }, 400)
    } catch (err) {
      // Fallback: if user is not in DB yet, auto-register demo user then log in
      try {
        await api.register({
          name: account.name,
          email: account.email,
          password: account.password,
          role: account.role,
          department: account.badge,
          idNumber: `${account.role}-DEMO`,
        })
        const user = await api.login({
          email: account.email,
          password: account.password,
        })
        onLoginSuccess(user)
      } catch (regErr) {
        setError(`Demo sign-in error: ${regErr.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleRegister(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.register({
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
        role: registerForm.role,
        department: registerForm.department,
        idNumber: registerForm.idNumber.trim(),
      })

      setSuccess('Account created successfully! Signing you in...')
      // Immediately log in with new credentials
      const user = await api.login({
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
      })
      setTimeout(() => {
        onLoginSuccess(user)
      }, 500)
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="authPageWrapper">
      <div className="authCard card">
        {/* Brand Banner */}
        <div className="authBrand">
          <div className="brandMark">
            <ShieldCheck size={26} color="#fff" />
          </div>
          <div>
            <h2>FixMyCampus</h2>
            <span>Smart Campus Operations & Issue Resolution</span>
          </div>
        </div>

        {/* 1-Click Quick Demo Sign In */}
        <div className="demoLoginSection">
          <div className="demoHeader">
            <Sparkles size={15} color="#2563eb" />
            <span>1-Click Role Sign In (Instant Testing):</span>
          </div>
          <div className="demoGrid">
            {demoAccounts.map((acct) => {
              const Icon = acct.icon
              return (
                <button
                  key={acct.role}
                  type="button"
                  className="demoBtn"
                  style={{ borderColor: `${acct.color}44` }}
                  onClick={() => handleQuickDemoLogin(acct)}
                  disabled={loading}
                >
                  <div className="demoIcon" style={{ backgroundColor: acct.bgColor, color: acct.color }}>
                    <Icon size={16} />
                  </div>
                  <div className="demoText">
                    <strong>{acct.label}</strong>
                    <small>{acct.name}</small>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="authDivider">
          <span>or sign in with your campus credentials</span>
        </div>

        {/* Tabs: Sign In / Create Account */}
        <div className="authTabs">
          <button
            type="button"
            className={`authTab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError(''); setSuccess('') }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`authTab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError(''); setSuccess('') }}
          >
            Create New Account
          </button>
        </div>

        {/* Error / Success Notifications */}
        {error && (
          <div className="authAlert error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="authAlert success">
            <CheckCircle2 size={16} />
            <span>{success}</span>
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form className="authForm" onSubmit={handleLogin}>
            <label>
              <span>Campus Email Address</span>
              <div className="inputWithIcon">
                <Mail size={16} />
                <input
                  type="email"
                  required
                  placeholder="e.g. student@fixmycampus.edu"
                  value={loginForm.email}
                  onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))}
                />
              </div>
            </label>

            <label>
              <span>Password</span>
              <div className="inputWithIcon">
                <Lock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="passwordToggleBtn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" className="primary authSubmitBtn" disabled={loading}>
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form className="authForm" onSubmit={handleRegister}>
            {/* Role Selection Picker */}
            <div className="rolePickerGroup">
              <span className="rolePickerLabel">Select Your Campus Role:</span>
              <div className="roleOptionCards">
                <label className={`roleOptionCard ${registerForm.role === 'STUDENT' ? 'selected student' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={registerForm.role === 'STUDENT'}
                    onChange={e => setRegisterForm(f => ({ ...f, role: e.target.value }))}
                  />
                  <GraduationCap size={20} />
                  <strong>Student</strong>
                  <small>Report issues, track status & upvote</small>
                </label>

                <label className={`roleOptionCard ${registerForm.role === 'TEACHER' ? 'selected teacher' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="TEACHER"
                    checked={registerForm.role === 'TEACHER'}
                    onChange={e => setRegisterForm(f => ({ ...f, role: e.target.value }))}
                  />
                  <Briefcase size={20} />
                  <strong>Teacher / Faculty</strong>
                  <small>Classroom watch & endorse tickets</small>
                </label>

                <label className={`roleOptionCard ${registerForm.role === 'ADMIN' ? 'selected admin' : ''}`}>
                  <input
                    type="radio"
                    name="role"
                    value="ADMIN"
                    checked={registerForm.role === 'ADMIN'}
                    onChange={e => setRegisterForm(f => ({ ...f, role: e.target.value }))}
                  />
                  <ShieldCheck size={20} />
                  <strong>Administrator</strong>
                  <small>Manage operations & assign staff</small>
                </label>
              </div>
            </div>

            <div className="twoCol">
              <label>
                <span>Full Name</span>
                <div className="inputWithIcon">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monish B / Prof. Sharma"
                    value={registerForm.name}
                    onChange={e => setRegisterForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
              </label>

              <label>
                <span>Campus Email</span>
                <div className="inputWithIcon">
                  <Mail size={16} />
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@campus.edu"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </label>
            </div>

            <div className="twoCol">
              <label>
                <span>Password (6+ characters)</span>
                <div className="inputWithIcon">
                  <Lock size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Create a secure password"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(f => ({ ...f, password: e.target.value }))}
                  />
                  <button
                    type="button"
                    className="passwordToggleBtn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </label>

              <label>
                <span>Department / Branch</span>
                <div className="inputWithIcon">
                  <Building size={16} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science / ECE"
                    value={registerForm.department}
                    onChange={e => setRegisterForm(f => ({ ...f, department: e.target.value }))}
                  />
                </div>
              </label>
            </div>

            <label>
              <span>{registerForm.role === 'TEACHER' ? 'Faculty Staff ID' : registerForm.role === 'ADMIN' ? 'Employee Code' : 'Student Registration Number'}</span>
              <div className="inputWithIcon">
                <BadgeAlert size={16} />
                <input
                  type="text"
                  placeholder={registerForm.role === 'TEACHER' ? 'e.g. FAC-2024-09' : 'e.g. STU-2024-41'}
                  value={registerForm.idNumber}
                  onChange={e => setRegisterForm(f => ({ ...f, idNumber: e.target.value }))}
                />
              </div>
            </label>

            <button type="submit" className="primary authSubmitBtn" disabled={loading}>
              <span>{loading ? 'Creating Account...' : `Register as ${registerForm.role}`}</span>
              <ArrowRight size={17} />
            </button>
          </form>
        )}

        {/* Footer Feature Badges */}
        <div className="authFeatures">
          <span>📸 Real Photo Upload</span>
          <span>⚡ Live Ticket Tracking</span>
          <span>🛡️ Role-Protected Operations</span>
        </div>
      </div>
    </div>
  )
}
