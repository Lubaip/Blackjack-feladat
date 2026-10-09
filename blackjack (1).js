let dealerSum = 0, yourSum = 0;
let dealerAceCount = 0, yourAceCount = 0;
let hidden, deck, canHit = true;

function buildDeck() {
  deck = [];
  for (const suit of ['C','D','H','S'])
    for (const rank of ['A','2','3','4','5','6','7','8','9','10','J','Q','K'])
      deck.push(`${rank}-${suit}`);
}
function shuffleDeck() {
  for (let i=deck.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [deck[i],deck[j]]=[deck[j],deck[i]];
  }
}
function getValue(card) {
  const rank=card.split('-')[0];
  return rank==='A'?11:['J','Q','K'].includes(rank)?10:Number(rank);
}
function checkAce(card){return card.startsWith('A-')?1:0;}
function reduceAce(sum,aces){while(sum>21&&aces>0){sum-=10;aces--;}return sum;}
function createCard(card,faceDown=false) {
  const img=document.createElement('img');
  const extension=!faceDown&&card.startsWith('8-')?'svg':'png';
  img.src=`cards/${faceDown?'BACK':card}.${extension}`;
  img.alt=faceDown?'Lefordított lap':card;
  img.width=1024;img.height=1536;
  // The four eights were absent from the supplied photograph.
  // The included vectors supply those four missing ranks without broken images.
  return img;
}
function updateControls(){document.getElementById('hit').disabled=!canHit;document.getElementById('stay').disabled=!canHit;}
function startGame() {
  dealerSum=yourSum=dealerAceCount=yourAceCount=0;canHit=true;
  document.getElementById('dealer-cards').replaceChildren();
  document.getElementById('your-cards').replaceChildren();
  document.getElementById('results').textContent='';
  document.getElementById('dealer-sum').textContent='?';
  buildDeck();shuffleDeck();
  hidden=deck.pop();dealerSum+=getValue(hidden);dealerAceCount+=checkAce(hidden);
  const back=createCard(hidden,true);back.id='hidden';document.getElementById('dealer-cards').append(back);
  const visible=deck.pop();dealerSum+=getValue(visible);dealerAceCount+=checkAce(visible);
  document.getElementById('dealer-cards').append(createCard(visible));
  for(let i=0;i<2;i++)drawPlayerCard();
  updateControls();
}
function drawPlayerCard(){
  const card=deck.pop();yourSum+=getValue(card);yourAceCount+=checkAce(card);
  document.getElementById('your-cards').append(createCard(card));
  document.getElementById('your-sum').textContent=reduceAce(yourSum,yourAceCount);
}
function hit(){if(!canHit)return;drawPlayerCard();if(reduceAce(yourSum,yourAceCount)>21)stay();}
function stay(){
  if(!canHit)return;
  canHit=false;
  const back=document.getElementById('hidden');back.replaceWith(createCard(hidden));
  yourSum=reduceAce(yourSum,yourAceCount);
  while(yourSum<=21&&reduceAce(dealerSum,dealerAceCount)<17){
    const card=deck.pop();dealerSum+=getValue(card);dealerAceCount+=checkAce(card);
    document.getElementById('dealer-cards').append(createCard(card));
  }
  dealerSum=reduceAce(dealerSum,dealerAceCount);
  const playerNatural=yourSum===21&&document.getElementById('your-cards').children.length===2;
  const dealerNatural=dealerSum===21&&document.getElementById('dealer-cards').children.length===2;
  let message;
  if(yourSum>21)message='Túllépted a 21-et. Vesztettél.';
  else if(playerNatural&&dealerNatural)message='Döntetlen — mindkettőtöknek blackjack!';
  else if(dealerNatural)message='Az osztónak blackjackje van. Vesztettél.';
  else if(playerNatural)message='Blackjack! Nyertél!';
  else if(dealerSum>21||yourSum>dealerSum)message='Nyertél!';
  else if(yourSum===dealerSum)message='Döntetlen.';
  else message='Az osztó nyert.';
  document.getElementById('dealer-sum').textContent=dealerSum;
  document.getElementById('your-sum').textContent=yourSum;
  document.getElementById('results').textContent=message;
  updateControls();
}
document.getElementById('hit').addEventListener('click',hit);
document.getElementById('stay').addEventListener('click',stay);
document.getElementById('new-game').addEventListener('click',startGame);
startGame();
