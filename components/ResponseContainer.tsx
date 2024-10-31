'use client';

import { useState } from 'react';
import { useAtomValue } from 'jotai';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { responsesAtom } from '@/lib/atoms';

export function ResponseContainer({ setValue }: { setValue: any }) {
  const responses = useAtomValue(responsesAtom);
  console.log(responses);

  return (
    <>
      {responses.length > 0 &&
        responses.map((response: any, index: number) => (
          <div
            key={index}
            className="flex flex-col gap-8 rounded-md border p-4"
          >
            <div className="source">
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Sources
              </h2>
              <ScrollArea className="max-h-96 overflow-y-auto">
                <div className="flex w-max space-x-4 p-4">
                  {response.response?.sources?.map((source: any, index: number) => (
                    <a
                      className="flex h-24 w-56 select-none flex-col justify-end rounded-md bg-slate-50 p-6 no-underline outline-none cursor-pointer hover:bg-slate-100 focus:shadow-md"
                      href={source.url}
                      key={index}
                    >
                      <div className="flex gap-2 mb-2 mt-4 text-xs font-medium">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={`https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${source.url}&size=16`}
                          />
                          <AvatarFallback>{source.title}</AvatarFallback>
                        </Avatar>
                        <span>{`${source.title.slice(0, 30)}...`}</span>
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {`${new URL(source?.url).hostname}`}
                      </p>
                    </a>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
            <div className="answer">
              <h2 className="scroll-m-20 border-b pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
                {response.query} 
              </h2>
              <div className="markdown-content leading-7 [&:not(:first-child)]:mt-6">
                <Markdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
          code({ inline, className, children }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            // If it's inline code, return it without the CodeBlock wrapper
            if (inline) {
              return (
                <code className={className}>
                  {children}
                </code>
              );
            }

            // Return the CodeBlock for code blocks, ensuring no nested elements
            return (
              <CodeBlock language={language}>
                {String(children).replace(/\n$/, '')} {/* Clean up any trailing new lines */}
              </CodeBlock>
            );
          },
        }}

                >
                  {response.response?.answer}
                </Markdown>
              </div>
            </div>

            {/*<div className="questions">
              <h2 className="scroll-m-20 border-b pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
                Questions
              </h2>
              <ul className="flex flex-col ">
                {response?.follow_up_questions?.map(
                  (question: string, index: number) => (
                    <li
                      onClick={() => setValue('query', question)}
                      key={index}
                      className="p-2 hover:bg-slate-100 rounded-md cursor-pointer"
                    >
                      <span className="text-sm font-medium">{question}</span>
                    </li>
                  )
                )}
              </ul>
            </div>*/}
          </div>
        ))}
    </>
  );
}



const CodeBlock = ({ children, language }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    console.log({children});
    navigator.clipboard.writeText(children[0].trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container">
      <SyntaxHighlighter language={language} style={docco} customStyle={{ overflow: 'auto' }}>
        {children}
      </SyntaxHighlighter>
      <button onClick={copyToClipboard} className="copy-button">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
