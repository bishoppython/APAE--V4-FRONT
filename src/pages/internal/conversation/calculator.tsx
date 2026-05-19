import { useState, useEffect } from "react";
import { PageContainer } from "@/components/ui/page_components";
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
    variant?: "default" | "orange" | "green" | "yellow";
    className?: string;
}) {
    const { play } = useTTS({ text: textToSpeak });

    const handleClick = () => {
        play();
        onClick(label);
    };

    let btnColorClasses = "";
    if (variant === "green") {
        btnColorClasses = `
            bg-gradient-to-b from-[#8de093] to-[#59bc60] 
            text-white border-[#8ce093] 
            shadow-[0_6px_0px_#3d8b42,_0_10px_18px_rgba(61,139,66,0.25)] 
            hover:from-[#9be8a1] hover:to-[#65c96c] 
            active:shadow-[0_1px_0px_#3d8b42,_0_2px_5px_rgba(0,0,0,0.15)]
        `;
    } else if (variant === "orange") {
        btnColorClasses = `
            bg-gradient-to-b from-[#ffa35c] to-[#f47c24] 
            text-white border-[#ffa35c] 
            shadow-[0_6px_0px_#bd5a11,_0_10px_18px_rgba(189,90,17,0.25)] 
            hover:from-[#ffb275] hover:to-[#f98a38] 
            active:shadow-[0_1px_0px_#bd5a11,_0_2px_5px_rgba(0,0,0,0.15)]
        `;
    } else if (variant === "yellow") {
        btnColorClasses = `
            bg-gradient-to-b from-[#ffe066] to-[#ffc715] 
            text-[#523d00] border-[#ffe066] 
            shadow-[0_6px_0px_#cc9c07,_0_10px_18px_rgba(204,156,7,0.25)] 
            hover:from-[#ffeb85] hover:to-[#ffd130] 
            active:shadow-[0_1px_0px_#cc9c07,_0_2px_5px_rgba(0,0,0,0.15)]
        `;
    } else {
        btnColorClasses = `
            bg-gradient-to-b from-[#ffffff] to-[#e8edf1] 
            text-[#334155] border-[#ffffff] 
            shadow-[0_6px_0px_#a8b8c5,_0_10px_15px_rgba(168,184,197,0.2)] 
            hover:from-[#ffffff] hover:to-[#f1f5f9] 
            active:shadow-[0_1px_0px_#a8b8c5,_0_2px_5px_rgba(0,0,0,0.15)]
        `;
    }

    return (
        <button
            className={`
                relative flex items-center justify-center 
                font-poppins font-extrabold text-[1.5rem] sm:text-[2.2rem] 
                h-18 sm:h-[5.8rem]
                rounded-3xl sm:rounded-[1.75rem] border-t-2 border-l transition-all duration-75 
                active:translate-y-[5px] select-none cursor-pointer 
                outline-none focus-visible:ring-4 focus-visible:ring-sky-300
                ${btnColorClasses} ${className}
            `}
            onClick={handleClick}
            style={{
                WebkitTapHighlightColor: "transparent",
            }}
        >
            <span className="transform translate-y-[-2px]">{label}</span>
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

        if (input === ".") {
            const parts = realExpression.split(/[\+\-\*\/]/);
            const lastPart = parts[parts.length - 1];
            if (lastPart.includes(".")) {
                return;
            }
            if (realExpression === "" || operadores.includes(lastChar)) {
                setRealExpression(prev => prev + "0.");
                setDisplayExpression(prev => prev + "0.");
                return;
            }
        }

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

    const [shouldSpeak, setShouldSpeak] = useState(false);
    const { play: playResult } = useTTS({ text: displayExpression });

    useEffect(() => {
        if (shouldSpeak && displayExpression) {
            const timer = setTimeout(() => {
                playResult();
                setShouldSpeak(false);
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [displayExpression, shouldSpeak, playResult]);

    const handleCalculate = () => {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(realExpression);
            if (Number.isFinite(result)) {
                // Formata decimais para não quebrar o layout
                const formattedResult = Number(result.toFixed(6)).toString();
                setRealExpression(formattedResult);
                setDisplayExpression(formattedResult);
                setShouldSpeak(true);
            } else {
                setRealExpression("");
                setDisplayExpression("Erro");
                setShouldSpeak(true);
            }
        } catch (error) {
            setRealExpression("");
            setDisplayExpression("Erro");
            setShouldSpeak(true);
        }
    };

    const CALC_BUTTONS: {
        label: string;
        textToSpeak: string;
        variant?: "default" | "orange" | "green" | "yellow";
        onClick?: () => void;
        value?: string;
        className?: string;
    }[] = [
            // Row 1
            { label: "C", textToSpeak: "Apagar", variant: "green", onClick: handleClear },
            { label: "+", textToSpeak: "Mais", variant: "orange" },
            { label: "-", textToSpeak: "Menos", variant: "orange" },
            { label: "×", textToSpeak: "Vezes", variant: "orange", value: "*" },

            // Row 2
            { label: "7", textToSpeak: "Sete" },
            { label: "8", textToSpeak: "Oito" },
            { label: "9", textToSpeak: "Nove" },
            { label: "÷", textToSpeak: "Dividido", variant: "orange", value: "/" },

            // Row 3
            { label: "4", textToSpeak: "Quatro" },
            { label: "5", textToSpeak: "Cinco" },
            { label: "6", textToSpeak: "Seis" },
            { label: ".", textToSpeak: "Ponto", value: "." },

            // Row 4
            { label: "1", textToSpeak: "Um" },
            { label: "2", textToSpeak: "Dois" },
            { label: "3", textToSpeak: "Três" },
            { label: "=", textToSpeak: "Igual", variant: "yellow", onClick: handleCalculate, className: "row-span-2 h-full" },

            // Row 5
            { label: "0", textToSpeak: "Zero", className: "col-span-3 w-full" },
        ];

    return (
        <PageContainer className="py-10 select-none flex flex-col items-center justify-center">
            {/* Animating styles */}
            <style>{`
                @keyframes blink {
                    0%, 90%, 100% { transform: scaleY(1); }
                    93%, 97% { transform: scaleY(0.15); }
                }
                @keyframes wave {
                    0%, 100% { transform: rotate(0deg); }
                    50% { transform: rotate(18deg); }
                }
                .animate-blink {
                    animation: blink 4s infinite;
                    transform-origin: center;
                }
                .animate-wave {
                    animation: wave 2.5s ease-in-out infinite;
                    transform-origin: 20% 90%;
                }
            `}</style>

            <div className="flex pt-15 justify-center items-center w-full">
                <div className="relative mt-10 px-0 md:px-8">
                    {/* Left Arm SVG*/}
                    <div className="hidden lg:block absolute -left-4 bottom-[30%] z-0 select-none pointer-events-none transform -translate-x-1/2">
                        <svg width="80" height="92" viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="left-arm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#addbff" />
                                    <stop offset="60%" stopColor="#85c3f2" />
                                    <stop offset="100%" stopColor="#5fa7df" />
                                </linearGradient>
                                <filter id="left-arm-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="-2" dy="4" stdDeviation="3" floodColor="#1e4e7e" floodOpacity="0.25" />
                                </filter>
                            </defs>
                            <path
                                d="M 50 15 C 30 15, 10 25, 5 45 C 2 55, 12 65, 22 62 C 30 60, 38 52, 45 45 C 48 40, 52 28, 50 15 Z"
                                fill="url(#left-arm-grad)"
                                filter="url(#left-arm-shadow)"
                            />
                            <path d="M 12 48 C 16 52, 22 53, 26 50" stroke="#71b2e5" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    {/* Right Arm SVG*/}
                    <div className="hidden lg:block absolute -right-4 top-[35%] z-0 select-none pointer-events-none transform translate-x-1/2 animate-wave">
                        <svg width="92" height="104" viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="right-arm-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#5fa7df" />
                                    <stop offset="50%" stopColor="#85c3f2" />
                                    <stop offset="100%" stopColor="#addbff" />
                                </linearGradient>
                                <filter id="right-arm-shadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#1e4e7e" floodOpacity="0.25" />
                                </filter>
                            </defs>
                            <path
                                d="M 10 65 C 15 50, 25 25, 45 15 C 55 10, 68 20, 62 32 C 58 40, 48 48, 38 55 C 28 62, 18 68, 10 65 Z"
                                fill="url(#right-arm-grad)"
                                filter="url(#right-arm-shadow)"
                            />
                            <path d="M 50 20 C 53 23, 53 28, 50 32" stroke="#71b2e5" strokeWidth="2.5" strokeLinecap="round" />
                            <path d="M 56 25 C 58 28, 57 33, 54 36" stroke="#71b2e5" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>

                    <div className="
                        relative z-10 w-[24rem] sm:w-lg max-w-full 
                        bg-[#85c3f2] rounded-[3.25rem] sm:rounded-[3.75rem] p-4 md:p-8 pb-10
                        shadow-[0_25px_50px_-12px_rgba(26,71,114,0.35),inset_0_-14px_24px_rgba(17,54,89,0.3),inset_0_14px_24px_rgba(255,255,255,0.65),0_2px_5px_rgba(255,255,255,0.4)]`
                        flex flex-col items-center
                    ">
                        {/* Glowing Creamy LED Display */}
                        <div className="
                            w-full mb-8 relative overflow-hidden rounded-[1.75rem]
                            bg-linear-to-b from-[#fffdec] to-[#fffbc4]
                            shadow-[inset_0_6px_10px_rgba(80,70,30,0.18),0_2px_4px_rgba(255,255,255,0.7)]
                            px-6 py-3 h-22 sm:h-26 flex items-center justify-end
                        ">
                            <input
                                className="
                                    pointer-events-none text-right font-poppins font-extrabold 
                                    text-[2.2rem] sm:text-[2.8rem] w-full text-[#334155] bg-transparent 
                                    border-none focus:outline-none tracking-wide select-none
                                "
                                type="text"
                                readOnly
                                value={displayExpression || "0"}
                            />
                        </div>

                        {/* Button Grid layout */}
                        <div className="grid grid-cols-4 gap-4 sm:gap-5 w-full">
                            {CALC_BUTTONS.map((btn) => (
                                <CalcButton
                                    key={btn.label}
                                    label={btn.label}
                                    textToSpeak={btn.textToSpeak}
                                    variant={btn.variant}
                                    className={btn.className}
                                    onClick={() => {
                                        if (btn.onClick) {
                                            btn.onClick();
                                        } else {
                                            handleInput(btn.value || btn.label);
                                        }
                                    }}
                                />
                            ))}
                        </div>

                    </div>
                </div>
            </div>
        </PageContainer>
    );
}

export default Calculator;
