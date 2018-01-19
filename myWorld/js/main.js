// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;

    var ViewManagement = Windows.UI.ViewManagement;
    var ApplicationViewWindowingMode = ViewManagement.ApplicationViewWindowingMode;
    var ApplicationView = ViewManagement.ApplicationView;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.voiceCommand) {
            // TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
            // this is a good place to decide whether to populate an input field or choose a different initial view.
        }
        else if (args.detail.kind === activation.ActivationKind.launch) {
            // A Launch activation happens when the user launches your app via the tile
            // or invokes a toast notification by clicking or tapping on the body.
            if (args.detail.arguments) {
                // TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
                // to take the user in response to them invoking a toast notification.
            }
            else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
                // TODO: This application had been suspended and was then terminated to reclaim memory.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
                // Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
            }
        }

        if (!args.detail.prelaunchActivated) {
            // TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
            // In that case it would be suspended shortly thereafter.
            // Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
            // should be done here (to avoid doing them in the prelaunch case).
            // Alternatively, this work can be done in a resume or visibilitychanged handler.
        }

        if (isFirstActivation) {
            // TODO: The app was activated and had not been running. Do general startup initialization here.
            document.addEventListener("visibilitychange", onVisibilityChanged);
            args.setPromise(WinJS.UI.processAll());
            ApplicationView.preferredLaunchWindowingMode = ApplicationViewWindowingMode.fullScreen;
        }

        isFirstActivation = false;
    };

    function onVisibilityChanged(args) {
        if (!document.hidden) {
            // TODO: The app just became visible. This may be a good time to refresh the view.
        }
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };
    // game globals
    var UI, uData, uLevel, tempSpecs;

    tempSpecs = {
        timeType: 0,
        timeLeft: 0
    }

    uLevel = 1;

    uData = {
        planetType: "",
        mass: 1,
        carbon: 1,
        silicon: 0,
        oxygen: 0,
        water: 0,
        iron: 0,
        zinc: 0,
        nitrogen: 0,
        totalLife: 0,
        plants: 0,
        animals: 0,
        sentience: 0,
        temp: 72,
        wind: 12,
        alienAllied: 0,
        alienFriendly: 0,
        alienEnemy: 0,
        alienRogue: 0,
        heroes: 0
    };
    // game library
    var iNames = ["", "Mass", "Carbon", "Silicon", "Oxygen", "Water", "Iron", "Zinc", "Nitrogen", "Total Life", "Plants", "Animals", "Sentience", "Temperature", "Wind", "Aliens Allied", "Aliens Friendly", "Aliens Enemy", "Aliens Rogue", "Heroes"];
    var iDefinitions = [
        " Ehawk",
        " is the total count of matter your planet is made of",
        " holds the key to making stuff happen.  It likes bonding and making complex organic compounds",
        " is a helpful metalic crystal that seeks out oxygen.  A conductor that likes oxygen, interesting...",
        " is essential for a healthy ozone and biosphere, you need it if life ever wants to live outside the ocean.",
        " is essential to create and sustain life, but needs an ozone to protect it",
        " Iron is important for all things from having a spinning liquid core to tools for your civilization...",
        ", a metalic conductor, helpful for when the ionisphere needs to send some lightning to the planet... lightning is great for triggering abiogenesis",
        ", the helpful gas that we need to cycle and trade compound elements throughout the biosphere,",
        " of our world, if any at all",
        " evolve floura and help create oxygen for the biosphere",
        " evolves much faster than plants and are key to creating a spacefaring civilization",
        " is the average rating of intelligence by gallactic standard",
        " can be natural or created by a civilization",
        " affects a civilizations' ability to build satilites and explore space",
        " to our planet are friendly and will protect the world",
        " to our planet will not try to colonize",
        " to our planet will try to colonize or conquer at any time.",
        " to our planet are unpredictable to an extreme",
        " are beings that are born of our world.  They help with various defenses",
    ];
    var iKey = ["planetType", "mass", "carbon", "silicon", "oxygen", "water", "iron", "zinc", "nitrogen", "totalLife", "plants", "animals", "sentience", "temp", "wind", "alienAllied", "alienFriendly", "alienEnemy", "alienRogue", "heroes"];
    var randMeteor = ["carbon", "silicon", "iron", "zinc"];
    var randComet = ["oxygen", "water"];
    var iButtons = ["Meteor", "Asteroid", "Comet", "Solar Flare", "Special"];
    var btnDes = ["Throw a ", "Send an ", "Lure a ", "Create a ", "Cast a "]
    //var planetTypes = ["Small Asteroid", "Small Asteroid", "Small Asteroid", "Asteroid", "Asteroid", "Asteroid"];
    //game
    UI = {
        //return statments
        createEle: (x) => { return document.createElement(x); },
        bySel: (x) => { return document.querySelector(x); },
        bySelAll: (x) => { return document.querySelectorAll(x); },
        //initializing and processing for localStorage
        init: () => {
            UI.myVoid();
            UI.myElements();
            UI.myInputs();
        },
        myVoid: () => {
            var uD = localStorage.getItem("uData");
            if (!uD) {
                localStorage.setItem("uData", JSON.stringify(uData));
            }

            var tS = localStorage.getItem("tempSpecs");
            if (!tS) {
                localStorage.setItem("tempSpecs", JSON.stringify(tempSpecs));
            }

            var uL = localStorage.getItem("uLevel");
            if (!uL) {
                localStorage.setItem("uLevel", uLevel);
            }
            //var x = localStorage.getItem("uData");
            //if (x) {
            //var xxx = JSON.parse(x);

            //}
            //console.log(localStorage);
        },
        //objects, autosaves and inputs
        myElements: () => {
            var ele = UI.createEle("div"),
                lavaLevel = UI.createEle("div"),
                plantLevel = UI.createEle("div"),
                civLevel = UI.createEle("div"),
                waterLevel = UI.createEle("div"),
                atmosphere = UI.createEle("div");

            atmosphere.innerHTML = "&nbsp;";
            atmosphere.className = "atmosphere";

            waterLevel.innerHTML = "&nbsp;";
            waterLevel.className = "waterLevel";

            civLevel.innerHTML = "&nbsp;";
            civLevel.className = "civLevel";

            plantLevel.innerHTML = "&nbsp;";
            plantLevel.className = "plantLevel";

            lavaLevel.innerHTML = "&nbsp;";
            lavaLevel.className = "lavaLevel";

            ele.className = "planetCase";

            
            ele.appendChild(plantLevel);
            ele.appendChild(waterLevel);
            ele.appendChild(lavaLevel);
            plantLevel.appendChild(civLevel);

            dvContain.appendChild(atmosphere);
            dvContain.appendChild(ele);
        },
        myInputs: () => {
            var bTable = UI.createEle("div"),
                dialogBox = UI.createEle("div"),
                specialsTable = UI.createEle("div"),
                optionsTable = UI.createEle("div"),
                eles, eBoxes,
                uD = localStorage.getItem("uData"),
                uL = localStorage.getItem("uLevel"),
                planetCase = UI.bySel(".planetCase"),
                lavaLevel = UI.bySel(".lavaLevel"),
                plantLevel = UI.bySel(".plantLevel"),
                civLevel = UI.bySel(".civLevel"),
                waterLevel = UI.bySel(".waterLevel"),
                atmosphere = UI.bySel(".atmosphere");

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            bTable.innerHTML = "";
            bTable.className = "bTable";

            for (var i = 0; i < 20; i++) {
                eBoxes = "<div class='eBoxes'>" + uuu[iKey[i]] + "</div>";

                eles = UI.createEle("div");
                eles.innerHTML = iNames[i] + eBoxes;
                eles.className = "eles";

                bTable.appendChild(eles);
            }

            dialogBox.innerHTML = "&nbsp;";
            dialogBox.className = "dialogBox";

            specialsTable.innerHTML = "&nbsp;";
            specialsTable.className = "specialsTable";
            for (var j = 0; j < 5; j++) {
                var specialBtns = UI.createEle("button");

                if (j >= uL) {
                    specialBtns.innerHTML = "LOCKED";
                    specialBtns.className = "specialBtns_locked";
                } else {
                    specialBtns.innerHTML = iButtons[j];
                    specialBtns.className = "specialBtns";
                    specialBtns.onmouseover = UI.hoverButtons(j, dialogBox);
                    specialBtns.onmouseout = UI.outHoverEffect(dialogBox);
                    specialBtns.onclick = UI.powerClickEffect(dialogBox, specialBtns, j);
                    
                }
                
                specialsTable.appendChild(specialBtns);
            }

            optionsTable.innerHTML = "⚙";
            optionsTable.className = "optionsTable_away";
            optionsTable.onclick = UI.getOptions(optionsTable);

            dvContain.appendChild(bTable);
            dvContain.appendChild(dialogBox);
            dvContain.appendChild(specialsTable);
            dvContain.appendChild(optionsTable);

            UI.renderDialogBox(bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere, dialogBox);

            ticker();

            function ticker() {
                setTimeout(() => {
                    UI.renderPlanetStatus(bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                    UI.timeTicker();
                    ticker();
                }, 500);
            }
            UI.renderTableUpdate(bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);

        },
        renderPlanetStatus: (bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere) => {
            var uD = localStorage.getItem("uData");

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            var winWidth = document.documentElement.clientWidth,
                winHeight = document.documentElement.clientHeight,
                uWidth = (+winWidth - uuu.mass) / 2,
                uHeight = (+winHeight - uuu.mass) / 2,
                uMass = uuu.mass / 10,
                bMass = uMass / 2;

            planetCase.style.width = uuu.mass + "px";
            planetCase.style.height = uuu.mass + "px";
            planetCase.style.left = uWidth + "px";
            planetCase.style.top = uHeight + "px";
            planetCase.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";
            planetCase.style.backgroundSize = uuu.mass + "px " + uuu.mass + "px";
            planetCase.style.animation = "spin " + (1000 - uuu.mass) + "s linear infinite";

            lavaLevel.style.width = uuu.mass + "px";
            lavaLevel.style.height = uuu.mass + "px";
            lavaLevel.style.left = "0";
            lavaLevel.style.top = "0";
            lavaLevel.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";
            lavaLevel.style.opacity = (uuu.temp * .0008);
            lavaLevel.style.backgroundSize = uuu.mass + "px " + uuu.mass + "px";
            lavaLevel.style.animation = "spin3 " + (1000 - uuu.mass) + "s linear infinite";

            plantLevel.style.width = uuu.mass + "px";
            plantLevel.style.height = uuu.mass + "px";
            plantLevel.style.left = "0";
            plantLevel.style.top = "0";
            plantLevel.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";
            if (uuu.oxygen > 60 && uuu.temp < 200) {
                plantLevel.style.opacity = (uuu.plants * .01);
            } else {
                plantLevel.style.opacity = 0;
            }
            plantLevel.style.backgroundSize = uuu.mass + "px " + uuu.mass + "px";
            plantLevel.style.animation = "spin " + (1000 - uuu.mass) + "s linear infinite";

            civLevel.style.width = uuu.mass + "px";
            civLevel.style.height = uuu.mass + "px";
            civLevel.style.left = "0";
            civLevel.style.top = "0";
            civLevel.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";
            if (uuu.oxygen > 60 && uuu.temp < 200) {
                civLevel.style.opacity = (uuu.sentience * .01);
            } else {
                civLevel.style.opacity = 0;
            }
            civLevel.style.backgroundSize = uuu.mass + "px " + uuu.mass + "px";
            civLevel.style.animation = "spin " + (1000 - uuu.mass) + "s linear infinite";

            waterLevel.style.width = uuu.mass + "px";
            waterLevel.style.height = uuu.mass + "px";
            waterLevel.style.left = "0";
            waterLevel.style.top = "0";
            waterLevel.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";
            waterLevel.style.opacity = (uuu.water * .01);
            waterLevel.style.backgroundSize = uuu.mass + "px " + uuu.mass + "px";
            waterLevel.style.animation = "spin " + (1000 - uuu.mass) + "s linear infinite";

            atmosphere.style.width = (+uuu.mass + 20) + "px";
            atmosphere.style.height = (+uuu.mass + 20) + "px";
            atmosphere.style.left = (+uWidth - 10) + "px";
            atmosphere.style.top = (+uHeight - 10) + "px";
            //atmosphere.style.boxShadow = "inset " + (bMass + 5) + "px -" + (bMass + 5) + "px " + (bMass + 5) + "px " + (bMass / 2) + "px rgba(0,0,0,0.4), inset " + (bMass / 4) + "px -" + (bMass / 2) + "px " + (bMass / 3) + "px " + (bMass / 10) + "px rgba(0,0,0,0.5), inset " + (bMass / 2) + "px -" + (bMass / 2) + "px " + (bMass / 2) + "px " + (bMass / 2) + "px rgba(0,0,0,0.6)";
            atmosphere.style.opacity = (uuu.oxygen * .01);
            //atmosphere.style.backgroundSize = (+uuu.mass + 10) + "px " + (uuu.mass * 2) + "px";
            atmosphere.style.animation = "spin2 " + (101 - uuu.wind) + "s linear infinite";

            UI.savePlanetStats(uuu, bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
        },
        savePlanetStats: (uuu, bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere) => {
            var pT, el,
                eBoxes = UI.bySelAll(".eBoxes");

            if (uuu.mass <= 5) {
                pT = "Small Asteroid";
            } else if (uuu.mass <= 10) {
                pT = "Medium Asteroid";
            } else if (uuu.mass <= 20) {
                pT = "Large Asteroid";
            } else if (uuu.mass <= 50) {
                el = 2;
                pT = "Small Dwarf Planet";
            } else if (uuu.mass <= 100) {
                pT = "Medium Dwarf Planet";
            } else if (uuu.mass <= 175) {
                pT = "Large Dwarf Planet";
                el = 3;
            } else if (uuu.mass <= 225) {
                pT = "Small Planet";
            } else if (uuu.mass <= 300) {
                pT = "Medium Planet";
            } else if (uuu.mass <= 400) {
                pT = "Large Planet";
                el = 4;
            } else if (uuu.mass <= 575) {
                pT = "Small Gaia Planet";
            } else if (uuu.mass <= 700) {
                pT = "Medium Gaia Planet";
            } else if (uuu.mass <= 900) {
                pT = "Large Gaia Planet";
                el = 5;
            }

            uData.planetType = pT;
            uData.mass = eBoxes[1].innerHTML;
            uData.carbon = eBoxes[2].innerHTML;
            uData.silicon = eBoxes[3].innerHTML;
            uData.oxygen = eBoxes[4].innerHTML;
            uData.water = eBoxes[5].innerHTML;
            uData.iron = eBoxes[6].innerHTML;
            uData.zinc = eBoxes[7].innerHTML;
            uData.plants = eBoxes[10].innerHTML;
            uData.temp = eBoxes[13].innerHTML;

            localStorage.setItem("uData", JSON.stringify(uData));

            if (!el || el === undefined) {

            } else {
                localStorage.setItem("uLevel", el);

            }
            
            //localStorage.setItem("uLevel", el);
            
           // var x = localStorage.getItem("uData");
           // if (x) {
            //    var xxx = JSON.parse(x);
            //}

            //console.log(xxx);
        },

        //dialog and hover effects
        hoverButtons: (j, dialogBox) => {
            return () => {
                dialogBox.innerHTML = btnDes[j] + iButtons[j];

            }
        },  
        outHoverEffect: (dialogBox) => {
            return () => {
                dialogBox.innerHTML = "&nbsp;";
            }
        },
        hoverTableEffect: (bT, k, dialogBox) => {
            return () => {
                if (iNames[k] != "") {
                    dialogBox.innerHTML = iNames[k] + iDefinitions[k];
                } else {
                    dialogBox.innerHTML = "&nbsp;";
                }
            }
        },
        renderDialogBox: (bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere, dialogBox) => {
            var uD = localStorage.getItem("uData"),
                bT = bTable.childNodes;

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            for (var k = 0; k < bT.length; k++) {
                bT[k].onmouseover = UI.hoverTableEffect(bT, k, dialogBox);
                bT[k].onmouseout = UI.outHoverEffect(dialogBox);
            }
        },
        hoverOptions: (x, dialogBox) => {
            return () => {
                var ele;

                if (x.className === "delAll") {
                    ele = "Delete all and start over?";
                } else {
                    ele = "somethings wrong hang on...";
                }
                dialogBox.innerHTML = ele;
            }
        },
        //timing agents
        timeTicker: () => {
            var uD = localStorage.getItem("uData"),
                eBoxes = UI.bySelAll(".eBoxes");

            if (uD) {
                var uuu = JSON.parse(uD);
            }
            if (uuu.temp > 72) {
                var dThing = uuu.temp - (uuu.mass * .5),
                    
                    d = Math.round(dThing);

                eBoxes[13].innerHTML = d;
            } else {
                eBoxes[13].innerHTML = 72;
            }
            //console.log(eBoxes[13].innerHTML);
        },
        //power effects
        powerClickEffect: (dialogBox, specialBtns, j) => {
            return () => {
                
                var planetCase = UI.bySel(".planetCase"),
                    pH = planetCase.style.height,
                    pW = planetCase.style.width,
                    pNum = pH.slice(0, -2),
                    pNum2 = pH.slice(0, -2);
                var x = randMeteor[Math.floor(randMeteor.length * Math.random())];
                var x2 = randComet[Math.floor(randComet.length * Math.random())];
                var winWidth = document.documentElement.clientWidth,
                    winHeight = document.documentElement.clientHeight;
                var randHeight = Math.floor((Math.random() * winHeight) + 1),
                    halfHeight = winHeight / 2;
                var randWidth = Math.floor((Math.random() * 3) - 3) + +50,
                    halfWidth = winWidth / 2;
                var randCenter = Math.floor((Math.random() * pNum) + 1),
                    randCenter2 = Math.floor((Math.random() * pNum2) + 1);
                var bTable = UI.bySel(".bTable"),
                    planetCase = UI.bySel(".planetCase"),
                    waterLevel = UI.bySel(".waterLevel"),
                    civLevel = UI.bySel(".civLevel"),
                    plantLevel = UI.bySel(".plantLevel"),
                    lavaLevel = UI.bySel(".lavaLevel"),
                    atmosphere = UI.bySel(".atmosphere");

                var pH = planetCase.style.height;

                specialBtns[j].innerHTML = "Pending";
                specialBtns[j].className = "specialBtns_busy";
                specialBtns[j].onmouseover = null;
                specialBtns[j].onclick = null;

                setTimeout(() => {
                    if (j === 0) {
                        dialogBox.innerHTML = x + " meteor sent!";
                        UI.sendMeteor(dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth);
                    } else if (j === 1) {
                        dialogBox.innerHTML = x + " asteroid sent!";
                        UI.sendAsteroid(dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth);
                    } else if (j === 2) {
                        dialogBox.innerHTML = x2 + " comet sent!";
                        UI.sendComet(dialogBox, specialBtns, j, x2, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth);
                    } else if (j === 3) {
                        dialogBox.innerHTML = " solar Flare sent!";
                        UI.sendMeteor(dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter);
                    } else if (j === 4) {
                        dialogBox.innerHTML = " special sent!";
                        UI.sendMeteor(dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter);
                    }
                }, 1000);
            }
        },
        sendMeteor: (dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth) => {
            var meteor = UI.createEle("div"),
                uL = localStorage.getItem("uLevel"),
                uD = localStorage.getItem("uData"),
                bTable = UI.bySel(".bTable"),
                planetCase = UI.bySel(".planetCase"),
                lavaLevel = UI.bySel(".lavaLevel"),
                waterLevel = UI.bySel(".waterLevel"),
                civLevel = UI.bySel(".civLevel"),
                plantLevel = UI.bySel(".plantLevel"),
                atmosphere = UI.bySel(".atmosphere"),
                eBoxes = UI.bySelAll(".eBoxes");

            if (uD) {
                var uuu = JSON.parse(uD);
            };

            var halfHeight = winHeight / 2;
            var halfWidth = winWidth / 2;

            var halfRandHeight = (randCenter / 2);
            var halfRandWidth = (randCenter2 / 2);

            var offsetHeight = Math.floor((Math.random() * halfRandHeight) - (halfRandHeight / 2));
            var offsetWidth = Math.floor((Math.random() * halfRandWidth) - (halfRandWidth / 2));

            var offsetYResult = halfHeight + offsetHeight;
            var offsetXResult = halfWidth + offsetWidth;

            meteor.innerHTML = "&nbsp;";
            meteor.className = "meteor";

            meteor.style.top = randHeight + "px";
            meteor.style.right = "-10px";

            dvContain.appendChild(meteor);

            setTimeout(() => {
                meteor.className = "meteor_fly";

                meteor.style.top = offsetYResult + "px";
                meteor.style.right = offsetXResult + "px";

                setTimeout(() => {
                    meteor.className = "meteor_exploding";
                    meteor.style.top = offsetYResult + "px";
                    meteor.style.right = offsetXResult + "px";
                    if (uuu.temp < 3000) {
                        UI.strikeTemp(meteor, uuu, eBoxes);
                    }
                    setTimeout(() => {
                        meteor.remove();
                        
                    }, 1300);
                    if (j >= uL) {
                        specialBtns.innerHTML = "LOCKED";
                        specialBtns.className = "specialBtns_locked";
                    } else {
                        specialBtns.innerHTML = iButtons[j];
                        specialBtns.className = "specialBtns";
                        specialBtns.onmouseover = UI.hoverButtons(j, dialogBox);
                        specialBtns.onmouseout = UI.outHoverEffect(dialogBox);
                        specialBtns.onclick = UI.powerClickEffect(dialogBox, specialBtns, j);
                        
                        eBoxes[1].innerHTML = +eBoxes[1].innerHTML + +1;
                        if (x === "carbon") {
                            eBoxes[2].innerHTML = +eBoxes[2].innerHTML + +1;
                        } else if (x === "silicon") {
                            eBoxes[3].innerHTML = +eBoxes[3].innerHTML + +1;
                        } else if (x === "iron") {
                            eBoxes[6].innerHTML = +eBoxes[6].innerHTML + +1;
                        } else if (x === "zinc") {
                            eBoxes[7].innerHTML = +eBoxes[7].innerHTML + +1;
                        }

                        UI.renderPlanetStatus(bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.savePlanetStats(uuu, bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.renderTableUpdate(bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                    }
                }, 3000);
            }, 100);

            //console.log("create meteor");
        },
        strikeTemp: (meteor, uuu, eBoxes) => {
            var myNum = 1000 - (uuu.mass * 10);
            
            eBoxes[13].innerHTML = +eBoxes[13].innerHTML + +((+uuu.temp + +myNum) - (+uuu.oxygen + +uuu.water));
        },

        sendAsteroid: (dialogBox, specialBtns, j, x, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth) => {
            var asteroid = UI.createEle("div"),
                uL = localStorage.getItem("uLevel"),
                uD = localStorage.getItem("uData"),
                bTable = UI.bySel(".bTable"),
                planetCase = UI.bySel(".planetCase"),
                lavaLevel = UI.bySel(".lavaLevel"),
                waterLevel = UI.bySel(".waterLevel"),
                civLevel = UI.bySel(".civLevel"),
                plantLevel = UI.bySel(".plantLevel"),
                atmosphere = UI.bySel(".atmosphere"),
                eBoxes = UI.bySelAll(".eBoxes");

            if (uD) {
                var uuu = JSON.parse(uD);
            };

            var halfHeight = winHeight / 2;
            var halfWidth = winWidth / 2;

            var halfRandHeight = (randCenter / 2);
            var halfRandWidth = (randCenter2 / 2);

            var offsetHeight = Math.floor((Math.random() * halfRandHeight) - (halfRandHeight / 2));
            var offsetWidth = Math.floor((Math.random() * halfRandWidth) - (halfRandWidth / 2));

            var offsetYResult = halfHeight + offsetHeight;
            var offsetXResult = halfWidth + offsetWidth;

            asteroid.innerHTML = "&nbsp;";
            asteroid.className = "asteroid";
            asteroid.style.top = randHeight + "px";
            asteroid.style.right = "-80px";

            dvContain.appendChild(asteroid);

            setTimeout(() => {
                asteroid.className = "asteroid_fly";
                asteroid.style.top = offsetYResult + "px";
                asteroid.style.right = offsetXResult + "px";

                setTimeout(() => {
                    
                    asteroid.className = "asteroid_exploding";
                    asteroid.style.top = (offsetYResult - 16) + "px";
                    asteroid.style.right = (offsetXResult - 24) + "px";
                    if (uuu.temp < 6000) {
                        UI.strikeAsteroidTemp(asteroid, uuu, eBoxes);
                    }
                    setTimeout(() => {
                        asteroid.remove();

                    }, 1300);
                    if (j >= uL) {
                        specialBtns.innerHTML = "LOCKED";
                        specialBtns.className = "specialBtns_locked";
                    } else {
                        specialBtns.innerHTML = iButtons[j];
                        specialBtns.className = "specialBtns";
                        specialBtns.onmouseover = UI.hoverButtons(j, dialogBox);
                        specialBtns.onmouseout = UI.outHoverEffect(dialogBox);
                        specialBtns.onclick = UI.powerClickEffect(dialogBox, specialBtns, j);

                        eBoxes[1].innerHTML = +eBoxes[1].innerHTML + +3;
                        if (x === "carbon") {
                            eBoxes[2].innerHTML = +eBoxes[2].innerHTML + +2;
                            eBoxes[6].innerHTML = +eBoxes[6].innerHTML + +1;
                        } else if (x === "silicon") {
                            eBoxes[6].innerHTML = +eBoxes[6].innerHTML + +1;
                            eBoxes[3].innerHTML = +eBoxes[3].innerHTML + +2;
                        } else if (x === "iron") {
                            eBoxes[6].innerHTML = +eBoxes[6].innerHTML + +3;
                        } else if (x === "zinc") {
                            eBoxes[6].innerHTML = +eBoxes[6].innerHTML + +1;
                            eBoxes[7].innerHTML = +eBoxes[7].innerHTML + +2;
                        }

                        UI.renderPlanetStatus(bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.savePlanetStats(uuu, bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.renderTableUpdate(bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                    }
                }, 3000);
            }, 100);

            //console.log("create meteor");
        },
        strikeAsteroidTemp: (asteroid, uuu, eBoxes) => {
            var myNum = 10000 - (uuu.mass * 1);

            eBoxes[13].innerHTML = +eBoxes[13].innerHTML + +((+uuu.temp + +myNum) - (+uuu.oxygen + +uuu.water));
        },

        sendComet: (dialogBox, specialBtns, j, x2, randWidth, randHeight, randCenter, randCenter2, winHeight, winWidth) => {
            var comet = UI.createEle("div"),
                uL = localStorage.getItem("uLevel"),
                uD = localStorage.getItem("uData"),
                bTable = UI.bySel(".bTable"),
                planetCase = UI.bySel(".planetCase"),
                lavaLevel = UI.bySel(".lavaLevel"),
                waterLevel = UI.bySel(".waterLevel"),
                civLevel = UI.bySel(".civLevel"),
                plantLevel = UI.bySel(".plantLevel"),
                atmosphere = UI.bySel(".atmosphere"),
                eBoxes = UI.bySelAll(".eBoxes");

            if (uD) {
                var uuu = JSON.parse(uD);
            };

            var halfHeight = winHeight / 2;
            var halfWidth = winWidth / 2;

            var halfRandHeight = (randCenter / 2);
            var halfRandWidth = (randCenter2 / 2);

            var offsetHeight = Math.floor((Math.random() * halfRandHeight) - (halfRandHeight / 2));
            var offsetWidth = Math.floor((Math.random() * halfRandWidth) - (halfRandWidth / 2));

            var offsetYResult = halfHeight + offsetHeight;
            var offsetXResult = halfWidth + offsetWidth;

            comet.innerHTML = "&nbsp;";
            comet.className = "comet";

            comet.style.top = randHeight + "px";
            comet.style.right = "-60px";

            dvContain.appendChild(comet);

            setTimeout(() => {
                comet.className = "comet_fly";

                comet.style.top = offsetYResult + "px";
                comet.style.right = offsetXResult + "px";

                setTimeout(() => {
                    comet.className = "comet_exploding";
                    comet.style.top = offsetYResult + "px";
                    comet.style.right = offsetXResult + "px";

                    if (uuu.temp < 12000) {
                        UI.strikeAsteroidTemp(comet, uuu, eBoxes);
                    }

                    setTimeout(() => {
                        comet.remove();

                    }, 1300);
                    if (j >= uL) {
                        specialBtns.innerHTML = "LOCKED";
                        specialBtns.className = "specialBtns_locked";
                    } else {
                        specialBtns.innerHTML = iButtons[j];
                        specialBtns.className = "specialBtns";
                        specialBtns.onmouseover = UI.hoverButtons(j, dialogBox);
                        specialBtns.onmouseout = UI.outHoverEffect(dialogBox);
                        specialBtns.onclick = UI.powerClickEffect(dialogBox, specialBtns, j);

                        eBoxes[1].innerHTML = +eBoxes[1].innerHTML + +4;
                        if (x2 === "oxygen") {
                            eBoxes[4].innerHTML = +eBoxes[4].innerHTML + +3;
                            eBoxes[5].innerHTML = +eBoxes[5].innerHTML + +1;
                        } else if (x2 === "water") {
                            eBoxes[4].innerHTML = +eBoxes[4].innerHTML + +1;
                            eBoxes[5].innerHTML = +eBoxes[5].innerHTML + +3;
                        }

                        UI.renderPlanetStatus(bTable, specialBtns, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.savePlanetStats(uuu, bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                        UI.renderTableUpdate(bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere);
                    }
                }, 3000);
            }, 100);

            //console.log("create meteor");
        },
        strikeCometTemp: (comet, uuu, eBoxes) => {
            var myNum = 100000 - (uuu.mass * .1);

            eBoxes[13].innerHTML = +eBoxes[13].innerHTML + +((+uuu.temp + +myNum) - (+uuu.oxygen + +uuu.water));
        },

        renderTableUpdate: (bTable, planetCase, lavaLevel, waterLevel, plantLevel, civLevel, atmosphere) => {
            var uD = localStorage.getItem("uData"),
                uL = localStorage.getItem("uLevel"),
                dialogBox = UI.bySel(".dialogBox");

            var specialBtns = UI.bySelAll(".specialsTable button");

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            var eBoxes = UI.bySelAll(".eBoxes");


            eBoxes[0].id = "planetNameCase";
            eBoxes[0].innerHTML = uuu.planetType;
            eBoxes[1].innerHTML = uuu.mass;
            eBoxes[2] = eBoxes[2].innerHTML;
            eBoxes[3] = eBoxes[3].innerHTML;
            eBoxes[4] = eBoxes[4].innerHTML;
            eBoxes[5] = eBoxes[5].innerHTML;
            eBoxes[6] = eBoxes[6].innerHTML;
            eBoxes[7] = eBoxes[7].innerHTML;

            for (var j = 0; j < specialBtns.length; j++) {

                if (j >= uL) {
                    specialBtns.innerHTML = "LOCKED";
                    specialBtns.className = "specialBtns_locked";
                } else {
 
                        specialBtns[j].innerHTML = iButtons[j];
                        specialBtns[j].className = "specialBtns";
                        specialBtns[j].onmouseover = UI.hoverButtons(j, dialogBox);
                        specialBtns[j].onmouseout = UI.outHoverEffect(dialogBox);
                        specialBtns[j].onclick = UI.powerClickEffect(dialogBox, specialBtns, j);
                    
                }
            }
        },
        
        //options and admin stuff
        getOptions: (optionsTable) => {
            return () => {
                var delAll = UI.createEle("button"),
                    dialogBox = UI.bySel(".dialogBox");

                delAll.className = "delAll";
                delAll.innerHTML = "🗑";
                delAll.onclick = UI.deleteAllStorage();
                delAll.onmouseover = UI.hoverOptions(delAll, dialogBox);
                delAll.onmouseout = UI.outHoverEffect(dialogBox);

                optionsTable.innerHTML = "<span id='spnXout'>✖</span>";
                optionsTable.className = "optionsTable_here";
                optionsTable.onclick = null;

                var spnXout = UI.bySel("#spnXout");
                spnXout.onclick = UI.spnXoutFunc(spnXout, optionsTable);

                setTimeout(() => {
                    optionsTable.appendChild(delAll);
                }, 100);
            }
        },
        spnXoutFunc: (spnXout, optionsTable) => {
            return () => {
                setTimeout(() => {
                    optionsTable.innerHTML = "⚙";
                    optionsTable.className = "optionsTable_away";
                    optionsTable.onclick = UI.getOptions(optionsTable);
                }, 10);
            }
        },
        deleteAllStorage: () => {
            return () => {
                localStorage.clear();
                location.reload();
            }
        }
    };
    

    app.start();

    window.onload = () => {
        //localStorage.clear();
        UI.init();
        //console.log(localStorage);
    };
})();
