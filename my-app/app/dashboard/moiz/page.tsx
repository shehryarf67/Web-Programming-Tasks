"use client";

import { useState, useEffect } from "react";

export default function ClientComponent() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData("Abdul Moiz 23I-0624!");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <h1>Client Side Rendering Example</h1>
      {data ? <p>{data}</p> : <p>Loading............</p>}
      <h1>Client Side Rendering Example</h1>
    </div>
  );
}