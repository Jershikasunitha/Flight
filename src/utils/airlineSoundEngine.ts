/**
 * Airline Sound Engine for VOYA
 * Inspired by Idle Airline Tycoon & flight simulator soundscapes.
 * Uses the Web Audio API to synthesize realistic aircraft jet engines,
 * flyby whooshes, airport arrival chimes, and radar beacon pings.
 */

class AirlineSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35; // default gentle volume
  private engineGainNode: GainNode | null = null;
  private engineOsc: OscillatorNode | null = null;
  private engineOscHarmonic: OscillatorNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGainNode: GainNode | null = null;
  private isEngineRunning: boolean = false;
  private listeners: Set<(muted: boolean, volume: number) => void> = new Set();

  constructor() {
    // Check saved audio preference
    const savedMute = localStorage.getItem('voya_audio_muted');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }
    const savedVol = localStorage.getItem('voya_audio_vol');
    if (savedVol !== null) {
      const v = parseFloat(savedVol);
      if (!isNaN(v) && v >= 0 && v <= 1) {
        this.volume = v;
      }
    }
  }

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public subscribe(cb: (muted: boolean, volume: number) => void): () => void {
    this.listeners.add(cb);
    cb(this.isMuted, this.volume);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isMuted, this.volume));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('voya_audio_muted', String(this.isMuted));
    if (this.isMuted) {
      if (this.engineGainNode && this.ctx) {
        this.engineGainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      }
    } else {
      this.initContext();
      if (!this.isEngineRunning) {
        this.startEngineSound();
      } else if (this.engineGainNode && this.ctx) {
        this.engineGainNode.gain.setTargetAtTime(this.volume * 0.28, this.ctx.currentTime, 0.1);
      }
    }
    this.notify();
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('voya_audio_vol', String(this.volume));
    if (!this.isMuted && this.engineGainNode && this.ctx) {
      this.engineGainNode.gain.setTargetAtTime(this.volume * 0.28, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Starts ambient twin-turbofan jet engine hum.
   * Synthesized using pink/brown noise and low-frequency turbine oscillators.
   */
  public startEngineSound(pitchMultiplier = 1.0) {
    if (this.isEngineRunning) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      this.isEngineRunning = true;

      // 1. Jet Engine Master Gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      this.engineGainNode = masterGain;

      // 2. Low-frequency Turbine blade hum
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(84 * pitchMultiplier, ctx.currentTime);

      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(168 * pitchMultiplier, ctx.currentTime);

      const humGain = ctx.createGain();
      humGain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc1.connect(humGain);
      osc2.connect(humGain);
      humGain.connect(masterGain);

      osc1.start();
      osc2.start();
      this.engineOsc = osc1;
      this.engineOscHarmonic = osc2;

      // 3. Jet Airflow / Turbine exhaust noise (Pink Noise buffer)
      const bufferSize = ctx.sampleRate * 2; // 2 seconds of loopable noise
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      // Filter noise to sound like high-altitude airliner cabin airflow
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(280 * pitchMultiplier, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(2.0, ctx.currentTime);
      this.engineFilter = noiseFilter;

      const airGain = ctx.createGain();
      airGain.gain.setValueAtTime(0.65, ctx.currentTime);
      this.noiseGainNode = airGain;

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(airGain);
      airGain.connect(masterGain);

      noiseSource.start();
      this.noiseNode = noiseSource;
    } catch {
      this.isEngineRunning = false;
    }
  }

  /**
   * Adjusts engine throttle dynamically (e.g. during climb, cruise, or landing)
   */
  public setThrottle(speedFactor: number) {
    if (!this.ctx || !this.isEngineRunning) return;
    const clamped = Math.max(0.6, Math.min(1.8, speedFactor));
    const now = this.ctx.currentTime;
    if (this.engineOsc) {
      this.engineOsc.frequency.setTargetAtTime(84 * clamped, now, 0.4);
    }
    if (this.engineOscHarmonic) {
      this.engineOscHarmonic.frequency.setTargetAtTime(168 * clamped, now, 0.4);
    }
    if (this.engineFilter) {
      this.engineFilter.frequency.setTargetAtTime(280 * clamped, now, 0.5);
    }
  }

  public stopEngineSound() {
    if (!this.isEngineRunning) return;
    try {
      if (this.engineOsc) {
        this.engineOsc.stop();
        this.engineOsc.disconnect();
      }
      if (this.engineOscHarmonic) {
        this.engineOscHarmonic.stop();
        this.engineOscHarmonic.disconnect();
      }
      if (this.noiseNode) {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      }
      if (this.engineGainNode) {
        this.engineGainNode.disconnect();
      }
    } catch {
      // ignore cleanup errors
    } finally {
      this.isEngineRunning = false;
      this.engineOsc = null;
      this.engineOscHarmonic = null;
      this.noiseNode = null;
      this.engineGainNode = null;
      this.engineFilter = null;
    }
  }

  /**
   * Plays a Doppler flyby jet whoosh (like planes flying overhead in Tycoon game)
   */
  public playFlybyWhoosh() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 2.2;

      // Bandpassed noise for air whoosh
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(1100, now + duration * 0.4);
      filter.frequency.exponentialRampToValueAtTime(180, now + duration);
      filter.Q.setValueAtTime(3.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.45, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Stereo panner for spatial pass
      if (typeof ctx.createStereoPanner === 'function') {
        const panner = ctx.createStereoPanner();
        panner.pan.setValueAtTime(-0.8, now);
        panner.pan.linearRampToValueAtTime(0.8, now + duration);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(panner);
        panner.connect(ctx.destination);
      } else {
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
      }

      noise.start(now);
      noise.stop(now + duration);
    } catch {}
  }

  /**
   * Classic Airport Announcement Two-Tone Chime ("Ding-Dong")
   */
  public playAirportChime() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const playTone = (freq: number, startTime: number, toneDuration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.35, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + toneDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + toneDuration);
      };

      // F5 (698 Hz) -> C5 (523 Hz)
      playTone(698.46, now, 0.7);
      playTone(523.25, now + 0.35, 0.9);
    } catch {}
  }

  /**
   * Subtle Radar Ping / ATC Beacon
   */
  public playRadarPing() {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(940, now);
      osc.frequency.exponentialRampToValueAtTime(860, now + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }
}

export const airlineSound = new AirlineSoundEngine();
