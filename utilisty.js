class Songo{
  constructor(){
      this.coteJoueur1 = [5,5,5,5,5,5,5];
      this.coteJoueur2 = [5,5,5,5,5,5,5];
      this.pointJoueur1 = 0;
      this.pointJoueur2 = 0;
      this.etat1 = true;
      this.etat2 = false;
  }

  estBloquer(id){
      if(id == 1){
          if(this.etat1 == false)
              return true;
          return false;
      }else{
          if(this.etat2 == false)
             return true;
          return false;
      }
  }

  async distribuer(id){
      if(!this.estBloquer(id)){
          if(id == 1){
              this.etat1 = true;
              this.etat2 = false;
              const tablesPlayer1 = document.getElementsByClassName('joueur1');
              const tablesPlayer2 = document.getElementsByClassName('joueur2');
              await waitClikedPlayer().then(button=>{
                   shareValueButton(button,id,this,tablesPlayer1,tablesPlayer2);
              });
              this.etat1 = false;
              this.etat2 = true;
         }else{
          this.etat1 = false;
          this.etat2 = true;
          const tablesPlayer1 = document.getElementsByClassName('joueur1');
          const tablesPlayer2 = document.getElementsByClassName('joueur2');
          let indice = Math.floor(Math.random()*7);
          let valeur = tablesPlayer2[indice].innerText;
          while(valeur == 0){
              indice = Math.floor(Math.random()*7);
              valeur = tablesPlayer2[indice].innerText;
          }
          shareValueButton(tablesPlayer2[indice],id,this,tablesPlayer1,tablesPlayer2);
          this.etat2 = false;
          this.etat1 = true;
        }
      }
  }
  async  prise(idj) {
    let cote = idJ === 1 ? this.coteJoueur1 : this.coteJoueur2;
    let coteAdv = idJ === 1 ? this.coteJoueur2 : this.coteJoueur1;
    let pointJoueur = idJ === 1 ? this.pointJoueur1 : this.pointJoueur2;
    let idx, indexInit, nbPions=0;
    let dernierIdx=-1;

    do {
      idx = Math.floor(Math.random() * 7);
    } while (cote[idx] < 2);

    let prevIndex = (idx == 0) ? 6 : idx-1;
    for (let i=prevIndex; cote[idx]>0; i=(i==0)? 6:i-1){
      cote[i]++;
      cote[idx]--;
      dernierIdx = i;
      nbPions++;
    }
    //si la dernière case remplie coté joueur 1 est égale à 1, 
    //prendre également les graines adverses dans la case correspondante
    let i;
    if ( i<7 && cote[i]==1){
        pointJoueur += 1 + coteAdv[i];
        cote[i] = 0;
        coteAdv[i] = 0;
    }

    if (idJ === 1) {
      this.coteJoueur1 = cote;
      this.coteJoueur2 = coteAdv;
      this.pointJoueur1 = pointJoueur;
    } else {
      this.coteJoueur2 = cote;
      this.coteJoueur1 = coteAdv;
      this.pointJoueur2 = pointJoueur;
    }

    return dernierIdx;
  }
  
}

function waitClikedPlayer(){
  const buttonPlayer = document.getElementsByClassName('joueur1');
  return new Promise(resolve=>{
      for(const button of buttonPlayer){
          button.addEventListener('click',()=>{
              resolve(button);
          });
      }
      requestAnimationFrame(waitClikedPlayer);
  });
}

function shareValueButton(buttonCliked,id,songo,tablesPlayer1,tablesPlayer2){
  if(!songo.estBloquer(id)){
      let tabConcat,tabReverse,trueIndice,valeur;
      tabReverse = songo.coteJoueur1;
      tabReverse.reverse();
      let indice = parseInt(buttonCliked.attributes.id.nodeValue);
      valeur = parseInt(buttonCliked.innerText);
      buttonCliked.innerText ="0";
      if(id == 1){
          trueIndice = 6 - indice; 
          tabConcat = tabReverse.concat(songo.coteJoueur2);
      }else{
          trueIndice = indice;
          tabConcat = songo.coteJoueur2.concat(tabReverse);
      }
      tabConcat[trueIndice] = 0;
      let reste = 0;
      for(let i = 1 ; i <= valeur ; i++){
          reste =(trueIndice+1)%tabConcat.length;
          if(id == 1){
              if(reste == (6 - indice)){
                  trueIndice = 7;
                  tabConcat[reste] += 1;
              }else{
                  tabConcat[reste] += 1;
                  trueIndice++;
              }
          }else{
              if(reste == indice){
                  trueIndice = 7;
                  tabConcat[trueIndice] += 1;
              }else{
                  tabConcat[reste] += 1;
                  trueIndice++;
              }
          }
      }
      for(let i = 0 ; i< tabConcat.length ; i++){
          if(id == 1){
              if(i<7){
                  songo.coteJoueur1[i] = tabConcat[i];
              }else{
                  songo.coteJoueur2[i-7] = tabConcat[i]; 
              }
          }else{
              if(i<7){
                  songo.coteJoueur2[i] = tabConcat[i];
              }else{
                  songo.coteJoueur1[i-7] = tabConcat[i]; 
              } 
          }
      }
      songo.coteJoueur1.reverse();
      for(let i = 0 ; i <songo.coteJoueur1.length ; i++){
          tablesPlayer1[i].innerText = songo.coteJoueur1[i];
      }
      for(let i = 0 ; i <songo.coteJoueur2.length ; i++){
          tablesPlayer2[i].innerText = songo.coteJoueur2[i]
      }
  }
}

function waitDistribuer(id , songo){
  return new Promise(resolve=>{
      songo.distribuer(id);
      resolve(songo.etat1);
  });
}

async function play(){
  let jeu = new Songo();
  for(let i = 0 ; i < 10 ; i++){
      if(!jeu.estBloquer(1))
       await jeu.distribuer(1);
      else
         await jeu.distribuer(2);
      console.log(i);
  } 
  async function play() {
    let gameState = await getGameState();
    let jeu = new Songo(gameState);
    for (let i = 0; i < 10; i++) {
      if (!jeu.estBloquer(1)) {
        await jeu.distribuer(1);
        await updateGameState(gameState);
        gameState = await getGameState();
      } else {
        await jeu.distribuer(2);
        await updateGameState(gameState);
        gameState = await getGameStae();
      }
      console.log(i);
    }
  }
  
}
play();