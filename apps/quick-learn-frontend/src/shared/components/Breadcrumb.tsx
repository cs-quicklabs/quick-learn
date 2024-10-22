import { TBreadcrumb } from '../types/breadcrumbType';
import { FC } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, HomeIcon } from './UIElements';

interface Props {
  links: TBreadcrumb[];
}

const Breadcrumb: FC<Props> = ({ links }) => {
  return (
    <div className="px-4 pb-4 sm:flex sm:items-center sm:justify-center sm:flex-wrap sm:px-6 lg:px-8">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex justify-self-center flex-wrap align-center justify-center rtl:space-x-reverse">
          {links.map(({ name, link }, index) => (
            <li
              className="inline-flex items-center text-gray-700 hover:text-blue-600"
              key={name}
            >
              {index != 0 && index != links.length && <ArrowRightIcon />}
              {index == 0 ? <HomeIcon /> : ''}
              <Link
                href={link}
                className="flex items-center text-sm font-medium capitalize hover:underline"
              >
                {name}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
