/**
 * Web Haptics Utility
 * Provides haptic feedback for button clicks and interactions
 * Works on iOS Safari and Android (Vibration API fallback)
 */

export type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

// Duration in milliseconds for each haptic type
const hapticMap: Record<HapticIntensity, number> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: 15,
  error: 25,
  warning: 20,
};

/**
 * Trigger haptic feedback using Vibration API
 * @param intensity - The intensity/type of haptic feedback
 */
export function haptic(intensity: HapticIntensity = 'light') {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(hapticMap[intensity]);
    }
  } catch (err) {
    // Silently fail - not all devices support haptics
    console.debug('Haptic feedback not supported on this device');
  }
}

/**
 * Hook for adding haptic feedback to button clicks
 * Usage: onClick={withHaptic(() => handleClick(), 'medium')}
 */
export function withHaptic<T extends (...args: any[]) => any>(
  fn: T,
  intensity: HapticIntensity = 'light'
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>) => {
    haptic(intensity);
    return fn(...args);
  };
}

/**
 * Add haptic feedback to all buttons on the page
 * Call this once in your app's entry point
 */
export function initGlobalHaptics() {
  if (typeof document === 'undefined') return;

  const handleClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const button = target.closest('button, [role="button"], a, input[type="submit"]');
    
    if (button) {
      // Determine intensity based on button type
      const intensity: HapticIntensity = 
        button.getAttribute('data-haptic') as HapticIntensity ||
        (button.classList.contains('btn-primary') ? 'medium' : 'light');
      
      haptic(intensity);
    }
  };

  document.addEventListener('click', handleClick, { passive: true });
  
  // Return cleanup function
  return () => document.removeEventListener('click', handleClick);
}

// Default export for convenience
export default haptic;
