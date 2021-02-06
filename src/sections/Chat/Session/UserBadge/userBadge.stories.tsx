import React from 'react';
import { Story, Meta } from '@storybook/react';
import UserBadge, { Props } from '.';
import stateDecorator from 'store/util';

export default {
  title: 'Components/UserBadge',
  component: UserBadge,
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
          hasPassword: false,
          isActive: true,
          icon: null,
          isAdmin: false,
        },
      },
    }),
  ],
} as Meta;

const Template: Story<Props> = (args) => <UserBadge {...args} />;

export const Default = Template.bind({});
