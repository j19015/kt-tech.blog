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
    <header className="py-6 px-4 flex justify-between items-center bg-blue-100 rounded-lg shadown m-1">
      <Link className="z-50" href="/" onClick={handleMenuClose}>
        <h1 className="text-2xl font-serif">kt-tech.blog</h1>
      </Link>

      <nav
        className={
          isOpen
            ? "z-40 bg-blue-100 fixed top-0 right-0 bottom-0 left-0 h-screen flex flex-col"
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
              <span className="font-serif">
                Home
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/blogs/page/1">
              <span className="font-serif">
                Blog
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/dev">
              <span className="font-serif">
                Dev
              </span>
            </Link>
          </li>
          <li>
            <Link onClick={handleMenuClose} href="/introduction">
              <span className="font-serif">
                Introduction
              </span>
            </Link>
          </li>
        </ul>
      </nav>
      <button className="z-50 space-y-2 md:hidden" onClick={handleMenuOpen}>
        <span
          className={
            isOpen
              ? "block w-8 h-0.5 bg-gray-600 translate-y-2.5 rotate-45 duration-300"
              : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
        <span
          className={
            isOpen ? "block opacity-0 duration-300" : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
        <span
          className={
            isOpen
              ? "block w-8 h-0.5 bg-gray-600 -rotate-45 duration-300"
              : "block w-8 h-0.5 bg-gray-600 duration-300"
          }
        />
      </button>
    </header>
  );
}

export default Header;