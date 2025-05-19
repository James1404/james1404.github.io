import { useState } from "react";
import clsx from "clsx";

function Link({ title, href }: { title: string; href: string }) {
    return (
        <li>
            <a className="no-underline text-text" href={href}>
                {title}
            </a>
        </li>
    );
}

export default function Navigation() {
    const [open, setOpen] = useState(false);

    return (
        <div className="fixed top-0 left-0 w-full h-full">
            <div className="fixed top-0 left-0 h-screen z-40 bg-background [&>*]:block">
                <ul className="list-none">
                    <Link title="Home" href="/" />
                    <Link title="Projects & Work" href="/projects-and-work" />
                </ul>
            </div>

            <div
                onClick={() => setOpen(!open)}
                className="fixed top-0 left-0 cursor-pointer"
            >
                toggle
            </div>
        </div>
    );
}
