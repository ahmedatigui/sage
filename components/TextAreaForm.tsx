'use client';

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
//import { toast } from "@/components/ui/use-toast"

const FormSchema = z.object({
  query: z
    .string()
    .min(10, {
      message: 'Query must be at least 10 characters.',
    })
    .max(600, {
      message: 'Query must not be longer than 600 characters.',
    }),
  search_depth: z
    .enum(['basic', 'advanced'], {
      required_error: 'You need to select a notification type.',
    })
    .default('basic'),
  // include_images: z.boolean().default(false).optional(),
  include_answer: z.boolean().default(true).optional(),
  max_results: z.number().min(1).max(50).default(5),
  include_domains: z.string().default('').optional(),
  exclude_domains: z.string().default('').optional(),
});

export function TextareaForm() {
  const setResponses = useSetAtom(responsesAtom);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search_depth: 'basic',
      // include_images: false,
      include_answer: true,
      max_results: 5,
      include_domains: '',
      exclude_domains: '',
    },
  });

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

    console.log(`You submitted the following ${JSON.stringify(body, null, 2)}`);

    const handleClickPOST = async () => {
      try {
        const res = await fetch('/api/sage', {
          method: 'POST',
          body: JSON.stringify(body),
        });
        const dt: unknown = await res.json();
        console.log(dt);
        setResponses((resp) => [...resp, dt]);
      } catch (error) {
        console.error(error);
      }
    };
    handleClickPOST();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-auto space-y-6 grid grid-cols-[2fr_1fr] gap-4"
      >
        <div className="grid grid-rows-[70vh_25vh] gap-4 w-full">
          <div className="overflow-y-auto">
            <div className="flex flex-col gap-4 max-h-full overflow-y-auto scrollbar ">
              <ResponseContainer setValue={form.setValue} />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-4">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Search for information"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can type in questions/article/links.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              Submit
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="search_depth"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-4 rounded-md border p-4">
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
          {/* <FormField
            control={form.control}
            name="include_images"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Include images in the response</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="include_answer"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
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
              <FormItem className="flex flex-col items-start gap-2 rounded-md border p-4">
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
              <FormItem className="flex flex-col items-start rounded-md border p-4">
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
              <FormItem className="flex flex-col items-start rounded-md border p-4">
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
