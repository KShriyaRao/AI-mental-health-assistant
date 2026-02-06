import { useState, useEffect, useCallback } from 'react';
import { SupportStyle } from '@/components/SupportStyleSettings';

const STORAGE_KEY = 'serenity-support-style';

export function useSupportStyle() {
  const [supportStyle, setSupportStyle] = useState<SupportStyle>('auto');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['auto', 'gentle', 'practical', 'minimal'].includes(stored)) {
      setSupportStyle(stored as SupportStyle);
    }
  }, []);

  const updateSupportStyle = useCallback((style: SupportStyle) => {
    setSupportStyle(style);
    localStorage.setItem(STORAGE_KEY, style);
  }, []);

  return {
    supportStyle,
    setSupportStyle: updateSupportStyle,
  };
}
