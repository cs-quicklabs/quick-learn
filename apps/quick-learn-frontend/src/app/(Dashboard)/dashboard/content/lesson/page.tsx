import Editor from '@src/shared/components/Editor';
import React from 'react';

export const metadata = {
  title: 'Content Repository • Quick Learn',
  description: 'Content repository quick learn',
};

const page = () => {
  return (
    <>
      <h1>Editor</h1>
      <Editor />
    </>
  );
};

export default page;
