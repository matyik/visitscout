import Head from 'next/head'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Dashboard from '../components/Dashboard'

const Home = ({ auth: { isAuthenticated, loading } }) => {
  return (
    <>
      <Head>
        {!loading && isAuthenticated ? (
          <title>Dashboard - Visitscout</title>
        ) : (
          <title>Visitscout - Easily track website visitors</title>
        )}
      </Head>
      <Navbar />
      {!loading && isAuthenticated ? (
        <Dashboard />
      ) : (
        <section className='left-section'>
          <div className='h1area'>
            <h1>Easily understand your users.</h1>
            <div className='bottom'></div>
          </div>
          <p>
            Visitscout is the free and easy way to see your website analytics.
            Get specific stats for each month, with information including the
            page, browser, and OS.
          </p>
          <Link href='/register'>
            <button>Try for free</button>
          </Link>
        </section>
      )}
    </>
  )
}

Home.propTypes = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Home)
