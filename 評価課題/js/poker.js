// 山札
let deck = [];

// 手札
let hand = [];

// 交換済みか
let exchanged = false;

// 山札作成
function createDeck(){

    deck = [];

    const suits = ["S","H","D","C"];

    for(const suit of suits){

        for(let num=1; num<=13; num++){

            deck.push({
                suit:suit,
                value:num,
                image:`image/${suit}${num}.png`
            });

        }

    }

    shuffle();

}

// シャッフル
function shuffle(){

    for(let i=deck.length-1;i>0;i--){

        let j=Math.floor(Math.random()*(i+1));

        [deck[i],deck[j]]=[deck[j],deck[i]];

    }

}

// 1枚引く
function drawCard(){

    return deck.pop();

}

// ゲーム開始
function startGame(){

    createDeck();

    hand=[];

    exchanged=false;

    for(let i=0;i<5;i++){

        hand.push(drawCard());

    }

    showCards();

    document.getElementById("result").textContent="交換するカードを選んでください";

}

// カード表示
function showCards(){

    const cards=document.getElementById("cards");

    poker_cards.innerHTML="";

    hand.forEach((poker_card,index)=>{

        const img=document.createElement("img");

        img.src=poker_card.image;

        img.className="poker_card";

        img.dataset.index=index;

        img.onclick=function(){

            if(exchanged)return;

            img.classList.toggle("selected");

        }

        cards.appendChild(img);

    });

}

// カード交換
function exchangeCards(){

    if(exchanged)return;

    const imgs=document.querySelectorAll(".card");

    imgs.forEach((img,index)=>{

        if(img.classList.contains("selected")){

            hand[index]=drawCard();

        }

    });

    exchanged=true;

    showCards();

    checkHand();

}

// 役判定
function checkHand(){

    const values=hand.map(c=>c.value).sort((a,b)=>a-b);

    const suits=hand.map(c=>c.suit);

    const count={};

    values.forEach(v=>{

        count[v]=(count[v]||0)+1;

    });

    const nums=Object.values(count);

    const flush=suits.every(s=>s===suits[0]);

    let straight=true;

    for(let i=0;i<4;i++){

        if(values[i]+1!==values[i+1]){

            straight=false;

        }

    }

    let result="ノーペア";

    if(straight && flush && values[0]==1 && values[1]==10){

        result="ロイヤルストレートフラッシュ";

    }
    else if(straight && flush){

        result="ストレートフラッシュ";

    }
    else if(nums.includes(4)){

        result="フォーカード";

    }
    else if(nums.includes(3)&&nums.includes(2)){

        result="フルハウス";

    }
    else if(flush){

        result="フラッシュ";

    }
    else if(straight){

        result="ストレート";

    }
    else if(nums.includes(3)){

        result="スリーカード";

    }
    else if(nums.filter(n=>n==2).length==2){

        result="ツーペア";

    }
    else if(nums.includes(2)){

        result="ワンペア";

    }

    document.getElementById("result").textContent=result;

}

// 交換ボタン
document.getElementById("exchange").addEventListener("click",()=>{

    exchangeCards();

});

// 開始
startGame();