import React, { FC } from 'react';
import Image from 'next/image';

interface Props {
  children: React.ReactElement;
}

const AuthTemplate: FC<Props> = ({ children }) => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="!#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={32}
            height={32}
          />
          Quick Learn
        </a>
        {children}
      </div>
    </section>
  );
};

export default AuthTemplate;
