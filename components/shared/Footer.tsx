
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  ArrowRight,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Equipment", href: "/all-equipment" },
  { name: "How It Works", href: "/#how-it-works" },
  { name: "About Us", href: "/#about" },
];

const serviceLinks = [
  {
    name: "Construction Equipment",
    href: "/all-equipment?category=construction",
  },
  {
    name: "Power Tools",
    href: "/all-equipment?category=tools",
  },
  {
    name: "Photography Gear",
    href: "/all-equipment?category=photography",
  },
  {
    name: "Outdoor Equipment",
    href: "/all-equipment?category=outdoor",
  },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/" },
  { name: "Instagram", href: "https://www.instagram.com/" },
  { name: "LinkedIn", href: "https://www.linkedin.com/" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Information */}
          <div>
            {/* Navbar Matching Logo */}
            <Link
              href="/"
              aria-label="Rentora Home"
              className="group mb-5 flex h-16 w-48 shrink-0 items-center justify-start transition-transform duration-300 hover:scale-[1.03] sm:w-52"
            >
              <Image
                src="/images/equipment-logo.png"
                alt="Rentora Logo"
                width={208}
                height={80}
                priority
                className="h-full w-full object-contain object-left"
              />
            </Link>

            <p className="max-w-xs text-sm leading-7 text-muted-foreground">
              Rentora makes equipment rental simple, affordable, and
              accessible. Find the right equipment for every project.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="rounded-lg bg-secondary px-3 py-2 text-sm text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Our Services
            </h3>

            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Contact Us
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-1 shrink-0 text-muted-foreground"
                  size={18}
                />

                <span className="text-sm leading-6 text-muted-foreground">
                  Bangladesh
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail
                  className="shrink-0 text-muted-foreground"
                  size={18}
                />

                <a
                  href="mailto:support@rentora.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  support@rentora.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  className="shrink-0 text-muted-foreground"
                  size={18}
                />

                <span className="text-sm text-muted-foreground">
                  Contact information coming soon
                </span>
              </li>
            </ul>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-muted-foreground"
            >
              Explore Equipment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Rentora. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/privacy-policy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
