import { useState } from "react";
import { PageContainer, PageTitle } from "@/components/ui/page_components";
import { useTTS } from "@/libs/text-to-speech";

function CalcButton({
    label,
    textToSpeak,
    onClick,
    variant = "default",
    className = ""
}: {
    label: string;
    textToSpeak: string;
    onClick: (label: string) => void;
    variant?: "default" | "red" | "green";
    className?: string;
}) {
    const { play } = useTTS({ text: textToSpeak });

    const handleClick = () => {
        play();
        onClick(label);
    };

    let edgeColor = "bg-gradient-to-r from-[#9f8200] via-[#bf9e1f] to-[#9f8200]";
    let frontColor = "bg-[#f1c92a]";
    let shadowColor = "bg-[rgba(239,201,54,0.6)]";

    if (variant === "red") {
        edgeColor = "bg-gradient-to-r from-[#802222] to-[#a83333]";
        frontColor = "bg-[#d44444]";
        shadowColor = "bg-[rgba(212,68,68,0.6)]";
    } else if (variant === "green") {
        edgeColor = "bg-gradient-to-r from-[#3b7d3b] to-[#4caf50]";
        frontColor = "bg-[#4caf50]";
        shadowColor = "bg-[rgba(76,175,80,0.6)]";
    }

    return (
        <button
            className={`relative bg-transparent cursor-pointer outline-none transition-[filter] duration-250 focus-visible:outline-2 focus-visible:outline-[#efc936] focus-visible:outline-offset-4 w-[3.5rem] h-[3.5rem] sm:w-[4.5rem] sm:h-[4.5rem] p-0 font-poppins text-[1.25rem] sm:text-[1.75rem] group ${className}`}
            onClick={handleClick}
        >
            <span className={`absolute top-0 left-0 w-full h-full rounded-[0.5rem] blur-[2px] transform translate-y-[2px] transition-transform duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-[4px] group-hover:duration-250 group-active:translate-y-[1px] group-active:duration-34 ${shadowColor}`}></span>
            
            <span className={`absolute top-0 left-0 w-full h-full rounded-[0.5rem] ${edgeColor}`}></span>
            
            <span className={`block absolute top-0 left-0 w-full h-full rounded-[0.5rem] text-[#eee] font-semibold uppercase tracking-[1.5px] text-[1.25rem] sm:text-[1.5rem] transform translate-y-[-4px] transition-transform duration-600 ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-[-6px] group-hover:duration-250 group-active:translate-y-[-2px] group-active:duration-34 flex items-center justify-center ${frontColor}`}>
                {label}
            </span>
        </button>
    );
}

export function Calculator() {
    const [realExpression, setRealExpression] = useState("");
    const [displayExpression, setDisplayExpression] = useState("");

    const handleInput = (input: string) => {
        const operadores = ["+", "-", "*", "/"];
        const operadoresDisplay: Record<string, string> = { "*": "×", "/": "÷" };

        const lastChar = realExpression.slice(-1);

        if (operadores.includes(input)) {
            if (realExpression === "" || operadores.includes(lastChar)) {
                return;
            }
            setRealExpression(prev => prev + input);
            setDisplayExpression(prev => prev + (operadoresDisplay[input] || input));
        } else {
            setRealExpression(prev => prev + input);
            setDisplayExpression(prev => prev + input);
        }
    };

    const handleClear = () => {
        setRealExpression("");
        setDisplayExpression("");
    };

    const handleCalculate = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(realExpression);
            if (Number.isFinite(result)) {
                setRealExpression(result.toString());
                setDisplayExpression(result.toString());
            } else {
                setRealExpression("");
                setDisplayExpression("Erro");
            }
        } catch (error) {
            setRealExpression("");
            setDisplayExpression("Erro");
        }
    };

    return (
        <PageContainer>
            <PageTitle>CALCULADORA</PageTitle>

            <div className="flex justify-center items-center w-full mt-4 sm:mt-8">
                <div className="flex flex-col w-fit max-w-full border-[3px] border-[#333] shadow-[0px_4px_30px_#73b369] rounded-[1.25rem] p-4 bg-[#a5cd50]">
                    
                    <input
                        className="pointer-events-none text-right font-poppins text-[1.5rem] sm:text-[2rem] h-[4rem] sm:h-[5rem] text-[#eee] bg-[#3a3231] border border-[#333] rounded-[0.625rem] px-4 py-2 mb-4 w-full box-border"
                        type="text"
                        readOnly
                        value={displayExpression}
                    />

                    <div className="grid grid-cols-4 gap-3 w-full mx-auto">
                        <CalcButton label="1" textToSpeak="Um" onClick={handleInput} />
                        <CalcButton label="2" textToSpeak="Dois" onClick={handleInput} />
                        <CalcButton label="3" textToSpeak="Três" onClick={handleInput} />
                        <CalcButton label="C" textToSpeak="Apagar" onClick={handleClear} variant="red" />

                        <CalcButton label="4" textToSpeak="Quatro" onClick={handleInput} />
                        <CalcButton label="5" textToSpeak="Cinco" onClick={handleInput} />
                        <CalcButton label="6" textToSpeak="Seis" onClick={handleInput} />
                        <CalcButton label="×" textToSpeak="Vezes" onClick={() => handleInput("*")} />

                        <CalcButton label="7" textToSpeak="Sete" onClick={handleInput} />
                        <CalcButton label="8" textToSpeak="Oito" onClick={handleInput} />
                        <CalcButton label="9" textToSpeak="Nove" onClick={handleInput} />
                        <CalcButton label="÷" textToSpeak="Dividido" onClick={() => handleInput("/")} />

                        <CalcButton label="+" textToSpeak="Mais" onClick={handleInput} />
                        <CalcButton label="0" textToSpeak="Zero" onClick={handleInput} />
                        <CalcButton label="-" textToSpeak="Menos" onClick={handleInput} />
                        <CalcButton label="=" textToSpeak="Igual" onClick={handleCalculate} variant="green" />
                    </div>

                </div>
            </div>
        </PageContainer>
    );
}
