import { PageContainer, PageTitle } from "@/components/ui/page_components";
import notFoundImage from "@/assets/images/not-found.png";

export function NotFound() {
    return (
        <PageContainer>
            <div className="flex flex-col items-center justify-center">
                <img src={notFoundImage} alt="Not Found" className="w-1/2" />
                <PageTitle>Página não encontrada</PageTitle>
            </div>
        </PageContainer>
    );
}
