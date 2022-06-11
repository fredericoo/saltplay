import { User } from '@prisma/client';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

const Mixpanel = () => {
  MIXPANEL_TOKEN && mixpanel.init(MIXPANEL_TOKEN, { debug: process.env.NODE_ENV !== 'production' });
  return mixpanel;
};

export const aliasAndSetUser = (user: Pick<User, 'name' | 'id' | 'email'>) => {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.alias(user.id);
  mixpanel.people.set({ $name: user.name, $email: user.email, $created: new Date() });
};

export const identifyAndSetUser = (user: Pick<User, 'name' | 'id' | 'email'>) => {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.identify(user.id);
  mixpanel.people.set({ $name: user.name, $email: user.email, $updated: new Date() });
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;
  mixpanel.track(event, properties);
};

export const useMixpanel = () => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!MIXPANEL_TOKEN) return;
      mixpanel.track('Route Change', { url });
    };
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);
};

export default Mixpanel();
