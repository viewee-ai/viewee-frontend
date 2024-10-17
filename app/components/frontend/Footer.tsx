import Image from "next/image";
import Link from "next/link";
import Logo from "@/data/ConversAI.png";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image src={Logo} className="size-8" alt="Logo" />
          <h4 className="text-lg font-semibold">
            Converse<span className="text-primary-green">AI</span>
          </h4>
        </Link>

        {/* Social Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <FaTwitter size={24} />
          </Link>
          <Link
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <FaLinkedin size={24} />
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} ConverseAI. All rights reserved.
      </div>
    </footer>
  );
}
