import {type RefObject } from 'react';

interface PopupWithCloseProps {
    children: React.ReactNode
    ref: RefObject<HTMLDialogElement>
    closeText?: string
}

export default function PopupWithClose({
    children,
    ref,
    closeText = "close"
}: PopupWithCloseProps) {
    return <dialog ref={ref} closedby={'any'}>
        <button onClick={() => ref.current?.close()}>{closeText}</button>
        {children}
    </dialog>;
}