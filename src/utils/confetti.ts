import confetti from 'canvas-confetti';

/**
 * Triggers a patriotic Pakistan-themed confetti celebration
 * Uses Pakistan Emerald Green (#006622), Pure White (#FFFFFF), and Gold (#FFD700)
 */
export function triggerPatrioticConfetti() {
  const colors = ['#006622', '#00401a', '#ffffff', '#ffd700', '#22c55e'];

  // Left side burst
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.7 },
    colors: colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });

  // Right side burst
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.7 },
    colors: colors,
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });
}

/**
 * Fireworks style grand celebration
 */
export function triggerFireworks() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#006622', '#ffffff', '#ffd700', '#10b981'];

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 20 * (timeLeft / duration);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 150,
      origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
      colors: colors,
      scalar: randomInRange(0.8, 1.3),
    });
  }, 250);
}
