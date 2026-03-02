import { useState, useEffect, MouseEvent, CSSProperties } from 'react';

interface RippleType {
  x: number;
  y: number;
  size: number;
  key: number;
}

export function useRipple() {
  const [ripples, setRipples] = useState<RippleType[]>([]);

  useEffect(() => {
    let timeoutId: number;
    if (ripples.length > 0) {
      // Clear ripples after animation duration (e.g., 600ms)
      // We set slightly longer to be safe
      timeoutId = window.setTimeout(() => {
        setRipples([]);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [ripples.length]);

  const addRipple = (event: MouseEvent<HTMLElement>) => {
    const rippleContainer = event.currentTarget.getBoundingClientRect();
    const size =
      rippleContainer.width > rippleContainer.height
        ? rippleContainer.width
        : rippleContainer.height;

    // Calculate position relative to the element
    const x = event.clientX - rippleContainer.left - size / 2;
    const y = event.clientY - rippleContainer.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      key: Date.now(),
    };
    setRipples((prev) => [...prev, newRipple]);
  };

  return { ripples, addRipple };
}

export function Ripple({ ripples, color = 'bg-neutral-500/20' }: { ripples: RippleType[]; color?: string }) {
  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className={`absolute ${color} rounded-full pointer-events-none animate-ripple`}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: ripple.size,
            height: ripple.size,
          } as CSSProperties}
        />
      ))}
    </>
  );
}
