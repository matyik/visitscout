import { useEffect, useState } from 'react'
import Head from 'next/head'
import PropTypes from 'prop-types'
import { Pie, Bar } from 'react-chartjs-2'
import axios from 'axios'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import Navbar from '../../../components/Navbar'

const timezonestest = [
  {
    visits: 24,
    left: 19,
    top: 22.5,
    opacity: 1
  },
  {
    visits: 9,
    left: 47.5,
    top: 17.5,
    opacity: 0.5
  }
]

const Website = ({ auth: { token } }) => {
  // const [websiteId, setWebsiteId] = useState()
  // const router = useRouter()
  // useEffect(async () => {
  //   setWebsiteId(router.query.id)
  //   const { data } = await axios.get(
  //     `http://localhost:5000/api/website/${websiteId}`,
  //     {
  //       headers: { Authorization: `Bearer ${token}` }
  //     }
  //   )
  // }, [])
  return (
    <>
      <Head>{/* <title>Website {websiteId}</title> */}</Head>
      <Navbar />
      <div className='website-container'>
        <h1>Test Site</h1>
        <h3>134 Total Visits</h3>
        <span className='smalltext'>(Excluding 12 bot visits)</span>
        <div className='month-chart-container'>
          <Bar
            data={{
              datasets: [
                {
                  label: 'Visits',
                  data: [25, 52, 123],
                  backgroundColor: ['#aac2fd']
                }
              ],
              labels: ['Mar 2021', 'Apr 2021', 'May 2021']
            }}
          />
        </div>
        <div className='double-pie'>
          <div className='pie-chart-container'>
            <Pie
              data={{
                datasets: [
                  {
                    data: [5, 2, 5, 3],
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF'
                    ]
                  }
                ],
                labels: ['Chrome', 'Firefox', 'Edge', 'Safari']
              }}
            />
          </div>
          <div className='pie-chart-container'>
            <Pie
              data={{
                datasets: [
                  {
                    data: [5, 2, 5, 3, 6],
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: ['iOS', 'Windows', 'Mac', 'Linux', 'Android']
              }}
            />
          </div>
        </div>
        <div className='timezonemap'>
          <img src='../../world.svg' alt='World Map SVG' />
          <div className='points-container'>
            {timezonestest.map(({ visits, left, top, opacity }, index) => (
              <svg
                key={`tz${index}`}
                title={visits}
                viewBox='0 0 166.418 166.418'
                style={{ left: `${left}%`, top: `${top}%`, width: '40px' }}>
                <path
                  style={{ fill: '#ff6819', opacity }}
                  d='M83.209,166.418c-7.121,0-13.11-4.387-15.258-11.176l-3.572-11.285
    c-5.089-16.083-13.75-31.047-25.742-44.478c-9.853-11.036-15.236-25.269-15.156-40.078c0.086-15.993,6.312-30.945,17.53-42.102
    C52.229,6.144,67.215,0,83.209,0c32.934,0,59.728,26.794,59.728,59.729c0,15.138-5.676,29.576-15.982,40.657
    c-11.19,12.03-19.574,26.691-24.917,43.575l-3.57,11.281C96.319,162.031,90.33,166.418,83.209,166.418z M83.209,5
    C52.685,5,28.645,28.908,28.481,59.429c-0.073,13.568,4.858,26.61,13.886,36.721c12.465,13.961,21.475,29.538,26.779,46.3
    l3.572,11.285c1.793,5.665,6.595,7.684,10.492,7.684c3.896,0,8.698-2.019,10.491-7.684l3.57-11.281
    c5.568-17.597,14.324-32.896,26.023-45.474c9.443-10.151,14.644-23.381,14.644-37.251C137.937,29.551,113.387,5,83.209,5z
    M83.209,91.996c-18.188,0-32.984-14.797-32.984-32.984c0-18.188,14.797-32.985,32.984-32.985c18.188,0,32.985,14.797,32.985,32.985
    C116.194,77.199,101.397,91.996,83.209,91.996z M83.209,31.026c-15.431,0-27.984,12.554-27.984,27.985
    c0,15.431,12.554,27.984,27.984,27.984c15.431,0,27.985-12.554,27.985-27.984C111.194,43.58,98.64,31.026,83.209,31.026z'
                />
              </svg>
            ))}
          </div>
        </div>
        <div className='double-pie'>
          <div className='pie-chart-container'>
            <Pie
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Pages'
                  }
                }
              }}
              data={{
                datasets: [
                  {
                    data: [5, 2, 5, 3, 6],
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: ['/', '/login', '/register', '/dashboard', '/settings']
              }}
            />
          </div>
          <div className='pie-chart-container'>
            <Pie
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Time Zones'
                  }
                }
              }}
              data={{
                datasets: [
                  {
                    data: [3, 3, 4, 6, 5],
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: ['PDT', 'MDT', 'CDT', 'EDT', 'CEST']
              }}
            />
          </div>
          <div className='pie-chart-container'>
            <Pie
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: 'Devices'
                  }
                }
              }}
              data={{
                datasets: [
                  {
                    data: [12, 42],
                    backgroundColor: ['#FFC294', '#9B7AFF']
                  }
                ],
                labels: ['Mobile', 'Desktop']
              }}
            />
          </div>
        </div>
        <footer>
          Created by <a href='http://matyi.pro'>Matyi Kari</a>
        </footer>
      </div>
    </>
  )
}

Website.propTypes = {
  auth: PropTypes.object.isRequired
}
const mapStateToProps = (state) => ({
  auth: state.auth
})

export default connect(mapStateToProps)(Website)
