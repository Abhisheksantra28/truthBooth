"use client";

import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md  text-black">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Truth booth
        </a>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user?.username || user?.email}</span>
            <Button
              onClick={() => signOut()}
              className="w-full md:w-auto"
           
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto"
            
            >
              Sign in
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
