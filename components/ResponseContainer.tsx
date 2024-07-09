'use client';

import { useAtomValue } from 'jotai';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { responsesAtom } from '@/lib/atoms';

export function ResponseContainer({
  setValue,
}: {
  setValue: any;
}) {
  const responses = useAtomValue(responsesAtom);
  console.log(responses);

  return (
    <>
    {responses.length > 0 && (
      responses.map((response: any, index: number) => (
        <div key={index} className="flex flex-col gap-8 rounded-md border p-4">
          <div className="source">
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              Sources
            </h2>
            <ScrollArea className="max-h-96 overflow-y-auto">
              <div className="flex w-max space-x-4 p-4">
                { response?.results?.map((result: any, index: number) => (  
                    <a
                      className="flex h-24 w-48 select-none flex-col justify-end rounded-md bg-slate-50 p-6 no-underline outline-none cursor-pointer hover:bg-slate-100 focus:shadow-md"
                      href={result.url}
                      key={index}
                    >
                      <div className="flex gap-2 mb-2 mt-4 text-sm font-medium">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={result.url} />
                          <AvatarFallback>{result.title}</AvatarFallback>
                        </Avatar>
                        <span>{result.title}</span>
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {`${result?.content?.slice(0, 10)}...`}
                      </p>
                    </a>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
          <div className="answer">
            <h2 className="scroll-m-20 border-b pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0">
              Answer
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">{response?.answer}</p>
          </div>

          <div className="questions">
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
          </div>
        </div>
      )))}
    </>
  );
}
