"use client";

import Link from "next/link";
import { Button, buttonVariants } from "../ui/button";
import { useContext } from "react";
import { AuthContext } from "@/context/Context";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function Navbar() {
  var { user,handleLogout } = useContext(AuthContext);

  return (
    <header className="py-2 px-4 border-b">
      <nav className="max-w-3xl mx-auto flex justify-between items-center">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 256 256"
              className="h-6 w-6"
            >
              <rect width="256" height="256" fill="none"></rect>
              <line
                x1="208"
                y1="128"
                x2="128"
                y2="208"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
              <line
                x1="192"
                y1="40"
                x2="40"
                y2="192"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="16"
              ></line>
            </svg>
            <div className="font-bold">BGTV</div>
          </Link>
        </div>

        <div className="flex gap-x-2 items-center">
          {user ? (
            <>
              {user?.fullName}
              <Button size="sm" onClick={handleLogout} variant="destructive">Logout</Button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className={buttonVariants({ variant: "outline" })}
              >
                Register
              </Link>
              <Link href="/login" className={buttonVariants()}>
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
