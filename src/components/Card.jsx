import React, { useRef, useEffect, useState } from 'react';

const Card = ({ reward, onScratch }) => {
    const canvasRef = useRef(null);
    const [isScratched, setIsScratched] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const lastPosition = useRef({ x: 0, y: 0 });

    // Responsive değerler (sadece CSS değişkenlerinden)
    const cardWidth = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-width')
        .trim() || '150px';
    const cardHeight = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-height')
        .trim() || '100px';
    const rewardTextSize = getComputedStyle(document.documentElement)
        .getPropertyValue('--reward-text-size')
        .trim() || '48px';
    const canvasWidth = 150;
    const canvasHeight = 100;
    const isMobile = window.innerWidth <= 600;
    const questionMarkSize = '80px';
    const margin = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--corner-margin')
        .trim() || '20');
    const size = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--corner-size')
        .trim() || '15');

    const drawCard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Modern gradient arka plan
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const scratchGradient = getComputedStyle(document.documentElement)
            .getPropertyValue('--scratch-area-gradient')
            .trim() || 'linear-gradient(135deg, #3f51b5, #2196f3)';
        
        const [color1, color2] = parseGradientColors(scratchGradient);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Soru işareti çizimi
        const questionMarkColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--question-mark-color')
            .trim() || 'rgba(255, 255, 255, 0.2)';
        ctx.fillStyle = questionMarkColor;
        ctx.font = `bold ${questionMarkSize} Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', canvas.width / 2, canvas.height / 2 + 3);

        // Dekoratif desenler
        const cornerColor = getComputedStyle(document.documentElement)
            .getPropertyValue('--corner-decoration-color')
            .trim() || 'rgba(255, 255, 255, 0.1)';
        const cornerWidth = getComputedStyle(document.documentElement)
            .getPropertyValue('--corner-decoration-width')
            .trim() || '2px';

        ctx.strokeStyle = cornerColor;
        ctx.lineWidth = parseInt(cornerWidth);
        
        // Sol üst köşe
        ctx.beginPath();
        ctx.moveTo(margin, margin + size);
        ctx.lineTo(margin, margin);
        ctx.lineTo(margin + size, margin);
        ctx.stroke();
        
        // Sağ üst köşe
        ctx.beginPath();
        ctx.moveTo(canvas.width - margin - size, margin);
        ctx.lineTo(canvas.width - margin, margin);
        ctx.lineTo(canvas.width - margin, margin + size);
        ctx.stroke();
        
        // Sol alt köşe
        ctx.beginPath();
        ctx.moveTo(margin, canvas.height - margin - size);
        ctx.lineTo(margin, canvas.height - margin);
        ctx.lineTo(margin + size, canvas.height - margin);
        ctx.stroke();
        
        // Sağ alt köşe
        ctx.beginPath();
        ctx.moveTo(canvas.width - margin - size, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin);
        ctx.lineTo(canvas.width - margin, canvas.height - margin - size);
        ctx.stroke();
    };

    useEffect(() => {
        drawCard();
    }, []);

    // CSS değişkenlerini izle
    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    drawCard();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style']
        });

        return () => observer.disconnect();
    }, []);

    const parseGradientColors = (gradientStr) => {
        const match = gradientStr.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)/);
        if (match) {
            return [match[1].trim(), match[2].trim()];
        }
        return ['#3f51b5', '#2196f3']; // Varsayılan renkler
    };

    const calculateScratchPercentage = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        let transparentPixels = 0;

        for (let i = 3; i < pixels.length; i += 4) {
            if (pixels[i] < 128) {
                transparentPixels++;
            }
        }

        return (transparentPixels / (canvas.width * canvas.height)) * 100;
    };

    const getScratchRadius = () => {
        if (window.innerWidth <= 600) return 28;
        return 20;
    };
    const getScratchThreshold = () => {
        if (window.innerWidth <= 600) return 20;
        return 30;
    };

    const scratch = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

        ctx.globalCompositeOperation = 'destination-out';
        
        // Yumuşak kazıma efekti
        const radius = getScratchRadius();
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        lastPosition.current = { x, y };

        const scratchPercentage = calculateScratchPercentage();
        if (scratchPercentage > getScratchThreshold() && !isScratched) {
            setIsScratched(true);
            onScratch();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const startDrawing = (e) => {
        setIsDrawing(true);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
        const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;
        lastPosition.current = { x, y };
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const cardBorderRadius = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-border-radius')
        .trim() || '12px';
    const cardBoxShadow = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-box-shadow')
        .trim() || '0 8px 16px rgba(0,0,0,0.1)';
    const cardHoverTransform = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-hover-transform')
        .trim() || '-2px';
    const cardHoverShadow = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-hover-shadow')
        .trim() || '0 12px 20px rgba(0,0,0,0.15)';

    const contentBg = getComputedStyle(document.documentElement)
        .getPropertyValue('--card-content-bg')
        .trim() || 'linear-gradient(135deg, #ffffff, #f5f5f5)';
    const rewardTextGradient = getComputedStyle(document.documentElement)
        .getPropertyValue('--reward-text-gradient')
        .trim() || 'linear-gradient(45deg, #2196f3, #3f51b5)';
    const rewardTextShadow = getComputedStyle(document.documentElement)
        .getPropertyValue('--reward-text-shadow')
        .trim() || '2px 2px 4px rgba(0,0,0,0.1)';

    return (
        <div className="scratch-card" style={{ width: '150px', height: '100px', position: 'relative' }}>
            <div
                className="reward-content"
                style={{
                    fontSize: rewardTextSize,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <span>{reward.text}</span>
            </div>
            <canvas
                ref={canvasRef}
                width={150}
                height={100}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    touchAction: 'none',
                    zIndex: 2
                }}
                onMouseDown={startDrawing}
                onMouseMove={scratch}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={scratch}
                onTouchEnd={stopDrawing}
            />
            <style jsx>{`
                .scratch-card {
                    width: ${cardWidth};
                    height: ${cardHeight};
                    position: relative;
                    border-radius: ${cardBorderRadius};
                    overflow: hidden;
                    cursor: pointer;
                    box-shadow: ${cardBoxShadow};
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .scratch-card:hover {
                    transform: translateY(${cardHoverTransform});
                    box-shadow: ${cardHoverShadow};
                }

                .reward-content {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${contentBg};
                    font-weight: bold;
                    background-image: ${rewardTextGradient};
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: ${rewardTextShadow};
                    overflow: hidden;
                    line-height: 1;
                }
                .reward-content span {
                    white-space: nowrap;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: block;
                }
            `}</style>
        </div>
    );
};

export default Card; 