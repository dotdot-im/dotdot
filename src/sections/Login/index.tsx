import React, { useRef } from 'react'
import { Form, Container } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import HCaptcha from "react-hcaptcha"
import ReCaptcha from "react-google-recaptcha"

import { useGlobalState } from 'store/state'
import { fetchResource } from 'util/fetch'
import Logo from 'components/Logo'

import styles from './index.module.scss'
import { AuthData } from 'store/types'
import { CAPTCHA_KEY, CAPTCHA_PROVIDER } from '../../constants'

type State = {
  username: string
  password: string
  verified: boolean
  hasPassword: boolean
  loading: boolean
}

export default () => {
  const { dispatch } = useGlobalState()
  const [localState, setState] = useImmer<State>({
    username: '',
    password: '',
    verified: false,
    hasPassword: false,
    loading: false,
  })

  const captchaRef = useRef<any>(null)

  const handleSubmit = (e: React.ChangeEvent<any>) => {
    e.preventDefault()
    if (localState.verified) {
      oncaptchaChange('verified')
      return
    }
    captchaRef.current.execute()
  };

  const oncaptchaChange = (token: string | null) => {
    if (!token || localState.loading) {
      return
    }

    setState((draft) => {
      draft.loading = true
    })

    const body = {
      username: localState.username,
      password: localState.password,
      captchaToken: token,
    }
    fetchResource('/auth', 'POST', body)
      .then((data: AuthData) => {
        if (captchaRef.current.resetCaptcha) {
          captchaRef.current.resetCaptcha()
        }

        if (!data || !data.user.user_id) {
          console.warn('Invalid user object')
          dispatch({
            type: 'login',
            payload: null,
          })
          return
        }

        dispatch({
          type: 'login',
          payload: data,
        })
      })
      .catch((reason) => {
        if (reason.status !== 400) {
          // username requires password
          dispatch({
            type: 'error',
            payload: reason.errors.join(', '),
          })
        }

        if (captchaRef.current.resetCaptcha) {
          captchaRef.current.resetCaptcha()
        }

        setState((draft) => {
          draft.loading = false
          draft.verified = (reason.data && reason.data.verified) || false
          if (reason.status === 400) {
            draft.hasPassword = true
          }
        })
      }
    )
  }

  let theme: 'light' | 'dark' = 'light'
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme = 'dark'
  }

  return (
    <Container className={classNames(styles.login, 'mt-4')}>
      <Logo />
      <Form noValidate onSubmit={handleSubmit}>
        <Form.Group controlId="loginForm.username">
          <Form.Control
            as="input"
            type="text"
            placeholder="What's your name?"
            disabled={localState.loading}
            autoFocus
            minLength={ 1 }
            maxLength={ 20 }
            onChange={(e) => {
              const value = e.currentTarget.value
              setState((draft) => {
                draft.username = value
              })
            }}
            value={localState.username}
          />
          {localState.hasPassword && (
            <Form.Control
              as="input"
              className="mt-2"
              type="password"
              placeholder="Password..."
              disabled={localState.loading}
              autoFocus
              onChange={(e) => {
                const value = e.currentTarget.value
                setState((draft) => {
                  draft.password = value
                })
              }}
              value={localState.password}
            />
          )}
          { CAPTCHA_PROVIDER === 'recaptcha' && (
            <ReCaptcha
              ref={ captchaRef }
              size='invisible'
              theme={ theme }
              sitekey={ CAPTCHA_KEY }
              onChange={ oncaptchaChange }
            />
          )}
          { CAPTCHA_PROVIDER === 'hcaptcha' && (
            <HCaptcha
              ref={ captchaRef }
              size='invisible'
              theme={ theme }
              sitekey={ CAPTCHA_KEY }
              onVerify={ oncaptchaChange }
            />
          )}
          <button type="submit" style={{ visibility: 'hidden' }}>
            Login
          </button>
        </Form.Group>
      </Form>
    </Container>
  )
}
