import { useState } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faDesktop,
  faQuestionCircle,
  faList,
  faPlusCircle
} from '@fortawesome/free-solid-svg-icons'
import auth from '../actions/auth'
import axios from 'axios'

const VIEWS = [
  ['Overview', faList],
  ['Websites', faDesktop],
  ['Settings', faCog],
  ['Help', faQuestionCircle]
]

const Dashboard = ({ userData }) => {
  const [view, setView] = useState(0)
  const [showSubmit, setShowSubmit] = useState(false)

  const changeEmail = async (e) => {
    const res = await axios.put(
      'http://localhost:5000/api/auth/updatedetails',
      { email: e.target[0].value }
    )
  }

  const changePwd = async (e) => {
    const res = await axios.put(
      'http://localhost:5000/api/auth/updatepassword',
      { currentPassword: e.target[0].value, newPassword: e.target[1].value },
      { headers: { Authorization: `Bearer ${userData.token}` } }
    )
  }

  // Show submit button if user has typed
  const checkForButton = (e) => {
    console.log(e.target)
    if (e.target.value) {
      setShowSubmit(true)
    } else {
      setShowSubmit(false)
    }
  }

  return (
    <>
      <div className='dashboard-container'>
        <div className='left-panel'>
          {VIEWS.map((item, index) => (
            <span
              className={`dashboard-option ${
                view === index ? 'option-selected' : ''
              }`}
              onClick={() => setView(index)}
              key={index}>
              <FontAwesomeIcon icon={item[1]} />
              {`  ${item[0]}`}
            </span>
          ))}
          <div className='copy-container'>
            <p className='copyright'>
              Created by <a href='https://matyi.pro'>Matyi Kari</a>
            </p>
          </div>
        </div>
        <section className='dashboard-content'>
          <h2>{VIEWS[view][0]}</h2>
          {view === 0 && (
            <div className='auto-grid'>
              <div className='card-option'>
                <h4>
                  Add Website <FontAwesomeIcon icon={faPlusCircle} />
                </h4>
              </div>
              <div className='card-option' onClick={() => setView(1)}>
                <h4>View Websites</h4>
              </div>
            </div>
          )}
          {view === 1 && (
            <div className='auto-grid'>
              {userData.user.data.websites.map((item, index) => (
                <Link key={`site${index}`} href={`/websites/${item._id}`}>
                  <div className='website'>
                    <h4>{item.name}</h4>
                    <div className='bottom-bar'>
                      <span className='total-visits'>
                        <span className='number'>{item.visits}</span> Total
                        Visits
                      </span>
                      <span className='monthy-visits'>
                        <span className='number'>12</span> Visits This Month
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {view === 2 && (
            <div className='settings-down'>
              <div className='setting'>
                Change Email{' '}
                <form
                  onSubmit={(e) => changeEmail(e)}
                  onChange={(e) => checkForButton(e)}>
                  <input type='email' placeholder='Email' />
                  <input type='password' placeholder='Password' />
                  {showSubmit && <button type='submit'>Change</button>}
                </form>
              </div>
              <div className='setting'>
                Change Password{' '}
                <form
                  onSubmit={(e) => changePwd(e)}
                  onChange={(e) => checkForButton(e)}>
                  <input type='password' placeholder='Old Password' />
                  <input type='password' placeholder='New Password' />
                  {showSubmit && <button type='submit'>Change</button>}
                </form>
              </div>
              <div className='setting'>Delete Account</div>
            </div>
          )}
          {view === 3 && (
            <p>
              Visitscout offers free and easy visit statistics for your website.
              Just add your website and copy+paste the given script into each
              page you want to track.
            </p>
          )}
        </section>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  userData: state.auth
})

export default connect(mapStateToProps, { auth })(Dashboard)
