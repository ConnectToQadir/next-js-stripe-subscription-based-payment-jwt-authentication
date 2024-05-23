"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { AuthContext } from "@/context/Context";
import Link from "next/link";
import { useContext } from "react";

export default function Home() {
  var { user } = useContext(AuthContext);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold text-center">Home Page</h1>

      {user ? (
        <div className="mt-10 flex justify-center items-center flex-col">
          <div className="flex text-2xl mb-4">
          Hi, {user?.fullName}
          </div>
          <Link href="/plans" className={buttonVariants()}>
                Upgrade to Pro
              </Link>
        </div>
      ) : null}
    </div>
  );
}
