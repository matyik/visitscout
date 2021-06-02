import Head from 'next/head'
import PropTypes from 'prop-types'
import { Pie, Bar } from 'react-chartjs-2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux'
import Navbar from '../../../components/Navbar'

const Website = ({
  auth: {
    user: {
      data: { websites }
    }
  }
}) => {
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

  const calculateStats = () => {
    const { visits, months, browsers, os, timeZones, pages, mobile } =
      websites[0]

    const MONTHS = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ]
    const TIMEZONES = {
      11: [10, 10],
      10: [4, 37],
      9: [10, 45],
      8: [16.5, 11],
      7: [15.5, 25],
      6: [19, 22],
      5: [21, 28.5],
      4: [27.5, 22.5],
      3: [24.5, 61],
      2: [38.5, 3],
      1: [41, 40],
      '-0': [43.5, 5],
      '-1': [47, 14],
      '-2': [50, 16],
      '-3': [57, 12],
      '-4': [63, 37],
      '-5': [66, 32],
      '-5.5': [68, 32],
      '-6': [65.5, 18],
      '-7': [77, 39],
      '-8': [78, 24],
      '-9': [84.4, 24],
      '-10': [88, 75],
      '-11': [81.5, 7.5],
      '-12': [93, 80]
    }

    let monthLabels = []
    let monthData = []
    let browserLabels = []
    let browserData = []
    let osLabels = []
    let osData = []
    let timeZonesCoords = []
    let timeZoneData = []
    let timeZoneLabels = []
    let pagesData = []
    let pagesLabels = []
    let deviceData = [mobile, visits]

    // Monthly
    for (const [key, value] of Object.entries(months)) {
      let monthText = key.split('-')
      monthLabels.push(
        `${MONTHS[monthText[1]]} ${monthText[0].substr(1, monthText[0].length)}`
      )
      monthData.push(value)
    }

    // Browser
    for (const [key, value] of Object.entries(browsers)) {
      browserLabels.push(key.charAt(0).toUpperCase() + key.slice(1))
      browserData.push(value)
    }

    // OS
    for (const [key, value] of Object.entries(os)) {
      key.charAt(0) === 'i'
        ? osLabels.push('iOS')
        : osLabels.push(key.charAt(0).toUpperCase() + key.slice(1))
      osData.push(value)
    }

    // Pages
    for (const [key, value] of Object.entries(pages)) {
      pagesLabels.push(key)
      pagesData.push(value)
    }

    // Time Zone
    for (const [keyy, value] of Object.entries(timeZones)) {
      const key = keyy.slice(1)
      timeZonesCoords.push({
        left: TIMEZONES[key][0],
        top: TIMEZONES[key][1]
      })
      timeZoneLabels.push(
        `UTC${key.charAt(0) === '-' ? `+${key.slice(1)}` : `-${key}`}`
      )
      timeZoneData.push(value)
    }

    return {
      monthLabels,
      monthData,
      browserLabels,
      browserData,
      osLabels,
      osData,
      timeZonesCoords,
      timeZoneLabels,
      timeZoneData,
      pagesLabels,
      pagesData,
      deviceData
    }
  }

  const copyText = () => {
    navigator.permissions.query({ name: 'clipboard-write' }).then((result) => {
      if (result.state == 'granted' || result.state == 'prompt') {
        navigator.clipboard.writeText(
          `<script>const VISITSCOUT_ID = '${websites[0]._id}'</script><script src='http://localhost:5000/tracker'></script>`
        )
      }
    })
  }

  return (
    <>
      <Head>
        <title>{websites[0].name} - Visitscout</title>
      </Head>
      <Navbar />
      <div className='website-container'>
        <h1>{websites[0].name}</h1>
        <div className='code-area'>
          <FontAwesomeIcon icon={faCopy} onClick={copyText} />
          <span className='color2'>
            &lt;!-- Add to your HTML to connect to Visitscout --&gt;
          </span>
          <br />
          <span className='color1'>&lt;script&gt;</span>
          <span className='color3'>const</span>{' '}
          <span className='color5'>VISITSCOUT_ID</span>{' '}
          <span className='color3'>=</span>{' '}
          <span className='color4'>'{websites[0]._id}'</span>
          <span className='color1'>&lt;/script&gt;</span>
          <br />
          <span className='color1'>&lt;script</span>{' '}
          <span className='color3'>src</span>
          <span className='color5'>=</span>
          <span className='color4'>'http://localhost:5000/tracker'</span>
          <span className='color1'>&gt;&lt;/script&gt;</span>
        </div>
        <h3>{websites[0].visits} Total Visits</h3>
        <span className='smalltext'>
          (Excluding {websites[0].probablyBot} bot visits)
        </span>
        <div className='month-chart-container'>
          <Bar
            data={{
              datasets: [
                {
                  label: 'Visits',
                  data: calculateStats().monthData,
                  backgroundColor: ['#aac2fd']
                }
              ],
              labels: calculateStats().monthLabels
            }}
            options={{
              scales: {
                x: {
                  reverse: true
                }
              }
            }}
          />
        </div>
        <div className='double-pie'>
          <div className='pie-chart-container'>
            <Pie
              data={{
                datasets: [
                  {
                    data: calculateStats().browserData,
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF'
                    ]
                  }
                ],
                labels: calculateStats().browserLabels
              }}
            />
          </div>
          <div className='pie-chart-container'>
            <Pie
              data={{
                datasets: [
                  {
                    data: calculateStats().osData,
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: calculateStats().osLabels
              }}
            />
          </div>
        </div>
        <h4>Time Zones Visualizer</h4>
        <div className='timezonemap'>
          <img src='../../world.svg' alt='World Map SVG' />
          <div className='points-container'>
            {calculateStats().timeZonesCoords.map(({ left, top }, index) => (
              <svg
                key={`tz${index}`}
                viewBox='0 0 166.418 166.418'
                style={{ left: `${left}%`, top: `${top}%`, width: '40px' }}>
                <path
                  style={{
                    fill: '#ff6819',
                    opacity:
                      (calculateStats().timeZoneData[index] /
                        websites[0].visits +
                        1) /
                      2
                  }}
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
                    data: calculateStats().pagesData,
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: calculateStats().pagesLabels
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
                    data: calculateStats().timeZoneData,
                    backgroundColor: [
                      '#FFC294',
                      '#FFF6A1',
                      '#FF86BC',
                      '#33E8FF',
                      '#9B7AFF'
                    ]
                  }
                ],
                labels: calculateStats().timeZoneLabels
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
                    data: calculateStats().deviceData,
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
