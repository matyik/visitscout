import Head from 'next/head'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { setAlert } from '../actions/alert'
import { registerUser } from '../actions/auth'
import Alert from '../components/alert'
import auth from '../actions/auth'

const register = ({ setAlert, registerUser, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  })

  const { email, password, password2 } = formData
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match')
    } else {
      registerUser({
        email,
        password
      })
    }
  }

  if (isAuthenticated) document.location = 'http://localhost:3000'

  return (
    <>
      <Head>
        <title>Register - Visitscout</title>
      </Head>
      <Alert />
      <Navbar />
      <div className='container'>
        <form className='register-form' onSubmit={onSubmit} onChange={onChange}>
          <h2>Register</h2>
          <input name='email' type='email' placeholder='Email' autoFocus />
          <input name='password' type='password' placeholder='Password' />
          <input
            name='password2'
            type='password'
            placeholder='Confirm Password'
          />
          <button>Register</button>
        </form>
        <img className='dots' src='patternpad.svg' alt='Circles Pattern' />
      </div>
    </>
  )
}

register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, registerUser, auth })(
  register
)
