const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');


// --- ASSET LOADING (EXACTLY AS YOU PROVIDED) ---
const sfx = {
    sword: new Audio('assets/sword.mp3'),
    walk: new Audio('assets/walk.mp3'),
    monsterHit: new Audio('assets/monster.mp3'),
    npcTalk: new Audio('assets/npc.mp3'),
    firework: new Audio('assets/fireworks.mp3'),
    farmerSing: new Audio('assets/singing.mp3')
};

const bgmPeaceful = new Audio('assets/peaceful.mp3');
bgmPeaceful.loop = true;
bgmPeaceful.volume = 0.4;

const bgmDungeon = new Audio('assets/dungeon.mp3');
bgmDungeon.loop = true;
bgmDungeon.volume = 0.4;

const bgmBoss = new Audio('assets/boss.mp3');
bgmBoss.loop = true;
bgmBoss.volume = 0.2;

const skeletonImage = new Image();
skeletonImage.src = 'assets/Skeleton.png';

const npc3Image = new Image(); 
npc3Image.src = 'assets/character_3_frame16x20.png';

const npc5Image = new Image(); 
npc5Image.src = 'assets/character_5_frame16x20.png';

const npc6Image = new Image(); 
npc6Image.src = 'assets/character_6_frame16x20.png';

const npc19Image = new Image(); 
npc19Image.src = 'assets/character_19_frame16x20.png';

const npc20Image = new Image(); 
npc20Image.src = 'assets/character_20_frame16x20.png';

const slimeImage = new Image();
slimeImage.src = 'assets/Slime_Green.png';

const plantImage = new Image();
plantImage.src = 'assets/TX Plant.png';

const txGrassImage = new Image();
txGrassImage.src = 'assets/TX Tileset Grass.png';

const propsImage = new Image();
propsImage.src = 'assets/TX Props.png';

const stoneGroundImage = new Image();
stoneGroundImage.src = 'assets/TX Tileset Stone Ground.png';

const wallImage = new Image();
wallImage.src = 'assets/TX Tileset Wall.png';

const structImage = new Image();
structImage.src = 'assets/TX Struct.png';

const cowImage = new Image();
cowImage.src = 'assets/Cow.png';

const sheepImage = new Image();
sheepImage.src = 'assets/Sheep.png';

const chickenImage = new Image();
chickenImage.src = 'assets/Free Chicken Sprites.png';

const npcSpriteSheet = new Image();
npcSpriteSheet.src = 'assets/Villagers.png'; 

const houseImage = new Image();
houseImage.src = 'assets/Wooden_house.png'; 

const fenceImage = new Image();
fenceImage.src = 'assets/Fences.png';

const tilesetImage = new Image();
tilesetImage.src = 'assets/Grass.png'; 

const playerImage = new Image();
playerImage.src = 'assets/Basic Charakter Spritesheet.png';

const dirtImage = new Image();
dirtImage.src = 'assets/Tilled Dirt.png'; 

const waterImage = new Image();
waterImage.src = 'assets/Water.png'; 

const objectsImage = new Image();
objectsImage.src = 'assets/Basic Grass Biom things 1.png';

const hillsImage = new Image();
hillsImage.src = 'assets/Hills.png';

// Adjust volumes so they don't overpower the background music
sfx.sword.volume = 0.6;
sfx.walk.volume = 0.3; 
sfx.monsterHit.volume = 0.5;
sfx.npcTalk.volume = 0.4;
sfx.firework.volume = 0.6;
sfx.farmerSing.volume = 0.4;

// --- GAME VARIABLES ---
let tileMap = []; 
let extraPaths = [];
let animals = [];
const GAME_WIDTH = 1344;
const GAME_HEIGHT = 768;

// Added these variables to prevent "ReferenceError" in the draw loop
let currentNotification = "";
let notificationTimer = 0;

function resizeCanvas() {
    // 1. Lock the internal game resolution
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    
    // 2. Scale the canvas visually using CSS to fit the window
    // (This ensures you see the whole world even on small screens)
    const scale = Math.min(window.innerWidth / GAME_WIDTH, window.innerHeight / GAME_HEIGHT);
    
    // Apply the scaling
    canvas.style.width = (GAME_WIDTH * scale) + 'px';
    canvas.style.height = (GAME_HEIGHT * scale) + 'px';
    
    // Center the canvas
    canvas.style.position = 'absolute';
    canvas.style.left = '50%';
    canvas.style.top = '50%';
    canvas.style.transform = 'translate(-50%, -50%)';

    // Only regenerate map if it doesn't exist yet
    if (tileMap.length === 0) generateTileMap();
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// --- 1. GAME DATA & STATE ---
let currentBGM = null;
let isPlaying = false;
let activeNpcSound = null;      
let isDialogueOpen = false; 
let currentZone = 0; 
let dungeonLevel = 1;
let dialogueIndex = 0;
let isLetterUIOpen = false;
const worldData = {}; 

const gameState = {
    bossDefeated: false,
    bossDialogueTriggered: false,
    readyToReadLetter: false
};

const player = {
    name: "Hero",
    x: 100, y: canvas.height / 2,
    size: 30, radius: 10, speed: 5,
    color: '#3498db',
    role: 'knight',
    hasWeapon: false, 
    isAttacking: false,
    type: 'player',
    frameX: 0, frameY: 0, moving: false, animTimer: 0,
    
    hasSword: false, 
    gold: 100,         
    potions: 0,       
    maxPotions: 5,
    lastAttackTime: 0,
    damage: 1,           
    hpUpgradeCost: 50,   
    dmgUpgradeCost: 50,  
    hasBossKey: false,
    hasLetter: false,
    walkSfxTimer: 0
};

// --- NEW GLOBAL VARIABLES ---
let isShopOpen = false;
let shopNPC = null;
let currentTalkingNPC = null;

let gameObjects = []; 
const pathY = canvas.height / 2;
const pathHeight = 100;

function generateTileMap() {
    tileMap = []; 
    const TILE_SIZE = 48;
    const cols = Math.ceil(canvas.width / TILE_SIZE);
    const rows = Math.ceil(canvas.height / TILE_SIZE);

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < cols; c++) {
            let type = 0;
            const rand = Math.random();
            if (rand > 0.8) type = 1; 
            else if (rand > 0.9) type = 2; 
            row.push(type);
        }
        tileMap.push(row);
    }
}
generateTileMap();

function generateWorld(zone) {
    currentZone = zone;

    // --- NEW: UNIQUE MAP KEY FOR DUNGEON LEVELS ---
    playMusicForZone(zone);

    let mapKey = zone === 1 ? `1_${dungeonLevel}` : zone;

    if (worldData[mapKey]) {
        gameObjects = [...(worldData[mapKey].objects || [])]; 
        animals = [...(worldData[mapKey].animals || [])];     
        extraPaths = [...(worldData[mapKey].paths || [])];    
        
        if (zone === 1) showNotification(`Entered: Dungeon Level ${dungeonLevel}/7 🛡️`);
        return; 
    }

    // --- 2. RESET LISTS ---
    extraPaths = []; 
    gameObjects = []; 
    animals = []; 

    // --- ZONE 2: THE VILLAGE (UNCHANGED) ---
    if (zone === 2) {
        showNotification("Entered: Peaceful Village 🏡");
        localStorage.removeItem('my_rpg_village_save'); 
        if (worldData[2]) delete worldData[2];

        const bottomY = canvas.height - 220;
        const houses = [
            { x: 90, y: 30 }, { x: 80, y: bottomY+60 },     
            { x: 1050, y: 50 }, { x: 1050, y: bottomY }     
        ];

        houses.forEach(h => {
            gameObjects.push({ type: 'house', x: h.x, y: h.y, w: 160, h: 160 });
            const gridX = Math.floor((h.x + 64) / 48) * 48;
            if (h.y < pathY) extraPaths.push({ x: gridX, startY: h.y + 140, endY: pathY - 48 });
            else extraPaths.push({ x: gridX, startY: pathY + 48, endY: h.y + 64 });
        });

        const vPond = { x: 480, y: 60, w: 380, h: 150 };
        gameObjects.push({ type: 'pond', x: vPond.x, y: vPond.y, w: vPond.w, h: vPond.h });

        const cowPen = { x: 350, y: bottomY + 80, w: 250, h: 150 };
        const sheepPen = { x: 650, y: bottomY + 80, w: 250, h: 150 };

        const createFarm = (pen, animalType) => {
            for(let cx = pen.x; cx <= pen.x + pen.w; cx += 48) {
                gameObjects.push({ type: 'fence', x: cx, y: pen.y, dir: 'hor' }); 
                gameObjects.push({ type: 'fence', x: cx, y: pen.y + pen.h, dir: 'hor' }); 
            }
            for(let cy = pen.y; cy <= pen.y + pen.h; cy += 30) {
                gameObjects.push({ type: 'fence', x: pen.x, y: cy, dir: 'ver' }); 
                gameObjects.push({ type: 'fence', x: pen.x + pen.w, y: cy, dir: 'ver' }); 
            }
            for(let i = 0; i < 3; i++) {
                animals.push({
                    type: animalType,
                    x: pen.x + 40 + Math.random() * (pen.w - 80),
                    y: pen.y + 40 + Math.random() * (pen.h - 80),
                    state: 'idle', timer: 0, dirX: 1, frame: 0, frameTimer: 0,
                    bounds: { minX: pen.x + 20, maxX: pen.x + pen.w - 20, minY: pen.y + 20, maxY: pen.y + pen.h - 20 }
                });
            }
        };

        createFarm(cowPen, 'cow');
        createFarm(sheepPen, 'sheep');

        const houseDecorTypes = [{ name: 'white_flower', srcX: 16, srcY: 32 }, { name: 'stump', srcX: 32, srcY: 48 }, { name: 'small_rock', srcX: 96, srcY: 48 }];
        
        houses.forEach(h => {
            for (let i = 0; i < 30; i++) { 
                 let tx = h.x - 100 + Math.random() * 360; 
                 let ty = h.y - 100 + Math.random() * 360;
                 if (tx > h.x - 30 && tx < h.x + 190 && ty > h.y - 30 && ty < h.y + 190) continue;
                 if (ty > pathY - 70 && ty < pathY + 70) continue;
                 if (tx > vPond.x - 40 && tx < vPond.x + vPond.w + 20 && ty > vPond.y - 40 && ty < vPond.y + vPond.h + 20) continue;
                 if (tx > cowPen.x - 20 && tx < cowPen.x + cowPen.w + 20 && ty > cowPen.y - 20 && ty < cowPen.y + cowPen.h + 20) continue;
                 if (tx > sheepPen.x - 20 && tx < sheepPen.x + sheepPen.w && ty > sheepPen.y - 20 && ty < sheepPen.y + sheepPen.h + 20) continue;

                 let onPath = false;
                 for (let p of extraPaths) { if (tx > p.x - 55 && tx < p.x + 48 + 55 && ty > p.startY - 55 && ty < p.endY + 55) { onPath = true; break; } }
                 if (onPath) continue; 
                 gameObjects.push({ type: 'tree', x: tx, y: ty, size: Math.random() * 30 + 40 });
            }
            
            for (let i = 0; i < 10; i++) {
                 let dx = h.x - 60 + Math.random() * 280; let dy = h.y - 60 + Math.random() * 280;
                 if (dx > h.x && dx < h.x + 160 && dy > h.y && dy < h.y + 160) continue; 
                 if (dy > pathY - 50 && dy < pathY + 50) continue; 
                 if (dx > vPond.x && dx < vPond.x + vPond.w && dy > vPond.y && dy < vPond.y + vPond.h) continue; 
                 if (dx > cowPen.x && dx < cowPen.x + cowPen.w && dy > cowPen.y && dy < cowPen.y + cowPen.h) continue;
                 if (dx > sheepPen.x && dx < sheepPen.x + sheepPen.w && dy > sheepPen.y && dy < sheepPen.y + sheepPen.h) continue;
                 
                 let onPath = false;
                 for (let p of extraPaths) { if (dx > p.x - 20 && dx < p.x + 48 + 20 && dy > p.startY - 20 && dy < p.endY + 20) onPath = true; }
                 if (onPath) continue;
                 const type = houseDecorTypes[Math.floor(Math.random() * houseDecorTypes.length)];
                 gameObjects.push({ type: 'decoration', x: dx, y: dy, srcX: type.srcX, srcY: type.srcY });
            }
        });

        const pondDecorTypes = [ { name: 'small_rock', srcX: 96, srcY: 48 } ];
        for (let i = 0; i < 20; i++) {
            let dx = vPond.x - 40 + Math.random() * (vPond.w + 80);
            let dy = vPond.y - 30 + Math.random() * (vPond.h + 60);
            if (dy > pathY - 50) continue;
            if (dx > vPond.x + 10 && dx < vPond.x + vPond.w - 10 && dy > vPond.y + 10 && dy < vPond.y + vPond.h - 10) continue;
            const type = pondDecorTypes[Math.floor(Math.random() * pondDecorTypes.length)];
            gameObjects.push({ type: 'decoration', x: dx, y: dy, srcX: type.srcX, srcY: type.srcY });
        }
        for(let i = 0; i < 8; i++) {
            let dx = vPond.x + 20 + Math.random() * (vPond.w - 40);
            let dy = vPond.y + 20 + Math.random() * (vPond.h - 40);
            gameObjects.push({ type: 'decoration', x: dx, y: dy, srcX: 112, srcY: 64 }); 
        }

        const fenceY_Top = pathY - 80; const fenceY_Bot = pathY + 40;
        for (let x = 0; x < canvas.width; x += 48) {
            let isGap = false; for (let p of extraPaths) { if (x >= p.x - 48 && x <= p.x + 96) isGap = true; }
            if (!isGap) { 
                gameObjects.push({ type: 'fence', x: x, y: fenceY_Top, dir: 'hor' }); 
                gameObjects.push({ type: 'fence', x: x, y: fenceY_Bot, dir: 'hor' }); 
            }
        }

        gameObjects.push({ type: 'npc', subtype: 'mayor', x: 360, y: pathY - 50, size: 30, radius: 15, name: "Mayor", dialogue: ["Oh you're the new hero?", "I remember there was also this other hero.", "I think his name is wotang?"], color: '#e67e22', sprite: npc19Image });
        for (let i = 0; i < 5; i++) {
            let cx = Math.random() * (canvas.width - 100); let cy = Math.random() * (canvas.height - 100);
            if (cx > 200 && cx < 500 && cy > 0 && cy < 250) continue;
            animals.push({ type: 'chicken', x: cx, y: cy, state: 'idle', timer: 0, dirX: 1, frame: 0, frameTimer: 0 });
        }

        // --- NEW: VILLAGE NPCs ---
        // 1. SHOPKEEPER (In front of Top-Left House)
        gameObjects.push({
            type: 'npc',
            subtype: 'shop_keeper',
            name: "Merchant",
            x: 170, // In front of the house at x:90
            y: 220, // <--- FIXED: Moved down to avoid overlapping the house
            radius: 15,
            color: '#9b59b6', // Purple
            dialogue: ["Welcome to the General Store!", "Press 'E' or SPACE to trade."],
            sprite: npc6Image 
        });

        // 2. MAYOR (Center of town - Overwriting your existing Mayor line if you want, or just ensure this one is used)
        // (Your code already had a Mayor, but this adds the subtype logic if needed later)
        
        // 3. LAKE VILLAGER (By the pond at 480, 60)
        gameObjects.push({
            type: 'npc',
            subtype: 'villager',
            name: "Villager",
            x: 420, 
            y: 120, 
            radius: 15,
            color: '#3498db', // Blue
            dialogue: ["The water is so peaceful...", "But no lele fish."],
            sprite: npc3Image 
        });

        // 4. LUMBERJACK (Near the trees) <--- NEW
        gameObjects.push({
            type: 'npc',
            subtype: 'villager',
            name: "Farmer",
            x: 750, 
            y: 600, 
            radius: 15,
            color: '#e74c3c', // Red
            dialogue: [
                "Wanna her me sing?",
                "Okay, here it is!",
                "♪  ♪",
                "Be careful in the forest!"
            ],
            sprite: npc5Image 
        });

        const savePacket = { objects: gameObjects, animals: animals, paths: extraPaths };
        localStorage.setItem('my_rpg_village_save', JSON.stringify(savePacket));
    }
    
    // --- ZONE 0: THE FOREST (UNCHANGED) ---
    else if (zone === 0) {
        showNotification("Entered: The Wild Forest 🌲");

        gameObjects.push({
            type: 'npc',
            subtype: 'quest_giver', 
            name: "Old Man",
            x: 200, 
            y: 300, 
            radius: 15,
            color: '#f1c40f', // Yellow
            dialogue: [`Hello ${player.name}, I have a special quest for you!`, 'There is this letter i lost', 'The monster took it, can you get it back for me?', 'Here is a sword to help you on your journey!'],
            interacted: false,
            hasQuest: true, 
            sprite: npc20Image
        });

        const pond = { x: 250, y: 50, w: 192, h: 144 }; 
        gameObjects.push({ type: 'cliff', x: 0, y: 0, w: 192, h: 240 });
        gameObjects.push({ type: 'cliff', x: canvas.width - 360, y: canvas.height - 240, w: 360, h: 240 });
        gameObjects.push({ type: 'pond', x: pond.x, y: pond.y, w: pond.w, h: pond.h });
        gameObjects.push({ type: 'campfire', x: 580, y: pathY - 40 });

        const landDecorTypes = [{ name: 'white_flower', srcX: 16, srcY: 32 }, { name: 'purple_flower', srcX: 32, srcY: 32 }, { name: 'red_mushroom', srcX: 112, srcY: 32 }, { name: 'brown_mushroom', srcX: 128, srcY: 32 }, { name: 'stump', srcX: 32, srcY: 48 }, { name: 'small_rock', srcX: 96, srcY: 48 }];
        const pondDecorTypes = [{ name: 'lily_pad', srcX: 112, srcY: 64 }, { name: 'water_rock', srcX: 96, srcY: 64 }];

        for (let i = 0; i < 40; i++) {
            let dx = Math.random() * (canvas.width - 50); let dy = Math.random() * (canvas.height - 50);
            if (dy > pathY - 60 && dy < pathY + 60) continue;
            if (dx > pond.x - 20 && dx < pond.x + pond.w + 10 && dy > pond.y - 20 && dy < pond.y + pond.h + 10) continue;
            const type = landDecorTypes[Math.floor(Math.random() * landDecorTypes.length)];
            gameObjects.push({ type: 'decoration', x: dx, y: dy, srcX: type.srcX, srcY: type.srcY });
        }
        for (let i = 0; i < 6; i++) {
            let dx = pond.x + 20 + Math.random() * (pond.w - 60); let dy = pond.y + 20 + Math.random() * (pond.h - 60);
            const type = pondDecorTypes[Math.floor(Math.random() * pondDecorTypes.length)];
            gameObjects.push({ type: 'decoration', x: dx, y: dy, srcX: type.srcX, srcY: type.srcY });
        }
        for (let i = 0; i < 15; i++) {
            let tx = Math.random() * canvas.width; let ty = Math.random() * canvas.height;
            if (ty > pathY - 80 && ty < pathY + 80) continue; 
            if (tx > 500 && tx < 650 && ty < pathY) continue; 
            if (tx > 250 - 40 && tx < 250 + 192 + 20 && ty > 50 - 40 && ty < 50 + 144 + 20) continue;
            gameObjects.push({ type: 'tree', x: tx, y: ty, size: Math.random() * 30 + 40 });
        }
        for (let i = 0; i < 5; i++) {
            let cx = Math.random() * (canvas.width - 100); let cy = Math.random() * (canvas.height - 100);
            if (cx > 200 && cx < 500 && cy > 0 && cy < 250) continue;
            animals.push({ x: cx, y: cy, state: 'idle', timer: 0, dirX: 1, frame: 0, frameTimer: 0 });
        }
    }
    
    // --- ZONE 1: THE GAUNTLET (RUINS + BUSHES) ---
    else if (zone === 1) {
        showNotification(`Entered: Dungeon Level ${dungeonLevel}/7 🛡️`);

        // 1. BASE: Full Grass with Texture Variations
        for(let x = 0; x < canvas.width; x += 48) {
            for(let y = 0; y < canvas.height; y += 48) {
                gameObjects.push({ type: 'tx_grass', x: x, y: y });
                // Add small grass texture bits
                if (Math.random() > 0.75) {
                     let variant = Math.floor(Math.random() * 3);
                     gameObjects.push({ type: 'tx_grass_decor', x: x + Math.random()*20, y: y + Math.random()*20, variant: variant });
                }
            }
        }

        // 2. PATH: Crumbled Stone Road
        for(let x = 0; x < canvas.width; x += 48) {
            for(let y = 150; y < canvas.height - 150; y += 48) {
                if (Math.random() > 0.3) {
                    let variant = (Math.random() > 0.9) ? 2 : 0; 
                    gameObjects.push({ type: 'stone_floor', x: x, y: y, variant: variant });
                    if (Math.random() > 0.8) gameObjects.push({ type: 'prop_rubble', x: x + 10, y: y + 10 });
                }
            }
        }

        // 3. WALLS
        for(let x = 0; x < canvas.width; x += 48) {
            gameObjects.push({ type: 'stone_wall', x: x, y: 100 - 48 });
            if ((x / 48) % 4 === 0) gameObjects.push({ type: 'stone_wall', x: x, y: 100 - 24 });
            gameObjects.push({ type: 'stone_wall', x: x, y: canvas.height - 100 });
        }

        // 4. DECOR: Rocks, Pots, Rubble
        for(let i = 0; i < 12; i++) {
            let rx = 200 + Math.random() * (canvas.width - 400); 
            let ry = 150 + Math.random() * (canvas.height - 300);
            rx = Math.floor(rx / 48) * 48; ry = Math.floor(ry / 48) * 48;
            let rand = Math.random();
            let type = (rand > 0.7) ? 'prop_pot' : (rand > 0.4 ? 'prop_rubble' : 'prop_rock');
            gameObjects.push({ type: type, x: rx, y: ry });
        }

        // 5. OVERGROWTH: Scatter Bushes
        for(let i = 0; i < 40; i++) { // Add plenty of bushes
            let bx = Math.random() * (canvas.width - 50);
            let by = Math.random() * (canvas.height - 50);
            // Don't spawn heavily on the center path
            if (by > 150 && by < canvas.height - 150 && Math.random() > 0.2) continue;
            
            let variant = Math.floor(Math.random() * 3); // Choose between 3 bush types
            gameObjects.push({ type: 'plant_bush', x: bx, y: by, variant: variant });
        }

        gameObjects.push({ type: 'stairs', x: canvas.width - 100, y: (canvas.height/2) - 24 });

        // --- NEW: PROGRESSIVE SLIMES ---
        // Slimes get more numerous and tankier based on dungeonLevel
        const numSlimes = 4 + (dungeonLevel * 2); 
        const slimeHp = 2 + (dungeonLevel * 2);   

        for(let i = 0; i < numSlimes; i++) {
            let mx = 300 + Math.random() * 800; let my = 150 + Math.random() * (canvas.height - 300);
            gameObjects.push({ 
                type: 'monster', x: mx, y: my, size: 40, radius: 20, color: '#e74c3c', 
                hp: slimeHp, maxHp: slimeHp, isHit: false 
            });
        }
    }

    // --- ZONE 3: THE BOSS ARENA (RUINS + BUSHES) ---
    else if (zone === 3) {
        showNotification("WARNING: BOSS ZONE ⚔️");

        // 1. BASE: Full Grass with Texture
        for(let x = 0; x < canvas.width; x += 48) {
            for(let y = 0; y < canvas.height; y += 48) {
                gameObjects.push({ type: 'tx_grass', x: x, y: y });
                 if (Math.random() > 0.75) {
                     let variant = Math.floor(Math.random() * 3);
                     gameObjects.push({ type: 'tx_grass_decor', x: x + Math.random()*20, y: y + Math.random()*20, variant: variant });
                }
            }
        }

        // 2. RUINS: Stone Patch
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        for(let x = cx - 300; x < cx + 300; x += 48) {
            for(let y = cy - 200; y < cy + 200; y += 48) {
                gameObjects.push({ type: 'stone_floor', x: x, y: y, variant: 0 });
                if (Math.random() > 0.9) gameObjects.push({ type: 'prop_rubble', x: x+5, y: y+5 });
            }
        }

        // --- NEW: DRAW STONE PATH TO THE LEFT EXIT ---
        for (let px = 0; px < cx - 300; px += 48) {
            gameObjects.push({ type: 'stone_floor', x: px, y: pathY - 24, variant: 0 });
            gameObjects.push({ type: 'stone_floor', x: px, y: pathY + 24, variant: 0 });
        }

        // --- FIXED: WALLS WITH A GAP ON THE LEFT ---
        for(let x = 0; x < canvas.width; x += 48) { 
            gameObjects.push({ type: 'stone_wall', x: x, y: 0 }); 
            gameObjects.push({ type: 'stone_wall', x: x, y: canvas.height - 48 }); 
        }
        for(let y = 0; y < canvas.height; y += 48) { 
            // Left wall: Leave a gap for the path
            if (y < pathY - 60 || y > pathY + 60) {
                gameObjects.push({ type: 'stone_wall', x: 0, y: y }); 
            }
            // Right wall is totally solid
            gameObjects.push({ type: 'stone_wall', x: canvas.width - 48, y: y }); 
        }

        for(let i = -2; i <= 2; i++) {
            if (i === 0) continue; 
            gameObjects.push({ type: 'pillar', x: cx - 200, y: cy + (i * 100) });
            gameObjects.push({ type: 'pillar', x: cx + 200, y: cy + (i * 100) });
            if(Math.random() > 0.5) gameObjects.push({ type: 'broken_pillar', x: cx - 250, y: cy + (i * 100) + 20 });
             if(Math.random() > 0.5) gameObjects.push({ type: 'broken_pillar', x: cx + 250, y: cy + (i * 100) + 20 });
        }

        // 4. Decor & OVERGROWTH (Bushes)
        gameObjects.push({ type: 'prop_rock', x: 100, y: 100 });
        gameObjects.push({ type: 'prop_pot', x: 140, y: 120 });
        gameObjects.push({ type: 'prop_rubble', x: 180, y: 100 });
        gameObjects.push({ type: 'prop_rock', x: canvas.width - 100, y: 100 });
        gameObjects.push({ type: 'prop_pot', x: canvas.width - 140, y: 120 });

        // Scatter bushes around the edges of the stone floor
        for(let i = 0; i < 25; i++) {
             let bx = Math.random() * canvas.width;
             let by = Math.random() * canvas.height;
             // Keep them mostly outside the central stone area
             if (bx > cx - 280 && bx < cx + 280 && by > cy - 180 && by < cy + 180) continue;
             let variant = Math.floor(Math.random() * 3);
             gameObjects.push({ type: 'plant_bush', x: bx, y: by, variant: variant });
        }


        // 5. BOSS
        if (!gameState.bossDefeated) {
            gameObjects.push({ 
                type: 'boss', name: 'Skeleton King', 
                x: cx, y: cy, radius: 40, hp: 300, maxHp: 300 
            });
        }
    }

    // --- SAVE TO CACHE USING UNIQUE MAP KEY ---
    worldData[mapKey] = { objects: [...gameObjects], animals: [...animals], paths: [...extraPaths] };
}

// --- 2. INPUT ---
const keys = { w: false, a: false, s: false, d: false, " ": false };

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;

    // --- DEBUG / CHEAT SYSTEM (REMOVE LATER) ---
    // Press 'B' to instantly teleport to the Boss Arena
    /*if (e.key === 'b' || e.key === 'B') {
        player.hasWeapon = true;
        player.hasSword = true;
        player.hasBossKey = true;
        player.hp = 500;       
        player.maxHp = 500;
        player.damage = 100;    
        player.potions = 5;
        dungeonLevel = 7;      
        generateWorld(3);      
        player.x = 100;
        player.y = canvas.height / 2;
        showNotification("DEBUG: Teleported to Boss! 🤖");
        return;
    }
    */
   
    // --- NEW: Press 'N' to teleport back to the Forest ---
    if (e.key === 'n' || e.key === 'N') {
        generateWorld(0);      
        player.x = canvas.width / 2;
        player.y = canvas.height / 2;
        showNotification("DEBUG: Teleported to Forest! 🌲");
        return;
    }
    // -------------------------------------------

    if (isShopOpen && (e.code === 'KeyE' || e.key === 'e' || e.key === 'Escape')) {
        isShopOpen = false;
        return; 
    }

    if (isShopOpen) {
        if (e.key === '1') {
            if (player.potions >= player.maxPotions) {
                showNotification("Potion bag is FULL! (Max 5)");
            } else if (player.gold >= 20) {
                player.gold -= 20; 
                player.potions++;
                showNotification(`Bought Potion! 🧪 (${player.potions}/${player.maxPotions})`);
            } else {
                showNotification("Not enough Gold!");
            }
        }
        else if (e.key === '2') {
            if (player.gold >= player.hpUpgradeCost) {
                player.gold -= player.hpUpgradeCost;
                player.maxHp += 20; player.hp += 20; 
                player.hpUpgradeCost = Math.floor(player.hpUpgradeCost * 1.5); 
                showNotification("Max HP Upgraded! ❤️");
            } else showNotification("Not enough Gold!");
        }
        else if (e.key === '3') {
            if (player.gold >= player.dmgUpgradeCost) {
                player.gold -= player.dmgUpgradeCost;
                player.damage += 2;
                player.dmgUpgradeCost = Math.floor(player.dmgUpgradeCost * 1.5); 
                showNotification("Weapon Upgraded! ⚔️");
            } else showNotification("Not enough Gold!");
        }
        return;
    }

    if (e.code === 'Space' || e.key === " " || e.code === 'Enter') {
        if (e.code === 'Space' || e.key === " ") e.preventDefault();

        if (isDialogueOpen) {
            // --- NEW: Play NPC sound without clashing ---
            if (typeof sfx !== 'undefined' && sfx.npcTalk) {
                sfx.npcTalk.pause();
                sfx.npcTalk.currentTime = 0;
                sfx.npcTalk.play().catch(err => console.log(err));
            }
            // --------------------------------------------
            advanceDialogue();
        } else {
            const talked = checkInteraction();
            if (!talked && isPlaying) {
                if (player.hasSword) { 
                    if (e.code === 'Space' || e.key === " ") {
                        performAttack();
                    }
                }
            }
        }
    }

    if (e.key === 'q' || e.key === 'Q') {
        if (player.potions > 0 && player.hp < player.maxHp) {
            player.potions--;
            player.hp = Math.min(player.hp + 50, player.maxHp);
            showNotification(`Used Potion! HP Restored. (${player.potions}/${player.maxPotions} left)`);
        } else if (player.potions === 0) {
            showNotification("No potions left!");
        } else if (player.hp >= player.maxHp) {
            showNotification("HP is already full!");
        }
    }
});

window.addEventListener('keyup', (e) => { 
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false; 
});

// --- 3. COMBAT & LOGIC ---
function checkInteraction() {
    if (isShopOpen) {
        isShopOpen = false;
        return true; 
    }

    const nearbyNPC = getNearbyNPC();
    if (nearbyNPC) {
        if (nearbyNPC.subtype === 'shop_keeper') {
            isShopOpen = true; 
            shopNPC = nearbyNPC;
            return true;
        } else {
            // This now handles BOTH normal NPCs and the Quest Giver
            startDialogue(nearbyNPC);
            return true; 
        }
    }
    return false;
}

function startDialogue(npc) {
    isDialogueOpen = true;
    currentTalkingNPC = npc;
    dialogueIndex = 0; 
    
    const box = document.getElementById('dialogueBox');
    const textEl = document.querySelector('#dialogueBox p'); 
    const titleEl = document.querySelector('#dialogueBox h3'); 
    const nextBtn = document.getElementById('nextBtn'); 

    box.classList.remove('hidden'); 
    
    if (titleEl) titleEl.innerText = npc.name;
    
    let dialogArray = Array.isArray(npc.dialogue) ? npc.dialogue : [npc.dialogue];
    let textToShow = dialogArray[0];

    if (npc.hasQuest && dialogArray.length === 1) {
        textToShow += " [Quest Accepted: Defeat 3 Slimes!]";
        npc.hasQuest = false; 
    }

    // --- AUDIO LOGIC ---
    if (textToShow.includes("♪")) {
        // Stop normal NPC sound and Background Music
        if (typeof sfx !== 'undefined' && sfx.npcTalk) sfx.npcTalk.pause();
        if (typeof currentBGM !== 'undefined' && currentBGM) currentBGM.pause();
        
        // Play singing
        if (typeof sfx !== 'undefined' && sfx.farmerSing) {
            sfx.farmerSing.currentTime = 0;
            sfx.farmerSing.play().catch(e => {});
        }
    } else {
        // Stop singing if it was playing, resume BGM
        if (typeof sfx !== 'undefined' && sfx.farmerSing && !sfx.farmerSing.paused) {
            sfx.farmerSing.pause();
            sfx.farmerSing.currentTime = 0;
            if (typeof currentBGM !== 'undefined' && currentBGM && typeof isPlaying !== 'undefined' && isPlaying) {
                currentBGM.play().catch(e => {});
            }
        }
        // Play normal NPC sound
        if (typeof sfx !== 'undefined' && sfx.npcTalk) {
            sfx.npcTalk.pause();
            sfx.npcTalk.currentTime = 0;
            sfx.npcTalk.play().catch(e => {});
        }
    }
    // -------------------

    if (textEl) textEl.innerText = textToShow;

    if (nextBtn) {
        if (dialogArray.length > 1) nextBtn.style.display = 'inline-block';
        else nextBtn.style.display = 'none';
    }
}

window.advanceDialogue = function() {
    if (!isDialogueOpen || !currentTalkingNPC) return;

    let dialogArray = Array.isArray(currentTalkingNPC.dialogue) ? currentTalkingNPC.dialogue : [currentTalkingNPC.dialogue];
    
    // Check if there are more pages left
    if (dialogueIndex < dialogArray.length - 1) {
        dialogueIndex++;
        const textEl = document.querySelector('#dialogueBox p');
        const nextBtn = document.getElementById('nextBtn');
        
        let textToShow = dialogArray[dialogueIndex];

        // Append quest text if it's the very last page
        if (currentTalkingNPC.hasQuest && dialogueIndex === dialogArray.length - 1) {
            textToShow += " [Quest Accepted: Get the letter from the boss!]";
            currentTalkingNPC.hasQuest = false;
        }

        // --- AUDIO LOGIC ---
        if (textToShow.includes("♪")) {
            if (typeof sfx !== 'undefined' && sfx.npcTalk) sfx.npcTalk.pause();
            if (typeof currentBGM !== 'undefined' && currentBGM) currentBGM.pause();
            
            if (typeof sfx !== 'undefined' && sfx.farmerSing) {
                sfx.farmerSing.currentTime = 0;
                sfx.farmerSing.play().catch(e => {});
            }
        } else {
            if (typeof sfx !== 'undefined' && sfx.farmerSing && !sfx.farmerSing.paused) {
                sfx.farmerSing.pause();
                sfx.farmerSing.currentTime = 0;
                if (typeof currentBGM !== 'undefined' && currentBGM && typeof isPlaying !== 'undefined' && isPlaying) {
                    currentBGM.play().catch(e => {});
                }
            }
            if (typeof sfx !== 'undefined' && sfx.npcTalk) {
                sfx.npcTalk.pause();
                sfx.npcTalk.currentTime = 0;
                sfx.npcTalk.play().catch(e => {});
            }
        }
        // -------------------

        if (textEl) textEl.innerText = textToShow;

        // Hide the next button if we just hit the last page
        if (nextBtn && dialogueIndex === dialogArray.length - 1) {
            nextBtn.style.display = 'none';
        }
    } else {
        // If no more pages, close the box entirely
        closeDialogue();
    }
}

function performAttack() {
    const now = Date.now();
    if (now - player.lastAttackTime < 1000) return; 

    if (player.isAttacking) return; 
    player.isAttacking = true;
    player.lastAttackTime = now;

    playSFX(sfx.sword);
    
    setTimeout(() => { player.isAttacking = false; }, 200);

    gameObjects.forEach(obj => {
        if (obj.type === 'monster' || obj.type === 'boss') {
            const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
            if (dist < 60 + obj.radius && obj.hp > 0) {

                playSFX(sfx.monsterHit);
                
                obj.hp -= player.damage; 
                obj.isHit = true; 
                setTimeout(() => { obj.isHit = false; }, 300);
                
                const push = (obj.type === 'boss') ? 5 : 20; 
                const angle = Math.atan2(obj.y - player.y, obj.x - player.x);
                obj.x += Math.cos(angle) * push;
                obj.y += Math.sin(angle) * push;

                if (obj.hp <= 0) {
                    if (obj.type === 'boss') {
                        gameState.bossDefeated = true; 
                        showNotification("🏆 BOSS DEFEATED! 🏆");
                        gameObjects.push({ type: 'item_letter', x: obj.x, y: obj.y });
                        
                        playMusicForZone(3);
                    } else {
                        const baseGold = Math.floor(Math.random() * 6) + 5;
                        const goldEarned = baseGold + (dungeonLevel * 3); 
                        player.gold += goldEarned;
                        showNotification(`+${goldEarned} Gold! 🪙`);
                    }
                }
            }
        }
    });
    gameObjects = gameObjects.filter(obj => (obj.type !== 'monster' && obj.type !== 'boss') || obj.hp > 0);
}

function showNotification(text) {
    const notif = document.getElementById('notification');
    notif.innerText = text;
    notif.classList.remove('hidden');
    setTimeout(() => { notif.classList.add('hidden'); }, 3000);
}

window.showCharacterSelect = function() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('character-screen').classList.remove('hidden');
}

window.startGameWithName = function() {
    const input = document.getElementById('playerNameInput');
    const name = input.value.trim(); // Get text and remove extra spaces

    if (name.length > 0) {
        player.name = name; // Save the name to the player object
        document.getElementById('character-screen').classList.add('hidden'); // Hide menu
        isPlaying = true; // Start game loop
        playMusicForZone(0); 
        generateWorld(0); // Generate the forest
    } else {
        alert("Please enter a name to start!");
    }
}

const dialogueBox = document.getElementById('dialogueBox');
const npcName = document.getElementById('npcName');
const npcText = document.getElementById('npcText');
const hintBox = document.getElementById('interaction-hint');


// --- 5. UPDATED PHYSICS (FIXED FENCES & TREES) ---

function checkCollision(newX, newY) {
    for (let obj of gameObjects) {

        // --- HOUSE COLLISION (FINAL FIX) ---
        if (obj.type === 'house') {
            const xOffset = 16; 
            

            if (newX > obj.x + 10 + xOffset && newX < obj.x + obj.w - 10 + xOffset &&
                newY > obj.y + 80 && newY < obj.y + obj.h) {
                return true;
            }
        }

        // Fence Collision
        if (obj.type === 'fence') {
            if (newX > obj.x - 2 && newX < obj.x + 52 &&
                newY > obj.y + 10 && newY < obj.y + 40) { 
                return true;
            }
        }

        // Tree Collision
        if (obj.type === 'tree') {
            const dist = Math.hypot(newX - obj.x, newY - obj.y);
            if (dist < player.radius + 15) return true;
        }

        if (obj.type === 'flower' || obj.type === 'npc' || obj.type === 'monster' || obj.type === 'boss') continue; 
        
        // Cliff Collision
        if (obj.type === 'cliff') {
            if (newX > obj.x && newX < obj.x + obj.w &&
                newY > obj.y + 20 && newY < obj.y + obj.h) {
                return true;
            }
        }
        
        // Pond Collision
        else if (obj.type === 'pond') {
             if (newX > obj.x - 10 && newX < obj.x + obj.w + 10 &&
                newY > obj.y - 10 && newY < obj.y + obj.h + 10) {
                return true;
            }
        } 
        
        // Campfire Collision
        else if (obj.type === 'campfire') {
            const dist = Math.hypot(newX - (obj.x + 15), newY - (obj.y + 15));
            if (dist < player.radius + 20) return true;
        }

        if (obj.type === 'stone_wall') {
            if (newX > obj.x && newX < obj.x + 48 && newY > obj.y && newY < obj.y + 48) return true;
        }
    }
    return false;
}

function update() {
    // Check if game is paused by dialogue/letter, BUT keep fireworks moving in background!
    if (!isPlaying || isDialogueOpen || isLetterUIOpen) {
        updateFireworks(); 
        return;
    }

    let nextX = player.x; 
    let nextY = player.y;
    player.moving = false;

    if (keys['w']) { nextY -= player.speed; player.frameY = 1; player.moving = true; }
    else if (keys['s']) { nextY += player.speed; player.frameY = 0; player.moving = true; }
    else if (keys['a']) { nextX -= player.speed; player.frameY = 2; player.moving = true; }
    else if (keys['d']) { nextX += player.speed; player.frameY = 3; player.moving = true; }

    if (!checkCollision(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }

    if (player.moving) {
        player.walkSfxTimer++;
        if (player.walkSfxTimer >= 15) { // Plays step sound every 15 frames
            playSFX(sfx.walk);
            player.walkSfxTimer = 0;
        }
    } else {
        player.walkSfxTimer = 0; // Reset timer when stopped
    }

    const onPath = (player.y > pathY - 45 && player.y < pathY + 45);

    // --- PICK UP ITEMS (THE LETTER) ---
    gameObjects = gameObjects.filter(obj => {
        if (obj.type === 'item_letter') {
            if (Math.hypot(player.x - obj.x, player.y - obj.y) < 40) {
                player.hasLetter = true;
                showNotification("Picked up: Mysterious Letter ✉️ (Take to Old Man)");
                return false; 
            }
        }
        return true;
    });

    // --- ZONE SWITCHING ---
    if (player.x > canvas.width) {
        if (onPath) {
            const mapKey = currentZone === 1 ? `1_${dungeonLevel}` : currentZone;
            worldData[mapKey] = { objects: [...gameObjects], animals: [...animals], paths: [...extraPaths] };

            if (currentZone === 2) { generateWorld(0); player.x = 50; }      
            else if (currentZone === 0) { generateWorld(1); player.x = 50; } 
            else if (currentZone === 1) { 
                const hasMonsters = gameObjects.some(obj => obj.type === 'monster' && obj.hp > 0);
                if (hasMonsters) {
                    player.x = canvas.width - 20; 
                    showNotification("Defeat all monsters to proceed! ⚔️");
                    return; 
                }

                if (dungeonLevel < 7) {
                    dungeonLevel++;
                    generateWorld(1); 
                    player.x = 50;
                } else {
                    if (!player.hasBossKey) {
                        player.hasBossKey = true;
                        showNotification("Got Boss Key! 🗝️ Entering Boss Room!");
                    }
                    generateWorld(3); 
                    player.x = 50; 
                }
            } 
            else { player.x = canvas.width - 20; }
        } else { player.x = canvas.width - 20; }
    }
    else if (player.x < 0) {
        if (onPath) {
            const mapKey = currentZone === 1 ? `1_${dungeonLevel}` : currentZone;
            worldData[mapKey] = { objects: [...gameObjects], animals: [...animals], paths: [...extraPaths] };

            if (currentZone === 3) { 
                dungeonLevel = 7; 
                generateWorld(1); 
                player.x = canvas.width - 50; 
            } 
            else if (currentZone === 1) { 
                if (dungeonLevel > 1) {
                    dungeonLevel--;
                    generateWorld(1);
                    player.x = canvas.width - 50;
                } else {
                    generateWorld(0); 
                    player.x = canvas.width - 50; 
                }
            } 
            else if (currentZone === 0) { generateWorld(2); player.x = canvas.width - 50; } 
            else { player.x = 20; }
        } else { player.x = 20; }
    }

    // Update fireworks during normal gameplay
    updateFireworks();
}

// --- 6. DRAWING (YOUR EXACT CODE) ---

const SRC_X = 16;  
const SRC_Y = 82;  

function draw() {
    ctx.imageSmoothingEnabled = false;
    
    updateAnimals();   
    updateMonsters();  

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentZone === 1 || currentZone === 3) { 
        ctx.fillStyle = '#141414'; 
        ctx.fillRect(0, 0, canvas.width, canvas.height); 
    } 
    else { 
        const TILE_SIZE = 48; 
        if (tilesetImage.complete && tilesetImage.naturalWidth !== 0) {
            for (let x = 0; x < canvas.width; x += TILE_SIZE) {
                for (let y = 0; y < canvas.height; y += TILE_SIZE) {
                    ctx.drawImage(tilesetImage, SRC_X, SRC_Y, 16, 16, x, y, TILE_SIZE, TILE_SIZE);
                }
            }
        } else {
            ctx.fillStyle = '#2e7d32'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        if (dirtImage.complete && dirtImage.naturalWidth !== 0) {
            const startY = pathY - 48; 
            for (let x = 0; x < canvas.width; x += TILE_SIZE) {
                for (let row = 0; row < 2; row++) {
                    ctx.drawImage(dirtImage, 16, 16, 16, 16, x, startY + (row * TILE_SIZE), TILE_SIZE, TILE_SIZE);
                }
            }
            if (currentZone === 2) {
                for (const p of extraPaths) {
                    for (let py = p.startY; py < p.endY; py += TILE_SIZE) {
                        ctx.drawImage(dirtImage, 16, 16, 16, 16, p.x, py, TILE_SIZE, TILE_SIZE);
                        ctx.drawImage(dirtImage, 16, 16, 16, 16, p.x + TILE_SIZE, py, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        } else {
            ctx.fillStyle = '#5d4037'; ctx.fillRect(0, pathY - 40, canvas.width, 80); 
        }
    }

    let renderList = [...gameObjects, ...animals, player]; 
    
    renderList.sort((a, b) => {
        const floorTypes = ['tx_grass', 'stone_floor', 'dungeon_grass', 'cliff', 'pond', 'water', 'tx_grass_decor', 'prop_rubble', 'stone_path', 'decoration'];
        const isFloorA = floorTypes.includes(a.type);
        const isFloorB = floorTypes.includes(b.type);
        if (isFloorA && !isFloorB) return -1;
        if (!isFloorA && isFloorB) return 1;
        const aY = (a.type === 'house') ? (a.y + a.h) : a.y;
        const bY = (b.type === 'house') ? (b.y + b.h) : b.y;
        return aY - bY;
    });

    renderList.forEach(obj => {
        if (obj.state) drawAnimal(obj); 
        else if (obj.type === 'plant_bush') drawPlantBush(obj);
        else if (obj.type === 'tx_grass') drawTXGrass(obj);
        else if (obj.type === 'tx_grass_decor') drawTXGrassDecor(obj);
        else if (obj.type === 'broken_pillar') drawBrokenPillar(obj);
        else if (obj.type === 'prop_rubble') drawRubble(obj);
        else if (obj.type === 'dungeon_grass') drawDungeonGrass(obj);
        else if (obj.type === 'pillar') drawPillar(obj);
        else if (obj.type === 'item_letter') {
            const bounce = Math.sin(Date.now() / 150) * 3;
            // Draw Envelope
            ctx.fillStyle = '#f1c40f'; ctx.fillRect(obj.x - 12, obj.y - 8 + bounce, 24, 16);
            ctx.fillStyle = '#c0392b'; ctx.fillRect(obj.x - 10, obj.y - 6 + bounce, 20, 12);
            ctx.strokeStyle = '#922b21'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(obj.x - 10, obj.y - 6 + bounce); ctx.lineTo(obj.x, obj.y + bounce); ctx.lineTo(obj.x + 10, obj.y - 6 + bounce); ctx.stroke();
            // Floating text
            ctx.fillStyle = 'yellow'; ctx.font = 'bold 12px Arial'; ctx.textAlign='center'; ctx.fillText("Letter", obj.x, obj.y - 15 + bounce);
        }
        else if (obj.type === 'prop' || obj.type === 'prop_crate' || obj.type === 'prop_barrel') drawProp(obj);
        else if (obj.type === 'stone_floor') drawStoneFloor(obj);
        else if (obj.type === 'stone_wall') drawStoneWall(obj);
        else if (obj.type === 'stairs') drawStairs(obj);
        else if (obj.type === 'player') {
            if (player.invincibleTimer > 0 && Math.floor(Date.now() / 100) % 2 === 0) {} 
            else { drawPlayer(obj); }
        }
        else if (obj.type === 'decoration') drawDecoration(obj);
        else if (obj.type === 'npc') drawNPC(obj);
        else if (obj.type === 'monster' || obj.type === 'boss') drawMonster(obj);
        else if (obj.type === 'tree') drawTree(obj);
        else if (obj.type === 'rock') drawRock(obj);
        else if (obj.type === 'cliff') drawCliff(obj);
        else if (obj.type === 'pond') drawPond(obj);
        else if (obj.type === 'campfire') drawCampfire(obj);
        else if (obj.type === 'flower') drawFlower(obj);
        else if (obj.type === 'house') drawHouse(obj); 
        else if (obj.type === 'fence') drawFence(obj); 
        else if (obj.type.startsWith('prop_')) drawProp(obj);
    });
    drawFireworks();

    const targetNPC = getNearbyNPC();
    if (targetNPC && !isDialogueOpen && !isShopOpen) {
        drawInteractionPrompt(targetNPC);
    }

    if (typeof notificationTimer !== 'undefined' && notificationTimer > 0) {
        ctx.fillStyle = `rgba(0, 0, 0, ${notificationTimer / 100})`;
        ctx.fillRect(canvas.width / 2 - 150, 50, 300, 40);
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(currentNotification, canvas.width / 2, 75);
        notificationTimer--;
    }

    ctx.fillStyle = '#333';
    ctx.fillRect(20, 20, 204, 54); 
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(22, 22, 200, 20); 
    
    if (player.hp > 0) {
        ctx.fillStyle = '#2ecc71';
        const hpWidth = (player.hp / player.maxHp) * 200;
        ctx.fillRect(22, 22, hpWidth, 20);
    }

    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`HP: ${player.hp}/${player.maxHp}`, 30, 37);
    
    ctx.fillStyle = '#f1c40f'; 
    ctx.fillText(`Gold: ${player.gold}g`, 30, 65);
    
    ctx.fillStyle = '#ff7675';
    ctx.fillText(`Potions(Q): ${player.potions}/${player.maxPotions}`, 110, 65);

    if (isShopOpen) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 200);
        
        ctx.strokeStyle = '#f1c40f';
        ctx.lineWidth = 4;
        ctx.strokeRect(100, 100, canvas.width - 200, canvas.height - 200);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("VILLAGE UPGRADE STORE", canvas.width / 2, 150);

        ctx.fillStyle = 'yellow';
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`Your Gold: ${player.gold}g`, canvas.width / 2, 185);
        ctx.fillStyle = 'white';
        ctx.fillText(`Potions: ${player.potions}/${player.maxPotions}  |  Max HP: ${player.maxHp}  |  Damage: ${player.damage}`, canvas.width / 2, 215);

        ctx.textAlign = 'left';

        ctx.fillStyle = '#ff7675';
        ctx.font = 'bold 22px Arial';
        ctx.fillText("[1] ❤️ Health Potion (Restores 50 HP)", canvas.width / 2 - 250, 280);
        ctx.fillStyle = '#2ecc71';
        ctx.fillText("20g", canvas.width / 2 + 200, 280);

        ctx.fillStyle = '#74b9ff';
        ctx.fillText(`[2] 💖 Max HP Upgrade (+20 Max HP)`, canvas.width / 2 - 250, 340);
        ctx.fillStyle = '#2ecc71';
        ctx.fillText(`${player.hpUpgradeCost}g`, canvas.width / 2 + 200, 340);

        ctx.fillStyle = '#fdcb6e';
        ctx.fillText(`[3] ⚔️ Weapon Upgrade (+2 Damage)`, canvas.width / 2 - 250, 400);
        ctx.fillStyle = '#2ecc71';
        ctx.fillText(`${player.dmgUpgradeCost}g`, canvas.width / 2 + 200, 400);

        ctx.fillStyle = '#aaa';
        ctx.font = 'italic 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("Press Key [1], [2], or [3] to buy.   Press [E] to Close Shop.", canvas.width / 2, canvas.height - 140);
    }
}


function drawPond(obj) {
    ctx.fillStyle = '#3a86ff'; 
    ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    if (waterImage.complete && waterImage.naturalWidth !== 0) {
        const TILE_SIZE = 48;
        for (let x = 0; x < obj.w; x += TILE_SIZE) {
            for (let y = 0; y < obj.h; y += TILE_SIZE) {
                ctx.drawImage(waterImage, 0, 0, 16, 16, obj.x + x, obj.y + y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function drawCampfire(obj) {
    ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 6; ctx.beginPath();
    ctx.moveTo(obj.x, obj.y); ctx.lineTo(obj.x + 30, obj.y + 30);
    ctx.moveTo(obj.x + 30, obj.y); ctx.lineTo(obj.x, obj.y + 30); ctx.stroke();
    const flicker = (Date.now() % 200) > 100 ? 5 : 0; 
    ctx.fillStyle = '#e67e22'; ctx.beginPath(); ctx.moveTo(obj.x + 5, obj.y + 20); ctx.lineTo(obj.x + 25, obj.y + 20); ctx.lineTo(obj.x + 15, obj.y - 10 - flicker); ctx.fill();
    ctx.fillStyle = '#f1c40f'; ctx.beginPath(); ctx.moveTo(obj.x + 10, obj.y + 20); ctx.lineTo(obj.x + 20, obj.y + 20); ctx.lineTo(obj.x + 15, obj.y + 5 - flicker); ctx.fill();
}

function drawFlower(obj) {
    ctx.fillStyle = '#2ecc71'; ctx.fillRect(obj.x - 1, obj.y, 2, 8);
    ctx.fillStyle = obj.color; ctx.beginPath(); ctx.arc(obj.x, obj.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white'; ctx.beginPath(); ctx.arc(obj.x, obj.y, 2, 0, Math.PI * 2); ctx.fill();
}

function drawCliff(obj) {
    if (hillsImage.complete && hillsImage.naturalWidth !== 0) {
        
        const DEST_SIZE = 48; 
        const SRC_SIZE = 16;
        
        // Safety margin to prevent "bleeding" from neighbor tiles
        const PAD = 0.1; 

        const cols = Math.ceil(obj.w / DEST_SIZE);
        const rows = Math.ceil(obj.h / DEST_SIZE);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let sx, sy; 

                // X AXIS
                if (c === 0) sx = 0;               
                else if (c === cols - 1) sx = 32;  
                else sx = 16;                      

                // Y AXIS
                if (r === 0) sy = 0;               
                else if (r === rows - 1) sy = 32;  
                else sy = 16;                      

                const dx = Math.floor(obj.x + c * DEST_SIZE);
                const dy = Math.floor(obj.y + r * DEST_SIZE);

                const dw = Math.min(DEST_SIZE, obj.x + obj.w - dx);
                const dh = Math.min(DEST_SIZE, obj.y + obj.h - dy);

                // We apply PAD (0.1) to x, y, width, and height to stay strictly inside the tile
                ctx.drawImage(
                    hillsImage, 
                    sx + PAD, sy + PAD,                         // Source X, Y (Shifted in slightly)
                    ((dw/DEST_SIZE)*SRC_SIZE) - (2 * PAD),      // Source Width (Shrunk slightly)
                    ((dh/DEST_SIZE)*SRC_SIZE) - (2 * PAD),      // Source Height (Shrunk slightly)
                    dx, dy, dw, dh                              // Destination (Stays same)
                );
            }
        }
    } else {
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
    }
}

function drawPlayer(obj) {
    // 1. Draw Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); 
    ctx.ellipse(obj.x, obj.y, 30, 15, 0, 0, Math.PI * 2); 
    ctx.fill();

    // 2. Animation Logic
    if (obj.moving) {
        obj.animTimer++;
        if (obj.animTimer > 10) { 
            obj.frameX++;
            if (obj.frameX >= 4) obj.frameX = 0; 
            obj.animTimer = 0;
        }
    } else {
        obj.frameX = 0; 
    }

    const spriteSize = 48; 
    const displaySize = 144; 

    // --- HELPER: SWORD DRAWING ---
    const drawSword = () => {
        if (!obj.hasWeapon) return;

        ctx.save();
        
        // --- 1. DIRECTIONAL POSITIONING (THE FIX) ---
        // We set unique X/Y offsets for every direction
        
        let swordX = 0;
        let swordY = 0;
        let angle = 0;

        // DOWN (Frame 0)
        if (obj.frameY === 0) { 
            swordX = 15;   
            swordY = -5;  
            angle = Math.PI / 2; 
        } 
        // UP (Frame 1)
        else if (obj.frameY === 1) { 
            swordX = 15;   
            swordY = -5;  
            angle = -Math.PI / 2; 
        } 
        // LEFT (Frame 2) - SIDEWAYS ADJUSTMENT
        else if (obj.frameY === 2) { 
            swordX = -8;  // Closer to center because sprite is thinner sideways
            swordY = -7;  // Slightly higher/lower depending on hand sprite
            angle = Math.PI; 
        } 
        // RIGHT (Frame 3) - SIDEWAYS ADJUSTMENT
        else if (obj.frameY === 3) { 
            swordX = -8;   // Closer to center because sprite is thinner sideways
            swordY = -7;  
            angle = 0; 
        }

        // Apply Position
        ctx.translate(obj.x + swordX, obj.y + swordY);

        // --- 2. ANIMATION ---
        if (obj.isAttacking) {
            const swing = Math.cos(Date.now() / 50) * 1.5;
            if (obj.frameY === 2 || obj.frameY === 1) angle -= swing; 
            else angle += swing;
        } else {
            angle += Math.sin(Date.now() / 300) * 0.1;
        }

        ctx.rotate(angle);

        // --- 3. DRAW SWORD ---
        ctx.fillStyle = '#5d4037'; ctx.fillRect(0, -2, 10, 4);   // Handle
        ctx.fillStyle = '#95a5a6'; ctx.fillRect(10, -6, 4, 12);  // Guard
        ctx.fillStyle = '#ecf0f1'; ctx.fillRect(14, -2, 28, 4);  // Blade
        ctx.beginPath(); ctx.moveTo(42, -2); ctx.lineTo(48, 0); ctx.lineTo(42, 2); ctx.fill(); // Tip

        // --- 4. DRAW PINK RIBBON ---
        ctx.fillStyle = '#ff9a9e'; // Pink color
        ctx.fillRect(7, -2, 4, 4); // Center knot
        
        // Top loop
        ctx.beginPath(); ctx.moveTo(9, -2); ctx.lineTo(13, -6); ctx.lineTo(5, -6); ctx.fill();
        
        // Bottom loop
        ctx.beginPath(); ctx.moveTo(9, 2); ctx.lineTo(13, 6); ctx.lineTo(5, 6); ctx.fill();
        
        // Tails
        ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(4, 7); ctx.lineTo(6, 8); ctx.fill();
        ctx.beginPath(); ctx.moveTo(8, 2); ctx.lineTo(8, 8); ctx.lineTo(10, 7); ctx.fill();

        ctx.restore();
    };

    // --- RENDER LAYERS ---

    // LAYER 1: BEHIND (Walking Up)
    if (obj.frameY === 1) {
        drawSword();
    }

    // LAYER 2: PLAYER SPRITE
    if (playerImage.complete && playerImage.naturalWidth !== 0) {
        ctx.drawImage(
            playerImage, 
            obj.frameX * spriteSize, obj.frameY * spriteSize, 
            spriteSize, spriteSize,
            Math.floor(obj.x - (displaySize / 2)), 
            Math.floor(obj.y - (displaySize * 0.6)), 
            displaySize, displaySize 
        );
    } else {
        ctx.fillStyle = obj.color;
        ctx.beginPath(); ctx.arc(obj.x, obj.y - 40, 20, 0, Math.PI*2); ctx.fill();
    }

    // LAYER 3: FRONT (Walking Down/Left/Right)
    if (obj.frameY !== 1) {
        drawSword();
    }

    ctx.save();
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    
    // Draw black outline (so it's readable on grass)
    ctx.strokeText(obj.name, obj.x, obj.y - 55);
    // Draw white text
    ctx.fillText(obj.name, obj.x, obj.y - 55);
    ctx.restore();
}

function drawMonster(obj) {
    // --- 1. BOSS LOGIC (SKELETON) ---
    if (obj.type === 'boss') {
        if (skeletonImage.complete && skeletonImage.naturalWidth !== 0) {
            // Skeleton Spritesheet Logic (Assume 32x32 frames, Row 0 is facing down)
            let srcY = 0; 
            let maxFrames = 3; 
            let srcX = (obj.frame % maxFrames) * 32; 

            // Huge Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.ellipse(obj.x, obj.y + 45, 30, 10, 0, 0, Math.PI*2);
            ctx.fill();

            // Draw Massive Skeleton Boss (Scaled 32x32 -> 128x128)
            ctx.drawImage(skeletonImage, srcX, srcY, 32, 32, obj.x - 64, obj.y - 80, 128, 128);
            
            // Boss HP Bar
            const hpPct = obj.hp / obj.maxHp;
            ctx.fillStyle = 'red'; ctx.fillRect(obj.x - 40, obj.y - 90, 80, 8);
            ctx.fillStyle = '#00ff00'; ctx.fillRect(obj.x - 40, obj.y - 90, 80 * hpPct, 8);
        } else {
            // Fallback purple circle
            ctx.fillStyle = 'purple';
            ctx.beginPath(); ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI*2); ctx.fill();
        }
        return; // Exit here so it doesn't draw a slime!
    }

    // --- 2. NORMAL SLIME LOGIC ---
    if (slimeImage.complete && slimeImage.naturalWidth !== 0) {
        let srcY = 64; 
        let srcX = obj.frame * 64; 

        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(obj.x + 24, obj.y + 45, 20, 8, 0, 0, Math.PI*2);
        ctx.fill();

        ctx.drawImage(slimeImage, srcX, srcY, 64, 64, obj.x - 16, obj.y - 24, 80, 80);
        
        const hpPct = (obj.hp && obj.maxHp) ? (obj.hp / obj.maxHp) : 1;
        ctx.fillStyle = 'red'; ctx.fillRect(obj.x, obj.y - 30, 48, 6);
        ctx.fillStyle = '#00ff00'; ctx.fillRect(obj.x, obj.y - 30, 48 * hpPct, 6);
    } else {
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath(); ctx.arc(obj.x + 24, obj.y + 24, 25, 0, Math.PI*2); ctx.fill();
    }
}

function drawNPC(obj) {
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(obj.x, obj.y + 15, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    let bounce = 0;
    if (obj.hasQuest) {
        bounce = Math.sin(Date.now() / 200) * 3;
    } else {
        bounce = Math.sin(Date.now() / 300) * 1.5;
    }

    if (obj.sprite && obj.sprite.complete && obj.sprite.naturalWidth !== 0) {
        const frameX = 16; 
        const frameY = 0;
        const srcW = 16;
        const srcH = 20;
        ctx.drawImage(obj.sprite, frameX, frameY, srcW, srcH, obj.x - 24, obj.y - 40 + bounce, 48, 60);
    } else {
        ctx.fillStyle = obj.color || 'blue';
        ctx.beginPath(); 
        ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2); 
        ctx.fill();
    }
    
    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(obj.name, obj.x, obj.y - 45 + bounce);
    
    if (obj.hasQuest) {
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 24px Courier New';
        ctx.fillText('!', obj.x, obj.y - 60 + bounce);
    }
}

function drawTree(obj) {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); 
    ctx.ellipse(obj.x, obj.y, 20, 10, 0, 0, Math.PI * 2); 
    ctx.fill();

    if (objectsImage.complete && objectsImage.naturalWidth !== 0) {
        const treeSrcW = 16; 
        const treeSrcH = 32; 
        ctx.drawImage(objectsImage, 0, 0, treeSrcW, treeSrcH, obj.x - 24, obj.y - 80, 48, 96);
    } else {
        ctx.fillStyle = '#27ae60'; 
        ctx.beginPath(); 
        ctx.moveTo(obj.x - 20, obj.y - 15); 
        ctx.lineTo(obj.x + 20, obj.y - 15); 
        ctx.lineTo(obj.x, obj.y - 45); 
        ctx.fill();
    }
}

function drawRock(obj) {
    ctx.fillStyle = obj.color; ctx.fillRect(obj.x - obj.radius, obj.y - obj.radius, obj.size, obj.size * 0.8);
    ctx.fillStyle = '#95a5a6'; ctx.fillRect(obj.x - obj.radius, obj.y - obj.radius, obj.size, 5);
}

function drawDecoration(obj) {
    // 1. Draw small shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(obj.x + 16, obj.y + 28, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw the specific item from the sprite sheet
    if (objectsImage.complete && objectsImage.naturalWidth !== 0) {
        ctx.drawImage(
            objectsImage, 
            obj.srcX, obj.srcY, 16, 16,  // SOURCE: Grab 16x16 pixel area
            obj.x, obj.y, 32, 32         // DESTINATION: Draw it larger (32x32)
        );
    } else {
        // Fallback (pink dot) if image fails
        ctx.fillStyle = 'pink';
        ctx.beginPath(); ctx.arc(obj.x + 16, obj.y + 16, 8, 0, Math.PI*2); ctx.fill();
    }
}

function drawHouse(obj) {
    // VISUAL OFFSET: Shifts the image 16px to the Right
    const xOffset = 17; 

    if (houseImage.complete && houseImage.naturalWidth !== 0) {
        // Draw the image at (x + 16)
        ctx.drawImage(houseImage, obj.x + xOffset, obj.y, obj.w, obj.h);
    } else {
        // Fallback rectangle (shifted as well)
        ctx.fillStyle = '#795548'; 
        ctx.fillRect(obj.x + xOffset, obj.y, obj.w, obj.h - 30);
        ctx.fillStyle = '#a1887f'; 
        ctx.beginPath();
        ctx.moveTo(obj.x - 10 + xOffset, obj.y);
        ctx.lineTo(obj.x + obj.w/2 + xOffset, obj.y - 40);
        ctx.lineTo(obj.x + obj.w + 10 + xOffset, obj.y);
        ctx.fill();
    }
}

function drawFence(obj) {
    // 1. Draw Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(obj.x + 5, obj.y + 35, 38, 8);

    if (fenceImage.complete && fenceImage.naturalWidth !== 0) {
        // --- CHANGE: LOGIC FOR VERTICAL FENCES ---
        
        // Default to Horizontal settings 
        let sourceX = 32; 
        let sourceY = 0;

        // If tagged as vertical, use the vertical post settings (Row 1, Column 0)
        if (obj.dir === 'ver') {
            sourceX = 0;
            sourceY = 16;
        }

        const sourceSize = 16; 
        const destSize = 48; 
        
        // Use the determined sourceX/Y variables
        ctx.drawImage(fenceImage, sourceX, sourceY, sourceSize, sourceSize, obj.x, obj.y, destSize, destSize);
    } else {
        // Fallback colors if image fails to load
        ctx.fillStyle = '#795548'; ctx.fillRect(obj.x + 20, obj.y + 5, 8, 35);
        ctx.fillStyle = '#a1887f'; ctx.fillRect(obj.x, obj.y + 15, 48, 6); ctx.fillRect(obj.x, obj.y + 28, 48, 6);
    }
}

function getNearbyNPC() {
    for (let obj of gameObjects) {
        if (obj.type === 'npc') {
            const dist = Math.hypot(player.x - obj.x, player.y - obj.y);
            if (dist < 60) {
                return obj;
            }
        }
    }
    return null;
}

function drawInteractionPrompt(npc) {
    const text = "[SPACE] Talk";
    const x = player.x; 
    const y = player.y - 40; 
    ctx.font = 'bold 12px Courier New';
    const textWidth = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.roundRect(x - textWidth/2 - 5, y - 12, textWidth + 10, 18, 5);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function updateAnimals() {
    animals.forEach(a => {
        // 1. BEHAVIOR
        a.timer--;
        if (a.timer <= 0) {
            a.timer = Math.floor(Math.random() * 80) + 20;
            if (Math.random() < 0.6) {
                a.state = 'idle';
            } else {
                a.state = 'walk';
                const angle = Math.random() * Math.PI * 2;
                a.vx = Math.cos(angle) * 0.5; 
                a.vy = Math.sin(angle) * 0.5;
                if (a.vx < 0) a.dirX = -1; else a.dirX = 1;
            }
        }

        // 2. MOVEMENT
        if (a.state === 'walk') {
            let nextX = a.x + a.vx;
            let nextY = a.y + a.vy;
            let allowed = true;

            // A. FARM BOUNDARY CHECK (For Cows/Sheep)
            if (a.bounds) {
                if (nextX < a.bounds.minX || nextX > a.bounds.maxX ||
                    nextY < a.bounds.minY || nextY > a.bounds.maxY) {
                    allowed = false;
                    // Turn them around immediately so they don't get stuck
                    a.vx = -a.vx;
                    a.vy = -a.vy;
                }
            }

            // B. POND CHECK (For Free Roaming Chickens)
            if (!a.bounds) {
                for (const obj of gameObjects) {
                    if (obj.type === 'pond') {
                        if (nextX > obj.x + 5 && nextX < obj.x + obj.w - 5 &&
                            nextY > obj.y + 5 && nextY < obj.y + obj.h - 5) {
                            allowed = false; break;
                        }
                    }
                }
                // Screen Limits
                if (nextX < 50 || nextX > canvas.width - 50 || nextY < 50 || nextY > canvas.height - 50) allowed = false;
            }

            if (allowed) {
                a.x = nextX;
                a.y = nextY;
            } else {
                a.state = 'idle';
                a.timer = 20;
            }
        }

        // 3. ANIMATION
        a.frameTimer++;
        if (a.frameTimer > 10) { 
            a.frameTimer = 0;
            a.frame++; 
        }
    });
}

function drawAnimal(a) {
    let img = chickenImage;
    let size = 32; // Default size for chickens
    let srcSize = 16; 

    // Select Image & Size based on Type
    if (a.type === 'cow') {
        img = cowImage;
        srcSize = 32; // Cows use 32x32 frames
        size = 60;    
    } else if (a.type === 'sheep') {
        img = sheepImage;
        srcSize = 32; // Sheep use 32x32 frames
        size = 60;    
    } else {
        // Default Chicken
        srcSize = 16;
        size = 32;
    }

    if (img.complete) {
        // Animation Logic
        // Row 0: Idle, Row 1: Walk
        let srcY = (a.state === 'idle') ? 0 : srcSize;
        let maxFrames = 2; // Assume 2 frames per row for all animals
        
        let currentFrame = a.frame % maxFrames;
        let srcX = currentFrame * srcSize; 

        ctx.save();
        ctx.translate(a.x + size/2, a.y + size/2); 
        ctx.scale(a.dirX, 1); 
        ctx.drawImage(img, srcX, srcY, srcSize, srcSize, -size/2, -size/2, size, size);
        ctx.restore();
    }
}

function drawStoneFloor(obj) {
    if (stoneGroundImage.complete && stoneGroundImage.naturalWidth !== 0) {
        // Use the Top-Left tile (0,0) which is guaranteed to be visible.
        // It might have a slight border pattern, but it's better than grey!
        ctx.drawImage(stoneGroundImage, 0, 0, 32, 32, Math.floor(obj.x), Math.floor(obj.y), 48, 48);
    } else {
        ctx.fillStyle = '#222'; 
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

function drawStoneWall(obj) {
    if (wallImage.complete && wallImage.naturalWidth !== 0) {
        // Draw the full wall height (Top + Front Face)
        // Source: x=32, y=0 (Top Edge), width=32, height=64 (Top + Face)
        
        // We shift y-48 to draw it standing UP from the tile position
        ctx.drawImage(wallImage, 32, 0, 32, 64, Math.floor(obj.x), Math.floor(obj.y - 48), 48, 96);
        
        // Add a shadow at the base to ground it
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(obj.x, obj.y + 30, 48, 18);
    } else {
        ctx.fillStyle = '#555'; 
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

function drawStairs(obj) {
    if (structImage.complete && structImage.naturalWidth !== 0) {
        // Stairs are typically at the bottom left of Struct.png
        // We'll guess the coordinate based on standard layout (0, 224 approx)
        ctx.drawImage(structImage, 0, 224, 96, 96, obj.x, obj.y, 96, 96);
    } else {
        ctx.fillStyle = 'yellow'; 
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

// Updated Prop Drawer (Rocks & Pots)
function drawProp(obj) {
    if (propsImage.complete && propsImage.naturalWidth !== 0) {
        let srcX = 0; 
        let srcY = 0;

        if (obj.type === 'prop_rock') {
            // Small Rocks (Bottom left of Props sheet)
            // Approx coords based on typical sheet layout
            srcX = 32; srcY = 480; 
        } else if (obj.type === 'prop_pot') {
            // Pots (Usually middle-left)
            srcX = 96; srcY = 160; 
        }

        ctx.drawImage(propsImage, srcX, srcY, 32, 32, obj.x, obj.y, 48, 48);
    } else {
        ctx.fillStyle = '#7f8c8d'; // Grey fallback
        ctx.fillRect(obj.x + 10, obj.y + 10, 28, 28);
    }
}

// NEW FUNCTION: Draws a tall pillar from TX Struct.png
function drawPillar(obj) {
    // We reuse the structImage (already loaded for stairs)
    if (structImage.complete && structImage.naturalWidth !== 0) {
        ctx.drawImage(structImage, 192, 96, 32, 96, obj.x, obj.y - 48, 48, 144);
    } else {
        // Fallback: dark grey block
        ctx.fillStyle = '#444';
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

// Draws the grass base for the dungeon
function drawDungeonGrass(obj) {
    if (tilesetImage.complete && tilesetImage.naturalWidth !== 0) {
        // Use a generic grass tile from the main set (e.g., top left 16,82)
        ctx.drawImage(tilesetImage, 16, 82, 16, 16, obj.x, obj.y, 48, 48);
    } else {
        ctx.fillStyle = '#2e7d32'; 
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

function drawTXGrass(obj) {
    if (txGrassImage.complete && txGrassImage.naturalWidth !== 0) {
        ctx.drawImage(txGrassImage, 0, 0, 32, 32, obj.x, obj.y, 48, 48);
    } else {
        // Fallback if image isn't loaded yet
        ctx.fillStyle = '#4a6b30'; 
        ctx.fillRect(obj.x, obj.y, 48, 48);
    }
}

// Draws small grass/leaf details on top of the base grass
function drawTXGrassDecor(obj) {
    if (txGrassImage.complete && txGrassImage.naturalWidth !== 0) {
        let srcX = 96 + (obj.variant * 16); 
        let srcY = 0;
        ctx.drawImage(txGrassImage, srcX, srcY, 16, 16, obj.x, obj.y, 24, 24);
    }
}

// Draws a cluster of small stones/rubble
function drawRubble(obj) {
    if (propsImage.complete && propsImage.naturalWidth !== 0) {
        ctx.drawImage(propsImage, 0, 480, 32, 32, obj.x, obj.y, 40, 40);
    } else {
         ctx.fillStyle = '#7f8c8d'; ctx.fillRect(obj.x, obj.y + 10, 20, 10);
    }
}

// Draws a broken pillar stump
function drawBrokenPillar(obj) {
     if (structImage.complete && structImage.naturalWidth !== 0) {
        ctx.drawImage(structImage, 192, 160, 32, 64, obj.x, obj.y - 24, 48, 72);
    } else {
        ctx.fillStyle = '#444'; ctx.fillRect(obj.x, obj.y, 48, 30);
    }
}

// Draws bushes from the TX Plant.png spritesheet
function drawPlantBush(obj) {
    if (plantImage.complete && plantImage.naturalWidth !== 0) {
        
        let srcY = 192; 
        let srcW = 64; 
        let srcH = 64;
        let srcX = 128; // Default

        // Select the 3 bush variants
        if (obj.variant === 0) { 
            srcX = 132;  // Bush A (Dense)
        } 
        else if (obj.variant === 1) { 
            srcX = 210;  // Bush B (Round)
        } 
        else { 
            srcX = 266;  // Bush C (Wide)
        }

        // Enable smoothing
        ctx.imageSmoothingEnabled = false; // Try pixel-perfect rendering

        // 1. DRAW SHADOW
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(obj.x + 24, obj.y + 38, 16, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. DRAW BUSH - render at native size (no scaling)
        ctx.drawImage(
            plantImage, 
            srcX, srcY, srcW, srcH,           // Source: 64x64
            obj.x - 8, obj.y - 16, 64, 64     // Destination: 64x64 (1:1, no scaling)
        );
        
    } else {
        // Fallback
        ctx.fillStyle = 'red';
        ctx.fillRect(obj.x + 10, obj.y + 10, 20, 20);
    }
}


function updateMonsters() {
    if (typeof player.hp === 'undefined') {
        player.hp = 100;
        player.maxHp = 100;
        player.invincibleTimer = 0;
    }

    if (player.invincibleTimer > 0) player.invincibleTimer--;

    // 3. CHECK FOR DEATH & RESPAWN LOGIC
    if (player.hp <= 0) {
        player.hp = player.maxHp; 
        currentZone = 0; 
        dungeonLevel = 1; 

        // --- NEW: WIPE DUNGEON CACHE ON DEATH ---
        for (let i = 1; i <= 7; i++) {
            delete worldData[`1_${i}`];
        }
        delete worldData[3]; // Clear boss room too

        player.x = canvas.width / 2;  
        player.y = canvas.height / 2; 

        generateWorld(0); 
        showNotification("You Died! Respawned in Forest 🌲");
        return; 
    }

    gameObjects.forEach(obj => {
        if (obj.type === 'monster' || obj.type === 'boss') {
            if (typeof obj.frame === 'undefined') obj.frame = 0;
            if (typeof obj.frameTimer === 'undefined') obj.frameTimer = 0;
            
            obj.frameTimer++;
            if (obj.frameTimer > 6) { 
                obj.frame++;
                if (obj.frame >= 8) obj.frame = 0; 
                obj.frameTimer = 0;
            }

            const dx = player.x - obj.x;
            const dy = player.y - obj.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            if (dist < 300 && dist > 10) { 
                const speed = 1.0; 
                obj.x += (dx / dist) * speed;
                obj.y += (dy / dist) * speed;
            }

            if (dist < 40) {
                if (player.invincibleTimer <= 0) {
                    player.hp -= 10; 
                    player.invincibleTimer = 60; 
                    player.x += (dx / dist) * 30; 
                    player.y += (dy / dist) * 30;
                }
            }
        }
    });
}

function checkInteraction() {
    if (isShopOpen) {
        isShopOpen = false;
        return true; 
    }

    const nearbyNPC = getNearbyNPC();
    if (nearbyNPC) {
        
        if (nearbyNPC.subtype === 'quest_giver' && player.hasLetter) {
            nearbyNPC.dialogue = [
                "A letter from the Skeleton King?", 
                `He was my cursed brother... You freed his soul, ${player.name}!`, 
                "But.. i think this letter is meant for you?",
                "I'll let you read what it says..." 
            ];
            startDialogue(nearbyNPC);
            player.hasLetter = false; 
            gameState.readyToReadLetter = true; // Trigger letter on close
            return true;
        }

        if (nearbyNPC.subtype === 'shop_keeper') {
            isShopOpen = true; 
            shopNPC = nearbyNPC;
            return true;
        } else {
            startDialogue(nearbyNPC);
            return true; 
        }
    }
    return false;
}

window.closeDialogue = function() {
    // Stop normal NPC sound
    if (typeof sfx !== 'undefined' && sfx.npcTalk) {
        sfx.npcTalk.pause();
        sfx.npcTalk.currentTime = 0;
    }

    // Stop singing and resume BGM if needed
    if (typeof sfx !== 'undefined' && sfx.farmerSing && !sfx.farmerSing.paused) {
        sfx.farmerSing.pause();
        sfx.farmerSing.currentTime = 0;
        if (typeof currentBGM !== 'undefined' && currentBGM && typeof isPlaying !== 'undefined' && isPlaying) {
            currentBGM.play().catch(e => {});
        }
    }

    isDialogueOpen = false;
    dialogueBox.classList.add('hidden');
    
    if (currentTalkingNPC && currentTalkingNPC.subtype === 'quest_giver') {
        if (!player.hasWeapon) {
            player.hasWeapon = true;
            player.hasSword = true;
            showNotification("ITEM RECEIVED: Ribbon Sword 🎀⚔️");
            currentTalkingNPC.dialogue = ["Go show those slimes who's boss!", "Press SPACE to attack!"];
        } 
        else if (typeof gameState !== 'undefined' && gameState.bossDefeated && !player.hasLetter && !gameState.readyToReadLetter) {
            currentTalkingNPC.dialogue = ["Thanks to you, our village is safe forever!"];
        }
    }
    
    if (typeof gameState !== 'undefined' && gameState.readyToReadLetter) {
        gameState.readyToReadLetter = false;
        showLetterUI();
    }
    
    currentTalkingNPC = null;
}

function showLetterUI() {
    isLetterUIOpen = true;
    const overlay = document.getElementById('letterOverlay');
    const letterCont = document.getElementById('letterContainer');
    overlay.classList.remove('hidden');
    letterCont.classList.remove('letter--open', 'letter--close'); 
}

window.openLetter = function() {
    const letterCont = document.getElementById('letterContainer');
    letterCont.classList.add('letter--open');
    letterCont.classList.remove('letter--close');
}

window.closeLetterUI = function() {
    const letterCont = document.getElementById('letterContainer');
    letterCont.classList.remove('letter--open');
    letterCont.classList.add('letter--close');
    
    setTimeout(() => {
        document.getElementById('letterOverlay').classList.add('hidden');
        isLetterUIOpen = false;
        showNotification("Quest Completed! 🏆");
    }, 400); // Wait for CSS animation to finish
}

let fireworksParticles = [];
const fireworksColors = ['#ff4757', '#2ed573', '#1e90ff', '#ffa502', '#ff6b81', '#7bed9f'];
let fireworksFired = 0;

function createFirework(x, y) {
    playSFX(sfx.firework);
    const numParticles = 50 + Math.random() * 30;
    const color = fireworksColors[Math.floor(Math.random() * fireworksColors.length)];
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        fireworksParticles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: color,
            alpha: 1,
            life: Math.random() * 40 + 40
        });
    }
}

function updateFireworks() {
    if (currentZone !== 2 || !gameState.bossDefeated) {
        fireworksFired = 0; 
        return;
    }
    
    if (Math.random() < 0.04 && fireworksFired < 6) { 
        createFirework(100 + Math.random() * (canvas.width - 200), 50 + Math.random() * (canvas.height / 2 - 50));
        fireworksFired++;
    }

    for (let i = fireworksParticles.length - 1; i >= 0; i--) {
        let p = fireworksParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; 
        p.vx *= 0.98; 
        p.vy *= 0.98;
        p.alpha -= 0.015; 
        p.life--;

        if (p.life <= 0 || p.alpha <= 0) {
            fireworksParticles.splice(i, 1);
        }
    }
}

function drawFireworks() {
    if (currentZone !== 2 || !gameState.bossDefeated) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    fireworksParticles.forEach(p => {
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.random() * 2 + 1, 0, Math.PI * 2); // Twinkling size
        ctx.fill();
    });
    ctx.restore();
}

function playMusicForZone(zone) {
    let nextBGM = null;
    
    if (zone === 0 || zone === 2) {
        nextBGM = bgmPeaceful;
    } 
    else if (zone === 1) {
        nextBGM = bgmDungeon;
    } 
    else if (zone === 3) {
        nextBGM = gameState.bossDefeated ? bgmDungeon : bgmBoss;
    }

    if (currentBGM !== nextBGM) {
        if (currentBGM) {
            currentBGM.pause();
            currentBGM.currentTime = 0; 
        }
        currentBGM = nextBGM;
        
        if (currentBGM && typeof isPlaying !== 'undefined' && isPlaying) {
            currentBGM.play().catch(e => console.log("Audio autoplay prevented by browser"));
        }
    }
}

function playSFX(audioObj) {
    if (!isPlaying) return; // Prevent sound if game hasn't started
    let snd = audioObj.cloneNode(); // Clones the audio so it can overlap
    snd.volume = audioObj.volume;
    snd.play().catch(e => {}); // Catch browser autoplay restrictions
}


function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();