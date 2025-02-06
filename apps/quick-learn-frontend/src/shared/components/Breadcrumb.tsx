import { TBreadcrumb } from '../types/breadcrumbType';
import { FC } from 'react';
import { SuperLink } from '@src/utils/HiLink';
import { ArrowRightIcon, HomeIcon } from './UIElements';

interface Props {
  links: TBreadcrumb[];
  disabled?: boolean;
}

function customLink(
  { link, name }: TBreadcrumb,
  isLast = false,
  disabled = false,
) {
  if (isLast || disabled) {
    return (
      <span className="flex items-center text-sm font-medium capitalize cursor-not-allowed">
        {name}
      </span>
    );
  }
  return (
    <SuperLink
      href={link}
      className="flex items-center text-sm font-medium capitalize hover:underline hover:text-blue-600"
    >
      {name}
    </SuperLink>
  );
}

const Breadcrumb: FC<Props> = ({ links, disabled = false }) => {
  return (
    <div className="px-4 pb-4 sm:flex sm:items-center sm:justify-center sm:flex-wrap sm:px-6 lg:px-8">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex justify-self-center flex-wrap align-center justify-center rtl:space-x-reverse">
          {links.map(({ name, link }, index) => (
            <li
              className="inline-flex items-center text-gray-700 "
              key={`${name}-${index}`}
            >
              {index != 0 && index != links.length && <ArrowRightIcon />}
              {index == 0 ? <HomeIcon /> : ''}
              {customLink({ name, link }, index == links.length - 1, disabled)}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
