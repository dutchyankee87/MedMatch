import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Voor Zorgorganisaties", href: "#voor-wie" },
    { label: "Voor Uitzendbureaus", href: "#voor-wie" },
    { label: "Werkwijze", href: "#werkwijze" },
    { label: "Mogelijkheden", href: "#features" },
  ],
  support: [
    { label: "Helpcentrum", href: "/help" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  legal: [
    { label: "Privacybeleid", href: "/privacy" },
    { label: "Algemene Voorwaarden", href: "/voorwaarden" },
    { label: "AVG/GDPR", href: "/avg" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white font-bold">
                M
              </div>
              <span className="font-semibold text-xl text-white">MedMatch</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Het platform dat zorgorganisaties verbindt met uitzendbureaus voor
              efficiënte, transparante personeelsplanning.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <p>info@medmatch.nl</p>
              <p>020-123 4567</p>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Ondersteuning</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Juridisch</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-gray-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-sm text-gray-400">
            <span>&copy; {new Date().getFullYear()} MedMatch B.V.</span>
            <span className="hidden md:inline">KvK: 12345678</span>
            <span className="hidden md:inline">BTW: NL123456789B01</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="https://linkedin.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
