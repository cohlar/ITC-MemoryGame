// STAR
// add game reset function
// add header with logo and button to reset
// win modal with button for new game

// GEEK
// add game reset function
// add header with logo and button to reset
// win modal with button for new game

"use strict";

let start = function () {
    html.init();
    addEventListeners();
};

let addEventListeners = function () {
    html.images.forEach(image => image.addEventListener("click", html.revealImage));
};


let images = {
    path: "images/",
    unknownImageName: "0.jpg",
    totalImagesAvailable: 34,   // number of bootcampers in cohort Oct 2019
}

let html = {
    gameContainer: undefined,
    images: undefined,

    init: function () {
        this.generateStructure();
        this.generateImagesHTML();
    },

    generateStructure: function () {
        this.gameContainer = document.createElement("div");
        this.gameContainer.id = "game-container";
        document.body.append(this.gameContainer);
    },

    generateImagesHTML: function () {
        gameSession.selectImagesRandomly(gameSession.numImages);
        gameSession.doubleImagesRandomly();
        gameSession.selectedImages.forEach( function(imageName, index) {
            let img = document.createElement("img");
            img.src = images.path + images.unknownImageName;
            img.id = index;
            img.className = "game-img";
            html.gameContainer.append(img);
        });
        this.images = document.querySelectorAll(".game-img");
    },

    revealImage: function () {
        this.src = images.path + gameSession.selectedImages[this.id] + ".jpg";
        if (gameSession.isCompleted === false) {
            if (gameSession.imageRevealed === null) {
                gameSession.imageRevealed = this.id;
            } else if (this.id !== gameSession.imageRevealed) {
                if (gameSession.selectedImages[gameSession.imageRevealed] === gameSession.selectedImages[this.id]) {
                    html.imagesRemoveEventListener();
                    setTimeout(html.imagesAddEventListener, gameSession.hideImageLagTime);
                    gameSession.goodAnswerCount++;
                    gameSession.imageRevealed = null;
                    console.log(this.id + " good: " + gameSession.goodAnswerCount);
                } else {
                    html.imagesRemoveEventListener();
                    setTimeout(html.hideImage.bind(this), gameSession.hideImageLagTime);
                    gameSession.wrongAnswerCount++;
                    console.log(this.id + " wrong: " + gameSession.wrongAnswerCount);
                }
            }
        }
        if (gameSession.goodAnswerCount === gameSession.numImages) {
            gameSession.isCompleted = true;
            html.imagesRemoveEventListener();
        }
    },

    hideImage: function () {
        this.src = images.path + images.unknownImageName;
        document.getElementById(gameSession.imageRevealed).src = images.path + images.unknownImageName;
        html.imagesAddEventListener();
        gameSession.imageRevealed = null;
    },

    imagesAddEventListener: function () {
        html.images.forEach(image => image.addEventListener("click", html.revealImage));
    },

    imagesRemoveEventListener: function () {
        html.images.forEach(image => image.removeEventListener("click", html.revealImage));
    },
}

let gameSession = {
    numImages: 6,               // beginner mode
    selectedImages: [],
    imageRevealed: null,
    hideImageLagTime: 2000,     // in ms
    goodAnswerCount: 0,
    wrongAnswerCount: 0,
    isCompleted: false,

    selectImagesRandomly: function (numInput) {
        while (this.selectedImages.length < numInput) {
            let rand = Math.floor(Math.random() * images.totalImagesAvailable) + 1;
            if(this.selectedImages.indexOf(rand) === -1) this.selectedImages.push(rand);
        }
    },

    doubleImagesRandomly: function () {
        this.selectedImages = this.selectedImages.concat(this.selectedImages);
        this.shuffle(this.selectedImages);
    },

    shuffle: function (array) {
        array.sort(() => Math.random() - 0.5);
    },
};

start();