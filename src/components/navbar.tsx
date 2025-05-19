import { useState } from "react";

function Dropdown({ name, menu }: { name: string; menu: React.ReactNode[] }) {
    const [open, setOpen] = useState(false);

    const toggle = () => {
        setOpen(!open);
    };

    return (
        <div>
            <button
                onClick={toggle}
                className=" transition-colors hover:text-blue-500"
            >
                {name}
            </button>
            {open ? (
                <ul className="list -none absolute transition-all bg-background divide-text p-5">
                    {menu.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
}

export default function Navbar() {
    return (
        <nav className="w-full flex flex-col items-center bg-background text-center z-50">
            <div className="flex justify-center py-10 w-[80%] border-b-2 border-b-text">
                <div className="flex gap-5 justify-between items-center w-full [&>*]:text-2xl max-sm:flex-col">
                    <a className="no-underline text-text" href="/">
                        James Barnfather
                    </a>
                    <div className="w-fit flex divide-x-2 divide-text [&>*]:px-5">
                        <a className="no-underline text-text" href="/">
                            Home
                        </a>
                        <a
                            className="no-underline text-text"
                            href="/projects-and-work"
                        >
                            Projects & Work
                        </a>
                        <Dropdown
                            name="Toys"
                            menu={[
                                <a
                                    className="no-underline text-text"
                                    href="/toys/boids"
                                >
                                    Boids
                                </a>,
                                <a
                                    className="no-underline text-text"
                                    href="/toys/boids"
                                >
                                    Boids
                                </a>,
                            ]}
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}
