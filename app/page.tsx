'use client';

import { useState } from "react";
import { TextareaForm } from "@/components/TextAreaForm";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [data, setData] = useState("");

  const handleClickGET = async () => {
    try {
      const res = await fetch("/api/sage");
      const data = await res.json();
      console.log(data);
      setData(JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-8">
      <Button onClick={handleClickGET}>GET{' '}<code>api/sage</code></Button>
      <section>
        {/* <pre>{data}</pre> */}
        <TextareaForm setData={setData} data={data} />
      </section>
    </main>
  );
}
