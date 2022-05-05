import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { HistoryState, lastHistoryState } from './state';

const useNavigationState = (title?: HistoryState['title']) => {
  const setLastState = useSetRecoilState(lastHistoryState);
  const { asPath } = useRouter();
  useState(() => setLastState({ title, href: asPath }));
};

export default useNavigationState;
