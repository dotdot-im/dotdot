import React from 'react'
import { Table } from 'react-bootstrap'

export default () => {
  return (
    <div>
      <h4>Welcome to dotdot</h4>
      <p>
        This is a place where you can chat with people whenever you want :)
        <br />
        We don't save any messages, so when the last person in a chat
        disconnects, the chat history is lost.
      </p>
      <p>Inactive user accounts are deleted after 2 weeks without chatting.</p>

      <h6>Keep your User</h6>
      <p>
        You can set a password to protect your username from being deleted and
        used by someone else. Simply click on the lock in the top right corner.
      </p>

      <h6>Private Messages</h6>
      <p>
        You can send anyone a private message simply by starting your message
        with @ and their name. You'll see the text box change to orange and a
        lock icon appear.
      </p>
      <p>
        Only you and the person you send the message to can see them. If they
        are offline they won't receive the message
      </p>

      <h5>Commands</h5>
      <p>There are some commands that you can use:</p>
      <Table size="sm" variant="dark">
        <thead>
          <tr>
            <th>Command</th>
            <th>Example</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>/help</code>
            </td>
            <td>
              <code>/help</code>
            </td>
            <td>It shows this message</td>
          </tr>
          <tr>
            <td>
              <code>/set color</code>
            </td>
            <td>
              <code>/set color eb0000</code>
            </td>
            <td>
              Change your color, the color needs to be a hex representation
              (sorry if this sounds confusing, soon there will be an easier way
              to do this)
            </td>
          </tr>
          <tr>
            <td>
              <code>/set icon</code>
            </td>
            <td>
              <code>/set icon smile</code>
            </td>
            <td>
              Change your icon, pick any of the ones from{' '}
              <a
                href="https://fontawesome.com/icons?d=gallery&s=regular&c=emoji&m=free"
                rel="noopener noreferrer"
                target="_blank"
              >
                this list
              </a>
            </td>
          </tr>
          <tr>
            <td>
              <code>/list</code>
            </td>
            <td>
              <code>/list</code>
            </td>
            <td>Get a list of the users who are currently online</td>
          </tr>
        </tbody>
      </Table>
    </div>
  )
}
