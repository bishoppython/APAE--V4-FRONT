import { cn } from "@/libs/utils";
import * as React from "react";
import { Link } from "react-router-dom";
interface FooterProps {
  name: string;
  year: number;
}
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  classname?: string;
}

interface FooterLinkGroupProps {
  children: React.ReactNode;
  title: string;
  classname?: string;
}

function FooterLinkGroup({ children, title }: FooterLinkGroupProps) {
  return (
    <nav aria-label={title} className="space-y-2">
      <h3 className="text-sm font-semibold text-zinc-300 pb-5">{title}</h3>
      {children}
    </nav>
  );
}

function FooterLink({ href, children, classname }: FooterLinkProps) {
  return (
    <Link
      to={href}
      className={cn(
        "block text-sm transition-colors hover:text-white",
        classname,
      )}
    >
      {children}
    </Link>
  );
}

function Footer({ name, year }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-black px-4 py-10 font-['Quicksand',sans-serif] text-[#ACACAC]">
      <div className="mx-auto grid max-w-6xl gap-2 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4 ">
        <div>
          <h2 className="text-2xl font-['Poppins',sans-serif] font-semibold text-white">
            {name}
          </h2>
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            &copy; {year}. Todos os direitos reservados.
          </p>
        </div>

        <FooterLinkGroup title="Navegação">
          <FooterLink href="/criancas">Crianças</FooterLink>
          <FooterLink href="/#conversacao">Conversação</FooterLink>
          <FooterLink href="/#jogos">Jogos</FooterLink>
          <FooterLink href="/dashboard">Dashboard</FooterLink>
        </FooterLinkGroup>

        <FooterLinkGroup title="Suporte">
          <FooterLink href="/contato">Fale Conosco</FooterLink>
        </FooterLinkGroup>

        <FooterLinkGroup title="Links Úteis">
          <FooterLink href="/sobre">Sobre nós</FooterLink>
        </FooterLinkGroup>
      </div>
    </footer>
  );
}

export default Footer;
