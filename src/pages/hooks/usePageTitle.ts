import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${title} | BrainTest Music`;

    return () => {
      document.title = prevTitle;
    };
  }, [title]);
};