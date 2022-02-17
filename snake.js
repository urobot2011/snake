//X축 방향
var X_MOVE = 0;

//Y축 방향
var Y_MOVE = 1;

//맵 테이블 크기
var tableTileSize = 21; 

//뱀
var snake = new Array();

//사과
var apple = new Array();


var gameInterval;
var gameIntervalSpeed = 150;

// 상하좌우 이동
function moveNum(obj){
    switch(obj.getAttribute("id")){
        case "ArrowUp":up();  break; //up
        case "ArrowDown":down(); break; //down
        case "ArrowLeft":left(); break;//left
        case "ArrowRight":right(); break; //right
    }
}

// 게임 초기화
function init(){
    var score = document.getElementById("score");
    score.innerHTML=0;
    
    gameIntervalSpeed = 150;
    X_MOVE = 0; // 좌우 방향 초기화
    Y_MOVE = 1; // 위아래 방향 초기화
    
	initTable();
	initApple();
    initSnake();
   
}

//맵 테이블 초기화
function initTable(){
    var tableCode = '';
    for(var i=0; i<tableTileSize; i++) {
        tableCode += '<tr>';

        var rowCode = '';
        for(var j=0; j<tableTileSize; j++) {
            rowCode += '<td id="tile'+i+'_'+j+'"></td>';
        }

        tableCode += rowCode + '</tr>';
        document.getElementById("snakeGamearea").innerHTML = tableCode;
    }
}

// 뱀 초기화
function initSnake(){
    snake = [];
    snake.push([0,1]);
    drawSnake();
}

//뱀 그리기
function drawSnake() {

    var score = parseInt(document.getElementById("score").innerHTML);
    
    var state = '';
    var snakes =  document.getElementsByClassName("s_t");
	$('.s_t_e_r').removeClass('s_t_e_r');
	$('.s_t_e_l').removeClass('s_t_e_l');
	$('.s_t_e_d').removeClass('s_t_e_d');
	$('.s_t_e_u').removeClass('s_t_e_u');
	$('.s_t_i_r').removeClass('s_t_i_r');
	$('.s_t_i_l').removeClass('s_t_i_l');
	$('.s_t_i_d').removeClass('s_t_i_d');
	$('.s_t_i_u').removeClass('s_t_i_u');
	$('.s_t').removeClass('s_t');
	
	var snakeLength = snake.length;
	
    for(var i=0;i<snakeLength;i++) {
    	if(i == 0) {
			document.getElementById("tile"+snake[i][0]+"_"+snake[i][1]).classList.add('s_t_e_'+방향());
		} else if(i == snakeLength-1) {
			document.getElementById("tile"+snake[i][0]+"_"+snake[i][1]).classList.add('s_t_i_'+방향());
		} else {
			document.getElementById("tile"+snake[i][0]+"_"+snake[i][1]).classList.add('s_t');
		}

           if(document.getElementById("tile"+snake[i][0]+"_"+snake[i][1]).classList.contains('apple')){
           score = score + 100;
            document.getElementById("score").innerHTML = score; //점수 반영
            apple.pop();
            initApple();
            //뱀 꼬리 늘리기
            state = 'eat';
            //뱀꼬리 3개 마다 속도 증가
            if(snakeLength % 3 == 0){
            	setGameIntervalSpeed();
            }
        }
    }
    return state;
}

// 게임 시작
function start(){
	document.getElementById("intro").style.display = 'none';
	document.getElementById("gamearea").style.display = 'block';
	init();
	gameInterval = setInterval(move, gameIntervalSpeed);
}

function setGameIntervalSpeed(){
	console.log("speedUp")
	gameIntervalSpeed = gameIntervalSpeed - 10;
	clearInterval(gameInterval);
	gameInterval = setInterval(move,gameIntervalSpeed);
}

function end() {
	clearInterval(gameInterval);
	var score = document.getElementById("score").innerHTML;
	var bestScore = document.getElementById("bestScore").innerHTML;
	
	alert("score : "+ score);
	
	if(parseInt(bestScore) < parseInt(score)){
		localStorage.removeItem("snake_best_score");
		localStorage.setItem("snake_best_score", score);
		document.getElementById("bestScore").innerHTML = score;		
	}
	
	document.getElementById("intro").style.display = 'block';
	document.getElementById("gamearea").style.display = 'none';
	document.getElementById("score").innerHTML = "0";
}

// 숫자 랜덤 생성
function randomNum(min,max){
    var ranNum = Math.floor(Math.random()*(max-min+1)) + min;
    return ranNum;
}

//사과 초기화
function initApple(){
    var x;
    var y;

    do{
         x = randomNum(0,tableTileSize-1);
         y = randomNum(0,tableTileSize-1);
    } while(document.getElementById("tile"+x+"_"+y).classList.contains("s_t")); // 뱀이랑 겹치면 다시

    apple = [];
    apple.push([x, y]);
    drawApple();
}

//사과 생성
function drawApple() {
    var apples =  document.getElementsByClassName("apple");
    
	while (apples.length){
		apples[0].classList.remove('apple');	
	}
	
    for(var i=0;i<apple.length;i++) {
    	document.getElementById("tile"+apple[i][0]+"_"+apple[i][1]).classList.add("apple");
    }
}

// 왼쪽
function right(){
    if(Y_MOVE == 0) return;
    X_MOVE = 1;
    Y_MOVE = 0;
}

//오른쪽
function left(){
    if(Y_MOVE == 0) return;
    X_MOVE = -1;
    Y_MOVE = 0;	
}
//아래
function down(){
    if(X_MOVE == 0) return;
    X_MOVE = 0;
    Y_MOVE = 1;
}

//위
function up(){
    if(X_MOVE == 0) return;
    X_MOVE = 0;
    Y_MOVE = -1;
}

function 방향(){
    if(X_MOVE == 1 && Y_MOVE == 0) return "r";
	if(X_MOVE == -1 && Y_MOVE == 0) return "l";
	if(X_MOVE == 0 && Y_MOVE == 1) return "d";
	if(X_MOVE == 0 && Y_MOVE == -1) return "u";
}

function move() {
    var head = new Array();
    head[0] = snake[0][0];
    head[1] = snake[0][1];

    // 벽 체크
    var tmp = head[0]+1*Y_MOVE;
    if(tmp >= 0 && tmp < tableTileSize) {
        head[0] = tmp;
    }else {
        end();
        return;
    }

    tmp = head[1]+1*X_MOVE;
    if(tmp >= 0 && tmp < tableTileSize) {
        head[1] = tmp;
    }else {
        end();
        return;
    }

    // 몸통 충돌 체크
    if(document.getElementById('tile'+head[0]+'_'+head[1]).classList.contains('s_t')){
        end();
        return;                    
    }
    
    snake.unshift(head);

    if(drawSnake() != 'eat') {
        snake.pop();
    }
}
