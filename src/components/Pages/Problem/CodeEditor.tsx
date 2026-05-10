import { Editor, OnChange, OnMount } from '@monaco-editor/react';
import { useState, useEffect } from 'react';

const CodeEditor: React.FC<{
  code: string;
  language: string;
  theme: string;
  isPlainMode?: boolean;
  onChange: OnChange | undefined;
  onMount: OnMount | undefined;
}> = ({ code, language, theme, isPlainMode, onChange, onMount }) => {
  const [localCode, setLocalCode] = useState(code);

  useEffect(() => {
    setLocalCode(code);
  }, [code, language]);

  return (
    <Editor
      theme={theme}
      language={language === 'c#' ? 'csharp' : language === 'c++' ? 'cpp' : language}
      value={localCode}
      className={`tw-max-h-full tw-overflow-x-auto tw-max-w-dvw ${isPlainMode ? 'plain-mode-editor' : ''}`}
      onMount={onMount}
      options={{
        automaticLayout: true,
        scrollBeyondLastLine: false,
        minimap: { enabled: false },
        ...(isPlainMode ? {
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: 'off',
          parameterHints: { enabled: false },
          snippetSuggestions: 'none',
        } : {})
      }}
      onChange={(val, ev) => {
        setLocalCode(val || '');
        if (onChange) onChange(val, ev);
      }}
    />
  );
};
export default CodeEditor;
