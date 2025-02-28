'use client';
import React, { forwardRef, type ComponentPropsWithRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const SuperLink = forwardRef<
  HTMLAnchorElement,
  ComponentPropsWithRef<typeof Link>
>((props, ref) => {
  const router = useRouter();
  const strHref = typeof props.href === 'string' ? props.href : props.href.href;

  const conditionalPrefetch = () => {
    if (strHref) {
      router.prefetch(strHref);
    }
  };

  return (
    <Link
      {...props}
      scroll={false}
      ref={ref}
      prefetch={false}
      onMouseEnter={(e) => {
        conditionalPrefetch();
        return props.onMouseEnter?.(e);
      }}
      onPointerEnter={(e) => {
        conditionalPrefetch();
        return props.onPointerEnter?.(e);
      }}
      onTouchStart={(e) => {
        conditionalPrefetch();
        return props.onTouchStart?.(e);
      }}
      onFocus={(e) => {
        conditionalPrefetch();
        return props.onFocus?.(e);
      }}
    />
  );
});

SuperLink.displayName = 'SuperLink';
