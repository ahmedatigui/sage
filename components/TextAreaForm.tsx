'use client';

import { useState, useRef, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSetAtom } from 'jotai';

import { responsesAtom } from '@/lib/atoms';
import { ResponseContainer } from '@/components/ResponseContainer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
//import { toast } from "@/components/ui/use-toast"

const ModelOption = ['mistralai/Mistral-7B-Instruct-v0.2', 'HuggingFaceH4/zephyr-7b-beta', 'mistralai/Mistral-Nemo-Instruct-2407', 'NousResearch/Hermes-3-Llama-3.1-8B', 'google/gemma-2-2b-it', 'gemini-1.5-flash'];
const modelOptions = [
  { label: 'Mistral-7B-Instruct-v0.2', value: 'mistralai/Mistral-7B-Instruct-v0.2' },
  { label: 'Zephyr-7b-beta', value: 'HuggingFaceH4/zephyr-7b-beta' },
  { label: 'Mistral-Nemo-Instruct-2407', value: 'mistralai/Mistral-Nemo-Instruct-2407' },
  { label: 'Hermes-3-Llama-3.1-8B', value: 'NousResearch/Hermes-3-Llama-3.1-8B' },
  { label: 'gemma-2-2b-it', value: 'google/gemma-2-2b-it' },
  { label: 'gemini-1.5-flash', value: 'gemini-1.5-flash' }
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
    .enum(['mistralai/Mistral-7B-Instruct-v0.2', 'HuggingFaceH4/zephyr-7b-beta', 'mistralai/Mistral-Nemo-Instruct-2407', 'NousResearch/Hermes-3-Llama-3.1-8B', 'google/gemma-2-2b-it', 'gemini-1.5-flash'], {
      required_error: 'You need to select a model type.',
    })
    .default('mistralai/Mistral-7B-Instruct-v0.2'),

  search_depth: z
    .enum(['basic', 'advanced'], {
      required_error: 'You need to select search_depth type.',
    })
    .default('basic'),
  include_answer: z.boolean().default(true).optional(),
  max_results: z.number().min(1).max(50).default(5),
  include_domains: z.string().default('').optional(),
  exclude_domains: z.string().default('').optional(),
});

export function TextareaForm() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState();
  const setResponses = useSetAtom(responsesAtom);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: '',
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      search_depth: 'basic',
      include_answer: true,
      max_results: 5,
      include_domains: '',
      exclude_domains: '',
    },
  });
  const responseContainerRef = useRef();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    /*toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })*/

    const body = {
      ...data,
      query: data.query.trim(),
      include_domains: data.include_domains?.split(','),
      exclude_domains: data.exclude_domains?.split(','),
    };

    form.resetField('query');
    console.log(`You submitted the following ${JSON.stringify(body, null, 2)}`);

    const handleClickPOST = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/sage', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        const dt: unknown = await res.json();
        console.log(dt);

        setLoading(false);

        setResponses((resp) => [...resp, { response: dt, query: body.query }]);
        responseContainerRef.current.scrollIntoView(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };
    handleClickPOST();
  }

  useEffect(() => {
    responseContainerRef.current.scrollIntoView(false);
  }, []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-auto space-y-6 grid  gap-4 grid-cols-1 md:grid-cols-[2fr_1fr]"
      >
        <div className="grid grid-rows-[70vh_25vh] gap-4 w-full">
          <div className="overflow-y-auto">
            <div
              ref={responseContainerRef}
              className="flex flex-col gap-4 max-h-full overflow-y-auto scrollbar"
            >
              <ResponseContainer setValue={form.setValue} />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
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
            { !loading ? (
              <Button type="submit" disabled={loading}>Submit</Button>):
              (<Button type="submit" disabled={loading}>Cancel</Button>)
            }
          </div>
        </div>
        <div className="flex md:flex-col gap-4 flex-row flex-wrap sm:justify-center justify-normal">
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Model:</FormLabel>
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
                          <SelectItem
                            key={index}
                            value={option.value}
                          >
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

          <FormField
            control={form.control}
            name="search_depth"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 rounded-md border p-4 w-full">
                <FormLabel>Search Depth</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? 'basic'}
                    // className="flex flex-col space-y-1"
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="basic" />
                      </FormControl>
                      <FormLabel className="font-normal">Basic</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="advanced" />
                      </FormControl>
                      <FormLabel className="font-normal">Advanced</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="include_answer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 w-full">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? true}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Include answers in the search results.</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max_results"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start gap-2 rounded-md border p-4 w-full">
                <div className="w-full flex flex-row items-center justify-between">
                  <FormLabel>Max Links</FormLabel>
                  <span>{field.value}</span>
                </div>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={1}
                    max={50}
                    step={1}
                    // onChange={field.onChange}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="include_domains"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start rounded-md border p-4 w-full">
                <FormLabel className="mb-4">Include domains</FormLabel>
                <FormControl>
                  <Input placeholder="example.com, wikipedia.org" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Seperate multiple domains with a comma (,)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exclude_domains"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start rounded-md border p-4 w-full">
                <FormLabel className="mb-4">Exclude domains</FormLabel>
                <FormControl>
                  <Input placeholder="example.com, wikipedia.org" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  Seperate multiple domains with a comma (,)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
