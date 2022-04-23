import {useRef} from 'react';

//better than useMemo as useMemo might clear memory and re-initialize
//better to pass class object creation as function for lazy intialization
export const useConstRef = (initialValue) => {
  const ref = useRef();
  if (ref.current === undefined) {
    ref.current = {
      value: typeof initialValue === 'function' ? initialValue() : initialValue,
    };
  }
  return ref.current.value;
};
