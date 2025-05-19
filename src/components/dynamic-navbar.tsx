import Navbar from "./navbar";

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export default function DynamicNavbar() {
    useGSAP(() => {
        gsap.to("nav", {
            scrollTrigger: {
                trigger: "nav",
                pin: true,
                start: "top top",
                endTrigger: "html",
                end: "bottom top",
                toggleActions: "play none none reverse",
            },
        });
    });

    return <Navbar />;
}
