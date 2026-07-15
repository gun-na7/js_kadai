// 山札
let deck = [];

// 勝利数
let win = 0;

// 現在のカード
let current;

// 次のカード
let next;

// 山札作成
function createDeck() {

    deck = [];

    const suits = ["S", "H", "D", "C"];

    for (const suit of suits) {

        for (let num = 1; num <= 13; num++) {

            deck.push({
                value: num,
                image: `image/${suit}${num}.png`
            });

        }

    }

    shuffle();

}

// シャッフル
function shuffle() {

    for (let i = deck.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];

    }

}

// 1枚引く
function drawCard() {

    return deck.pop();

}

// 残り枚数更新
function updateRemain() {

    document.getElementById("remain").textContent = deck.length;

}

// 勝利数更新
function updateWin() {

    document.getElementById("win").textContent = win;

}

// 初期化
function startGame() {

    createDeck();

    win = 0;
    updateWin();

    current = drawCard();
    next = drawCard();

    // 左のカードは表
    document.getElementById("currentCard").src = current.image;

    // 右のカードは裏
    const nextImg = document.getElementById("nextCard");
    nextImg.classList.remove("flip");
    nextImg.classList.remove("moveLeft");
    nextImg.src = "image/back.jpg";

    document.getElementById("result").textContent = "";

    updateRemain();
}

// ゲーム
function play(choice) {

    if (!next) {

        document.getElementById("result").textContent = "山札がなくなりました";
        return;

    }

    const nextImg = document.getElementById("nextCard");

    nextImg.classList.remove("flip");
    nextImg.classList.remove("moveLeft");
    nextImg.src = "image/back.jpg";

    // カードをめくる
    nextImg.classList.add("flip");

    // 90°回転したところで画像を変更
    setTimeout(() => {

        nextImg.src = next.image;

        // 元の向きに戻す
        nextImg.classList.remove("flip");
    }, 800);


    let result = "";
    let resultClass = "";
    let gameOver = false;

    if (next.value === current.value) {

        result = "Draw";
        resultClass = "draw";

    }
    else if (choice === "high" && next.value > current.value) {

        result = "Win!";
        resultClass = "win";
        win++;

    }
    else if (choice === "low" && next.value < current.value) {

        result = "Win!";
        resultClass = "win";
        win++;

    }
    else {

        result = "Lose...";
        resultClass = "lose";
        gameOver = true;

    }

    // めくり終わったら結果表示
    setTimeout(() => {

        document.getElementById("result").innerHTML =
            `<span class="${resultClass}">${result}</span>`;
        updateWin();

        // 勝った時だけ左へ移動
        if (!gameOver && result !== "Draw") {
            
            setTimeout(() => {
                nextImg.classList.add("moveLeft");

            }, 1000)
        }

    }, 1200);

    // 少し待ってから次のターン
    setTimeout(() => {

        if (gameOver) {

            document.getElementById("overlayResult").innerHTML =
                `<span class="${resultClass}">${result}</span>`;

            // 今回の連勝数を表示
            document.getElementById("overlayWin").textContent = win;

            document.getElementById("gameOverScreen").style.display = "flex";

            return;

        }

        // 勝った時だけスライドを戻す
        if (!gameOver && result !== "Draw") {
            nextImg.classList.remove("moveLeft");
        }

        // 左側のカードを更新
        current = next;
        document.getElementById("currentCard").src = current.image;

        // 次のカードを準備（裏面）
        if (deck.length > 0) {

            next = drawCard();

            document.getElementById("nextCard").src = "image/back.jpg";

        } else {

            next = null;

            document.getElementById("result").textContent += "今日はツイてる";

        }

        updateRemain();

    }, 3000);

}

// HIGHボタン
document.getElementById("high").addEventListener("click", () => {

    play("high");

});

// LOWボタン
document.getElementById("low").addEventListener("click", () => {

    play("low");

});

// リセットボタン
document.getElementById("reset").addEventListener("click", () => {

    startGame();

});

document.getElementById("retry").addEventListener("click", () => {

    // ゲームオーバー画面を閉じる
    document.getElementById("gameOverScreen").style.display = "none";

    // 新しいゲームを開始
    startGame();

});

// ゲーム開始
startGame();