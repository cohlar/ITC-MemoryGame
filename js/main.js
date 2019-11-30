"use strict";

window.onload = function () {

    // NameSpace and main game variables
    let MemoryGame = {

        images: {
            path: "images/",
            unknownImageName: "0.jpg",
            totalImagesAvailable: {
                bootcampers: 34,   // number of bootcampers in cohort Oct 2019
                larry: 12,          // surprise edition, only appears after first win
            }
        },

        session: {
            numUniqueImages: 6,       // beginner mode
            hideImageLagTime: 2000,     // in ms
            displayModalLagTime: 1000,  // in ms
            selectedImages: undefined,
            startScore: 50,
            score: undefined,
            rightAnswerCount: undefined,
            wrongAnswerCount: undefined,
            edition: "Bootcampers",
        },
    };

    // Initiates the game and webpage when opening the URL
    MemoryGame.init = function () {
        MemoryGame.setToDefault();
        MemoryGame.generateHTML();
        $(".game-img").on("click", MemoryGame.revealImage);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        $(window).on("resize", MemoryGame.styleImages);
    };

    // Sets / Resets game variables to their default value
    MemoryGame.setToDefault = function () {
        $("#game > img").remove();
        this.session.selectedImages = [];
        this.session.score = this.startScore;
        this.session.rightAnswerCount = 0;
        this.session.wrongAnswerCount = 0;
        this.setScore();
    };

    // Generates HTML elements dynamically (mainly images)
    MemoryGame.generateHTML = function () {
        $("#edition").html(this.session.edition);   // name of the edition at the top of the page
        this.generateImagesRandomly(this.session.numUniqueImages);
        this.session.selectedImages.forEach(function (imageName, index) {
            $("#game").append($(`<img src="${MemoryGame.images.path + MemoryGame.images.unknownImageName}" id="${index}" class="game-img" />`));
        });
        MemoryGame.styleImages();   // defines how images will be displayed on the page according to screen size
        MemoryGame.images.lazyLoad();
    };

    // Reveals images when clicked on
    MemoryGame.revealImage = function () {
        $(".game-img.last-revealed").toggleClass("last-revealed");
        const imagePath = MemoryGame.images.path + MemoryGame.session.edition + "/";
        $(this).attr("src", imagePath + MemoryGame.session.selectedImages[this.id] + ".jpg");
        $(this).toggleClass("last-revealed");
        $(this).off("click", MemoryGame.revealImage);
        $(this).toggleClass("active");
        if ($(".game-img.active").length === 2) {
            const clickedImage1 = MemoryGame.session.selectedImages[$(".game-img.active").attr("id")];
            const clickedImage2 = MemoryGame.session.selectedImages[$(".game-img.active").last().attr("id")];
            if (clickedImage1 === clickedImage2) {
                MemoryGame.session.rightAnswerCount++;
                $(".game-img.active").toggleClass("matched");
                $(".game-img.active").toggleClass("active");
            } else {
                $(".game-img").off("click", MemoryGame.revealImage);
                setTimeout(MemoryGame.hideImages, MemoryGame.session.hideImageLagTime);
                MemoryGame.session.wrongAnswerCount++;
            }
            MemoryGame.setScore();
        }
        if (MemoryGame.session.rightAnswerCount === MemoryGame.session.numUniqueImages) {
            MemoryGame.displayWinModal();
        } else if (MemoryGame.session.score === 0) {
            $(".game-img").off("click", MemoryGame.revealImage);
            MemoryGame.displayLoseModal();
        }
    };

    // Hides back images when required
    MemoryGame.hideImages = function () {
        if (MemoryGame.session.score > 0) {
            $(".game-img.active").attr("src", MemoryGame.images.path + MemoryGame.images.unknownImageName);
            $(".game-img.active").toggleClass("active");
            $(".game-img:not(.matched)").on("click", MemoryGame.revealImage);
        }
    };

    // Resets the game when clicking on new game buttons
    MemoryGame.startNewGame = function () {
        $(".new-game-btn.active").toggleClass("active");
        $(`[name ="${this.name}"]`).toggleClass("active");
        switch (this.name) {
            case "level1-btn":
                MemoryGame.session.numUniqueImages = 6;
                break;
            case "level2-btn":
                MemoryGame.session.numUniqueImages = 9;
                break;
            case "level3-btn":
                MemoryGame.session.numUniqueImages = 12;
                break;
        }
        MemoryGame.removeModal();
        MemoryGame.setToDefault();
        MemoryGame.generateHTML();
        MemoryGame.styleImages();
        $(".game-img").on("click", MemoryGame.revealImage);
    };

    // Sets and displays score based on number of right and wrong answers
    MemoryGame.setScore = function () {
        this.session.score = Math.max(0, this.session.startScore + this.session.rightAnswerCount * 10 - this.session.wrongAnswerCount * 5);
        $("#score").html(this.session.score);
        $("#right-answer-count").html(this.session.rightAnswerCount);
        $("#wrong-answer-count").html(this.session.wrongAnswerCount);
    };

    // Selects images randomly based on the specified number of images to display
    MemoryGame.generateImagesRandomly = function (numInput) {
        const imagesAvailable = (this.session.edition === "Bootcampers") ? this.images.totalImagesAvailable.bootcampers : this.images.totalImagesAvailable.larry;
        while (this.session.selectedImages.length < numInput) {
            let rand = Math.floor(Math.random() * imagesAvailable) + 1;
            if (this.session.selectedImages.indexOf(rand) === -1) this.session.selectedImages.push(rand);
        }
        this.session.selectedImages = this.doubleArrayRandomly(this.session.selectedImages);
    };

    // Pushes the content of an array at the end of that same array
    MemoryGame.doubleArrayRandomly = function (array) {
        array = array.concat(array);
        array = this.shuffle(array);
        return array;
    };

    // Shuffles arrays randomly
    MemoryGame.shuffle = function (array) {
        array.sort(() => Math.random() - 0.5);
        return array;
    };

    // Generates and displays modal when game is won
    MemoryGame.displayWinModal = function () {
        MemoryGame.createModal();
        $("#modal").append(`
            <h1>Congratulations, you won!</h1>
            <p>
                Your final score is <span id="final-score"></span>
                ${(MemoryGame.session.edition === "Larry") ? "" : "and you unlocked a <strong>special game edition!</strong><br />Play again and you'll have a pleasant surprise..."}
            </p>
            <div id="modal-buttons">
                <button name="level1-btn" class="new-game-btn new-game">Newb</button>
                <button name="level2-btn" class="new-game-btn new-game">Geek</button>
                <button name="level3-btn" class="new-game-btn new-game">Ninja</button>
            </div>
            <div class="modal-gif-container loading">
                <img class="modal-gif">
            </div>
        `);
        $("#final-score").html(MemoryGame.session.score);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        MemoryGame.displayRandomGif("happy-win");
        MemoryGame.session.edition = "Larry";
    };

    // Generates and displays modal when game is lost
    MemoryGame.displayLoseModal = function () {
        MemoryGame.createModal();
        $("#modal").append(`
            <h1>You lost you loser!</h1>
            <p>
                Your reached the laughable score of <span id="final-score"></span>
                <br />
                You're welcome to try again...
                ${(MemoryGame.session.edition === "Larry") ? "but you're back to the original edition" : ""}
            </p>
            <div id="modal-buttons">
                <button name="level1-btn" class="new-game-btn new-game">Newb</button>
                <button name="level2-btn" class="new-game-btn new-game">Geek</button>
                <button name="level3-btn" class="new-game-btn new-game">Ninja</button>
            </div>
            <div class="modal-gif-container loading">
                <img class="modal-gif">
            </div>
        `);
        $("#final-score").html(MemoryGame.session.score);
        $(".new-game-btn").on("click", MemoryGame.startNewGame);
        MemoryGame.displayRandomGif("you-lose");
        MemoryGame.session.edition = "Bootcampers";
    };

    // Generates random gif from Giphy API
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

    // Generates the modal HTML
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

    // Removes the modal from the screen
    MemoryGame.removeModal = function () {
        $(".modal-background").remove();
    };

    // Styles the images responsively based on the screen size
    MemoryGame.styleImages = function () {
        const gameContainer = {
            width: $("#game-container").width(),
            height: $("#game-container").height(),
        };
        let gameWidth = gameContainer.width;
        let imgMargin = gameContainer.width / 80;
        let imgSize = (gameContainer.width + gameContainer.height - 2 * imgMargin) / (MemoryGame.session.numUniqueImages * 2);

        switch (MemoryGame.session.numUniqueImages) {
            case 6:
                if (gameContainer.width >= (imgSize + imgMargin * 2) * 6) {
                    imgMargin = (gameContainer.width / 6 - imgSize) / 2;
                } else if (gameContainer.width >= (imgSize + imgMargin * 2) * 5 && gameContainer.width < (imgSize + imgMargin * 2) * 6) {
                    gameWidth = (imgSize + imgMargin * 2) * 4;
                }
                break;
            case 9:
                if (gameContainer.width >= (imgSize + imgMargin * 2) * 9) {
                    imgSize = (gameContainer.width / 6 - 2 * imgMargin) * .9;
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

    // Downloads images behing the scene so they can be displayed instantly when revealing them
    MemoryGame.images.lazyLoad = async function () {
        const imagePath = MemoryGame.images.path + MemoryGame.session.edition + "/";
        await MemoryGame.session.selectedImages.forEach(function (imageName) {
            $(`<img src="${imagePath + imageName}.jpg" />`);
        });
    };

    // And this is where all the magic happens
    MemoryGame.init();
};