// GEEK
// Add the ability to change the game theme (both images and card pattern).
// Make the basic layout the “easy” level, add levels medium and hard (with more 18 and 24 cards).
// Add modal for new game without complete
// NINJA
// Add flipping animation effect for the card. (and for the modal...)
// Add a high score functionality, that will save the name of the person with the least amounts of wrong guesses.

"use strict";

// (function () {

    let MemoryGame = {

        images: {
            path: "images/",
            unknownImageName: "0.jpg",
            totalImagesAvailable: 34,   // number of bootcampers in cohort Oct 2019
        },

        session: {
            numImages: 6,       // beginner mode
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

    MemoryGame.init = function () {
        MemoryGame.session.setToDefault();
        MemoryGame.generateHTML();
        MemoryGame.styleImages();
        $(".game-img").on("click", MemoryGame.revealImage);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        $(window).on("resize", MemoryGame.styleImages);
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
        this.generateImagesRandomly(this.session.numImages);
        this.session.selectedImages.forEach(function (imageName, index) {
            $("#game").append($(`<img src="${MemoryGame.images.path + MemoryGame.images.unknownImageName}" id="${index}" class="game-img" />`));
        });
    };
    
    MemoryGame.styleImages = function () {
        const gameContainer = {
            width: $("#game-container").width(),
            height: $("#game-container").height(),
        };
        const imgSize = ( gameContainer.width + gameContainer.height ) / ( MemoryGame.session.numImages * 2 );
        const imgMargin = gameContainer.width / 100;
        $(".game-img").css({
            "width": imgSize,
            "height": imgSize,
            "margin": imgMargin,
        });
        switch (MemoryGame.session.numImages) {
            case 6:
                if (gameContainer.width >= (imgSize + imgMargin*2)*5 && gameContainer.width < (imgSize + imgMargin*2)*6) {
                    $("#game").width((imgSize + imgMargin*2)*4);
                } else if (gameContainer.width >= (imgSize + imgMargin*2)*7) {
                    $("#game").width((imgSize + imgMargin*2)*6);
                } else {
                    $("#game").width(gameContainer.width);
                }
                break;
            case 8:

                console.log(123);
                break;
            case 10:

                console.log(456);
                break;
        }
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

    MemoryGame.generateImagesRandomly = function (numInput) {
        while (this.session.selectedImages.length < numInput) {
            let rand = Math.floor(Math.random() * this.images.totalImagesAvailable) + 1;
            if (this.session.selectedImages.indexOf(rand) === -1) this.session.selectedImages.push(rand);
        }
        this.session.selectedImages = this.doubleArrayRandomly(this.session.selectedImages);
    };

    MemoryGame.doubleArrayRandomly = function (array) {
        array = array.concat(array);
        array = this.shuffle(array);
        return array;
    };

    MemoryGame.shuffle = function (array) {
        array.sort(() => Math.random() - 0.5);
        return array;
    };

    MemoryGame.setScore = function () {
        this.session.score = Math.max(0, 50 + this.session.rightAnswerCount * 10 - this.session.wrongAnswerCount * 5);
        $("#score").html(this.session.score);
        $("#right-answer-count").html(this.session.rightAnswerCount);
        $("#wrong-answer-count").html(this.session.wrongAnswerCount);
    };
    
    MemoryGame.startNewGame = function () {
        console.log(this);
        switch (this.id) {
            case "level1-btn":
                MemoryGame.session.numImages = 6;
                break;
            case "level2-btn":
                MemoryGame.session.numImages = 8;
                break;
            case "level3-btn":
                MemoryGame.session.numImages = 10;
                break;
        }
        console.log(MemoryGame.session.numImages);
        MemoryGame.removeModal();
        MemoryGame.session.setToDefault();
        MemoryGame.generateHTML();
        MemoryGame.styleImages();
        $(".game-img").on("click", MemoryGame.revealImage);
        // $(".new-game-btn").on("click", MemoryGame.startNewGame);
        $(window).on("resize", MemoryGame.styleImages);
    };

    // MemoryGame.displayStartModal = function () {
    //     MemoryGame.createModal();
    //     $("#modal").append(`
    //         <h1>Welcome to the ITC Memory Game - 2019 Oct Bootcampers Edition!</h1>

    //         <img class="modal-gif">

    //         <p>
    //             Please select the desired level of difficulty:
    //         </p>
    //         <div>
    //         <button id="level1-btn" class="new-game-btn">Beginner</button>
    //         <button id="level2-btn" class="new-game-btn">Intermediate</button>
    //         <button id="level3-btn" class="new-game-btn">Advanced</button>
    //         </div>
    //     `);
    //     $(".new-game-btn").on("click", MemoryGame.start);
    //     MemoryGame.displayRandomGif("welcome");
    // };

    MemoryGame.displayWinModal = function () {
        MemoryGame.createModal();
        $("#modal").append(`
            <h1>Congratulations, you won!</h1>
            <p>
                Your final score is <span id="final-score"></span>
            </p>
            <button class="new-game-btn">Start a New Game</button>
            <img class="modal-gif">
        `);
        $("#final-score").html(MemoryGame.session.score);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        MemoryGame.displayRandomGif("happy win");
    };

    MemoryGame.displayRandomGif = async function (inputTag) {
        try {
            let response = await $.ajax({
                method: "GET",
                url: "https://api.giphy.com/v1/gifs/random",
                dataType: "json",
                data: {
                    api_key: "rbBrEcYnKrJXV3ye6yYewwC1SPbC3ZPj",
                    tag: inputTag,
                },
            }).promise();
            $(".modal-gif").attr("src", response.data.fixed_height_downsampled_url);
        }
        catch (error) {
            $(".modal-gif").attr("src", "https://media3.giphy.com/media/l3q2Z6S6n38zjPswo/200_d.gif");
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

    MemoryGame.init();
    // MemoryGame.displayStartModal();

// })();