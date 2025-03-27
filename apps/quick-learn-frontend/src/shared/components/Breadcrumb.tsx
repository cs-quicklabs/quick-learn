import { TBreadcrumb } from '../types/breadcrumbType';
import { FC } from 'react';
import { SuperLink } from '@src/utils/HiLink';
import { ArrowRightIcon, HomeIcon } from './UIElements';
import { firstLetterCapital } from '@src/utils/helpers';
import { useRouter } from 'next/navigation';

interface Props {
  links: TBreadcrumb[];
  disabled?: boolean;
  onLinkClick?: (link: string) => void;
}

function customLink(
  { link, name, disabled: linkDisabled }: TBreadcrumb,
  onLinkClick?: (link: string) => void,
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

  // If onLinkClick is provided, use it instead of direct navigation
  const handleClick = onLinkClick
    ? (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default navigation
        onLinkClick(link);
      }
    : undefined;

  return (
    <SuperLink
      href={link}
      onClick={handleClick}
      className="flex items-center text-sm font-medium capitalize hover:underline hover:text-blue-600"
    >
      {firstLetterCapital(name)}
    </SuperLink>
  );
}

const Breadcrumb: FC<Props> = ({ links, disabled = false, onLinkClick }) => {
  const router = useRouter();

  // Default link click handler if no custom handler is provided
  const defaultLinkClick = (link: string) => {
    router.push(link);
  };

  // Use provided onLinkClick or fall back to default navigation
  const handleLinkClick = onLinkClick || defaultLinkClick;

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
              {customLink(
                link,
                handleLinkClick,
                index === links.length - 1,
                disabled,
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
