// Obtener el canvas y su contexto
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

// Configuración del juego
canvas.width = 400;
canvas.height = 400;
const box = 20; // Tamaño del gusanito
let snake = [{ x: 200, y: 200 }]; // Posición inicial
let food = generateFood(); // Posición inicial de la comida
let direction = "RIGHT";
let score = 0;
let speed = 300; // Velocidad inicial (en milisegundos)
let gameInterval;

// Capturar las teclas para mover el gusanito
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Función para generar comida en una posición aleatoria
function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

// Función para actualizar el estado del juego
function updateGame() {
    let head = { ...snake[0] }; // Clonamos la cabeza

    // Movimiento en la dirección seleccionada
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // Verificar colisión con los bordes
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
        alert("Game Over! Puntuación: " + score);
        clearInterval(gameInterval);
        return;
    }

    // Verificar colisión con el propio cuerpo
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            alert("Game Over! Puntuación: " + score);
            clearInterval(gameInterval);
            return;
        }
    }

    // Agregar la nueva cabeza
    snake.unshift(head);

    // Si come la comida, crece y se genera nueva comida
    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
        increaseSpeed();
    } else {
        snake.pop(); // Elimina la última parte de la cola (para que no crezca infinitamente)
    }
}

// Función para aumentar la velocidad gradualmente
function increaseSpeed() {
    if (speed > 50) { // Límite mínimo de velocidad
        speed -= 10; // Reduce el tiempo entre movimientos
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, speed);
    }
}

// Función para dibujar el juego en el canvas
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el canvas

    // Dibujar la comida
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dibujar el gusanito
    ctx.fillStyle = "green";
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // Mostrar la puntuación
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Puntuación: " + score, 10, 20);
}

// Bucle del juego
function gameLoop() {
    updateGame();
    drawGame();
}

// Iniciar el juego
gameInterval = setInterval(gameLoop, speed);
