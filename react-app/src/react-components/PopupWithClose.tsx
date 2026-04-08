import {type RefObject } from 'react';

interface PopupWithCloseProps {
    children: React.ReactNode
    ref: RefObject<HTMLDialogElement>
    closeText?: string
    label: string
}

export default function PopupWithClose({
    children,
    ref,
    closeText = "close",
    label
}: PopupWithCloseProps) {
    return <dialog ref={ref} popover={'auto'} role="dialog" aria-modal="true" aria-label={label}>
        <button onClick={() => ref.current?.close()}>{closeText}</button>
        {children}
    </dialog>;
}