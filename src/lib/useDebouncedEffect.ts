import { DependencyList, useEffect, useState } from 'react';

const useDebouncedMemo = <T>(effect: () => T, delay: number, deps: DependencyList) => {
  const [state, setState] = useState<T>();

  useEffect(() => {
    setState(effect());
  }, [effect]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setState(effect());
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [deps]);

  return state;
};

export default useDebouncedMemo;
