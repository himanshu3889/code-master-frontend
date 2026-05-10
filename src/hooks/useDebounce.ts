import { useEffect, useState } from 'react';

export default function useDebounce(value: string, delay: number) {
  const [debounceValue, setDebounceValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay || 500]);

  return debounceValue;
}
