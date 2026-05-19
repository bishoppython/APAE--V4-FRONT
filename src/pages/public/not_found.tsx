import { PageContainer, PageTitle } from "@/components/ui/page_components";
import notFoundImage from "@/assets/images/not-found.png";
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <PageContainer className="w-full justify-center">
      <div 
        role="main" 
        className="flex flex-col items-center justify-center text-center p-6 min-h-[60vh]"
      >
        {/* Descrição da imagem para leitores de tela */}
        <img 
          src={notFoundImage} 
          alt="Ilustração amigável indicando que o caminho não foi encontrado" 
          className="w-full max-w-md mb-6" 
        />
        
        <PageTitle>Página não encontrada</PageTitle>
        
        {/* Mensagem */}
        <p className="text-gray-600 my-4 text-lg max-w-md">
          O link que você tentou acessar pode estar quebrado ou a página foi movida para outro endereço.
        </p>

        {/* Rota para a home */}
        <Link
          to="/"
          aria-label="Voltar para a página inicial do NeuroKids"
          className="mt-4 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-md transition-transform hover:scale-105 active:scale-95 text-lg"
        >
          Voltar para o Início
        </Link>
      </div>
    </PageContainer>
  );
}