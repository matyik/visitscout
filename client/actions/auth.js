import axios from 'axios'
import { setAlert } from './alert'
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT
} from './types'
import cookie from 'js-cookie'
import setAuthToken from '../utils/setAuthToken'

// Load User
export const loadUser = () => async (dispatch) => {
  if (cookie.get('token')) {
    setAuthToken(cookie.get('token'))
  }

  try {
    const res = await axios.get('http://localhost:5000/api/auth/me')

    dispatch({ type: USER_LOADED, payload: res.data })
  } catch (err) {
    dispatch({ type: AUTH_ERROR })
  }
}

// Register User
export const registerUser = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/register',
      body,
      config
    )

    dispatch({ type: REGISTER_SUCCESS, payload: res.data })
  } catch (err) {
    console.log(err)
    const error = err.response ? err.response.data.error : 'Unknown error'
    if (error) {
      dispatch(setAlert(error))
    }
    dispatch({ type: REGISTER_FAIL })
  }
}

// Login User
export const loginUser = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  const body = JSON.stringify({ email, password })

  try {
    const res = await axios.post(
      'http://localhost:5000/api/auth/login',
      body,
      config
    )

    dispatch({ type: LOGIN_SUCCESS, payload: res.data })
  } catch (err) {
    console.log(err)
    const error = err.response ? err.response.data.error : 'Unknown error'
    if (error) {
      dispatch(setAlert(error))
    }
    dispatch({ type: LOGIN_FAIL })
  }
}

// Log out
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT })
}
