import './style.css'

// CANVAS 

const canvas = document.querySelector("canvas")
const context = canvas.getContext("2d")
const $score = document.querySelector("span")

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

let score = 0

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

// BOARD

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard (width, height) {
  return Array(height).fill().map(() => Array(width).fill(0))
}

// PLAYER PIECE

const piece = {
  position: { x: 5, y: 5 },
  shape: [
    [1, 1],
    [1, 1]
  ]
}

// RANDOM PIECES

const PIECES = [
  [ 
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [ 
    [0, 1, 0],
    [1, 1, 1]
  ],
  [ 
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1]
  ]
]

// AUTODROP

let dropCounter = 0
let lastTime = 0

function update(time = 0) {
  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if (dropCounter > 1000) {
    piece.position.y++
    dropCounter = 0

    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  draw()
  window.requestAnimationFrame(update)
}

// DRAW 

function draw() {
  context.fillStyle = "#000"
  context.fillRect(0, 0, canvas.width, canvas.height)

  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = "yellow"
        context.fillRect(x, y, 1, 1)
      }
    })
  })

  // PIECE SHAPE

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = "red"
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  document.querySelector("span").innerText = score

}

// PIECES MOVEMENT

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") {
    piece.position.x--
    if (checkCollision()) {
      piece.position.x++
    }
  }
  if (event.key === "ArrowRight") {
    piece.position.x++
    if (checkCollision()) {
      piece.position.x--
    }
  }
  if (event.key === "ArrowDown") {
    piece.position.y++
    if (checkCollision()) {
      piece.position.y--
      solidifyPiece()
      removeRows()
    }
  }

  // ROTATION

  if(event.key === "ArrowUp") {
    const rotatedPiece = []

    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = []

      for (let j = piece.shape.length -1; j >= 0; j--) {
        row.push(piece.shape[j][i])
      }
      rotatedPiece.push(row)
    }
    const previousShape = piece.shape
    piece.shape = rotatedPiece
    if (checkCollision()){
      piece.shape = previousShape
    }
  }
})

// CHECK COLLISION

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

// SOLIDIFY PIECE

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })
  // Reset position
  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2)
  piece.position.y = 0
  // Get random shape
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  // Gameover
  if (checkCollision()) {
    window.alert("Game over!")
    board.forEach((row) => row.fill(0))
  }
}

// REMOVE ROWS 

function removeRows() {
  const rowsToRemove = []
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      rowsToRemove.push(y)
    }
  })
  rowsToRemove.forEach(y => {
    board.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    board.unshift(newRow)
    score += 10
  })
}

const $section = document.querySelector("section")

$section.addEventListener("click", () => {
  update()
  $section.remove()
})



