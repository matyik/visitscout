import React from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../actions/auth'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  return (
    <div className='navbar'>
      <Link href='../'>Visitscout</Link>
      {!loading && isAuthenticated ? (
        <span onClick={logout}>Log out</span>
      ) : (
        <Link href='/login'>Log in</Link>
      )}
    </div>
  )
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps, { logout })(Navbar)
