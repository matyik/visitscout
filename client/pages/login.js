import Head from 'next/head'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { loginUser } from '../actions/auth'
import Alert from '../components/alert'
import auth from '../actions/auth'

const login = ({ loginUser, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const { email, password } = formData
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    loginUser({
      email,
      password
    })
  }

  if (isAuthenticated) document.location = 'http://localhost:3000'

  return (
    <>
      <Head>
        <title>Log in - Visitscout</title>
      </Head>
      <Alert />
      <Navbar />
      <div className='form-container'>
        <form onSubmit={onSubmit} onChange={onChange}>
          <h3>Welcome Back!</h3>
          <input name='email' type='text' placeholder='Email' />
          <input name='password' type='password' placeholder='Password' />
          <Link href='/forgotpassword'>Forgot Password?</Link>
          <button>Log In</button>
          <span className='register'>
            Don't have an account? <Link href='/register'>Register</Link>
          </span>
        </form>
      </div>
    </>
  )
}

login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { loginUser, auth })(login)
