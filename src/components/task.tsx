import type { ReactNode } from "react";

export default function Task({
    className,
    children,
    checked,
    ...props
}: {
    className?: string;
    children: ReactNode;
    checked?: boolean;
}) {
    return (
        <>
            <div className="flex items-center gap-2 w-fit">
                <div className="flex justify-center items-center cursor-default select-none border-2 border-[var(--text-color)] rounded min-w-fit min-h-fit w-5 h-5">
                    {checked ? <>&#10003;</> : <></>}
                </div>
                <div className={className} {...props}>
                    {children}
                </div>
            </div>
        </>
    );
}
