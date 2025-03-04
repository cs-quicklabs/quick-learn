import { TBreadcrumb } from '../types/breadcrumbType';
import { FC } from 'react';
import { SuperLink } from '@src/utils/HiLink';
import { ArrowRightIcon, HomeIcon } from './UIElements';
import { firstLetterCapital } from '@src/utils/helpers';

interface Props {
  links: TBreadcrumb[];
  disabled?: boolean;
}

function customLink(
  { link, name, disabled: linkDisabled }: TBreadcrumb,
  isLast = false,
  disabled = false,
) {
  if (isLast || disabled || linkDisabled) {
    return (
      <span className="flex items-center text-sm font-medium cursor-not-allowed">
        {firstLetterCapital(name)}
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
    <div className="flex justify-center px-4 pb-4 pt-5 sm:px-6 lg:px-8">
      <nav
        className="flex justify-self-center flex-wrap"
        aria-label="Breadcrumb"
      >
        <ol className="inline-flex justify-self-center flex-wrap align-center justify-center rtl:space-x-reverse">
          {links.map((link, index) => (
            <li
              className="inline-flex items-center text-gray-700 "
              key={`${link.name}-${index}`}
            >
              {index !== 0 && index !== links.length && <ArrowRightIcon />}
              {index === 0 ? <HomeIcon /> : ''}
              {customLink(link, index === links.length - 1, disabled)}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
