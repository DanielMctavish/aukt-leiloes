import logoAuk from "./media/logos/logos-auk/aukt_blue.png"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

function DeveloperScreen() {
    const [dots, setDots] = useState(".");
    
    // Animação dos pontos para mostrar atividade
    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? "." : prev + ".");
        }, 600);
        
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col w-full h-screen 
            justify-center items-center
            bg-gradient-to-r from-gray-50 to-gray-100">
            
            <motion.div 
                className="flex flex-col items-center max-w-md w-full px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <motion.img 
                    src={logoAuk} 
                    alt="Aukt Logo" 
                    className="w-24 md:w-32 mb-12 object-contain"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                />
                
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-3">
                        Em manutenção{dots}
                    </h1>
                    
                    <p className="text-lg md:text-xl text-gray-500 font-light mb-8">
                        Estamos trabalhando para oferecer uma experiência ainda melhor.
                    </p>
                </motion.div>
                
                <motion.div 
                    className="w-full max-w-xs flex justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                >
                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </motion.div>
                
                <motion.p 
                    className="text-sm text-gray-400 mt-8 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                >
                    Voltaremos em breve com novidades
                </motion.p>
            </motion.div>
        </div>
    )
}

export default DeveloperScreen;