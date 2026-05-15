"use client";
import React, { useEffect } from 'react';

type ModalesProps = {
  isOpen: boolean;
  onClose: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  className?: string;
};

export default function Modales({ isOpen, onClose, maxWidth = "600px", children, className = "" }: ModalesProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      const handleEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
      document.addEventListener('keydown', handleEsc);
      return () => {
        document.body.classList.remove('modal-open');
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`wiModal active ${className}`} onClick={onClose} style={{ display: 'flex' }}>
      <div className="modalBody" style={{ maxWidth }} onClick={e => e.stopPropagation()}>
        <button className="modalX" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}
