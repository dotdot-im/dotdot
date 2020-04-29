import React, { useRef } from 'react'
import { Form, Container, Button, Row, Col, InputGroup } from 'react-bootstrap'
import { useImmer } from 'use-immer'
import classNames from 'classnames'
import HCaptcha from 'react-hcaptcha'
import ReCaptcha from 'react-google-recaptcha'

import { useGlobalState } from 'store/state'
import { fetchResource } from 'util/fetch'

import styles from './index.module.scss'
import { AuthData } from 'store/types'
import { CAPTCHA_KEY, CAPTCHA_PROVIDER } from '../../constants'
import Logo from 'components/Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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
  }

  const reset = () => {
    console.log('reset')
    setState((draft) => {
      draft.loading = false
      draft.hasPassword = false
    })
  }

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
      })
  }

  let theme: 'light' | 'dark' = 'light'
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    theme = 'dark'
  }

  return (
    <div className={styles.all}>
      <Container className={styles.login}>
        <div className={styles.title}>
          {localState.hasPassword
            ? "I've seen you before, welcome back!"
            : 'How should we call you?'}
        </div>
        <Form noValidate onSubmit={handleSubmit}>
          <Form.Group controlId="loginForm.username">
            <div className={styles.singleLineForm}>
              <InputGroup
                bsPrefix={classNames(styles.singleLineFormPiece, 'input-group')}
              >
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon1" className={styles.at}>
                    @
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="input"
                  type="text"
                  autoComplete="username"
                  placeholder="Username..."
                  disabled={localState.loading}
                  autoFocus
                  minLength={1}
                  maxLength={20}
                  onChange={(e) => {
                    const value = e.currentTarget.value
                    setState((draft) => {
                      draft.username = value
                    })
                  }}
                  value={localState.username}
                />
              </InputGroup>
              {localState.hasPassword && (
                <Form.Control
                  as="input"
                  className={styles.singleLineFormPiece}
                  type="password"
                  placeholder="Password..."
                  autoComplete="current-password"
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
              <Button
                className={styles.singleLineFormPiece}
                type="submit"
                size="sm"
              >
                Enter
              </Button>
            </div>

            <div className={styles.subtitle}>
              {localState.hasPassword && (
                <Button variant="link" onClick={reset}>
                  Not you?
                </Button>
              )}
            </div>

            {CAPTCHA_PROVIDER === 'recaptcha' && (
              <ReCaptcha
                ref={captchaRef}
                size="invisible"
                theme={theme}
                sitekey={CAPTCHA_KEY}
                onChange={oncaptchaChange}
              />
            )}
            {CAPTCHA_PROVIDER === 'hcaptcha' && (
              <HCaptcha
                ref={captchaRef}
                size="invisible"
                theme={theme}
                sitekey={CAPTCHA_KEY}
                onVerify={oncaptchaChange}
              />
            )}
          </Form.Group>
        </Form>
      </Container>

      <Container>
        <Row>
          <Logo className={styles.logo} />
        </Row>
        <Row>
          <p className={styles.description}>
            A place where you can talk to people
          </p>
        </Row>
        <Row>
          <Col sm={12} md={true}>
            <h5 className={styles.ksp}>Limited capacity</h5>
            <p className={styles.copy}>
              Never more than 10 people at once. Big live chats make it
              impossible to have a conversation or keep track of one. Here we
              break it down so people can engage.
            </p>
          </Col>
          <Col sm={12} md={true}>
            <h5 className={styles.ksp}>Message streaming</h5>
            <p className={styles.copy}>
              As you type, your message will be shared live with the room, and
              so will other dot's messages. This makes for a more engaging, real
              experience.
            </p>
          </Col>
          <Col sm={12} md={true}>
            <h5 className={styles.ksp}>Absolutely private</h5>
            <p className={styles.copy}>
              No private data is stored, period. We don’t relate your IP to your
              user, so we could never track you.
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className={styles.github}>
              <a
                href="https://github.com/dotdot-im"
                target="_blank"
                rel="external noopener"
                title="View dotdot organisation on GitHub"
              >
                <FontAwesomeIcon icon={['fab', 'github']} /> dotdot-im
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
