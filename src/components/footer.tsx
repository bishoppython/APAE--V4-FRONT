interface FooterProps {
  nome: string;
  ano: number;
}

function Footer({ nome, ano }: FooterProps) {
  return (
    <footer className="w-full border-t border-white/10 bg-black px-4 py-10 font-['Quicksand',sans-serif] text-[#ACACAC]">
      <div className="mx-auto grid max-w-6xl gap-2 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4 ">
        <div>
          <h2 className="text-2xl font-['Poppins',sans-serif] font-semibold text-white">
            {nome}
          </h2>
          <p className="mt-3 text-xs leading-5 text-zinc-400">
            &copy; {ano}. Todos os direitos reservados.
          </p>
        </div>

        <nav aria-label="Recursos" className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-300 pb-5">Recursos</h3>
          <a
            href="#"
            className="block text-sm transition-colors hover:text-white"
          >
            Jogos
          </a>
          <a
            href="#"
            className="block text-sm transition-colors hover:text-white"
          >
            Conversação
          </a>
          <a
            href="#"
            className="block text-sm transition-colors hover:text-white"
          >
            Dashboard
          </a>
        </nav>

        <nav aria-label="Suporte" className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300 pb-5">Suporte</h3>
          <a
            href="#"
            className="block text-sm transition-colors hover:text-white"
          >
            Fale Conosco
          </a>
        </nav>

        <nav aria-label="Links" className="space-y-2">
          <h3 className="text-sm font-semibold text-zinc-300 pb-5">Links Úteis</h3>
          <a
            href="#"
            className="block text-sm transition-colors hover:text-white"
          >
            Sobre nós
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
