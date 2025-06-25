'use client'

import Link from 'next/link'
import Image from 'next/image'
import { FaXTwitter } from "react-icons/fa6";
import { FaTelegramPlane, FaGithub } from "react-icons/fa";
import SimpleButton from './SimpleButton';
import { useEffect, useState } from 'react';
import { BsCalendarWeek } from "react-icons/bs";

type IconProps = React.SVGProps<SVGSVGElement>;

const hoverColorClasses = [
    'hover:text-prisma-a',
    'hover:text-prisma-b',
    'hover:text-prisma-c',
    'hover:text-prisma-d',
  ];

const getRandomHoverColor = () => hoverColorClasses[Math.floor(Math.random() * hoverColorClasses.length)];

const OpenCollectiveIcon = ({ style, ...props }: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      fill="currentColor"
      viewBox="0 0 16 16"
      style={style}
      {...props}
    >
      <path
        fillOpacity=".4"
        d="M12.995 8.195c0 .937-.312 1.912-.78 2.693l1.99 1.99c.976-1.327 1.6-2.966 1.6-4.683 0-1.795-.624-3.434-1.561-4.76l-2.068 2.028c.468.781.78 1.679.78 2.732z"
      />
      <path d="M8 13.151a4.995 4.995 0 1 1 0-9.99c1.015 0 1.951.273 2.732.82l1.95-2.03a7.805 7.805 0 1 0 .04 12.449l-1.951-2.03a5.07 5.07 0 0 1-2.732.781z" />
    </svg>
);

const iconClasses = 'w-5 h-5 transition-all duration-500 hover:scale-110'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Disable scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = ''; // Re-enable scrolling
    }

    return () => {
      document.body.style.overflow = ''; // Clean up when the component is unmounted
    };
  }, [menuOpen]);

  return (
    <>
        <header className="fixed right-0 left-0 top-0 z-50 w-full bg-transparent print:hidden">
            {/* Blurred background */}
            <div className="absolute -z-10 inset-0 backdrop-blur-sm bg-white/70 dark:bg-neutral-900/70 border-b border-neutral-200 dark:border-neutral-800" />

            <nav className="mx-auto flex w-full items-center gap-4 px-6 justify-between h-16">
                {/* Logo */}
                <Link
                href="https://www.prisma.events/"
                className="me-auto flex items-center transition-opacity hover:opacity-75"
                aria-label="Prisma Events"
                >
                <div>
                    <Image
                    src="/prisma-name-text-dark.svg"
                    width={140}
                    height={60}
                    alt="Prisma Logo"
                    />
                </div>
                </Link>

                {/* Hamburger Menu for Mobile */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden flex flex-col gap-1.5 items-center justify-center p-2"
                    aria-label="Open menu"
                >
                    <div
                    className={`w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
                    ></div>
                    <div
                    className={`w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
                    ></div>
                    <div
                    className={`w-6 h-0.5 bg-white transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                    ></div>
                </button>

                {/* Main icons */}
                <div className={`lg:flex items-center gap-4 hidden`}>
                    {/* GitHub */}
                    <a
                        href="https://github.com/prisma-collective/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaGithub className={`${iconClasses} ${getRandomHoverColor()}`} />
                    </a>

                    {/* Telegram */}
                    <a
                        href="https://t.me/+9-UF8k9H8dBjNWFk/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaTelegramPlane className={`${iconClasses} ${getRandomHoverColor()}`} />
                    </a>

                    {/* X (Twitter) */}
                    <a
                        href="https://twitter.com/__prismaevents/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <FaXTwitter className={`${iconClasses} ${getRandomHoverColor()}`} />
                    </a>

                    {/* Open Collective */}
                    <a
                        href="https://opencollective.com/prisma-collective/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <OpenCollectiveIcon className={`${iconClasses} ${getRandomHoverColor()}`} />
                    </a>

                    {/* Open Collective */}
                    <a
                        href="https://lu.ma/prisma"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <BsCalendarWeek className={`${iconClasses} ${getRandomHoverColor()}`} />
                    </a>
                    {/* Docs */}
                    <a
                        href="https://docs.prisma.events/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${getRandomHoverColor()}`}
                    >
                        Docs
                    </a>
                    {/* Register */}
                    <SimpleButton buttonText="Register" redirectTo="https://register.prisma.events/" />
                </div>
            </nav>
        </header>

        {/* Mobile Menu Overlay */}
        {menuOpen && (
            <div className="lg:hidden fixed inset-0 z-40 w-full h-full" onClick={toggleMenu}>
                <div className="backdrop-blur-md bg-black/60 p-4 absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div className="flex flex-col gap-8 items-center">
                        <Link href="https://docs.prisma.events/" className="text-white text-xl">Docs</Link>
                        <a href="https://github.com/prisma-collective/" className="text-white text-xl">GitHub</a>
                        <a href="https://t.me/+9-UF8k9H8dBjNWFk" className="text-white text-xl">Telegram</a>
                        <a href="https://twitter.com/__prismaevents" className="text-white text-xl">Twitter</a>
                        <a href="https://opencollective.com/prisma-collective" className="text-white text-xl">Open Collective</a>
                        <a href="https://lu.ma/prisma" className="text-white text-xl">Calendar</a>
                        <SimpleButton buttonText="Register" redirectTo="https://register.prisma.events/" className='text-xl'/>
                    </div>
                </div>
            </div>
        )}
    </>
    
  );
}
