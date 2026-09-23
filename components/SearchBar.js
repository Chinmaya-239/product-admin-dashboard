"use client";

import { useEffect, useState } from "react";

// Keeps a local, immediately-updating input value so typing feels
// responsive, but only calls onDebouncedChange 500ms after the user stops
// typing — that debounced value is what drives the API call and the URL.
export default function SearchBar({ value, onDebouncedChange }) {
  const [text, setText] = useState(value);

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text !== value) onDebouncedChange(text);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Search products…"
      className="w-full border border-line rounded-lg px-3 py-2 text-sm focus:border-accent"
    />
  );
}
