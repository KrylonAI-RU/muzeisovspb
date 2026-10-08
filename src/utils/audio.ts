// Audio completely disabled as requested
class RetroSoundEngine {
  public enabled: boolean = false;

  playCoinDrop() {}
  playRelayClick() {}
  playTorpedoLaunch() {}
  playExplosion() {}
  playSodaPour() {}
}

export const retroSound = new RetroSoundEngine();
