"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import "./dialog.css";

export default function Dialog( {children} ) {
  const router = useRouter();
  const dialog = useRef();

  useEffect(() => {
    dialog.current.showModal();
  }, []);

  return (
    <dialog ref={dialog} onClose={() => router.back()}>
      {children}
    </dialog>
  );
}