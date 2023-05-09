class Rover {
    constructor(position, direction, grid) {
        this.position = position
        this.direction = direction
        this.grid = grid
    }

    getCurrentPosition() {
        return this.position
    }

    getCurrentDirection() {
        return this.direction
    }

    followTheseOrders(orders) {
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i]
            switch (order) {
                case 'M':
                    this.move()
                    break
                case 'B':
                    this.moveBackward()
                    break
                case 'L':
                    this.turnLeft()
                    break
                case 'R':
                    this.turnRight()
                    break
                default:
                    throw new Error(`Invalid order: ${order}`)
            }
        }
    }

    move() {
        const newPosition = this.getNewPosition()
        if (this.isValidPosition(newPosition)) {
            this.position = newPosition
        } else {
            throw new Error('Obstacle detected')
        }
    }

    moveBackward() {
        const newPosition = this.getNewPositionBackward()
        if (this.isValidPosition(newPosition)) {
            this.position = newPosition
        } else {
            throw new Error('Obstacle detected')
        }
    }

    turnLeft() {
        const directions = ['N', 'W', 'S', 'E']
        const currentIndex = directions.indexOf(this.direction)
        this.direction = directions[(currentIndex + 1) % directions.length]
    }

    turnRight() {
        const directions = ['N', 'E', 'S', 'W']
        const currentIndex = directions.indexOf(this.direction)
        this.direction = directions[(currentIndex + 1) % directions.length]
    }

    getNewPosition() {
        const { x, y } = this.position
        let newX, newY

        switch (this.direction) {
            case 'N':
                newY = y - 1
                if (newY < 0) {
                    newY = this.grid.height - 1
                }
                return { x, y: newY }
            case 'E':
                newX = x + 1
                if (newX >= this.grid.width) {
                    newX = 0
                }
                return { x: newX, y }
            case 'S':
                newY = y + 1
                if (newY >= this.grid.height) {
                    newY = 0
                }
                return { x, y: newY }
            case 'W':
                newX = x - 1
                if (newX < 0) {
                    newX = this.grid.width - 1
                }
                return { x: newX, y }
            default:
                throw new Error(`Invalid direction: ${this.direction}`)
        }
    }

    getNewPositionBackward() {
        const { x, y } = this.position
        let newX, newY

        switch (this.direction) {
            case 'N':
                newY = y + 1
                if (newY >= this.grid.height) {
                    newY = 0
                }
                return { x, y: newY }
            case 'E':
                newX = x - 1
                if (newX < 0) {
                    newX = this.grid.width - 1
                }
                return { x: newX, y }
            case 'S':
                newY = y - 1
                if (newY < 0) {
                    newY = this.grid.height - 1
                }
                return { x, y: newY }
            case 'W':
                newX = x + 1
                if (newX >= this.grid.width) {
                    newX = 0
                }
                return { x: newX, y }
            default:
                throw new Error(`Invalid direction: ${this.direction}`)
        }
    }

    isValidPosition(position) {
        const { width, height, obstacles } = this.grid
        const { x, y } = position
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return false
        }
        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i]
            if (obstacle.x === x && obstacle.y === y) {
                return false
            }
        }
        return true
    }
}

const rover = new Rover({ x: 0, y: 0 }, 'N', { width: 6, height: 6, obstacles: [{ x: 2, y: 1 }, { x: 4, y: 4 }, { x: 0, y: 3 }] })

const forwardBtn = document.getElementById('forward-btn')
const backwardBtn = document.getElementById('backward-btn')
const leftBtn = document.getElementById('left-btn')
const rightBtn = document.getElementById('right-btn')
const positionDiv = document.getElementById('position')

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            rover.move()
            drawRover()
            break
        case 'ArrowDown':
            rover.moveBackward()
            drawRover()
            break
        case 'ArrowLeft':
            rover.turnLeft()
            drawRover()
            break
        case 'ArrowRight':
            rover.turnRight()
            drawRover()
            break
        default:
            break
    }
})

forwardBtn.addEventListener('click', (event) => {
    event.preventDefault()
    rover.move()
    drawRover()
})

backwardBtn.addEventListener('click', (event) => {
    event.preventDefault()
    rover.moveBackward()
    drawRover()
})

leftBtn.addEventListener('click', (event) => {
    event.preventDefault()
    rover.turnLeft()
    drawRover()
})

rightBtn.addEventListener('click', (event) => {
    event.preventDefault()
    rover.turnRight()
    drawRover()
})

const canvas = document.getElementById('planet')
const ctx = canvas.getContext('2d')

const roverImg = new Image()
roverImg.src = 'rover.png'

const roverSize = { width: 100, height: 100 }

function drawRover() {
    const { x, y } = rover.getCurrentPosition()
    const direction = rover.getCurrentDirection()

    // Clear previous rover position
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw new rover position
    const roverX = x * (canvas.width / 6) + (canvas.width / 6 - roverSize.width) / 2
    const roverY = y * (canvas.height / 6) + (canvas.height / 6 - roverSize.height) / 2

    // Draw an arror pointing North that changes direction depending on the rover's direction
    ctx.beginPath()
    ctx.moveTo(roverX + roverSize.width / 2, roverY + roverSize.height / 2)
    switch (direction) {
        case 'N':
            ctx.lineTo(roverX + roverSize.width / 2, roverY)
            ctx.lineTo(roverX + roverSize.width / 2 - 10, roverY + 10)
            ctx.moveTo(roverX + roverSize.width / 2, roverY)
            ctx.lineTo(roverX + roverSize.width / 2 + 10, roverY + 10)
            break
        case 'E':
            ctx.lineTo(roverX + roverSize.width, roverY + roverSize.height / 2)
            ctx.lineTo(roverX + roverSize.width - 10, roverY + roverSize.height / 2 - 10)
            ctx.moveTo(roverX + roverSize.width, roverY + roverSize.height / 2)
            ctx.lineTo(roverX + roverSize.width - 10, roverY + roverSize.height / 2 + 10)
            break
        case 'S':
            ctx.lineTo(roverX + roverSize.width / 2, roverY + roverSize.height)
            ctx.lineTo(roverX + roverSize.width / 2 - 10, roverY + roverSize.height - 10)
            ctx.moveTo(roverX + roverSize.width / 2, roverY + roverSize.height)
            ctx.lineTo(roverX + roverSize.width / 2 + 10, roverY + roverSize.height - 10)
            break
        case 'W':
            ctx.lineTo(roverX, roverY + roverSize.height / 2)
            ctx.lineTo(roverX + 10, roverY + roverSize.height / 2 - 10)
            ctx.moveTo(roverX, roverY + roverSize.height / 2)
            ctx.lineTo(roverX + 10, roverY + roverSize.height / 2 + 10)
            break
        default:
            break
    }
    ctx.strokeStyle = 'black'
    ctx.stroke()

    // draw the obstacles
    const obstacles = rover.grid.obstacles
    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i]
        const obstacleX = obstacle.x * (canvas.width / 6) + (canvas.width / 6 - roverSize.width) / 2
        const obstacleY = obstacle.y * (canvas.height / 6) + (canvas.height / 6 - roverSize.height) / 2
        ctx.fillStyle = 'black'
        ctx.fillRect(obstacleX, obstacleY, roverSize.width, roverSize.height)
    }

    ctx.drawImage(roverImg, roverX, roverY, roverSize.width, roverSize.height)
}

// prevent key scrolling
window.addEventListener('keydown', function (e) {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault()
    }
}, false)

window.onload = () => {
    drawRover()
}
