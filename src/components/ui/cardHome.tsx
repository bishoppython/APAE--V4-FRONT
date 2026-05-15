import { Link } from "react-router-dom";

export interface CardHomeProps {
    img: string;
    title: string;
    description: string;
    href?: string;
}

export function CardHome({ img, title, description, href }: CardHomeProps) {
    return (
        <Link to={href || `/${title}`} draggable={false} className="block group outline-none focus-visible:ring-4 focus-visible:ring-[#00C4CC] rounded-3xl shrink-0 snap-center">
            <div className="w-full max-w-[360px] h-[460px] sm:max-w-[420px] sm:h-[520px] bg-white rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center p-8 border-2 border-transparent hover:border-[#00C4CC]/20 relative overflow-hidden">

                <div className="w-full h-[200px] sm:h-[260px] bg-linear-to-br from-[#E6F2F9] to-[#F3F8FB] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-500 shadow-inner overflow-hidden shrink-0">
                    <img src={img} alt={title} draggable={false} className="w-full h-full object-cover pointer-events-none" />
                </div>

                <div className="flex flex-col items-center w-full flex-1 justify-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center group-hover:text-[#00C4CC] transition-colors duration-300">
                        {title}
                    </h1>
                    <p className="text-center text-[16px] sm:text-[18px] font-medium text-gray-500 leading-relaxed line-clamp-3">
                        {description}
                    </p>
                </div>
            </div>
        </Link>
    )
}