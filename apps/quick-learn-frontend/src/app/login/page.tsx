import React from 'react';
import Loginpagecomp from './Loginpagecomp';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quick Learn :: Login',
  description: 'Quick Learn from Crownstack',
};
const login = () => {
  return (
    <>
      <Loginpagecomp />
    </>
  );
};

export default login;
