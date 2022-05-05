# Battleship

<p align="center">
<img src="img/preview.png">
</p>

# Introduction

Battleship is a 3D game, built using WebGL and Three.js.

### Player Ship

The player ship can move around the ocean, and can fire cannonballs at enemy ships. The player ship can also collect treasure chests lying around the ocean. The player has a health of 100, and each hit from a cannon from enemy ship reduces the player's health by 10 and a hot with enemy ship reduces it by 30. The game ends when the player's health reaches 0.

### Enemy Ships

Enemy ships are randomly spawned within a certain disteance around the player ship. They can fire cannonballs at the player ship at periodic intervals once they are within a certain distance from the player. Each enemy ship has a health of 100, and each hit from the player ship reduces the enemy ship's health by 25.

### Treasure Chests

Treasure chests are randomly spawned within a certain distance around the player ship. They can be collected by the player ship to increase the score of the player.

## Controls

<kbd>W</kbd> - Move forward<br>
<kbd>A</kbd> - Rotate left<br>
<kbd>S</kbd> - Move backward<br>
<kbd>D</kbd> - Rotate right<br>
<kbd>" "</kbd> - Fire cannonball<br>
<kbd>R</kbd> - Third-person view / Bird's-eye view<br>


## Setup

1. Clone the repository.

2. Change the working directory to the repository.
```bash
cd Ship-Battle
```

3. Run the following commands:
```bash
npm install
npm i three
npm run dev
```
4. Open the browser and navigate to the localhost mentioned on terminal. You should now be able to play the game.
