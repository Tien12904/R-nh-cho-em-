/**
 * Romantic ambient piano & chime synthesizer using the Web Audio API.
 * 100% self-contained, no external audio files, no network latency.
 */

class RomanticAudioPlayer {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private noteIndex: number = 0;

  // Gentle, nostalgic arpeggio in F major / D minor (F, A, C, E, D, G...)
  private melodyNotes: number[] = [
    349.23, // F4
    440.00, // A4
    523.25, // C5
    659.25, // E5
    587.33, // D5
    440.00, // A4
    523.25, // C5
    392.00, // G4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    659.25  // E5
  ];

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying || !this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.noteIndex = 0;

    // Play next note every 650ms for a peaceful, tender pacing
    this.intervalId = window.setInterval(() => {
      this.playNote();
    }, 650);

    this.playNote();
  }

  public pause() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  private playNote() {
    if (!this.ctx || !this.masterGain) return;

    const freq = this.melodyNotes[this.noteIndex % this.melodyNotes.length];
    this.noteIndex++;

    const now = this.ctx.currentTime;
    
    // Create soft sine oscillator for warm body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm harmonics layer (triangle wave 1 octave lower)
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(freq / 2, now);

    // Bell chime overtone (gentle high sparkle)
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(freq * 2, now);

    // Envelope shaping (gentle attack, lingering decay)
    oscGain.gain.setValueAtTime(0.0001, now);
    oscGain.gain.exponentialRampToValueAtTime(0.2, now + 0.08);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

    subGain.gain.setValueAtTime(0.0001, now);
    subGain.gain.exponentialRampToValueAtTime(0.07, now + 0.1);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    bellGain.gain.setValueAtTime(0.0001, now);
    bellGain.gain.exponentialRampToValueAtTime(0.04, now + 0.04);
    bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

    // Connections
    osc.connect(oscGain);
    subOsc.connect(subGain);
    bellOsc.connect(bellGain);

    oscGain.connect(this.masterGain);
    subGain.connect(this.masterGain);
    bellGain.connect(this.masterGain);

    osc.start(now);
    subOsc.start(now);
    bellOsc.start(now);

    osc.stop(now + 2.5);
    subOsc.stop(now + 2.5);
    bellOsc.stop(now + 1.5);
  }

  // Play a soft magic chime when flower blooms
  public playBloomSound() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    chords.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 1.6);
    });
  }
}

export const romanticAudio = new RomanticAudioPlayer();
