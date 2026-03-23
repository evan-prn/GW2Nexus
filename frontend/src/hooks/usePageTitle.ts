// src/hooks/usePageTitle.ts
import { useEffect } from 'react';

const APP_NAME = 'GW2Nexus';

const usePageTitle = (title?: string): void => {
  useEffect(() => {
    document.title = title ? `${title} — ${APP_NAME}` : APP_NAME;
  }, [title]);
};

export default usePageTitle;