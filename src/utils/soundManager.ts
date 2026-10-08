export class SoundManager {
  private static sounds: Record<string, HTMLAudioElement> = {
    cannon: new Audio('/assets/sounds/cannon.mp3'),
    explosion: new Audio('/assets/sounds/explosion.mp3'),
    hit: new Audio('/assets/sounds/hit.mp3'),
  };

  public static play(soundName: 'cannon' | 'explosion' | 'hit'): void {
    const audio = this.sounds[soundName];
    if (audio) {
      const clone = audio.cloneNode() as HTMLAudioElement; // Permite tocar múltiplos sons ao mesmo tempo
      clone.volume = 0.5;
      clone.play().catch(() => {
        // Ignora erros de reprodução sem interação prévia do usuário
      });
    }
  }
}