"use client";
import React from "react";

type ModalProps = { open: boolean; onClose: () => void; children: React.ReactNode };

export function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded bg-white p-6 shadow-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-slate-600 hover:text-slate-900">Fechar</button>
        </div>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export default Modal;