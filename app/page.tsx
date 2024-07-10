import { TextareaForm } from '@/components/TextAreaForm';

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-8">
      <section>
        <TextareaForm />
      </section>
    </main>
  );
}
