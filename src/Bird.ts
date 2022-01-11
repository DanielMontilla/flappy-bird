import { mapValue, Sprite, Surface, Texture } from "ugf";

export default class Bird extends Sprite {

   public hitRad: number = 23;

   public vel: number   // px/s
   public acc: number   // px/s^2

   constructor(surface: Surface, texture: Texture) {
      super(surface, 128, surface.center[1], texture);

      this.width = 31;
      this.height = 29;

      this.scale(2);
      this.vel = 0;
      this.acc = 2100;   // gravity :)
   }

   public update(dt: number): void {
      
      this.vel += this.acc * dt;
      this.y += this.vel * dt;
   }

   public jump() {
      this.vel = -600;
      this.playAnim();
   }

   private playAnim() {
      setTimeout(() => {this.setFrame(1) }, 0) // Mid flap
      setTimeout(() => {this.setFrame(2) }, 100) // full flap
      setTimeout(() => {this.setFrame(1) }, 200) // Mid flap
      setTimeout(() => {this.setFrame(0) }, 300) // idle
   }

   public reset() {
      this.y = this.surface.center[1];
   }
}