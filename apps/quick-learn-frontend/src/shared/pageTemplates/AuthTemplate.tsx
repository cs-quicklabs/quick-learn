import React, { FC } from 'react';
import { en } from '@src/constants/lang/en';
import { RouteEnum } from '@src/constants/route.enum';
import WebsiteLogo from '../components/WebsiteLogo';

interface Props {
  title: string;
  children: React.ReactElement;
}

const AuthTemplate: FC<Props> = ({ title, children }) => {
  return (
    <section className="bg-gray-50 ">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 mt-24 md:min-h-screen md:mt-0">
        <a
          href={RouteEnum.LOGIN}
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 "
        >
          <WebsiteLogo width="60" />
          <p className="ml-3">{en.common.quickLearn}</p>
        </a>
        <div className="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              {title}
            </h1>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthTemplate;
