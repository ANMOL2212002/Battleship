const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let enemies = [];
let treasure = [];
let cannonballs = [];
let enemycannon = [];
let coin;
let health; // 30 for ship, 10 for cannonball
let score; // 20 for enemy, 5 for coin

let camera;
let camera_bird;
const scene = new THREE.Scene();

var clock = new THREE.Clock();
var enemy_clock = new THREE.Clock();
var treasure_clock = new THREE.Clock();
var enemy_cannon_clock = new THREE.Clock();

coin = 0;
health = 100;
score = 0;

camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 2, 5);

camera_bird = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

var camop = 0;
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x005262);

const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

///////////////////////////////////////////
class playerShip {
  constructor() {
    this.scene = scene;
    const loader = new THREE.GLTFLoader();
    loader.load("/models/scene.gltf", (gltf) => {
      gltf.scene.position.set(0, -3.5, -10);
      gltf.scene.scale.set(0.01, 0.01, 0.01);
      //gltf.scene.rotation.set(0, Math.PI / 2, 0);
      this.player = gltf.scene;
      scene.add(this.player);
      //  camera.lookAt(this.player.position);
    });
  }

  rightmotion() {
    if (this.player) {
      // animate_loop.sub(b);
      var temp1 = new THREE.Vector3(
        this.player.position.x,
        camera.position.y,
        this.player.position.z
      );
      var d = temp1.distanceTo(camera.position);

      camera.translateZ(-d);
      this.player.rotateY(-0.1);
      camera.rotateY(-0.1);
      camera.translateZ(d);
    }
  }

  leftmotion() {
    if (this.player) {
      // animate_loop.sub(b);
      var temp1 = new THREE.Vector3(
        this.player.position.x,
        camera.position.y,
        this.player.position.z
      );
      var d = temp1.distanceTo(camera.position);

      camera.translateZ(-d);
      this.player.rotateY(0.1);
      camera.rotateY(0.1);
      camera.translateZ(d);
    }
  }

  forwardmotion() {
    if (this.player) {
      this.player.translateZ(-1);
      camera.translateZ(-1);
    }
  }

  backwardmotion() {
    if (this.player) {
      this.player.translateZ(1);
      camera.translateZ(1);
    }
  }
}

const player = new playerShip();
//camera.lookAt(this.player.position);

class EnemyShip {
  constructor(vec) {
    this.scene = scene;
    const loader = new THREE.GLTFLoader();
    loader.load("/models/enemy.glb", (gltf) => {
      gltf.scene.position.set(vec.x, vec.y, vec.z);
      gltf.scene.scale.set(2, 2, 2);
      this.enemy = gltf.scene;
      scene.add(this.enemy);
      //console.log(this.enemy.position);
    });
  }
}

class TreasureCoin {
  constructor(vec) {
    this.scene = scene;
    const loader = new THREE.GLTFLoader();
    loader.load("/models/treasure_chest_1.glb", (gltf) => {
      gltf.scene.position.set(vec.x, vec.y, vec.z);
      gltf.scene.scale.set(1, 1, 1);
      this.treasure = gltf.scene;
      scene.add(this.treasure);
      //console.log(this.treasure.position);
    });
  }
}

class CannonBall {
  constructor(vec, rot) {
    this.scene = scene;
    const loader = new THREE.GLTFLoader();

    loader.load("/models/bullet.glb", (gltf) => {
      gltf.scene.position.set(vec.x, vec.y, vec.z);
      gltf.scene.scale.set(0.5, 0.5, 0.5);
      gltf.scene.rotation.set(rot.x, rot.y, rot.z);
      this.cannonball = gltf.scene;
      scene.add(this.cannonball);
      //console.log(this.cannonball.position);
    });
  }
}

// get a random distance
function random_position(min, max) {
  var ran_dis = Math.random() * (max - min) + min;
  var ran_angle = Math.random() * (Math.PI * 2);
  var delta = new THREE.Vector3(
    ran_dis * Math.cos(ran_angle),
    0,
    ran_dis * Math.sin(ran_angle)
  );
  //console.log(delta);
  //console.log(player.player.position);
  return delta.add(player.player.position);
}

const scenery = new landscape(scene, renderer);
scenery.updateSun(scene);

var ftime = 0;
var count = 0;
function update() {
  //console.log(camop);
  if (player.player !== undefined) {
    if (health <= 0) {
      if (count == 0) {
        ftime = Math.floor(clock.getElapsedTime());
      }
      count = 1;

      document.getElementById("health").innerHTML = "Health: " + 0;
      document.getElementById("coin").innerHTML = "Coin: " + coin;
      document.getElementById("score").innerHTML = "Score: " + score;
      document.getElementById("time").innerHTML = "Time : " + (60 - ftime) + " secs";
      document.getElementById("over").innerHTML = "Game Over";
      return;
    }
    if (clock.getElapsedTime() >= 60) {
      ftime = 60;
      document.getElementById("health").innerHTML = "Health: " + health;
      document.getElementById("coin").innerHTML = "Coin: " + coin;
      document.getElementById("score").innerHTML = "Score: " + score;
      document.getElementById("time").innerHTML = "Time: " + (60 - ftime) + " secs";
      document.getElementById("over").innerHTML = "Game Won";
      return;
    }
    ftime = Math.floor(clock.getElapsedTime());
    document.getElementById("health").innerHTML = "Health: " + health;
    document.getElementById("coin").innerHTML = "Coin: " + coin;
    document.getElementById("score").innerHTML = "Score: " + score;
    document.getElementById("time").innerHTML = "Time: " + (60 - ftime) + " secs";
    scenery.waterObj.material.uniforms["time"].value += 0.3 / 60.0;

    // camera operations
    if (camop == 0) {
      renderer.render(scene, camera);
    }

    if (camop == 1) {
      camera_bird.position.set(
        player.player.position.x,
        100,
        player.player.position.z
      );
      camera_bird.lookAt(player.player.position);
      renderer.render(scene, camera_bird);
    }

    // creating enenemies
  if (enemy_clock.getElapsedTime() > 15) {
    enemies.push(new EnemyShip(random_position(35, 70)));
    enemy_clock.start();
  }

    // creating treasure
    if (treasure_clock.getElapsedTime() > 7) {
      treasure.push(new TreasureCoin(random_position(25, 75)));
      treasure_clock.start();
    }

    // move enemy
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].enemy !== undefined) {
        enemies[i].enemy.lookAt(player.player.position);
        enemies[i].enemy.translateZ(0.03);
      }
    }

    // check collisions of player with enemies
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].enemy !== undefined) {
        if (player.player.position.distanceTo(enemies[i].enemy.position) < 5) {
          scene.remove(enemies[i].enemy);
          health -= 30;
          console.log(health);
          enemies.splice(i, 1);
        }
      }
    }

    // checking collision of player with treasure
      for (var i = 0; i < treasure.length; i++) {
        if (treasure[i].treasure !== undefined) {
          if (
            player.player.position.distanceTo(treasure[i].treasure.position) < 2
          ) {
            scene.remove(treasure[i].treasure);
            coin += 1;
            score += 5;
            console.log(coin);
            treasure.splice(i, 1);
          }
        }
      }



    // move cannonball of player
    for (var i = 0; i < cannonballs.length; i++) {
      if (cannonballs[i].cannonball !== undefined) {
        cannonballs[i].cannonball.translateZ(-0.7);
      }
    }

    //delete cannonball of player
    for (var i = 0; i < cannonballs.length; i++) {
      if (cannonballs[i].cannonball !== undefined) {
        if (
          cannonballs[i].cannonball.position.distanceTo(
            player.player.position
          ) > 500
        ) {
          scene.remove(cannonballs[i].cannonball);
          cannonballs.splice(i, 1);
        }
      }
    }

    /////////////////////////////////////////////////////////////
    // check collision of enemey with cannonball of player
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].enemy !== undefined) {
        for (var j = 0; j < cannonballs.length; j++) {
          if (cannonballs[j].cannonball !== undefined) {
            if (
              enemies[i].enemy.position.distanceTo(
                cannonballs[j].cannonball.position
              ) < 2
            ) {
              console.log("enemy collsiosn with cannon ball");
              score += 20;
              scene.remove(enemies[i].enemy);
              scene.remove(cannonballs[j].cannonball);
              enemies.splice(i, 1);
              cannonballs.splice(j, 1);
              
            }
          }
        }
      }
    }
  }
  //////////////////////////////////////////////////////////////////

  // create cannonball of enemy
  if (enemy_cannon_clock.getElapsedTime() > 5) {
    enemy_cannon_clock.start();
    for (var i = 0; i < enemies.length; i++) {
      if (enemies[i].enemy !== undefined) {
        enemycannon.push(
          new CannonBall(enemies[i].enemy.position, enemies[i].enemy.rotation)
        );
      }
    }
  }

  // move cannon ball of enemy
  for (var i = 0; i < enemycannon.length; i++) {
    if (enemycannon[i].cannonball !== undefined) {
      enemycannon[i].cannonball.translateZ(0.5);
    }
  }

  // delete cannon ball of enemy
  for (var i = 0; i < enemycannon.length; i++) {
    if (enemycannon[i].cannonball !== undefined) {
      if (
        enemycannon[i].cannonball.position.distanceTo(player.player.position) >
        500
      ) {
        scene.remove(enemycannon[i].cannonball);
        enemycannon.splice(i, 1);
      }
    }
  }

  // check collision of player with cannon ball of enemy
  for (var i = 0; i < enemycannon.length; i++) {
    if (enemycannon[i].cannonball !== undefined) {
      if (
        player.player.position.distanceTo(enemycannon[i].cannonball.position) <
        2
      ) {
        scene.remove(enemycannon[i].cannonball);
        enemycannon.splice(i, 1);
        health -= 10;
        console.log(health);
      }
    }
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function logKey(e) {
  if (e.key == "w") {
    player.forwardmotion();
  }

  if (e.key == "s") {
    player.backwardmotion();
  }

  if (e.key == "d") {
    player.rightmotion();
  }

  if (e.key == "a") {
    player.leftmotion();
  }

  if (e.key == " ") {
    if (player.player !== undefined) {
      cannonballs.push(
        new CannonBall(player.player.position, player.player.rotation)
      );
    }
  }

  if (e.key == "r") {
    camop = 1 - camop;
  }
}

window.addEventListener("resize", onWindowResize);
window.addEventListener("keydown", logKey);

function animate_loop() {
  update();
  requestAnimationFrame(animate_loop);
}

animate_loop();
