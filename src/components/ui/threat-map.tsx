"use client";

import { useEffect, useRef } from "react";

interface ThreatNode {
    x: number;
    y: number;
    pulse: number;
    intensity: number;
}

interface AttackLine {
    from: ThreatNode;
    to: ThreatNode;
    progress: number;
    speed: number;
}

export function ThreatMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Generate threat nodes (hotspots)
        const nodes: ThreatNode[] = [];
        for (let i = 0; i < 15; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                pulse: Math.random() * Math.PI * 2,
                intensity: 0.3 + Math.random() * 0.7,
            });
        }

        // Generate attack lines
        const lines: AttackLine[] = [];
        for (let i = 0; i < 8; i++) {
            const from = nodes[Math.floor(Math.random() * nodes.length)];
            const to = nodes[Math.floor(Math.random() * nodes.length)];
            if (from !== to) {
                lines.push({
                    from,
                    to,
                    progress: Math.random(),
                    speed: 0.002 + Math.random() * 0.003,
                });
            }
        }

        // Animation loop
        let animationId: number;
        const animate = () => {
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw grid
            ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += 50) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += 50) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }

            // Draw attack lines
            lines.forEach((line) => {
                line.progress += line.speed;
                if (line.progress > 1) line.progress = 0;

                const x = line.from.x + (line.to.x - line.from.x) * line.progress;
                const y = line.from.y + (line.to.y - line.from.y) * line.progress;

                // Draw line trail
                const gradient = ctx.createLinearGradient(line.from.x, line.from.y, x, y);
                gradient.addColorStop(0, "rgba(255, 0, 0, 0)");
                gradient.addColorStop(1, "rgba(255, 0, 0, 0.5)");

                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(line.from.x, line.from.y);
                ctx.lineTo(x, y);
                ctx.stroke();

                // Draw moving particle
                ctx.fillStyle = "rgba(255, 50, 50, 0.8)";
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fill();
            });

            // Draw threat nodes
            nodes.forEach((node) => {
                node.pulse += 0.05;
                const pulseSize = 5 + Math.sin(node.pulse) * 3;

                // Outer glow
                const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, pulseSize * 3);
                gradient.addColorStop(0, `rgba(0, 255, 255, ${node.intensity * 0.3})`);
                gradient.addColorStop(1, "rgba(0, 255, 255, 0)");

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize * 3, 0, Math.PI * 2);
                ctx.fill();

                // Core node
                ctx.fillStyle = `rgba(0, 255, 255, ${node.intensity})`;
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
                ctx.fill();

                // Inner highlight
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.beginPath();
                ctx.arc(node.x, node.y, pulseSize * 0.4, 0, Math.PI * 2);
                ctx.fill();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
            style={{ background: "linear-gradient(to bottom, #000000, #0a0a0a)" }}
        />
    );
}
