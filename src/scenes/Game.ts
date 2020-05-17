import Phaser from 'phaser'

export default class Demo extends Phaser.Scene {
  logo: Phaser.GameObjects.Image
  logoSm: Phaser.GameObjects.Image
  timer: number = 0

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
  }

  create() {
    this.logo = this.add.image(400, 200, 'twopm')
    this.logoSm = this.add.image(400, 200, 'twopm')
    this.logoSm.scale = 0.2

    this.tweens.add({
      targets: this.logo,
      y: 240,
      duration: 3000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }

  update() {
    this.timer += 0.005
    let radius = 220

    this.logoSm.setPosition(
      this.logo.x + radius * Math.cos(this.timer),
      this.logo.y + radius * Math.sin(this.timer)
    )
  }
}
