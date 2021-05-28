import { useState } from 'react'
import { connect } from 'react-redux'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCog,
  faDesktop,
  faQuestionCircle,
  faList
} from '@fortawesome/free-solid-svg-icons'
import auth from '../actions/auth'

const VIEWS = [
  ['Overview', faList],
  ['Websites', faDesktop],
  ['Settings', faCog],
  ['Help', faQuestionCircle]
]

const Dashboard = ({ userData }) => {
  const [view, setView] = useState(0)
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
          {view === 0 && 'ill do this last'}
          {view === 1 && (
            <div className='auto-grid'>
              {userData.websites.map((item, index) => (
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
        </section>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  userData: state.auth.user.data
})

export default connect(mapStateToProps, { auth })(Dashboard)
