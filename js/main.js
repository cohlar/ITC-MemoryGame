// GEEK
// Add the ability to change the game theme (both images and card pattern).
// Make the basic layout the “easy” level, add levels medium and hard (with more 18 and 24 cards).
// NINJA
// Add flipping animation effect for the card. (and for the modal...)
// Add a high score functionality, that will save the name of the person with the least amounts of wrong guesses.

"use strict";

(function () {

    let MemoryGame = {

        images: {
            path: "images/",
            unknownImageName: "0.jpg",
            totalImagesAvailable: 34,   // number of bootcampers in cohort Oct 2019
        },

        session: {
            numImages: 6,               // beginner mode
            hideImageLagTime: 2000,     // in ms
            displayModalLagTime: 1000,  // in ms
            selectedImages: undefined,
            imageRevealed: undefined,
            startScore: 50,
            score: undefined,
            rightAnswerCount: undefined,
            wrongAnswerCount: undefined,
            isCompleted: false,
        },
    };

    MemoryGame.start = function () {
        MemoryGame.removeModal();
        MemoryGame.session.setToDefault();
        MemoryGame.generateHTML();
        $(".game-img").on("click", MemoryGame.revealImage);
    };

    MemoryGame.session.setToDefault = function () {
        $("#game > img").remove();
        this.selectedImages = [];
        this.imageRevealed = null;
        this.score = this.startScore;
        this.rightAnswerCount = 0;
        this.wrongAnswerCount = 0;
        this.isCompleted = false;

    };

    MemoryGame.generateHTML = function () {
        this.setScore();
        this.selectImagesRandomly(this.session.numImages);
        this.doubleImagesRandomly();
        this.session.selectedImages.forEach(function (imageName, index) {
            $("#game").append($(`<img src="${MemoryGame.images.path + MemoryGame.images.unknownImageName}" id="${index}" class="game-img" >`));
        });
    };

    MemoryGame.revealImage = function () {
        this.src = MemoryGame.images.path + MemoryGame.session.selectedImages[this.id] + ".jpg";
        if (MemoryGame.session.isCompleted === false) {
            if (MemoryGame.session.imageRevealed === null) {
                MemoryGame.session.imageRevealed = this.id;
            } else if (this.id !== MemoryGame.session.imageRevealed) {
                if (MemoryGame.session.selectedImages[MemoryGame.session.imageRevealed] === MemoryGame.session.selectedImages[this.id]) {
                    MemoryGame.session.rightAnswerCount++;
                    MemoryGame.session.imageRevealed = null;
                } else {
                    $(".game-img").off("click", MemoryGame.revealImage);
                    setTimeout(MemoryGame.hideImage.bind(this), MemoryGame.session.hideImageLagTime);
                    MemoryGame.session.wrongAnswerCount++;
                }
                MemoryGame.setScore();
            }
        }
        if (MemoryGame.session.rightAnswerCount === MemoryGame.session.numImages) {
            setTimeout(MemoryGame.displayWinModal, MemoryGame.session.displayModalLagTime);
            MemoryGame.session.isCompleted = true;
            $(".game-img").off("click", MemoryGame.revealImage);
        }
    };

    MemoryGame.hideImage = function () {
        this.src = MemoryGame.images.path + MemoryGame.images.unknownImageName;
        $(`#${MemoryGame.session.imageRevealed}`).attr("src", MemoryGame.images.path + MemoryGame.images.unknownImageName);
        $(".game-img").on("click", MemoryGame.revealImage);
        MemoryGame.session.imageRevealed = null;
    };

    MemoryGame.selectImagesRandomly = function (numInput) {
        while (this.session.selectedImages.length < numInput) {
            let rand = Math.floor(Math.random() * this.images.totalImagesAvailable) + 1;
            if (this.session.selectedImages.indexOf(rand) === -1) this.session.selectedImages.push(rand);
        }
    };

    MemoryGame.doubleImagesRandomly = function () {
        this.session.selectedImages = this.session.selectedImages.concat(this.session.selectedImages);
        this.shuffle(this.session.selectedImages);
    };

    MemoryGame.shuffle = function (array) {
        array.sort(() => Math.random() - 0.5);
    };

    MemoryGame.setScore = function () {
        this.session.score = Math.max(0, 50 + this.session.rightAnswerCount * 10 - this.session.wrongAnswerCount * 5);
        $("#score").html(this.session.score);
        $("#right-answer-count").html(this.session.rightAnswerCount);
        $("#wrong-answer-count").html(this.session.wrongAnswerCount);
    };

    MemoryGame.displayWinModal = function () {
        MemoryGame.createModal();
        $("#modal").append(`
            <h1>Congratulations, you won!</h1>
            <p>
                Your final score is <span id="final-score"></span>
            </p>
            <button class="new-game-btn">Start a New Game</button>
            <img id="win-gif">
        `);
        $("#final-score").html(MemoryGame.session.score);
        $(".new-game-btn").on("click", MemoryGame.start);
        MemoryGame.displayRandomGif();
    };

    MemoryGame.displayRandomGif = async function () {
        try {
            let response = await $.ajax({
                method: "GET",
                url: "http://api.giphy.com/v1/gifs/random",
                dataType: "json",
                data: {
                    api_key: "rbBrEcYnKrJXV3ye6yYewwC1SPbC3ZPj",
                    tag: "happy win",
                },
            }).promise();
            $("#win-gif").attr("src", response.data.fixed_height_downsampled_url);
        }
        catch (error) {
            $("#win-gif").attr("src", "https://media3.giphy.com/media/l3q2Z6S6n38zjPswo/200_d.gif");
        }
    }
    
    MemoryGame.createModal = function () {
        $("body").append(`
            <div class="modal-background">
                <div id="modal">
                    <div id="close-modal">X</div>
                </div>
            </div>
        `);
        $("#close-modal").on("click", this.removeModal);
    };

    MemoryGame.removeModal = function () {
        $(".modal-background").remove();
    };

    $(".new-game-btn").on("click", MemoryGame.start);
    MemoryGame.start();

})();