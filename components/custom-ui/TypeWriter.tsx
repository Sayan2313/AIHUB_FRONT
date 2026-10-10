"use client"

import { motion } from "framer-motion";
import {useEffect,useState} from "react";

interface TypeWriterProps {
    text: string,
    speed?: number
}
export default function TypeWriter({text,speed = 50}:TypeWriterProps){
    const [displayedText, setDisplayedText] = useState<string>("")

    useEffect(() => {
        setDisplayedText("");

        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(text.slice(0, i + 1));
            i++;

            if (i >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return (
        <div className="flex items-center text-2xl sm:text-4xl font-bold">
            <span>{displayedText}</span>

            <motion.span
                animate={{
                    opacity: [1, 0, 1],
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity,
                }}
                className="ml-1"
            >
                |
            </motion.span>
        </div>
    );
}