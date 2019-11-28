// GEEK
// Add the ability to change the game theme (both images and card pattern).
// NINJA
// Add flipping animation effect for the card. (and for the modal...)
// Add a high score functionality, that will save the name of the person with the least amounts of wrong guesses.

"use strict";

window.onload = function () {

    let MemoryGame = {

        images: {
            path: "images/",
            unknownImageName: "0.jpg",
            totalImagesAvailable: {
                bootcamp: 34,   // number of bootcampers in cohort Oct 2019
                larry: 15,
            }
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
            mode: "bootcamp",
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
        let gameWidth = gameContainer.width;
        let imgMargin = gameContainer.width / 80;
        let imgSize = (gameContainer.width + gameContainer.height - 2 * imgMargin) / (MemoryGame.session.numImages * 2);

        switch (MemoryGame.session.numImages) {
            case 6:
                if (gameContainer.width >= (imgSize + imgMargin * 2) * 6) {
                    imgMargin = (gameContainer.width / 6 - imgSize) / 2;
                } else if (gameContainer.width >= (imgSize + imgMargin * 2) * 5 && gameContainer.width < (imgSize + imgMargin * 2) * 6) {
                    gameWidth = (imgSize + imgMargin * 2) * 4;
                }
                break;
            case 9:
                if (gameContainer.width >= (imgSize + imgMargin * 2) * 9) {
                    imgSize = (gameContainer.width / 6 - 2 * imgMargin)*.9;
                    if (gameContainer.height < (imgSize + imgMargin * 2) * 3) {
                        imgSize = gameContainer.width / 9 - 2 * imgMargin;
                    }
                } else if (gameContainer.width >= (imgSize + imgMargin * 2) * 9) {
                    imgMargin = (gameContainer.width / 9 - imgSize) / 2;
                } else if (gameContainer.width >= (imgSize + imgMargin * 2) * 7 && gameContainer.width < (imgSize + imgMargin * 2) * 9) {
                    imgMargin = gameContainer.width / 50;
                    imgSize = Math.min(gameContainer.width / 6 - 2 * imgMargin, gameContainer.height / 3 - 2 * imgMargin);
                } else if (gameContainer.width >= (imgSize + imgMargin * 2) * 4 && gameContainer.width < (imgSize + imgMargin * 2) * 6) {
                    imgMargin = gameContainer.width / 30;
                    imgSize = Math.min(gameContainer.width / 3 - 2 * imgMargin, gameContainer.height / 6 - 2 * imgMargin);
                }
                break;
            case 12:
                if (gameContainer.width >= (imgSize + imgMargin * 2) * 9) {
                    imgSize = gameContainer.width / 8 - 2 * imgMargin;
                    if (gameContainer.height < (imgSize + imgMargin * 2) * 3) {
                        imgSize = gameContainer.width / 12 - 2 * imgMargin;
                    }
                }
                else if (gameContainer.width >= (imgSize + imgMargin * 2) * 7 && gameContainer.width < (imgSize + imgMargin * 2) * 8) {
                    if (gameContainer.height >= (imgSize + imgMargin * 2) * 4) {
                        imgSize = gameContainer.width / 6 - 2 * imgMargin;
                    } else {
                        imgSize = gameContainer.width / 12 - 2 * imgMargin;
                    }
                }
                else if (gameContainer.width >= (imgSize + imgMargin * 2) * 5 && gameContainer.width < (imgSize + imgMargin * 2) * 6) {
                    if (gameContainer.height >= (imgSize + imgMargin * 2) * 4) {
                        imgSize = gameContainer.width / 6 - 2 * imgMargin;
                    } else {
                        imgSize = gameContainer.width / 12 - 2 * imgMargin;
                    }
                }
                break;
        }
        $("#game").width(gameWidth);
        $(".game-img").css({
            "width": imgSize,
            "height": imgSize,
            "margin": imgMargin,
        });
    };

    MemoryGame.revealImage = function () {
        $(".game-img.last-revealed").toggleClass("last-revealed");
        const imagePath = MemoryGame.images.path + MemoryGame.session.mode + "/";
        this.src = imagePath + MemoryGame.session.selectedImages[this.id] + ".jpg";
        $(this).toggleClass("last-revealed");
        $(this).toggleClass("active");
        if (MemoryGame.session.isCompleted === false) {
            if (MemoryGame.session.imageRevealed === null) {
                MemoryGame.session.imageRevealed = this.id;
            } else if (this.id !== MemoryGame.session.imageRevealed) {
                if (MemoryGame.session.selectedImages[MemoryGame.session.imageRevealed] === MemoryGame.session.selectedImages[this.id]) {
                    MemoryGame.session.rightAnswerCount++;
                    $(".game-img.active").toggleClass("matched");
                    $(".game-img.active").toggleClass("active");
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
            // setTimeout(MemoryGame.displayWinModal, MemoryGame.session.displayModalLagTime);
            MemoryGame.displayWinModal();
            MemoryGame.session.isCompleted = true;
            $(".game-img").off("click", MemoryGame.revealImage);
        }
    };

    MemoryGame.hideImage = function () {
        console.log(MemoryGame.images.path + MemoryGame.images.unknownImageName);
        $(".game-img.active").attr("src", MemoryGame.images.path + MemoryGame.images.unknownImageName);
        $(".game-img.active").toggleClass("active");
        $(".game-img").on("click", MemoryGame.revealImage);
        MemoryGame.session.imageRevealed = null;
    };

    MemoryGame.generateImagesRandomly = function (numInput) {
        const imagesAvailable = (this.session.mode === "bootcamp") ? this.images.totalImagesAvailable.bootcamp : this.images.totalImagesAvailable.larry;
        while (this.session.selectedImages.length < numInput) {
            let rand = Math.floor(Math.random() * imagesAvailable) + 1;
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
        $(".new-game-btn.active").toggleClass("active");
        $(`[name ="${this.name}"]`).toggleClass("active");
        switch (this.name) {
            case "level1-btn":
                MemoryGame.session.numImages = 6;
                break;
            case "level2-btn":
                MemoryGame.session.numImages = 9;
                break;
            case "level3-btn":
                MemoryGame.session.numImages = 12;
                break;
        }
        MemoryGame.removeModal();
        MemoryGame.session.setToDefault();
        MemoryGame.generateHTML();
        MemoryGame.styleImages();
        $(".game-img").on("click", MemoryGame.revealImage);
        // $(".new-game-btn").on("click", MemoryGame.startNewGame);
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
                Your final score is <span id="final-score"></span> and you unleashed a <strong>new game mode!</strong>
                <br />
                Play again and you'll have a nice surprise...
            </p>
            <div id="modal-buttons">
                <button name="level1-btn" class="new-game-btn new-game active">Newb</button>
                <button name="level2-btn" class="new-game-btn new-game">Geek</button>
                <button name="level3-btn" class="new-game-btn new-game">Ninja</button>
            </div>
            <div class="modal-gif-container loading">
                <img class="modal-gif">
            </div>
        `);
        $("#final-score").html(MemoryGame.session.score);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        MemoryGame.displayRandomGif("happy win");
        MemoryGame.session.mode = "larry";
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
        $(".modal-gif-container.loading").toggleClass("loading");
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

};