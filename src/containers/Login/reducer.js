import { getAccountsFromWIFKey } from 'neon-js'

import {
  LOGIN_REQ,
  LOGIN_HIDE_ERROR
} from './constants'

const initialState = {
  isLogged: false,
  account: false,
  isLoading: false,
  alertDialogShown: false
}

export default function account (state = initialState, action) {
  switch (action.type) {
    case LOGIN_REQ:
      console.log("ACTION", action)
      const account = doLogin(action.wif)

      return {
        ...state,
        account: account,
        isLogged: account,
        alertDialogShown: !account,
        isLoading: true
      }

    case LOGIN_HIDE_ERROR:
      return {
        ...state,
        alertDialogShown: false
      }

    default:
      return state
  }
}

function doLogin (wif) {
  let account
  try {
    account = getAccountsFromWIFKey(wif)[0]
    console.log(account)
  } catch (e) {
    account = -1
  }

  if (account === -1 || account === -2 || account === undefined) {
    return false
  }

  return account
}