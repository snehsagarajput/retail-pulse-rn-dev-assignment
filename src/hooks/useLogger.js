import {useEffect} from 'react';

export const useLogger = (componentName = '', ...args) => {
  useEffect(() => {
    console.log(`${componentName} mounted`, JSON.stringify(args));
    return () => console.log(`${componentName} unmounted`);
  }, []);

  useEffect(() => {
    console.log(`${componentName} updated`, JSON.stringify(args));
  });
};
