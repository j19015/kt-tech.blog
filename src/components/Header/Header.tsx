"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export const Header = () => {
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleMenuOpen = () => {
    setOpen(!isOpen);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <header className="py-6 px-4 flex justify-between items-center bg-gray-900 rounded-lg shadow-md m-1">
      <Link className="z-50" href="/" onClick={handleMenuClose}>
        <h1 className="text-3xl font-serif hover:text-blue-500 transition duration-300">kt-tech.blog</h1>
      </Link>

      <nav
        className={
          isOpen
            ? "z-40 bg-gray-600 text-white fixed top-0 right-0 bottom-0 left-0 h-screen flex flex-col"
            : "right-[-100%] md:right-4"
        }
      >
        <ul
          className={
            isOpen
              ? "flex h-screen justify-center items-center flex-col gap-6 text-xl"
              : " hidden block md:flex md:gap-8"
          }
        >
          <li>
            <Link onClick={handleMenuClose} href="/">
              <span className="font-serif hover:text-blue-500 transition duration-300">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/blogs/page/1">
              <span className="font-serif hover:text-blue-500 transition duration-300">
                Blog
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/dev">
              <span className="font-serif hover:text-blue-500 transition duration-300">
                Dev
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/introduction">
              <span className="font-serif hover:text-blue-500 transition duration-300">
                Introduction
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <button className="z-50 space-y-2 md:hidden" onClick={handleMenuOpen}>
        <span className={isOpen ? "block w-8 h-0.5 bg-white transform translate-y-2.5 rotate-45 duration-300" : "block w-8 h-0.5 bg-white duration-300"} />
        <span className={isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-white duration-300"} />
        <span className={isOpen ? "block w-8 h-0.5 bg-white transform -rotate-45 duration-300" : "block w-8 h-0.5 bg-white duration-300"} />
      </button>
    </header>
  );
}

export default Header;