import { Users, UserCheck, Plus, ArrowLeft } from 'lucide-react';
import { PageContainer } from "@/components/ui/page_components"
import { ChildRegistrationForm } from "@/components/forms/create_child_form"
import { useState } from 'react';
import StatItem from '../components/StatItem';

export default function Caretaker() {
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');

  // Simulação do banco
  const [totalCriancas, setTotalCriancas] = useState(0);
  const [criancasAtivas, setCriancasAtivas] = useState(0);

  return (
    
    <PageContainer className="max-w-5xl mx-auto flex flex-col items-center mt-[5vh] md:mt-[10vh]">
      
        {view === 'dashboard' && (
        <>
          {/* CONTAINER DE ESTATÍSTICAS */}
          <div className="w-full max-w-[92%] md:max-w-5xl bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
            
            <StatItem 
              label="Crianças cadastradas" 
              valor={totalCriancas} 
              icon={<Users size={28} className="text-green-600" />} 
            />

            <div className="hidden md:block h-12 w-px bg-gray-200 dark:bg-slate-700" />

            <StatItem 
              label="Crianças ativas" 
              valor={0} 
              icon={<UserCheck size={28} className="text-green-600" />} 
            />

            <div className="hidden md:block h-12 w-px bg-gray-200 dark:bg-slate-700" />

            {/* BOTÃO DE CADASTRO */}
            <button 
              onClick={() => setView('form')}
              className="flex items-center gap-4 group transition-all hover:opacity-75"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Plus size={32} className="text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-xs text-gray-400 font-medium">Adicionar</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Cadastro</p>
              </div>
            </button>
          </div>

          {/* ESTADO VAZIO (Aparece se for 0) */}
          {totalCriancas === 0 && (
            <div className="w-full max-w-[92%] md:max-w-5xl bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-16 shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col items-center text-center">
              <img src="/img/empty-state.png" alt="Vazio" className="w-72 h-auto mb-8" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Nada ainda!</h2>
              <p className="text-gray-500 dark:text-gray-400">Realize o primeiro cadastro.</p>
            </div>
          )}
        </>
        )
        } 

        {view === 'form' && (
        /* COMPONENTE DE CADASTRO */
        <div className="w-full max-w-[92%] md:max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={() => setView('dashboard')}
            className="flex items-center gap-2 text-gray-500 hover:text-green-600 mb-6 transition-colors"
          >
            <ArrowLeft size={20} /> Voltar para o painel
          </button>
          
          <ChildRegistrationForm></ChildRegistrationForm>
        </div>
      )}

    </PageContainer>
  );
}