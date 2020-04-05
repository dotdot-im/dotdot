import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip, Button, Modal, Form } from "react-bootstrap";

import styles from './index.module.scss';
import { fetchResource } from 'util/fetch';
import useGlobalState from 'store/state';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

export default () => {
  const { state, dispatch } = useGlobalState();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [validated, setValidated] = useState<boolean>(false);

  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    if (form.checkValidity() === false || password !== repeatPassword) {
      return;
    }

    setValidated(true);

    const body = {
      password,
      repeatPassword,
    };

    fetchResource('/password', 'POST', body).then(() => {
      dispatch({
        type: 'user_password',
        payload: true,
      })
    }).catch(reason => {
      console.log('login fail reason', reason);
      dispatch({
        type: 'error',
        payload: reason.errors.join(', '),
      })
    });
  };

  let buttonClass = styles.unlocked;
  let buttonIcon: IconProp = 'lock-open';
  let tooltipText = 'Set a password to keep your username';

  if (state.auth.user && state.auth.user.hasPassword) {
    buttonClass = styles.locked;
    buttonIcon = 'lock';
    tooltipText = 'Change your password';
  }

  return (
    <div className={ styles.passwordLock }>
      <OverlayTrigger
          placement='bottom'
          delay={ 500 }
          overlay={
            <Tooltip id='passwordLock'>
              { tooltipText }
            </Tooltip>
          }
        >
          <Button variant="link" className={ buttonClass } onClick={ handleShow }>
            <FontAwesomeIcon icon={ buttonIcon } />
          </Button>
        </OverlayTrigger>

        <Modal show={ showModal } onHide={handleClose}>
          <Form noValidate validated={validated} onSubmit={handleSubmit} >
            <Modal.Header closeButton>
              <Modal.Title>Claim Username</Modal.Title>
            </Modal.Header>

            <Modal.Body>

              <Form.Group controlId="pwd.new">
                <Form.Control
                  as="input"
                  type="password"
                  placeholder='Password...'
                  autoFocus
                  required
                  minLength={ 6 }
                  onChange={ (event) => { setPassword(event.currentTarget.value); } }
                  value={ password }
                />
                <Form.Control.Feedback type="invalid">The password is too short. Minimum length is 6 characters.</Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="pwd.new">
                <Form.Control
                  as="input"
                  type="password"
                  placeholder='Repeat Password...'
                  required
                  minLength={ 6 }
                  pattern={ password }
                  onChange={ (event) => { setRepeatPassword(event.currentTarget.value); } }
                  value={ repeatPassword }
                />
                <Form.Control.Feedback type="invalid">The passwords don't match!</Form.Control.Feedback>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type='submit' variant="primary">
                Set password
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
    </div>
  );
};