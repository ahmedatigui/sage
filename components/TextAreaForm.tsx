// 'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  include_images: z.boolean().default(false).optional(),
  include_answer: z.boolean().default(true).optional(),
  max_results: z.number().min(1).max(50).default(5),
  include_domains: z.string().default('').optional(),
  exclude_domains: z.string().default('').optional(),
});

export function TextareaForm({ setData, data }: { setData: any, data: any }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      search_depth: 'basic',
      include_images: false,
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

    // const params = new URLSearchParams();
    // if (data.search_depth) params.append('search_depth', data.search_depth);
    // if (data.include_images) params.append('include_images', data.include_images.toString());
    // if (data.include_answer) params.append('include_answer', data.include_answer.toString());
    // if (data.max_results) params.append('max_results', data.max_results.toString());
    // if (data.include_domains) params.append('include_domains', data.include_domains);
    // if (data.exclude_domains) params.append('exclude_domains', data.exclude_domains);

    console.log(`You submitted the following ${JSON.stringify(data, null, 2)}`);
    // console.log(`You submitted the following Params ${params}`);
    const handleClickPOST = async () => {
      try {
        const res = await fetch(`/api/sage`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
        const dt = await res.json();
        console.log(dt);
        setData(JSON.stringify(dt));
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
        <div className='grid grid-rows-[70vh_25vh] gap-4 w-full'>
          <div className='overflow-y-auto'>
          <div className='max-h-full overflow-y-auto'>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
            <pre>{data}</pre>
          </div>
          </div>
          <div className='grid grid-cols-[1fr_auto] gap-4'>
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Query</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit about yourself"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can <span>@mention</span> other users and organizations.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
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
          <FormField
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
          />
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
                <div className='w-full flex flex-row items-center justify-between'>
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
                  <Input
                    placeholder="example.com, wikipedia.org"
                    {...field}
                  />
                </FormControl>
                  <FormDescription className='text-xs'>
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
                  <Input
                    placeholder="example.com, wikipedia.org"
                    {...field}
                  />
                </FormControl>
                  <FormDescription  className='text-xs'>
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
