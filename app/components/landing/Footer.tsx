import Link from "next/link";
import { FaTwitter, FaGithub, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <h4 className="text-lg font-semibold">
            AI Interview<span className="text-primary-green">Wizard</span>
          </h4>
        </Link>

        {/* Social Links */}
        <div className="flex items-center space-x-6">
          <Link
            href="https://github.com/viewee-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://www.linkedin.com/school/george-mason-university/"
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
        © {new Date().getFullYear()} AI Interview Wizard - Built at George Mason University. All rights reserved.
      </div>
    </footer>
  );
}