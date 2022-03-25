import { User } from '@prisma/client';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Mixpanel = () => {
  const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  MIXPANEL_TOKEN && mixpanel.init(MIXPANEL_TOKEN, { debug: process.env.NODE_ENV !== 'production' });
  return mixpanel;
};

export const aliasAndSetUser = (user: Pick<User, 'name' | 'id' | 'email'>) => {
  mixpanel.alias(user.id);
  mixpanel.people.set({ $name: user.name, $email: user.email, $created: new Date() });
};

export const identifyAndSetUser = (user: Pick<User, 'name' | 'id' | 'email'>) => {
  mixpanel.identify(user.id);
  mixpanel.people.set({ $name: user.name, $email: user.email, $updated: new Date() });
};

export const useMixpanel = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      mixpanel.track('Route Change', { url });
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);
};

export default Mixpanel();
