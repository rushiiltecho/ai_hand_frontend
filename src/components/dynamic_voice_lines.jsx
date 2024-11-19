import { useEffect, useRef } from "react";

export const DynamicVoiceLine = ({ activeMode = null }) => {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);

    

    useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      let time = 0;
      
      const scale = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * scale;
      canvas.height = canvas.offsetHeight * scale;
      ctx.scale(scale, scale);
      
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerY = canvas.height / (2 * scale);
        
        const drawLayer = (offset, colors, amplitude, frequency, thickness) => {
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
          });
          
          ctx.beginPath();
          ctx.moveTo(0, centerY);
          
          for (let x = 0; x < canvas.width; x++) {
            const normalizedX = x / canvas.width;
            const baseAmplitude = activeMode ? amplitude * 1.8 : amplitude * 0.4;
            
            const y = centerY + 
              Math.sin(x * 0.015 + time * frequency * 2 + offset) * baseAmplitude * (1 - Math.abs(normalizedX - 0.5)) +
              Math.sin(x * 0.03 - time * frequency * 1.4) * (baseAmplitude * 0.7) * Math.sin(time * 0.002) +
              Math.sin(x * 0.007 + time * frequency * 1.2) * (baseAmplitude * 0.5);
              
            ctx.lineTo(x, y);
          }
          
          ctx.lineWidth = thickness;
          ctx.strokeStyle = gradient;
          ctx.stroke();
          
          ctx.save();
          ctx.filter = `blur(${thickness * 3}px)`;
          ctx.strokeStyle = gradient;
          ctx.lineWidth = thickness * 0.7;
          ctx.stroke();
          ctx.restore();
        };
  
        const layers = activeMode === 'user' ? [
          {
            colors: ['#4f46e5', '#7c3aed', '#db2777', '#ef4444'],
            amplitude: 45,
            frequency: 0.006,
            thickness: 3,
            offset: 0
          },
          {
            colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e'],
            amplitude: 35,
            frequency: 0.008,
            thickness: 2,
            offset: Math.PI / 4
          },
          {
            colors: ['#60a5fa', '#a78bfa', '#f472b6', '#fb7185'],
            amplitude: 25,
            frequency: 0.01,
            thickness: 1.5,
            offset: Math.PI / 2
          }
        ] : [
          {
            colors: ['#059669', '#0d9488', '#0891b2', '#0284c7'],
            amplitude: 45,
            frequency: 0.004,
            thickness: 3,
            offset: 0
          },
          {
            colors: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'],
            amplitude: 35,
            frequency: 0.006,
            thickness: 2,
            offset: Math.PI / 4
          },
          {
            colors: ['#34d399', '#2dd4bf', '#22d3ee', '#38bdf8'],
            amplitude: 25,
            frequency: 0.008,
            thickness: 1.5,
            offset: Math.PI / 2
          }
        ];
        
        if (activeMode) {
          layers.forEach(layer => {
            drawLayer(layer.offset, layer.colors, layer.amplitude, layer.frequency, layer.thickness);
          });
        } else {
          // Draw idle state with minimal movement
          drawLayer(0, ['#4B5563', '#6B7280', '#9CA3AF'], 10, 0.002, 1);
        }
        
        time += activeMode ? 2 : 0.3;
        animationRef.current = requestAnimationFrame(draw);
      };
      
      draw();
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [activeMode]);
    
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full max-w-3xl h-64">
          <div className={`absolute inset-0 bg-gradient-to-r ${
            activeMode === 'user' 
              ? 'from-indigo-600/20 via-purple-600/20 to-pink-500/20'
              : activeMode === 'ai'
                ? 'from-emerald-600/20 via-teal-600/20 to-cyan-500/20'
                : 'from-gray-600/10 via-gray-600/10 to-gray-600/10'
          } blur-3xl`} />
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>
    );
  };
  