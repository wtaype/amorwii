"use client";
import React, { useEffect } from 'react';
import "../app/(main)/login/login.css";

type ModalesProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
};

export default function ModalesLogin({ isOpen, onClose, children, className = "" }: ModalesProps) {
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
        <div
            className={`wiModal active ${className}`}
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 1000,
                background: 'rgba(0, 0, 0, 0.45)',
                display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
                paddingTop: '6vh', paddingBottom: '6vh', overflowY: 'auto',
                backdropFilter: 'blur(3px)'
            }}
        >
            <div className="modalBody" style={{ position: 'relative', margin: '0 auto' }} onClick={e => e.stopPropagation()}>
                <button className="modalX" onClick={onClose} aria-label="Cerrar">&times;</button>
                {children}
            </div>
        </div>
    );
}
