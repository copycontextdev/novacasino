import { CopyCheckIcon, CopyIcon } from 'lucide-react';
import React, { useState } from 'react';

const CopyButton = ({ textToCopy }: {textToCopy:string}) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className={`px-4 py-2 font-semibold rounded-lg shadow-md transition-colors duration-200 ${
        isCopied
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
    >
      {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
    </button>
  );
};

export default CopyButton;
