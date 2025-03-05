'use client';

import { getClientIp } from '@src/apiServices/ipService';

import { useEffect } from 'react';

export default function ClientIpWrapper() {
  useEffect(() => {
    getClientIp().catch((error) =>
      console.error('Error preloading client IP:', error),
    );
  }, []);

  return null;
}
