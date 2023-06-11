const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isGameRunning = true;
const gridSize = 20;
const gridCount = canvas.width / gridSize;
const snake = {
    body: [{ x: 0, y: 0 }],
    dx: gridSize,
    dy: 0,
    color: 'green',
    status: 'RIGHT',
    apples: 0,
};
const apple = {
    x: 100,
    y: 100,
    width: gridSize,
    height: gridSize,
    color: 'red',
};

apple.x = Math.floor(Math.random() * gridCount);
apple.y = Math.floor(Math.random() * gridCount);

function drawSnake(x = 0, y = 0, width = gridSize, height = gridSize, color = 'green') {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function restartGame() {
    snake.body = [{ x: 0, y: 0 }];
    snake.dx = 1;
    snake.dy = 0;
    snake.apples = 0;
    apple.x = Math.floor(Math.random() * (canvas.width / gridSize));
    apple.y = Math.floor(Math.random() * (canvas.height / gridSize));

    isGameRunning = true;
    moveSnake();
}

function drawSnakeBody() {
    const { body } = snake;
    for (let i = 1; i < body.length; i++) {
        drawSnake(body[i].x, body[i].y);
    }
}

function increaseSnakeLength() {
    const { body } = snake;
    const lastBodyPart = body[body.length - 1];
    const newBodyPart = { x: lastBodyPart.x, y: lastBodyPart.y };
    body.push(newBodyPart);
}

function drawApple(x = 0, y = 0, width = gridSize, height = gridSize, color = 'red') {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawGrid() {
    context.strokeStyle = 'lightgray';
    for (let i = 0; i < gridCount; i++) {
        context.beginPath();
        context.moveTo(i * gridSize, 0);
        context.lineTo(i * gridSize, canvas.height);
        context.stroke();

        context.beginPath();
        context.moveTo(0, i * gridSize);
        context.lineTo(canvas.width, i * gridSize);
        context.stroke();
    }
}

function moveSnake() {
    const { body } = snake;
    const head = { x: body[0].x + snake.dx, y: body[0].y + snake.dy };
    body.unshift(head);

    if (snake.apples > 0) {
        snake.apples--;
    } else {
        body.pop();
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        isGameRunning = false;
        alert('Game over');
        return;
    }

    for (let i = 1; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            isGameRunning = false;
            alert('Game over');
            return;
        }
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake(head.x, head.y);
    drawSnakeBody();
    drawApple(apple.x * gridSize, apple.y * gridSize);
    drawGrid();

    if (head.x === apple.x * gridSize && head.y === apple.y * gridSize) {
        increaseSnakeLength();
        apple.x = Math.floor(Math.random() * (canvas.width / gridSize));
        apple.y = Math.floor(Math.random() * (canvas.height / gridSize));
        snake.apples++;
    }

    if (isGameRunning) {
        setTimeout(moveSnake, 100);
    }
}


function handleAction(event) {
    switch (event.keyCode) {
        case 37:
            if (snake.status !== 'RIGHT') {
                snake.dx = -gridSize;
                snake.dy = 0;
                snake.status = 'LEFT';
            }
            break;
        case 38:
            if (snake.status !== 'BOTTOM') {
                snake.dx = 0;
                snake.dy = -gridSize;
                snake.status = 'UP';
            }
            break;
        case 39:
            if (snake.status !== 'LEFT') {
                snake.dx = gridSize;
                snake.dy = 0;
                snake.status = 'RIGHT';
            }
            break;
        case 40:
            if (snake.status !== 'UP') {
                snake.dx = 0;
                snake.dy = gridSize;
                snake.status = 'BOTTOM';
            }
            break;
    }
}

window.onload = () => {
    moveSnake();
};

window.addEventListener('keydown', handleAction);
