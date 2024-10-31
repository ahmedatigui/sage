import { TextareaForm } from '@/components/TextAreaForm';

export default function Home() {
  return (
    <main className="max-w-screen-xl m-auto relative flex min-h-screen flex-col items-center justify-between md:p-8 p-4">
      <section>
        <TextareaForm />
      </section>
    </main>
  );
}
