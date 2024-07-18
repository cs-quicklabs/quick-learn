import React from 'react';
import Login from './components/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Learn: Login',
  description: 'Quick Learn from Crownstack',
};
const login = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default login;
