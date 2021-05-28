import '../styles/styles.css'
import { Provider } from 'react-redux'
import cookie from 'js-cookie'
import { useEffect } from 'react'
import store from '../store'
import setAuthToken from '../utils/setAuthToken'
import { loadUser } from '../actions/auth'

if (cookie.get('token')) {
  setAuthToken(cookie.get('token'))
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
