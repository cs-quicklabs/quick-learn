'use client';
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ProtectedRouteEnum, RouteEnum } from '../../constants/route.enum';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter();
    const url = usePathname() as any;
    useEffect(() => {
      const checkAuth = () => {
        const accessToken = localStorage.getItem('accessToken');
        if (Object.values(ProtectedRouteEnum).includes(url) && !accessToken) {
          router.replace(RouteEnum.LOGIN);
        }
      };
      checkAuth();
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
