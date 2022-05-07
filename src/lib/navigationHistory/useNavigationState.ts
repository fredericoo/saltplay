import { useAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { HistoryState, writeHistoryStateAtom } from './state';

const useNavigationState = (title?: HistoryState['title']) => {
  const [, setLastState] = useAtom(writeHistoryStateAtom);
  const { asPath } = useRouter();
  useEffect(() => setLastState({ title, href: asPath }), [asPath, setLastState, title]);
};

export default useNavigationState;
