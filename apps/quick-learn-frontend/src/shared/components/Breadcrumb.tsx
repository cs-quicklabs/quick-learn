import { TBreadcrumb } from '../types/breadcrumbType';
import { FC } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, HomeIcon } from './UIElements';

interface Props {
  links: TBreadcrumb[];
}

function customLink({ link, name }: TBreadcrumb, isLast = false) {
  if (isLast) {
    return (
      <span className="flex items-center text-sm font-medium capitalize cursor-not-allowed">
        {name}
      </span>
    );
  }
  return (
    <Link
      href={link}
      aria-disabled={isLast}
      className="flex items-center text-sm font-medium capitalize hover:underline hover:text-blue-600"
    >
      {name}
    </Link>
  );
}

const Breadcrumb: FC<Props> = ({ links }) => {
  return (
    <div className="px-4 pb-4 sm:flex sm:items-center sm:justify-center sm:flex-wrap sm:px-6 lg:px-8">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex justify-self-center flex-wrap align-center justify-center rtl:space-x-reverse">
          {links.map(({ name, link }, index) => (
            <li
              className="inline-flex items-center text-gray-700 "
              key={Math.random() * 1000}
            >
              {index != 0 && index != links.length && <ArrowRightIcon />}
              {index == 0 ? <HomeIcon /> : ''}
              {customLink({ name, link }, index == links.length - 1)}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
