/* eslint-disable indent */
import React from 'react';
import Account from './Account/Account';
import Content from './Content/Content';
import Danger from './Danger/Danger';

const Tabs = ({ active }: { active: number }) => {
  switch (active) {
    case 0:
      return <Account />;
    case 1:
      return <Content />;
    case 2:
      return <Danger />;
    default:
      return <Account />;
  }
};

export default Tabs;
