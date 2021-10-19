
const sonidos = document.getElementById('song');



const grid =document.querySelector('.grid')
const resultSDisplay = document.querySelector('.results')
let currentdefensorindex = 202 // indica la posicion del defensor 
let width = 15 //hace que los aliens no transpasen los muros
let direccion = 1
let invasoresId
let goingRight = true
let aliensRemovidos =[]
let results = 0

for (let i = 0; i < 255; i++) { //multiplica los div
    const cuadrado = document.createElement('div')
    grid.appendChild(cuadrado)
}

const cuadrados = Array.from(document.querySelectorAll('.grid div'))

const alienInvasion = [ //se colocan las posiciones de los aliens
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw(){
    for (let i = 0; i < alienInvasion.length; i++){
        if(!aliensRemovidos.includes(i)){  //se creo la funcion para qie desaparezcan los aliens al disparar
            cuadrados[alienInvasion[i]].classList.add('invasion')
        }
    }
}

function remove(){ //posiciona a los aliens  correctamente 
    for (let i = 0; i < alienInvasion.length; i++){
        cuadrados[alienInvasion[i]].classList.remove('invasion')  
    }

}

draw()

cuadrados[currentdefensorindex].classList.add('defensor') //Agrega al defensor

function moveDefensor(e) {
    cuadrados[currentdefensorindex].classList.remove('defensor')//hace que al moverse de isquierda y derecha borre la marca
    switch(e.key) {
        case 'ArrowLeft':
            if(currentdefensorindex % width !== 0) currentdefensorindex -=1
            break
        case 'ArrowRight':
            if(currentdefensorindex % width < width -1) currentdefensorindex +=1
            break
    }
    cuadrados[currentdefensorindex].classList.add('defensor')
}
document.addEventListener('keydown', moveDefensor)

function moveInvasores(){
    const leftEdge = alienInvasion[0] % width === 0
    const rightEdge = alienInvasion[alienInvasion.length -1] % width === width -1
    remove()

    if(rightEdge && goingRight){ // ayuda a que los aliens no traspase la pared izquierda, probocando que choque, avanzando a la linea de abajo y continiar hacia la derecha
        for(let i = 0; i < alienInvasion.length; i++){
            alienInvasion[i] += width +1
            direccion = -1
            goingRight = false
        }
    }

    if(leftEdge && !goingRight){ // ayuda a que los aliens no traspase la pared derecha, probocando que choque, avanzando a la linea de abajo y continiar hacia la izquierda
        for(let i = 0; i < alienInvasion.length; i++){
            alienInvasion[i] += width -1
            direccion = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvasion.length; i++)
    alienInvasion[i] += direccion
    draw()

    if (cuadrados[currentdefensorindex].classList.contains('invasion', 'defensor')) { //se indica que cuando los aliens choquen con el defensor, el juego se acaba
        resultSDisplay.innerHTML = 'GAME OVER'
        clearInterval(invasoresId)
    }

    for (let i = 0; i < alienInvasion.length; i++){
        if(alienInvasion[i] > (cuadrados.length)) {
            resultSDisplay.innerHTML = 'GAME OVER'
            clearInterval(invasoresId)
        }
    }
    if (aliensRemovidos.length === alienInvasion.length){
        resultSDisplay.innerHTML = 'FELICIDADES, GANASTE!'
        clearInterval(invasoresId)
    }
}
invasoresId = setInterval(moveInvasores, 300) // indica la velocidad en la que se mueve los aliens 

function disparo(e) { // se agrega la funcion para que el defensor dispare 
    let laserId
    let currentLaserIndex = currentdefensorindex
    function moveLaser () {
        cuadrados[currentLaserIndex].classList.remove('laser') //al momento de disparare no quede marcada la bala
        currentLaserIndex -= width
        cuadrados[currentLaserIndex].classList.add('laser')


        //se agrega la funcion de deteccion de enemigos al impactar
        if (cuadrados[currentLaserIndex].classList.contains('invasion')){
            cuadrados[currentLaserIndex].classList.remove('laser')
            cuadrados[currentLaserIndex].classList.remove('invasion')
            cuadrados[currentLaserIndex].classList.add('boom')

            // se crea la funcion de que impacte solo a un enemigo 
            setTimeout(()=> cuadrados[currentLaserIndex].classList.remove('boom'), 300)
            clearInterval(laserId)

            const invasionRemoval = alienInvasion.indexOf(currentLaserIndex)
            aliensRemovidos.push(invasionRemoval)
            results++
            resultSDisplay.innerHTML = results
            console.log(aliensRemovidos)
            
        }
    }
    switch(e.key) { //se selecciona la tecla y velocidad con la cual quieras disparar
        
        case 'ArrowUp':
            laserId = setInterval(moveLaser, 400) 
      }
    
    
}

document.addEventListener('keydown', disparo)


