// STAR
// add game reset function
// add header with logo and button to reset
// win modal with button for new game

// GEEK
// add game reset function
// add header with logo and button to reset
// win modal with button for new game

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
            selectedImages: [],
            imageRevealed: null,
            hideImageLagTime: 2000,     // in ms
            goodAnswerCount: 0,
            wrongAnswerCount: 0,
            isCompleted: false,
        },
    };


    MemoryGame.start = function () {
        this.generateHtmlStructure();
        this.generateImagesHTML();
        $(".game-img").on("click", this.revealImage);
    };

    MemoryGame.generateHtmlStructure = function () {
        $("body").append('<div id="game-container"></div>');
    };

    MemoryGame.generateImagesHTML = function () {
        this.selectImagesRandomly(this.session.numImages);
        this.doubleImagesRandomly();
        this.session.selectedImages.forEach(function (imageName, index) {
            $("#game-container").append($(`<img src="${MemoryGame.images.path + MemoryGame.images.unknownImageName}" id="${index}" class="game-img" >`));
        });
    };

    MemoryGame.revealImage = function () {
        this.src = MemoryGame.images.path + MemoryGame.session.selectedImages[this.id] + ".jpg";
        if (MemoryGame.session.isCompleted === false) {
            if (MemoryGame.session.imageRevealed === null) {
                MemoryGame.session.imageRevealed = this.id;
            } else if (this.id !== MemoryGame.session.imageRevealed) {
                if (MemoryGame.session.selectedImages[MemoryGame.session.imageRevealed] === MemoryGame.session.selectedImages[this.id]) {
                    $(".game-img").off("click", MemoryGame.revealImage);
                    setTimeout((() => $(".game-img").on("click", MemoryGame.revealImage)), MemoryGame.session.hideImageLagTime);
                    MemoryGame.session.goodAnswerCount++;
                    MemoryGame.session.imageRevealed = null;
                    console.log(this.id + " good: " + MemoryGame.session.goodAnswerCount);
                } else {
                    $(".game-img").off("click", MemoryGame.revealImage);
                    setTimeout(MemoryGame.hideImage.bind(this), MemoryGame.session.hideImageLagTime);
                    MemoryGame.session.wrongAnswerCount++;
                    console.log(this.id + " wrong: " + MemoryGame.session.wrongAnswerCount);
                }
            }
        }
        if (MemoryGame.session.goodAnswerCount === MemoryGame.session.numImages) {
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

    MemoryGame.start();

})();