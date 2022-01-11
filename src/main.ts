import { Surface, Texture } from 'ugf';
import Bird from "./Bird";
import Pipe from "./Pipe";

const main = async () => {
   // Initilizing Surface
   let surface = new Surface(1400, 750, [119,153,202]);
   
   // Loading assets
   let assets = './assets/';
   let birdTex = await Texture.fromPath(assets + 'bird.png', {cols: 3, rows: 1, height: 29, width: 31});
   let pipeTex = await Texture.fromPath(assets + 'pipe.png', {cols: 1, rows: 2, height: 32, width: 32});
   
   // Pipe Settings
   Pipe.init(
      2 * 32, // width
      32    , // min height
      32 * 7 - 10, // gap,
      surface.height, // world height
      surface.width  // start pos
   )

   // GLOBAL variables
   let score = 0;
   let bestScore: number;
   let strBestScore = localStorage.getItem('bestScore');

   if (!strBestScore) {
      bestScore = 0;
      localStorage.setItem('bestScore', bestScore.toString());
   } else {
      bestScore = parseInt(strBestScore);
   };

   // HTML elements
   let scoreElem = document.createElement('h1');
   let bestScoreElem = document.createElement('h1');
   document.body.appendChild(scoreElem);
   document.body.appendChild(bestScoreElem);

   let setScore = (n: number) => {
      score = n;
      scoreElem.textContent = `Score: ${score.toString()}`;
   }
   
   let setBestScore = (n: number) => {
      if (n > bestScore) {
         bestScore = n;
      }

      bestScoreElem.textContent = `Best Score: ${bestScore}`;
      localStorage.setItem('bestScore', bestScore.toString());
   }

   setScore(0);
   setBestScore(0);

   // Creating gameobjects
   let bird = new Bird(surface, birdTex);
   let pipes: Pipe[] = [];

   let pipeInterval = 250 + Pipe.WIDTH// gap between pipes interval
   let pipeSpeed = 300;
   let amount = 5;
   for (let i = 0; i < amount; i++) pipes.push(new Pipe(surface, pipeTex));

   // pipes move 300 px/s, if we want 400 px interval then t = delay
   let delay = (pipeInterval / pipeSpeed) * 1000;

   // Input
   let space = surface.addKeyInput(' ');
   
   let gameScene = () => {
      let begin = () => {
         // Resting input
         space.reset();
         space.onDownCallback = () => { start(); bird.jump(); }
         bird.reset();
         for (const pipe of pipes) {
            pipe.stop();
         }
         surface.update = () => {};
      }

      let start = () => {

         let incrementScore = () => { setScore(score + 1) };

         // Reseting input
         space.reset();
         space.onDownOnceCallback = () => { bird.jump() };
         let count = 0;
         let timer = setInterval(
            () => {
               // allows pipe to move, resets its position and randomized its gap position
               pipes[count % amount].start();
               count++;
            },
            delay
         )

         

         surface.update = (dt: number) => {
            bird.update(dt);
            pipes.forEach(
               p => {
                  p.move(pipeSpeed * dt)
                  if (p.checkCollision(bird, incrementScore)) {
                     setBestScore(score);
                     setScore(0);
                     begin();
                     clearInterval(timer);
                  }
               }
            )
         };
      }

      begin();
   }

   gameScene();
}

main();