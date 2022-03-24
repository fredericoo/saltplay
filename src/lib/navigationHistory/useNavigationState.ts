import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { HistoryState, lastHistoryState } from './state';

const useNavigationState = (title?: HistoryState['title']) => {
  const [, setLastState] = useRecoilState(lastHistoryState);
  const { asPath } = useRouter();
  const currentState = useMemo(() => ({ title, href: asPath }), [title, asPath]);

  useEffect(() => {
    setLastState(currentState);
  }, [currentState, setLastState]);
};

export default useNavigationState;
