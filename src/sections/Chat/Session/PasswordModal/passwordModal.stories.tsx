import React from 'react';
import { Story, Meta } from '@storybook/react';
import PasswordModal, { Props } from '.';
import stateDecorator from 'store/util';

export default {
  title: 'Components/PasswordModal',
  component: PasswordModal,
  decorators: [
    stateDecorator({
      auth: {
        loggedIn: true,
        checked: true,
        user: {
          user_id: '1',
          name: 'Test user',
          color: '#eb0000',
          contrastColor: '#ff5454',
          hasPassword: true,
          isActive: true,
          icon: null,
          isAdmin: false,
        },
      },
    }),
  ],
} as Meta;

const Template: Story<Props> = (args) => <PasswordModal {...args} />;

export const Default = Template.bind({
  show: true,
});
