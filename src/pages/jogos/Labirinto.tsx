import { useState, useRef, useEffect } from "react";
import mouseImg from "../../assets/images/labirinto/mouse.png";
import cheeseImg from "../../assets/images/labirinto/chesse.png";

// --- Funções Auxiliares (Legado) ---
function rand(max: number) {
  return Math.floor(Math.random() * max);
}

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function changeBrightness(factor: number, sprite: HTMLImageElement): HTMLImageElement {
  try {
    const virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    const context = virtCanvas.getContext("2d");
    if (!context) return sprite;
    context.drawImage(sprite, 0, 0, 500, 500);

    const imgData = context.getImageData(0, 0, 500, 500);

    for (let i = 0; i < imgData.data.length; i += 4) {
      imgData.data[i] = imgData.data[i] * factor;
      imgData.data[i + 1] = imgData.data[i + 1] * factor;
      imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);

    const spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
  } catch (err) {
    console.warn("changeBrightness falhou. Usando sprite original.", err);
    return sprite;
  }
}

// --- Classes do Jogo (Legado adaptado) ---
class MazeGen {
  width: number;
  height: number;
  mazeMap: any[][];
  startCoord: { x: number, y: number };
  endCoord: { x: number, y: number };
  dirs = ["n", "s", "e", "w"];
  modDir: any = {
    n: { y: -1, x: 0, o: "s" },
    s: { y: 1, x: 0, o: "n" },
    e: { y: 0, x: 1, o: "w" },
    w: { y: 0, x: -1, o: "e" }
  };

  constructor(Width: number, Height: number) {
    this.width = Width;
    this.height = Height;
    this.mazeMap = [];
    this.startCoord = { x: 0, y: 0 };
    this.endCoord = { x: 0, y: 0 };

    this.genMap();
    this.defineStartEnd();
    this.defineMaze();
  }

  map() { return this.mazeMap; }
  start() { return this.startCoord; }
  end() { return this.endCoord; }

  genMap() {
    this.mazeMap = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      this.mazeMap[x] = new Array(this.height);
      for (let y = 0; y < this.height; ++y) {
        this.mazeMap[x][y] = { n: false, s: false, e: false, w: false, visited: false, priorPos: null };
      }
    }
  }

  defineMaze() {
    let isComp = false;
    let move = false;
    let cellsVisited = 1;
    let numLoops = 0;
    let maxLoops = 0;
    let pos = { x: 0, y: 0 };
    let numCells = this.width * this.height;

    while (!isComp) {
      move = false;
      this.mazeMap[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        shuffle(this.dirs);
        maxLoops = Math.round(rand(this.height / 8));
        numLoops = 0;
      }
      numLoops++;
      
      for (let index = 0; index < this.dirs.length; index++) {
        let direction = this.dirs[index];
        let nx = pos.x + this.modDir[direction].x;
        let ny = pos.y + this.modDir[direction].y;

        if (nx >= 0 && nx < this.width && ny >= 0 && ny < this.height) {
          if (!this.mazeMap[nx][ny].visited) {
            this.mazeMap[pos.x][pos.y][direction] = true;
            this.mazeMap[nx][ny][this.modDir[direction].o] = true;
            this.mazeMap[nx][ny].priorPos = pos;
            pos = { x: nx, y: ny };
            cellsVisited++;
            move = true;
            break;
          }
        }
      }

      if (!move) {
        pos = this.mazeMap[pos.x][pos.y].priorPos;
        if (!pos) break; // Fallback infinito
      }
      if (numCells === cellsVisited) {
        isComp = true;
      }
    }
  }

  defineStartEnd() {
    switch (rand(4)) {
      case 0:
        this.startCoord = { x: 0, y: 0 };
        this.endCoord = { x: this.width - 1, y: this.height - 1 };
        break;
      case 1:
        this.startCoord = { x: this.width - 1, y: 0 };
        this.endCoord = { x: 0, y: this.height - 1 };
        break;
      case 2:
        this.startCoord = { x: 0, y: this.height - 1 };
        this.endCoord = { x: this.width - 1, y: 0 };
        break;
      case 3:
        this.startCoord = { x: this.width - 1, y: this.height - 1 };
        this.endCoord = { x: 0, y: 0 };
        break;
    }
  }
}

class DrawMaze {
  maze: MazeGen;
  ctx: CanvasRenderingContext2D;
  cellSize: number;
  endSprite: HTMLImageElement | null;

  constructor(Maze: MazeGen, ctx: CanvasRenderingContext2D, cellsize: number, endSprite: HTMLImageElement | null = null) {
    this.maze = Maze;
    this.ctx = ctx;
    this.cellSize = cellsize;
    this.endSprite = endSprite;
    this.ctx.lineWidth = this.cellSize / 40;

    this.clear();
    this.drawMap();
    if (this.endSprite) this.drawEndSprite();
    else this.drawEndFlag();
  }

  redrawMaze(size: number) {
    this.cellSize = size;
    this.ctx.lineWidth = this.cellSize / 50;
    this.drawMap();
    if (this.endSprite) this.drawEndSprite();
    else this.drawEndFlag();
  }

  drawCell(xCord: number, yCord: number, cell: any) {
    let x = xCord * this.cellSize;
    let y = yCord * this.cellSize;

    if (cell.n === false) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x + this.cellSize, y);
      this.ctx.stroke();
    }
    if (cell.s === false) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y + this.cellSize);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
      this.ctx.stroke();
    }
    if (cell.e === false) {
      this.ctx.beginPath();
      this.ctx.moveTo(x + this.cellSize, y);
      this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
      this.ctx.stroke();
    }
    if (cell.w === false) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(x, y + this.cellSize);
      this.ctx.stroke();
    }
  }

  drawMap() {
    let map = this.maze.map();
    for (let x = 0; x < map.length; x++) {
      for (let y = 0; y < map[x].length; y++) {
        this.drawCell(x, y, map[x][y]);
      }
    }
  }

  drawEndFlag() {
    let coord = this.maze.end();
    let gridSize = 4;
    let fraction = this.cellSize / gridSize - 2;
    let colorSwap = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 === 0) colorSwap = !colorSwap;
      for (let x = 0; x < gridSize; x++) {
        this.ctx.beginPath();
        this.ctx.rect(
          coord.x * this.cellSize + x * fraction + 4.5,
          coord.y * this.cellSize + y * fraction + 4.5,
          fraction,
          fraction
        );
        this.ctx.fillStyle = colorSwap ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
        this.ctx.fill();
        colorSwap = !colorSwap;
      }
    }
  }

  drawEndSprite() {
    if (!this.endSprite) return;
    let offsetLeft = this.cellSize / 50;
    let coord = this.maze.end();
    this.ctx.drawImage(
      this.endSprite,
      2, 2, this.endSprite.width, this.endSprite.height,
      coord.x * this.cellSize + offsetLeft,
      coord.y * this.cellSize + offsetLeft,
      this.cellSize - offsetLeft * 2,
      this.cellSize - offsetLeft * 2
    );
  }

  clear() {
    let canvasSize = this.cellSize * this.maze.map().length;
    this.ctx.clearRect(0, 0, canvasSize, canvasSize);
  }
}

class Player {
  maze: MazeGen;
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  cellSize: number;
  onComplete: (moves: number) => void;
  onStep: (moves: number) => void;
  sprite: HTMLImageElement | null;
  moves: number = 0;
  cellCoords: { x: number, y: number };
  halfCellSize: number;
  bindedCheck: (e: KeyboardEvent) => void;

  constructor(maze: MazeGen, c: HTMLCanvasElement, _cellsize: number, onComplete: (moves: number) => void, onStep: (moves: number) => void, sprite: HTMLImageElement | null = null) {
    this.maze = maze;
    this.c = c;
    this.ctx = c.getContext("2d")!;
    this.cellSize = _cellsize;
    this.onComplete = onComplete;
    this.onStep = onStep;
    this.sprite = sprite;
    
    this.cellCoords = { x: maze.start().x, y: maze.start().y };
    this.halfCellSize = this.cellSize / 2;

    this.bindedCheck = this.check.bind(this);
    this.bindKeyDown();

    if (this.sprite) this.drawSpriteImg(this.cellCoords);
    else this.drawSpriteCircle(this.cellCoords);
  }

  redrawPlayer(_cellsize: number) {
    this.cellSize = _cellsize;
    this.halfCellSize = this.cellSize / 2;
    if (this.sprite) this.drawSpriteImg(this.cellCoords);
    else this.drawSpriteCircle(this.cellCoords);
  }

  drawSpriteCircle(coord: { x: number, y: number }) {
    this.ctx.beginPath();
    this.ctx.fillStyle = "yellow";
    this.ctx.arc(
      (coord.x + 1) * this.cellSize - this.halfCellSize,
      (coord.y + 1) * this.cellSize - this.halfCellSize,
      this.halfCellSize - 2, 0, 2 * Math.PI
    );
    this.ctx.fill();
    if (coord.x === this.maze.end().x && coord.y === this.maze.end().y) {
      this.onComplete(this.moves);
      this.unbindKeyDown();
    }
  }

  drawSpriteImg(coord: { x: number, y: number }) {
    if (!this.sprite) return;
    let offsetLeft = this.cellSize / 50;
    this.ctx.drawImage(
      this.sprite,
      0, 0, this.sprite.width, this.sprite.height,
      coord.x * this.cellSize + offsetLeft,
      coord.y * this.cellSize + offsetLeft,
      this.cellSize - offsetLeft * 2,
      this.cellSize - offsetLeft * 2
    );
    if (coord.x === this.maze.end().x && coord.y === this.maze.end().y) {
      this.onComplete(this.moves);
      this.unbindKeyDown();
    }
  }

  removeSprite(coord: { x: number, y: number }) {
    let offsetLeft = this.cellSize / 50;
    let offsetRight = this.cellSize / 25;
    this.ctx.clearRect(
      coord.x * this.cellSize + offsetLeft,
      coord.y * this.cellSize + offsetLeft,
      this.cellSize - offsetRight,
      this.cellSize - offsetRight
    );
  }

  moveDir(dirConfig: string) {
    let cell = this.maze.map()[this.cellCoords.x][this.cellCoords.y];
    if (cell[dirConfig] === true) {
      this.removeSprite(this.cellCoords);
      if (dirConfig === 'w') this.cellCoords = { x: this.cellCoords.x - 1, y: this.cellCoords.y };
      else if (dirConfig === 'n') this.cellCoords = { x: this.cellCoords.x, y: this.cellCoords.y - 1 };
      else if (dirConfig === 'e') this.cellCoords = { x: this.cellCoords.x + 1, y: this.cellCoords.y };
      else if (dirConfig === 's') this.cellCoords = { x: this.cellCoords.x, y: this.cellCoords.y + 1 };
      
      this.moves++;
      this.onStep(this.moves);
      if (this.sprite) this.drawSpriteImg(this.cellCoords);
      else this.drawSpriteCircle(this.cellCoords);
    }
  }

  check(e: KeyboardEvent) {
    let handled = true;
    // Prevenindo o scroll da página apenas se for as setas direcionais
    if([37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }

    switch (e.keyCode) {
      case 65: case 37: this.moveDir('w'); break; // west
      case 87: case 38: this.moveDir('n'); break; // north
      case 68: case 39: this.moveDir('e'); break; // east
      case 83: case 40: this.moveDir('s'); break; // south
      default: handled = false; break;
    }
  }

  bindKeyDown() {
    window.addEventListener("keydown", this.bindedCheck, false);

    // Swap adaptado (touch swiping sem jQuery)
    let touchstartX = 0;
    let touchstartY = 0;
    const view = document.getElementById("view");
    if(!view) return;

    const handleTouchStart = (e: TouchEvent) => {
        touchstartX = e.changedTouches[0].screenX;
        touchstartY = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
        let touchendX = e.changedTouches[0].screenX;
        let touchendY = e.changedTouches[0].screenY;
        this.handleSwipe(touchstartX, touchstartY, touchendX, touchendY);
    };

    view.addEventListener('touchstart', handleTouchStart, {passive: true});
    view.addEventListener('touchend', handleTouchEnd, {passive: true});
    // guardamos pra remover depois
    // @ts-ignore
    this.handleTouchStart = handleTouchStart;
     // @ts-ignore
    this.handleTouchEnd = handleTouchEnd;
  }

  handleSwipe(startX: number, startY: number, endX: number, endY: number) {
      let xDiff = endX - startX;
      let yDiff = endY - startY;

      // Threshold para disparo do swap
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
          if (Math.abs(xDiff) > 30) {
              if (xDiff > 0) this.moveDir('e');
              else this.moveDir('w');
          }
      } else {
          if (Math.abs(yDiff) > 30) {
              if (yDiff > 0) this.moveDir('s');
              else this.moveDir('n');
          }
      }
  }

  unbindKeyDown() {
    window.removeEventListener("keydown", this.bindedCheck, false);
    const view = document.getElementById("view");
    if(view) {
       // @ts-ignore
      view.removeEventListener('touchstart', this.handleTouchStart);
       // @ts-ignore
      view.removeEventListener('touchend', this.handleTouchEnd);
    }
  }
}

function getShortestPath(maze: MazeGen): number {
  const map = maze.map();
  const start = maze.start();
  const end = maze.end();
  
  const queue = [{ x: start.x, y: start.y, dist: 0 }];
  const visited: boolean[][] = new Array(maze.width);
  for (let x = 0; x < maze.width; x++) {
    visited[x] = new Array(maze.height).fill(false);
  }
  visited[start.x][start.y] = true;

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (current.x === end.x && current.y === end.y) {
      return current.dist;
    }
    
    const cell = map[current.x][current.y];
    if (cell.n === true && !visited[current.x][current.y - 1]) {
      visited[current.x][current.y - 1] = true;
      queue.push({ x: current.x, y: current.y - 1, dist: current.dist + 1 });
    }
    if (cell.s === true && !visited[current.x][current.y + 1]) {
      visited[current.x][current.y + 1] = true;
      queue.push({ x: current.x, y: current.y + 1, dist: current.dist + 1 });
    }
    if (cell.e === true && !visited[current.x + 1][current.y]) {
      visited[current.x + 1][current.y] = true;
      queue.push({ x: current.x + 1, y: current.y, dist: current.dist + 1 });
    }
    if (cell.w === true && !visited[current.x - 1][current.y]) {
      visited[current.x - 1][current.y] = true;
      queue.push({ x: current.x - 1, y: current.y, dist: current.dist + 1 });
    }
  }
  return 0;
}

// --- Componente React ---
export default function Labirinto() {
  const [tamanho, setTamanho] = useState<number>(10);
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won' | 'gaveUp'>('menu');
  const [moves, setMoves] = useState<number>(0);
  const [minMoves, setMinMoves] = useState<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [spritesLoaded, setSpritesLoaded] = useState(false);
  
  // Guardamos as instâncias em refs para o onresize
  const mazeRef = useRef<MazeGen | null>(null);
  const drawRef = useRef<DrawMaze | null>(null);
  const playerRef = useRef<Player | null>(null);
  
  const spriteRef = useRef<HTMLImageElement | null>(null);
  const finishSpriteRef = useRef<HTMLImageElement | null>(null);

  // Carrega os sprites 1 vez quando o componente monta
  useEffect(() => {
    let completeOne = false;
    let completeTwo = false;

    const checkComplete = () => {
      if (completeOne && completeTwo) {
        setSpritesLoaded(true);
      }
    };

    const s1 = new Image();
    s1.src = mouseImg;
    s1.onload = () => {
      spriteRef.current = changeBrightness(1.2, s1);
      completeOne = true;
      checkComplete();
    };

    const s2 = new Image();
    s2.src = cheeseImg;
    s2.onload = () => {
      finishSpriteRef.current = changeBrightness(1.1, s2);
      completeTwo = true;
      checkComplete();
    };

    return () => {
      if (playerRef.current) playerRef.current.unbindKeyDown();
    };
  }, []);

  // Controla o Resize Automático
  useEffect(() => {
    const handleResize = () => {
      if (gameState !== 'playing' || !canvasRef.current || !containerRef.current) return;
      
      const viewWidth = containerRef.current.clientWidth;
      const viewHeight = containerRef.current.clientHeight;
      const ctx = canvasRef.current.getContext('2d');
      if(!ctx) return;

      const offset = 48; // compensa o padding de p-4 + bordas
      if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - offset;
        ctx.canvas.height = viewHeight - offset;
      } else {
        ctx.canvas.width = viewWidth - offset;
        ctx.canvas.height = viewWidth - offset;
      }

      const cellSize = ctx.canvas.width / tamanho;
      if (drawRef.current && playerRef.current) {
        drawRef.current.redrawMaze(cellSize);
        playerRef.current.redrawPlayer(cellSize);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gameState, tamanho]);

  const makeMaze = () => {
    if(!spritesLoaded) return;
    
    setGameState('playing');
    setMoves(0);
    
    // Pequeno delay para garantir que a transição de renderização do container foi concluída (já que saimos do modo menu => playing)
    setTimeout(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      // Reseta refs
      if (playerRef.current) {
        playerRef.current.unbindKeyDown();
        playerRef.current = null;
      }

      // Calcula as dimensões
      const viewWidth = container.clientWidth;
      const viewHeight = container.clientHeight || window.innerHeight * 0.8;

      const offset = 48; // compensa o padding de p-4 + bordas
      if (viewHeight < viewWidth) {
        ctx.canvas.width = viewHeight - offset;
        ctx.canvas.height = viewHeight - offset;
      } else {
        ctx.canvas.width = viewWidth - offset;
        ctx.canvas.height = viewWidth - offset;
      }

      const cellSize = ctx.canvas.width / tamanho;
      
      // Inicializar Classes do Jogo
      mazeRef.current = new MazeGen(tamanho, tamanho);
      drawRef.current = new DrawMaze(mazeRef.current, ctx, cellSize, finishSpriteRef.current);
      
      setMinMoves(getShortestPath(mazeRef.current));
      
      const onGameWon = (mvs: number) => {
        setMoves(mvs);
        setGameState('won');
      };

      const onStep = (mvs: number) => {
        setMoves(mvs);
      };

      playerRef.current = new Player(mazeRef.current, canvas, cellSize, onGameWon, onStep, spriteRef.current);
    }, 50);
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const handleGiveUp = () => {
    setGameState('gaveUp');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-screen bg-gray-100">
      
      {gameState === 'menu' && (
        <div className="menu-labirinto mb-6 bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Selecione a Dificuldade</h2>
          <div className="dificuldade-input grid grid-cols-2 gap-4 mb-8">
            {[
              { val: 10, label: 'Fácil' },
              { val: 15, label: 'Médio' },
              { val: 25, label: 'Difícil' },
              { val: 38, label: 'Extremo' }
            ].map((op) => (
              <label key={op.val} className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${tamanho === op.val ? 'border-blue-600 bg-blue-50 transform scale-105 shadow-sm' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input 
                  name="value-radio" 
                  type="radio" 
                  className="hidden"
                  checked={tamanho === op.val}
                  onChange={() => setTamanho(op.val)}
                />
                <span className={`font-semibold text-lg ${tamanho === op.val ? 'text-blue-700' : 'text-gray-600'}`}>{op.label}</span>
                <span className={`text-xs mt-1 ${tamanho === op.val ? 'text-blue-500' : 'text-gray-400'}`}>{op.val}x{op.val}</span>
              </label>
            ))}
          </div>
          
          <button 
            type="button" 
            onClick={makeMaze}
            disabled={!spritesLoaded}
            className={`w-full font-bold py-4 px-4 rounded-xl text-lg transition-colors cursor-pointer ${spritesLoaded ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            {spritesLoaded ? 'Iniciar Jogo' : 'Carregando recursos...'}
          </button>
        </div>
      )}

      {gameState === 'playing' && (
        <>
          <div className="mb-4 flex flex-col md:flex-row justify-between w-full max-w-5xl items-center pb-2 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-700 mb-2 md:mb-0">Explore o labirinto!</h1>
            <div className="flex items-center gap-4">
               <span className="text-gray-600 font-medium">Movimentos: <span className="text-blue-600 font-bold">{moves}</span> <span className="text-sm text-gray-400">/ Ideal {minMoves}</span></span>
               <button onClick={handleGiveUp} className="px-5 py-2 bg-red-100 hover:bg-red-200 rounded-lg cursor-pointer text-sm font-bold text-red-700 transition shadow-sm">Desistir</button>
            </div>
          </div>
          
          <div 
            ref={containerRef}
            className="view mb-6 flex justify-center items-center w-full max-w-5xl h-[80vh]" 
            id="view"
          >
            <div className="labirinto bg-white p-3 md:p-4 shadow-xl rounded-2xl shrink-0" id="labirinto">
              <canvas 
                ref={canvasRef}
                className="border-[3px] border-gray-800 rounded-md bg-gray-50 block" 
              ></canvas>
            </div>
          </div>

          {/* Instruções */}
          <div className="instrucao bg-amber-50 border border-amber-200 text-amber-900 px-6 py-4 rounded-xl max-w-5xl w-full text-center shadow-sm">
            <p className="font-medium text-lg flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Use as setas do teclado para mover o ratinho pelo labirinto até o queijo.
            </p>
          </div>
        </>
      )}

      {gameState === 'won' && (
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-green-500">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-green-600 mb-4">Você Venceu!</h2>
          <p className="text-xl text-gray-700 mb-2">Parabéns! Você encontrou o queijo em <span className="font-bold text-2xl text-blue-600">{moves}</span> movimentos.</p>
          <p className="text-md text-gray-500 mb-8">O caminho ideal tinha exatos <span className="font-semibold text-gray-700">{minMoves}</span> passos.</p>
          <button 
            type="button" 
            onClick={backToMenu}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
          >
            Jogar Novamente
          </button>
        </div>
      )}

      {gameState === 'gaveUp' && (
        <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg text-center border-t-8 border-red-500">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold text-red-600 mb-4">Você Desistiu!</h2>
          <p className="text-xl text-gray-700 mb-2">Que pena! Você chegou a caminhar <span className="font-bold text-2xl text-red-600">{moves}</span> vezes pelo labirinto.</p>
          <p className="text-md text-gray-500 mb-8">Com apenas mais alguns passos, você teria encontrado o queijo.</p>
          <button 
            type="button" 
            onClick={backToMenu}
            className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-bold py-4 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg text-lg"
          >
            Voltar para o Menu
          </button>
        </div>
      )}

    </div>
  );
}
