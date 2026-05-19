import { LoginForm } from "@/components/forms/login_form";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/ui/page_components";
import { Puzzle } from "lucide-react";

export default function Login() {
  return (
    <PageContainer className="flex w-full justify-between min-h-screen">

      <section className="flex flex-1 flex-col items-center justify-center bg-white">
        <h1 className="text-[42px] font-bold text-center">NeuroKids</h1>
        <h2 className="text-[26px] font-bold text-center mb-6">Bem-vindo, cuidador!</h2>

        <LoginForm />

        <span className="text-[26px] text-center py-10 text-[#B0BAC3]"> - OU - </span>

        <nav className="flex flex-col gap-4">
          <Button variant="secondary" className="w-full">
            {/*tem que trocar esse svg do google dps*/}
            <img src="Google.svg" className="size-18" alt="Google" />
            Entrar com o Google
          </Button>

          <Button variant="secondary" className="w-full">
            <img src="Facebook.svg" className="size-8" alt="Facebook" />
            Entrar com o Facebook
          </Button>
        </nav>
      </section>

      <aside className=" bg-[#E6F2F9] flex items-center justify-center px-6">
        <div className="relative">
          <Puzzle className="absolute top-8 left-50 rotate-60  text-primary size-12 fill-primary animate-pulse" />
          <Puzzle className="absolute bottom-25 right-35 rotate-5 text-green-500 size-12 fill-green-500 animate-pulse" />
          <img src="LoginIMG.svg" className="w-full h-screen py-6 object-cover" alt="Login Background" />
        </div>
      </aside>
    </PageContainer>
  );
}