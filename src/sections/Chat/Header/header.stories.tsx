import React from 'react';
import { Story, Meta } from '@storybook/react';
import Header, { Props } from './';

export default {
  title: 'Components/Header',
  component: Header,
} as Meta;

const Template: Story<Props> = (args) => <Header {...args} />;

export const Default = Template.bind({});