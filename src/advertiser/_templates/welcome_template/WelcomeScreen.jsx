/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import './WelcomeScreen.css';

function WelcomeScreen({ onContinue }) {
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        if (loading) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(timer);
                        setExiting(true);
                        setTimeout(() => {
                            onContinue();
                        }, 1000); // Aguarda 1 segundo para a animação de saída
                        return 100;
                    }
                    const newProgress = oldProgress + 1;
                    return Math.min(newProgress, 100);
                });
            }, 30);

            return () => clearInterval(timer);
        }
    }, [loading, onContinue]);

    return (
        <div className="welcome-screen">
            <div className="floating-elements">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className={`floating-element element-${i % 3} ${exiting ? 'exit-animation' : ''}`}
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDuration: `${15 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * -15}s`,
                            transitionDelay: `${i * 0.05}s`
                        }}
                    ></div>
                ))}
            </div>

            <h1 className={`welcome-title ${exiting ? 'fade-out' : ''}`}>Bem-vindo ao Editor AUK</h1>
            <p className={`welcome-subtitle ${exiting ? 'fade-out' : ''}`}>Crie seu site personalizado em minutos</p>
            {!loading ? (
                <button
                    onClick={() => setLoading(true)}
                    className={`continue-button ${exiting ? 'fade-out' : ''}`}
                >
                    Continuar
                </button>
            ) : (
                <div className={`progress-bar-container ${exiting ? 'fade-out' : ''}`}>
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}

export default WelcomeScreen;
