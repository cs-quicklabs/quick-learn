import React from 'react';
import TeamMemberDetails from './teamMemberDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Details • Quick Learn',
  description: 'Team Member Details quick learn',
};

const page = () => {
  return <TeamMemberDetails />;
};

export default page;
