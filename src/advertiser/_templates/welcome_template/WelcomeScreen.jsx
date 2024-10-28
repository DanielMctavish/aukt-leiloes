/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import './WelcomeScreen.css';
import logoAuk from '../../../media/logos/logos-auk/aukt_blue.png';  // Corrigido o caminho

function WelcomeScreen({ onContinue }) {
    const [isLoading, setIsLoading] = useState(false);
    const [loading, setLoading] = useState(0);
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const loadingInterval = useRef(null);

    // Configurações das partículas
    const config = {
        particleCount: 300,
        baseRadius: 2,
        maxConnections: 5,
        connectionRadius: 150,
        speed: 0.3, // Reduzida a velocidade base
        shapes: ['circle', 'square', 'triangle'],
        particleSize: {
            min: 8,
            max: 15
        }
    };

    // Função para gerar uma cor aleatória
    const getRandomColor = () => {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
            '#E74C3C', '#2ECC71', '#F1C40F', '#1ABC9C'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Atualiza as partículas próximas ao clique
        particlesRef.current = particlesRef.current.map(p => {
            const dx = x - p.x;
            const dy = y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const clickRadius = 100; // Raio de influência do clique

            if (distance < clickRadius) {
                return {
                    ...p,
                    color: getRandomColor(), // Atribui uma cor aleatória
                    alpha: 1, // Torna a partícula mais visível
                    // Pequeno "impulso" para fora do ponto de clique
                    vx: p.vx + (dx / distance) * 0.5,
                    vy: p.vy + (dy / distance) * 0.5
                };
            }
            return p;
        });
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrame;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createParticle = () => {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * config.speed,
                vy: (Math.random() - 0.5) * config.speed,
                baseVx: (Math.random() - 0.5) * config.speed, // Velocidade base original
                baseVy: (Math.random() - 0.5) * config.speed, // Velocidade base original
                radius: config.particleSize.min + Math.random() * (config.particleSize.max - config.particleSize.min),
                shape: config.shapes[Math.floor(Math.random() * config.shapes.length)],
                connections: 0,
                alpha: 0.6 + Math.random() * 0.4,
                originalX: 0,
                originalY: 0
            };
        };

        const initParticles = () => {
            particlesRef.current = Array(config.particleCount).fill().map(createParticle);
        };

        const drawParticle = (particle) => {
            ctx.beginPath();
            ctx.fillStyle = particle.color || `rgba(255, 255, 255, ${particle.alpha})`;

            switch (particle.shape) {
                case 'square':
                    ctx.rect(particle.x - particle.radius, particle.y - particle.radius, 
                            particle.radius * 2, particle.radius * 2);
                    break;
                case 'triangle':
                    ctx.moveTo(particle.x, particle.y - particle.radius);
                    ctx.lineTo(particle.x + particle.radius, particle.y + particle.radius);
                    ctx.lineTo(particle.x - particle.radius, particle.y + particle.radius);
                    break;
                default: // circle
                    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            }

            ctx.fill();
        };

        const drawConnections = () => {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;

            particlesRef.current.forEach((p1, i) => {
                particlesRef.current.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < config.connectionRadius && p1.connections < config.maxConnections) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                        p1.connections++;
                    }
                });
            });
        };

        const updateParticles = () => {
            particlesRef.current.forEach(p => {
                // Movimento natural base
                p.x += p.vx;
                p.y += p.vy;

                // Influência do mouse
                const dx = mouseRef.current.x - p.x;
                const dy = mouseRef.current.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const influenceRadius = 600; // Aumentado para 600px

                if (distance < influenceRadius) {
                    const influence = (influenceRadius - distance) / influenceRadius;
                    
                    // Suavemente retorna à velocidade base quando fora da influência
                    p.vx = p.baseVx * (1 - influence) - (dx * influence * 0.003); // Reduzido para 0.003
                    p.vy = p.baseVy * (1 - influence) - (dy * influence * 0.003); // Reduzido para 0.003
                } else {
                    // Gradualmente retorna à velocidade base
                    p.vx = p.vx * 0.98 + p.baseVx * 0.02;
                    p.vy = p.vy * 0.98 + p.baseVy * 0.02;
                }

                // Bounce nas bordas com amortecimento
                if (p.x < 0 || p.x > canvas.width) {
                    p.vx *= -0.6;
                    p.x = p.x < 0 ? 0 : canvas.width;
                }
                if (p.y < 0 || p.y > canvas.height) {
                    p.vy *= -0.6;
                    p.y = p.y < 0 ? 0 : canvas.height;
                }

                p.connections = 0;
            });
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            updateParticles();
            drawConnections();
            particlesRef.current.forEach(drawParticle);
            animationFrame = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouseRef.current = {
                x: e.clientX,
                y: e.clientY
            };
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', handleMouseMove);
        resizeCanvas();
        initParticles();
        animate();

        canvas.addEventListener('click', handleCanvasClick);
        
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrame);
            canvas.removeEventListener('click', handleCanvasClick);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleContinueClick = () => {
        setIsLoading(true);
        loadingInterval.current = setInterval(() => {
            setLoading(prev => {
                if (prev >= 100) {
                    clearInterval(loadingInterval.current);
                    onContinue();
                    return 100;
                }
                return prev + 1;
            });
        }, 30);
    };

    return (
        <div className="welcome-screen">
            <canvas ref={canvasRef} className="particles-canvas" />
            
            <div className="welcome-content">
                <div className="flex justify-center mb-8">
                    <img src={logoAuk} alt="Logo" className="welcome-logo" />
                </div>
                <h1 className="welcome-title">Bem-vindo ao AUK Constructor</h1>
                <p className="welcome-description">
                    Crie seu site personalizado para leilões de forma simples e intuitiva.
                </p>
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-circle"></div>
                        <div className="loading-bar">
                            <div 
                                className="loading-progress" 
                                style={{ width: `${loading}%` }}
                            ></div>
                        </div>
                        <span className="loading-text">{loading}%</span>
                    </div>
                ) : (
                    <button onClick={handleContinueClick} className="welcome-button">
                        Continuar
                    </button>
                )}
            </div>
        </div>
    );
}

export default WelcomeScreen;
