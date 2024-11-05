import { TextareaForm } from '@/components/TextAreaForm';

export default function Home() {
  return (
    <main className="max-w-screen-xl m-auto relative flex min-h-screen flex-col items-center justify-between md:px-8 py-4 px-3">
      <section className="w-full max-w-[768px] relative">
        <TextareaForm />
      </section>
    </main>
  );
}
