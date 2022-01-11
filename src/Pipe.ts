import { Sprite, Surface, Texture, rand, rangeOverlaps } from "ugf";
import Bird from "./Bird";

export default class Pipe {
   // Constants
   public static WIDTH: number;
   private static MIN_HEIGHT: number;
   private static GAP_LENGHT: number;
   private static WORLD_HEIGHT: number;
   private static START: number;

   /**
    * 0: Bot head
    * 1: Bot body
    * 2: Top head
    * 3: Top body
    */
   private pipes: Sprite[] = new Array<Sprite>(4);
   private surface: Surface;
   private texture: Texture;
   private gapRange!: {min: number, max: number};

   private go: boolean = false;

   public static init(
      width: number,
      min_height: number,
      gap: number,
      world_height: number,
      start: number
   ) {
      Pipe.WIDTH = width;
      Pipe.MIN_HEIGHT = min_height;
      Pipe.GAP_LENGHT = gap;
      Pipe.WORLD_HEIGHT = world_height;
      Pipe.START = start;
   }

   constructor(surface: Surface, texture: Texture) {
      this.surface = surface;
      this.texture = texture;
      this.populate();
   }
   
   populate() {
      let surface = this.surface;
      let texture = this.texture;
      let worldHeight = Pipe.WORLD_HEIGHT;
      let gap = Pipe.GAP_LENGHT;
      let minHeight = Pipe.MIN_HEIGHT;
      let width = Pipe.WIDTH;
      let x = Pipe.START;

      let [ min, max ] = [ minHeight + gap, worldHeight - minHeight ];
   
      let hBot = rand(min, max);
      let hTop = hBot - gap; // TODO: maybe make it so gap has varience...?

      this.gapRange = { min: hTop + width, max: hBot };
   
      this.pipes[0] = new Sprite(surface, x, hBot, texture, 0).setSize(width).setAnchor(0); // BOT HEAD
      this.pipes[1] = new Sprite(surface, x, hBot + minHeight, texture, 1).setSize(width, worldHeight).setAnchor(0); // BOT body
      this.pipes[2] = new Sprite(surface, x, hTop, texture, 0).setSize(width).setAnchor(1, 0).rotate(Math.PI); // TOP HEAD
      this.pipes[3] = new Sprite(surface, x, hTop, texture, 1).setSize(width, worldHeight).setAnchor(1, 0).flipX(); // TOP BODY
   }

   start() {
      if (this.go) {
         this.canPoint = true;
         this.randomizeGap();
         for (const pipe of this.pipes) {
            pipe.x = Pipe.START
         }
      } else {
         this.go = true;
      }
   }

   stop() {
      this.go = false;
      this.canPoint = true;
      for (const pipe of this.pipes) {
         pipe.x = Pipe.START;
      }
      this.randomizeGap();
   }

   randomizeGap() {
      let worldHeight = Pipe.WORLD_HEIGHT;
      let gap = Pipe.GAP_LENGHT;
      let width = Pipe.WIDTH;
      let minHeight = Pipe.MIN_HEIGHT;
      let [ min, max ] = [ minHeight + gap, worldHeight - minHeight ];
      let hBot = rand(min, max);
      let hTop = hBot - gap; // TODO: maybe make it so gap has varience...?

      this.pipes[0].y = hBot;
      this.pipes[1].y = hBot + minHeight;
      this.pipes[2].y = hTop;
      this.pipes[3].y = hTop;

      this.gapRange = { min: hTop + width, max: hBot };
   }

   move(n: number) {
      if (this.go) for (const pipe of this.pipes) pipe.x -= n;
   }

   canPoint = true;

   checkCollision(bird: Bird, fn: Function): boolean {
      let x = this.pipes[0].x;
      let width = Pipe.WIDTH;
      let birdRangeY = { min: bird.y + bird.hitRad, max: bird.y - bird.hitRad };
      let birdRangeX = { min: bird.x - bird.hitRad, max: bird.x + bird.hitRad };
      let gapRange = this.gapRange;
      let widthRange = { min: x, max: x + width};

      let inRangeX = rangeOverlaps(birdRangeX, widthRange);

      if (inRangeX) {
         if (this.canPoint) {
            fn();
            this.canPoint = false;
         }
      }

      return inRangeX && !rangeOverlaps(birdRangeY, gapRange);
   }
}