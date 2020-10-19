places = places.filter(place=>{
    return place.MGLSDE_LOC !== ""
  })
  let map;
  function initMap() {
    let gameOver=false
    let scoreCount = 0
    let currentMarker
    let targetMarker
    let distanceLine
    let endInfo
  
    const newGame = document.getElementById('newGame')
    const submit = document.getElementById('submit')
    const target = document.getElementById('target')
    const desc = document.getElementById('desc')
    const lastScore = document.getElementById('lastScore')
    const totalScore = document.getElementById('totalScore')
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 31, lng: 35 },
      zoom: 8,
      styles:[{
        featureType: "all",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      }],
    });
  
    function startNewGame(){
      gameOver = false
      clearMarker(targetMarker)
      currentMarker&&currentMarker.setDraggable(true)
      distanceLine&&distanceLine.setVisible(false)
      endInfo&&endInfo.close()
      let randomIndex = Math.round(Math.random()*places.length)
      let newTarget = places[randomIndex]
      target.innerText = newTarget.MGLSDE_LOC
      desc.innerText = newTarget.MGLSDE_L_3
      
      targetPosition = new google.maps.LatLng(newTarget.Y,newTarget.X,)
      targetMarker = placeMarker(targetPosition,false,true)
    }
    
    async function checkSolution(){
      if(gameOver){return}
      gameOver = true
      currentMarker.setDraggable(false)
      targetMarker.setMap(map)
      targetMarker.set
      map.setZoom(8)
      await map.panTo(currentMarker.getPosition())
      distanceLine = new google.maps.Polyline({
        path: [
          targetMarker.getPosition(),
          currentMarker.getPosition()
        ], 
        map: map
      });
      console.log(distanceLine)
          
      const distance = (google.maps.geometry.spherical
      .computeDistanceBetween(
        currentMarker.getPosition(),
        targetMarker.getPosition()
      )/1000).toFixed(2)
      console.log(distance)
      endInfo = new google.maps.InfoWindow({
        content:`You missed by ${distance<20?'just':''} ${distance} KM!
        ${distance<10?'amazing!':''}`,
      })
      endInfo.open(map,targetMarker)
      console.log(score(distance))
      lastScore.innerText=score(distance)
      scoreCount += score(distance)
      totalScore.innerText = scoreCount
    }
  
    function placeMarker(location,visible=true,fixed=false) {
        const marker = new google.maps.Marker({
            position: location, 
            map: visible?map:null,
            draggable:!fixed,
        });
        return marker
    }
  
    function clearMarker(marker){
      marker&&marker.setMap(null)
    }
    
    function score(distance){
      let score
        if( distance<5){
          score = 10
        }else if( distance<10){
          score = 8
        }else if( distance<25){
          score = 6
        }else if( distance<50){
          score = 4
        }else if( distance<75){
          score = 2
        }else if( distance<=100){
          score = 1
        }else{
          score = 0;
        }
      return score
    }
    startNewGame()
    currentMarker = placeMarker(
      new google.maps.LatLng(31.5641403209608,34.8414581270788)
    )
    
    newGame.addEventListener('click',startNewGame)
    submit.addEventListener('click',checkSolution)
  
    google.maps.event.addListener(map, 'click', function(e) {
    if(gameOver){return}
      clearMarker(currentMarker)
      currentMarker = placeMarker(e.latLng);
    });
  
  
  }