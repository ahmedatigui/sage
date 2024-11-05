'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAtom } from 'jotai';

import { toast } from 'sonner';
import { responsesAtom, isLoadingAtom } from '@/lib/atoms';
import { ResponseContainer } from '@/components/ResponseContainer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const modelOptions = [
  {
    label: 'Mistral-7B-Instruct-v0.2',
    value: 'mistralai/Mistral-7B-Instruct-v0.2',
  },
  {
    label: 'Mistral-Nemo-Instruct-2407',
    value: 'mistralai/Mistral-Nemo-Instruct-2407',
  },
  {
    label: 'Hermes-3-Llama-3.1-8B',
    value: 'NousResearch/Hermes-3-Llama-3.1-8B',
  },
  { label: 'gemini-1.5-flash', value: 'gemini-1.5-flash' },
];

const FormSchema = z.object({
  query: z
    .string()
    .min(10, {
      message: 'Query must be at least 10 characters.',
    })
    .max(600, {
      message: 'Query must not be longer than 600 characters.',
    }),
  model: z
    .enum(
      [
        'mistralai/Mistral-7B-Instruct-v0.2',
        'HuggingFaceH4/zephyr-7b-beta',
        'mistralai/Mistral-Nemo-Instruct-2407',
        'NousResearch/Hermes-3-Llama-3.1-8B',
        'google/gemma-2-2b-it',
        'gemini-1.5-flash',
      ],
      {
        required_error: 'You need to select a model type.',
      }
    )
    .default('mistralai/Mistral-7B-Instruct-v0.2'),
});

export function TextareaForm() {
  const [fetchSignal, setFetchSignal] = useState<AbortController>();
  const [loading, setLoading] = useAtom(isLoadingAtom);
  const [responses, setResponses] = useAtom(responsesAtom);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: '',
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
    },
  });

  const responseContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      toast.info(
        'Our project uses free LLMs, which may cause slower server responses.',
        { duration: 3000, position: 'top-center' }
      );
    });
  }, []);

  useEffect(() => {
    if (responses.length >= 1 && loading) {
      const container = responseContainerRef?.current;
      if (container) {
        const scrollHeight = container?.scrollHeight - container?.clientHeight;
        container.scrollTo({ top: scrollHeight, behavior: 'smooth' });
      }
    }
  }, [loading]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const body = {
      ...data,
      query: data.query.trim(),
    };

    form.resetField('query');
    console.log(`You submitted the following ${JSON.stringify(body, null, 2)}`);

    const handleClickPOST = async () => {
      console.log({ responses });
      const controller = new AbortController();
      setFetchSignal(controller);

      try {
        setLoading(true);

        const res = await fetch('/api/sage', {
          method: 'POST',
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const data = await res.json();
        console.log(data);

        setResponses((resp) => [...resp, { query: body.query, ...data }]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
          if (error.name === 'AbortError') {
            toast.error('Request aborted', {
              duration: 3000,
              position: 'top-center',
            });
          } else {
            toast.error('Error generating content', {
              duration: 3000,
              position: 'top-center',
            });
          }
        }
      } finally {
        setFetchSignal(undefined);
        setLoading(false);
      }
    };
    handleClickPOST();
  }

  const abortFetch = () => {
    console.log({ fetchSignal });
    if (fetchSignal) {
      setLoading(false);
      fetchSignal.abort();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-auto space-y-6 grid grid-cols-1"
      >
        <div className="flex flex-cols gap-4 justify-between">
          <div className="">
            <Link href="/" className="font-bold text-xl">
              Sage
            </Link>
          </div>

          <div>
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="">
                  <FormControl>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a property type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectGroup>
                          {modelOptions.map((option, index) => (
                            <SelectItem key={index} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-rows-[70vh] gap-4 w-full">
          <div className="overflow-y-auto">
            <div
              ref={responseContainerRef}
              className="flex flex-col gap-4 max-h-full overflow-y-auto scrollbar"
            >
              <ResponseContainer setValue={form.setValue} />
            </div>
          </div>
          <div className="grid md:grid-cols-[1fr_auto] md:gap-4 gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to know?"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!loading ? (
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            ) : (
              <Button disabled={!loading} onClick={abortFetch}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
