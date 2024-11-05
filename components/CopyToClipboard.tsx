import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CopyCheck } from 'lucide-react';

export function CopyToClipboard({
  content,
  containsText = false,
}: {
  content: string;
  containsText?: boolean;
}) {
  const [isCopied, setIsCopied] = useState(false);

  async function copyTextToClipboard() {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(content);
    } else {
      return document.execCommand('copy', true, content);
    }
  }

  const handleCopyClick = () => {
    copyTextToClipboard()
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 2500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Button
        onClick={handleCopyClick}
        className="p-2"
        size="sm"
        variant="ghost"
      >
        {isCopied ? (
          <span className="flex gap-2 items-center">
            <CopyCheck size={14} />
            {containsText && 'Copied'}
          </span>
        ) : (
          <span className="flex gap-2 items-center">
            <Copy size={14} />
            {containsText && 'Copy'}
          </span>
        )}
      </Button>
    </>
  );
}
