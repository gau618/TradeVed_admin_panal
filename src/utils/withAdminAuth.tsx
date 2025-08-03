'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const withAdminAuth = (WrappedComponent: React.ComponentType) => {
  return function Wrapper(props: any) {
    const { isAuthenticated, loading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (
        !loading &&
        (!isAuthenticated ||
          !user?.userRole?.some(
            (roleObj: any) => roleObj.role.title === 'SUPER_ADMIN'
          ))
      ) {
        router.replace('/login');
      }
    }, [isAuthenticated, loading, user, router]);

    if (loading || !isAuthenticated) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
