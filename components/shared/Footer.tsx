
import Link from "next/link";
import {
  Package,
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
    <footer className="border-t border-[#442719]/10 bg-[#f5eee5] text-[#442719] transition-colors duration-300 dark:border-white/10 dark:bg-[#17120f] dark:text-[#f5e9dc]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Information */}
          <div>
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-2"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ea580c] text-white">
                <Package size={24} />
              </span>

              <span className="text-2xl font-bold text-[#442719] dark:text-[#f5e9dc]">
                Rent<span className="text-[#ea580c]">ora</span>
              </span>
            </Link>

            <p className="max-w-xs text-sm leading-7 text-[#785f50] dark:text-gray-400">
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
                  className="rounded-lg bg-[#442719]/10 px-3 py-2 text-sm text-[#442719] transition hover:bg-[#ea580c] hover:text-white dark:bg-white/10 dark:text-gray-300 dark:hover:bg-[#ea580c] dark:hover:text-white"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#442719] dark:text-[#f5e9dc]">
              Quick Links
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#785f50] transition hover:text-[#ea580c] dark:text-gray-400 dark:hover:text-orange-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#442719] dark:text-[#f5e9dc]">
              Our Services
            </h3>

            <ul className="space-y-4">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#785f50] transition hover:text-[#ea580c] dark:text-gray-400 dark:hover:text-orange-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-[#442719] dark:text-[#f5e9dc]">
              Contact Us
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-1 shrink-0 text-[#ea580c]"
                  size={18}
                />

                <span className="text-sm leading-6 text-[#785f50] dark:text-gray-400">
                  Bangladesh
                </span>
              </li>

              <li className="flex items-center gap-3">
                <Mail
                  className="shrink-0 text-[#ea580c]"
                  size={18}
                />

                <a
                  href="mailto:support@rentora.com"
                  className="text-sm text-[#785f50] transition hover:text-[#ea580c] dark:text-gray-400 dark:hover:text-orange-400"
                >
                  support@rentora.com
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone
                  className="shrink-0 text-[#ea580c]"
                  size={18}
                />

                <span className="text-sm text-[#785f50] dark:text-gray-400">
                  Contact information coming soon
                </span>
              </li>
            </ul>

            <Link
              href="/all-equipment"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#ea580c] transition hover:text-[#c2410c] dark:text-orange-400 dark:hover:text-orange-300"
            >
              Explore Equipment
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#442719]/15 pt-8 text-center sm:flex-row sm:text-left dark:border-white/10">
          <p className="text-sm text-[#927c6d] dark:text-gray-500">
            © {new Date().getFullYear()} Rentora. All rights reserved.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-[#927c6d] dark:text-gray-500">
            <Link
              href="/privacy-policy"
              className="transition hover:text-[#ea580c] dark:hover:text-orange-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#ea580c] dark:hover:text-orange-400"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
