import {useState, useCallback} from 'react';

export const useBoolean = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(
    () => setState((state) => (!state ? true : false)),
    [],
  );
  return [state, toggle];
};
