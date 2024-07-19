import React from 'react';
import { Metadata } from 'next';
import LoginComponent from './LoginComponent';

export const metadata: Metadata = {
  title: 'Quick Learn :: Login',
  description: 'Quick Learn from Crownstack',
};
const login = () => {
  return (
    <>
      <LoginComponent />
    </>
  );
};

export default login;
