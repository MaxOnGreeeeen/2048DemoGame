//to do:
// create a function, which controls the spawn of blocks
// spawn of block "2" has the probability of 80%
// spawn of block "4" has the probability of 20%

// block are spawn in any available area

//functions which were not introduced:
//1.show time and amount of moves in modal window after game over
//2.undo is not working properly
//3.colors were chosen randomly,
//it would be great to use colors from the original game
const colorOfBigBlocks = "white";
const colorOfSmallBlocks = "#8d5c5c";
const startButton = document.getElementById("startBtn");
const timeValue = document.getElementById("time");
const userCurrentScore = document.getElementById("scoreValue");
const bestScore = document.getElementById("bestScoreValue");
const undoButton = document.getElementById("undo");
const modal = document.getElementById('myModal');
const earnedScore = document.getElementById("earnedScore");
const restartButton = document.getElementById("restartButton");
let initialValueOfSeconds = 0, initialValueOfMinutes = 0, interval,
currentTime, scoreValue = 0, initialState = true, randomIdValue,
isItFirstClick = true, amountOfMoves = 0;
let matrixOfValues = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
let previousStateOfMatrix;

const matrixOfRandomValues = [2, 2, 2, 2, 2, 2, 2, 4, 2, 4];

const styles = {
    2: ["#b1f8eb", colorOfSmallBlocks],
    4: ['#6adcca', colorOfSmallBlocks],
    8: ['rgb(242, 177, 121)', colorOfBigBlocks],
    16: ['rgb(245, 149, 99)', colorOfBigBlocks],
    32: ['rgb(246, 126, 95)', colorOfBigBlocks],
    64: ['brown',colorOfBigBlocks],
    128: ['#5e9642',colorOfBigBlocks],
    256: ['#337315', colorOfBigBlocks],
    512: ['#5bc429', colorOfBigBlocks],
    1024: ['#5bc429', colorOfBigBlocks],
    2048: ['#295014', colorOfBigBlocks]
}
window.addEventListener('DOMContentLoaded', () => {
    // start using application
        return loadPage();
    });
//
class PersonalRecord {
    currentObject = null;
    bestScore = 0;
    time = "";
    moves = 0;

    constructor(bestScore, time, moves) {
        this.bestScore = bestScore;
        this.time = time;
        this.moves = moves;
    }
    addToStorage () {
        this.currentObject = {
            bestScore : this.bestScore,
            time : this.time,
            moves : this.moves
        }
        let newObject = JSON.stringify(this.currentObject);
        sessionStorage.setItem((sessionStorage.length).toString(), newObject);
    }
}

const loadPage = () =>{
    addEventListener("keydown", keyPressListener);
    if(sessionStorage.length !== 0) bestScore.innerText = findTheBestScore().toString();

        startButton.addEventListener("click", (event) =>{
            event.preventDefault();
            try{
                nullifyGameParameters();
            }catch (e){
                startButton.innerHTML = "Error";
            }
        }
    );
    undoButton.addEventListener("click", drawTheField);

    return startFunction();
}

const findTheBestScore = () => {
    let bestScoreObj, bestScoreValue, optionToAccess = "bestScore", maxValue = 0;
    for (let i = 0; i < sessionStorage.length; i++) {
        bestScoreObj = JSON.parse(sessionStorage.getItem(i.toString()));
        bestScoreValue =  bestScoreObj[optionToAccess];
        if (bestScoreValue > maxValue) maxValue = bestScoreValue;
    }return maxValue;
}
//spawns the first "2" block
//at the beginning

//initialize the first block
const startFunction = () => {
    spawnRandomBlock(true);
}

const clearTheDesk = () =>{
    for (let i = 0; i < matrixOfValues.length; i++){
        for (let j = 0; j < matrixOfValues.length; j++){
            let anIdOfBlock = "cell" + i.toString() + j.toString();
            let buttonToClear = document.getElementById(anIdOfBlock);
            buttonToClear.innerText = ""; buttonToClear.style.background = "#cdc1b4";
        }
    }
}
const nullifyGameParameters = () =>{
    addEventListener("keydown", keyPressListener);
    scoreValue = 0, amountOfMoves = 0, initialValueOfSeconds = 0, initialValueOfMinutes = 0,
        isItFirstClick = true,  currentTime = "";
    matrixOfValues = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
    userCurrentScore.innerText = scoreValue.toString();
    clearTheDesk();
    stopTimer();
    startFunction();
}
const drawTheField = () => {
    let valueOfBlock;
    for (let i = 0; i < matrixOfValues.length; i++){
        for (let j = 0; j < matrixOfValues.length; j++){
            let anIdOfBlock = "cell" + i.toString() + j.toString();
            let blockToDraw = document.getElementById(anIdOfBlock);
            valueOfBlock = previousStateOfMatrix[i][j];

            if (valueOfBlock !== 0){
                blockToDraw.innerText = valueOfBlock;
                blockToDraw.style.color = styles[valueOfBlock][1];
                blockToDraw.style.background = styles[valueOfBlock][0];
            }else {
                blockToDraw.innerText = "";
                blockToDraw.style.background  = "#cdc1b4";
            }
        }
    }
}

const spawnRandomBlock  = (isItFirstIteration) =>{
    let randomValue;
    const getRandomValueForColoring = getRandomElementOfMatrix();
    if( getRandomValueForColoring === undefined){
        if (checkForGameOver()){

            removeEventListener("keydown", keyPressListener);
            stopTimer();

            modal.style.display = "block";
            let scoreValueToDisplay = " " + scoreValue + " points";
            earnedScore.innerText = scoreValueToDisplay;

            restartButton.addEventListener("click", (event) =>{
                event.preventDefault();
                try{
                    modal.style.animationName = "change-opacity";
                    modal.style.animationDuration = "1s"
                    setTimeout(()=>{
                        modal.style.display = "none";
                        modal.style.animationName = "none";
                    }, 500);

                    nullifyGameParameters();

                }catch (e){
                    restartButton.innerText = e.valueOf().toString();
                }
            })

            let currentTime = timeValue.innerText.valueOf().toString()
            let personalRecord = new PersonalRecord(scoreValue, currentTime, amountOfMoves);
            personalRecord.addToStorage();
            bestScore.innerText =  findTheBestScore().toString();
            modal.style.display = "block";
        }
    }
    else{
        const firstElemToColor = document.getElementById("cell" + getRandomValueForColoring);
        if (isItFirstIteration) randomValue = 2;
        else randomValue = matrixOfRandomValues[Math.floor(Math.random()*10)];
        firstElemToColor.innerText = randomValue.toString();

        matrixOfValues[parseInt(getRandomValueForColoring.charAt(0))][parseInt(getRandomValueForColoring.charAt(1))] = randomValue;

        firstElemToColor.style.background = styles[randomValue][0];
        firstElemToColor.style.color = styles[randomValue][1];
        firstElemToColor.style.animationName = "spawn-block";
        firstElemToColor.style.animationDuration = "0.5s";
        setTimeout( () =>{
            firstElemToColor.style.animationName = "none";
        }, 500);
    }

}


const drawBlockAtId = (IDHorizontal, IDVertical, isItConnection) => {
    let newID = "cell" + IDHorizontal.toString() + IDVertical.toString();
    let blockToDraw = document.getElementById(newID);
    blockToDraw.innerText = matrixOfValues[IDHorizontal][IDVertical].toString();
    blockToDraw.style.background = styles[matrixOfValues[IDHorizontal][IDVertical]][0];
    blockToDraw.style.color = styles[matrixOfValues[IDHorizontal][IDVertical]][1];

    if(isItConnection){
        blockToDraw.style.animationName = "animate-connection";
        blockToDraw.style.animationDuration = "0.5s";
        setTimeout( () =>{
            blockToDraw.style.animationName = "none";
        }, 500);
    }
}
//new matrix is getting filled with new elements, which
//are need to be changed
//than new matrix is compared with the previous one
//after that new elements are drawn and animated

//spent here plenty of time
//trying to get rid of code duplicates

//after collapsing of blocks
//we need to make one more iteration
//of drawing
const moveBlocksToDirection = (direction) => {

    let indexHorizontal, maxCycleValue, maxIndexHorizontal, cycleValue;
    //this part is working
    //but spawn still works weird
        cycleValue = 0;
        maxCycleValue = matrixOfValues.length;
        for( cycleValue ; cycleValue < maxCycleValue; cycleValue++) {

            if (direction === "right" || direction === "down") {
                indexHorizontal = matrixOfValues.length - 1;
                maxIndexHorizontal = 0;
                for (indexHorizontal; indexHorizontal >= maxIndexHorizontal; indexHorizontal--) {
                    commonPartForCycles(cycleValue, indexHorizontal, direction);
                }
            } else {
                indexHorizontal = 0;
                maxIndexHorizontal = matrixOfValues.length;
                for (indexHorizontal; indexHorizontal < maxIndexHorizontal; indexHorizontal++) {
                    commonPartForCycles(cycleValue, indexHorizontal, direction);
                }
            }
        }

}
    const commonPartForCycles = (cycleValue, indexHorizontal, direction) => {
        let indexOfMoving, previousIndexState, isFree, conditionToGoAhead, lastValueToRich = -1, isItConnection = false;
        if (direction === "right" || direction === "down"){
            if (direction === "right") conditionToGoAhead = matrixOfValues[cycleValue][indexHorizontal] !== 0 && indexHorizontal !== matrixOfValues.length - 1 ;
            else conditionToGoAhead = matrixOfValues[indexHorizontal][cycleValue] !== 0  && indexHorizontal !== matrixOfValues.length - 1;
        }else{
            if (direction === "left") conditionToGoAhead = matrixOfValues[cycleValue][indexHorizontal] !== 0 && indexHorizontal !== 0;
            else conditionToGoAhead = matrixOfValues[indexHorizontal][cycleValue] !== 0  && indexHorizontal !== 0;
        }

        if(conditionToGoAhead){
            isFree = true;
            indexOfMoving = indexHorizontal;

            while(isFree && lastValueToRich !== indexOfMoving){

                if(direction === "right" || direction === "down") {
                    indexOfMoving++;
                    previousIndexState = indexOfMoving - 1;
                }else {
                    indexOfMoving--;
                    previousIndexState = indexOfMoving + 1;
                }
                if (direction === "right" || direction === "left"){
                    if (
                        matrixOfValues[cycleValue][indexOfMoving] === 0 ||
                        matrixOfValues[cycleValue][indexOfMoving] === matrixOfValues[cycleValue][previousIndexState]
                    ){

                        if (matrixOfValues[cycleValue][indexOfMoving] === 0 )
                            matrixOfValues[cycleValue][indexOfMoving] = matrixOfValues[cycleValue][previousIndexState];
                        else if (matrixOfValues[cycleValue][indexOfMoving] === matrixOfValues[cycleValue][previousIndexState]){
                            isItConnection = true;
                            matrixOfValues[cycleValue][indexOfMoving] *= 2;
                            scoreValue += matrixOfValues[cycleValue][indexOfMoving];
                            lastValueToRich = indexOfMoving;
                        } else {
                            isFree = false;
                        }

                        matrixOfValues[cycleValue][previousIndexState] = 0;
                        clearTheBlock(cycleValue, previousIndexState)
                        drawBlockAtId(cycleValue, indexOfMoving, isItConnection);

                        userCurrentScore.innerText = scoreValue;
                        isItConnection = false;

                    }else isFree = false;
                }
                else{
                    if (matrixOfValues[indexOfMoving][cycleValue] === 0 || matrixOfValues[indexOfMoving][cycleValue] === matrixOfValues[previousIndexState][cycleValue]){
                    //I've stopped here
                        //catch some condition
                        if (matrixOfValues[indexOfMoving][cycleValue] === 0 )  matrixOfValues[indexOfMoving][cycleValue] = matrixOfValues[previousIndexState][cycleValue];
                        else if(matrixOfValues[indexOfMoving][cycleValue] === matrixOfValues[previousIndexState][cycleValue]){
                            matrixOfValues[indexOfMoving][cycleValue] *= 2;
                            isItConnection = true;
                            scoreValue += matrixOfValues[indexOfMoving][cycleValue];
                            lastValueToRich = indexOfMoving;
                        }else{
                            isFree = false;
                        }
                        matrixOfValues[previousIndexState][cycleValue] = 0;
                        clearTheBlock(previousIndexState, cycleValue)
                        drawBlockAtId(indexOfMoving,  cycleValue, isItConnection)

                        userCurrentScore.innerText = scoreValue;
                        isItConnection = false;
                        if (indexOfMoving === 0 || indexOfMoving === matrixOfValues.length - 1) isFree = false;
                    }else isFree = false;
                }
            }
        }
    }

const clearTheBlock = (IDVertical, IDHorizontal) => {
    let elemID = "cell" + IDVertical.toString() + IDHorizontal.toString();
    let elementToClear = document.getElementById(elemID);
    elementToClear.innerText = "";
    elementToClear.style.background = "#cdc1b4";
}

//get an id of cell of matrix
//where new block will be spawned
const getRandomElementOfMatrix = () =>{
    let arrayOfIDs = [];
    let newID = "";
    if (initialState){
        randomIdValue = Math.floor(Math.random()*4).toString() + Math.floor(Math.random()*4).toString();
        initialState = false;
        return randomIdValue;
    }else{
        for (let i = 0; i < matrixOfValues.length; i++ ){
            for (let j = 0; j < matrixOfValues[i].length; j++){
                if (matrixOfValues[i][j] === 0) {
                    newID = i.toString() + j.toString();
                    arrayOfIDs.push(newID);
                }else continue;
            }
        }
        return arrayOfIDs[Math.floor(Math.random()*arrayOfIDs.length)];
    }

}
const checkForGameOver = () => {
    //check for vertical and horizontal moves
    for (let i = 0;  i < matrixOfValues.length; i++) {
        for ( let j = 0; j < matrixOfValues.length; j++){
            if( j === 0){
                if (matrixOfValues[i][j] === matrixOfValues[i][j + 1] ||
                 matrixOfValues[j][i] === matrixOfValues[j][i + 1]) return false;
                else continue;
            }else if ( j > 0 && j < matrixOfValues.length - 1){
                if (matrixOfValues[i][j] === matrixOfValues[i][j + 1] ||
                    matrixOfValues[i][j] === matrixOfValues[i][j - 1] ||
                    matrixOfValues[j][i] === matrixOfValues[j + 1][i] ||
                    matrixOfValues[j][i] === matrixOfValues[j - 1][i]) return false;
            }else{
                if (matrixOfValues[i][j] === matrixOfValues[i][j - 1] ||
                    matrixOfValues[j][i] === matrixOfValues[j - 1][i]) return false;
            }
        }
    }
    return true;
}
const keyPressListener = (event) =>{

    amountOfMoves++;
    if(isItFirstClick){
        clearInterval(interval);
        interval = setInterval(startTimer, 1000);
        isItFirstClick = false;
    }
    previousStateOfMatrix = [];
    let newValue = []
    for (let i = 0; i < matrixOfValues.length; i++){
        newValue = []
        for (let j = 0; j < matrixOfValues.length; j++){
            newValue.push(matrixOfValues[i][j]);
        }previousStateOfMatrix.push(newValue);
    }
    switch(event.key){
        case "ArrowLeft":  // if arrowLEFT is pressed
            moveBlocksToDirection("left");
            spawnRandomBlock(false);
            break;
        case "ArrowUp":   // if arrowTOP is pressed
            moveBlocksToDirection("up");
            spawnRandomBlock(false);
            break;
        case "ArrowRight":   // if arrowRIGHT is pressed
            moveBlocksToDirection("right");
            spawnRandomBlock(false);
            break;
        case "ArrowDown":   // if arrowDOWN is pressed
            moveBlocksToDirection("down");
            spawnRandomBlock(false);
            break;
    }

}
//function to start time counting
const startTimer = () =>{
    initialValueOfSeconds++;
    if (initialValueOfSeconds > 60) {
        initialValueOfSeconds = 0;
        initialValueOfMinutes ++;
    }
    if (initialValueOfMinutes > 0){
        currentTime = initialValueOfMinutes.toString() + "m" + " " + initialValueOfSeconds.toString() + "s";
    }
    else{
        currentTime =  initialValueOfSeconds.toString() + "s";
    }
    timeValue.innerText = "Time passed: " + currentTime;
}
const stopTimer = () => {
    clearInterval(interval);
    timeValue.innerText = "Time passed: ";
}