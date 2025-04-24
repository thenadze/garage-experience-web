
import { useEffect, useRef } from 'react';
import p5 from 'p5';

const sketch = (p: p5) => {
  let angle = 0;
  let vertices: { x: number; y: number }[] = [];
  let targetVertices: { x: number; y: number }[] = [];
  let morphing = false;
  let progress = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    createShape('circle');
  };

  const createShape = (shape: 'circle' | 'square' | 'triangle') => {
    const radius = Math.min(p.width, p.height) * 0.2;
    const numPoints = 60;

    targetVertices = [];
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * p.TWO_PI;
      targetVertices.push({
        x: p.cos(angle) * radius,
        y: p.sin(angle) * radius
      });
    }

    if (!vertices.length) {
      vertices = [...targetVertices];
    } else {
      morphing = true;
      progress = 0;
    }
  };

  p.draw = () => {
    p.background(0, 25);
    p.translate(p.width / 2, p.height / 2);
    p.rotate(angle);
    angle += 0.005;

    if (morphing) {
      progress += 0.02;
      if (progress >= 1) {
        progress = 1;
        morphing = false;
      }

      for (let i = 0; i < vertices.length; i++) {
        vertices[i].x = p.lerp(vertices[i].x, targetVertices[i].x, progress);
        vertices[i].y = p.lerp(vertices[i].y, targetVertices[i].y, progress);
      }
    }

    p.stroke(255);
    p.noFill();
    p.beginShape();
    vertices.forEach(v => {
      p.vertex(v.x, v.y);
    });
    p.endShape(p.CLOSE);
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    createShape('circle');
  };
};

const LoadingAnimation = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const p5Instance = new p5(sketch, canvasRef.current);
    return () => p5Instance.remove();
  }, []);

  return <div ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default LoadingAnimation;
