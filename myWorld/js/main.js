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
    var UI, uData, uLevel;

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
        satellites: 0,
        wind: 0,
        alienAllied: 0,
        alienFriendly: 0,
        alienEnemy: 0,
        alienRogue: 0,
        heroes: 0
    };
    // game library
    var iNames = ["", "Mass", "Carbon", "Silicon", "Oxygen", "Water", "Iron", "Zinc", "Nitrogen", "Total Life", "Plants", "Animals", "Sentience", "Satellites", "Wind", "Aliens Allied", "Aliens Friendly", "Aliens Enemy", "Aliens Rogue", "Heroes"];
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
    var iKey = ["planetType", "mass", "carbon", "silicon", "oxygen", "water", "iron", "zinc", "nitrogen", "totalLife", "plants", "animals", "sentience", "satellites", "wind", "alienAllied", "alienFriendly", "alienEnemy", "alienRogue", "heroes"];

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
        //objects and inputs
        myElements: () => {
            var ele = UI.createEle("div"),
                waterLevel = UI.createEle("div"),
                atmosphere = UI.createEle("div");

            atmosphere.innerHTML = "&nbsp;";
            atmosphere.className = "atmosphere";

            waterLevel.innerHTML = "&nbsp;";
            waterLevel.className = "waterLevel";

            ele.className = "planetCase";
            ele.appendChild(waterLevel);

            ele.appendChild(atmosphere);

            dvContain.appendChild(ele);
        },
        myInputs: () => {
            var bTable = UI.createEle("div"),
                dialogBox = UI.createEle("div"),
                specialsTable = UI.createEle("div"),
                eles, eBoxes,
                uD = localStorage.getItem("uData"),
                uL = localStorage.getItem("uLevel"),
                planetCase = UI.bySel(".planetCase"),
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

            dvContain.appendChild(bTable);
            dvContain.appendChild(dialogBox);
            dvContain.appendChild(specialsTable);

            UI.renderDialogBox(bTable, planetCase, waterLevel, atmosphere, dialogBox);
            UI.renderPlanetStatus(bTable, planetCase, waterLevel, atmosphere);
            UI.renderTableUpdate(bTable, planetCase, waterLevel, atmosphere);

        },
        renderPlanetStatus: (bTable, planetCase, waterLevel, atmosphere) => {
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

            waterLevel.style.width = uuu.mass + "px";
            waterLevel.style.height = uuu.mass + "px";
            waterLevel.style.left = uWidth + "px";
            waterLevel.style.top = uHeight + "px";
            waterLevel.style.boxShadow = "inset " + uMass + "px -" + uMass + "px " + uMass + "px " + (uMass / 2) + "px #000, inset -" + (uMass / 4) + "px -" + (uMass / 2) + "px " + (uMass / 3) + "px " + (uMass / 10) + "px rgba(101, 11, 11, 0.28), inset 1px 2px 1px 1px rgba(255, 216, 0, 0.10)";

            atmosphere.style.width = (uuu.mass - 1) + "px";
            atmosphere.style.height = (uuu.mass - 1) + "px";
            atmosphere.style.left = "0";
            atmosphere.style.top = "0";
            atmosphere.style.boxShadow = "inset " + (bMass + 5) + "px -" + (bMass + 5) + "px " + (bMass + 5) + "px " + (bMass / 2) + "px rgba(0,0,0,0.4), inset " + (bMass / 4) + "px -" + (bMass / 2) + "px " + (bMass / 3) + "px " + (bMass / 10) + "px rgba(0,0,0,0.5), inset " + (bMass / 2) + "px -" + (bMass / 2) + "px " + (bMass / 2) + "px " + (bMass / 2) + "px rgba(0,0,0,0.6)";

            UI.savePlanetStats(uuu, bTable);
        },
        savePlanetStats: (uuu, bTable) => {
            var pT, eBoxes = UI.bySelAll(".eBoxes");

            if (uuu.mass <= 5) {
                pT = "Small Asteroid";
            } else if (uuu.mass <= 10) {
                pT = "Medium Asteroid";
            } else if (uuu.mass <= 20) {
                pT = "Large Asteroid";
            } else if (uuu.mass <= 50) {
                pT = "Small Dwarf Planet";
            } else if (uuu.mass <= 100) {
                pT = "Medium Dwarf Planet";
            } else if (uuu.mass <= 175) {
                pT = "Large Dwarf Planet";
            } else if (uuu.mass <= 225) {
                pT = "Small Planet";
            } else if (uuu.mass <= 300) {
                pT = "Medium Planet";
            } else if (uuu.mass <= 400) {
                pT = "Large Planet";
            } else if (uuu.mass <= 575) {
                pT = "Small Gaia Planet";
            } else if (uuu.mass <= 700) {
                pT = "Medium Gaia Planet";
            } else if (uuu.mass <= 900) {
                pT = "Large Gaia Planet";
            }

            uData.planetType = pT;
            uData.mass = eBoxes[1].innerHTML;

            localStorage.setItem("uData", JSON.stringify(uData));

            var x = localStorage.getItem("uData");
            if (x) {
                var xxx = JSON.parse(x);
            }

            //console.log(xxx);
        },
        hoverButtons: (j, dialogBox) => {
            return () => {
                dialogBox.innerHTML = btnDes[j] + iButtons[j];

            }
        },
        renderDialogBox: (bTable, planetCase, waterLevel, atmosphere, dialogBox) => {
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
        powerClickEffect: (dialogBox, specialBtns, j) => {
            return () => {
                specialBtns.innerHTML = "Pending";
                specialBtns.className = "specialBtns_busy";
                specialBtns.onmouseover = null;
                specialBtns.onclick = null;
                if (j === 0) {
                    dialogBox.innerHTML = "Meteor sent!";

                    UI.sendMeteor(dialogBox, specialBtns, j);
                } else if (j === 1) {
                    dialogBox.innerHTML = "Asteroid sent!";
                } else if (j === 2) {
                    dialogBox.innerHTML = "Comet sent!";
                } else if (j === 3) {
                    dialogBox.innerHTML = "Solar Flare sent!";
                } else if (j === 4) {
                    dialogBox.innerHTML = "Special sent!";
                }
            }
        },
        sendMeteor: (dialogBox, specialBtns, j) => { 
            var meteor = UI.createEle("div"),
                uL = localStorage.getItem("uLevel"),
                uD = localStorage.getItem("uData"),
                bTable = UI.bySel(".bTable"),
                planetCase = UI.bySel(".planetCase"),
                waterLevel = UI.bySel(".waterLevel"),
                atmosphere = UI.bySel(".atmosphere"),
                eBoxes = UI.bySelAll(".eBoxes");

            if (uD) {
                var uuu = JSON.parse(uD);
            };

                meteor.innerHTML = "&nbsp;";
                meteor.className = "meteor";

                dvContain.appendChild(meteor);

                setTimeout(() => {
                    meteor.className = "meteor_fly";
                    setTimeout(() => {
                        meteor.remove();
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

                            UI.renderPlanetStatus(bTable, planetCase, waterLevel, atmosphere);
                            UI.renderTableUpdate(bTable, planetCase, waterLevel, atmosphere);
                            UI.savePlanetStats(uuu, bTable);
                        }
                    }, 3000);
                }, 100);

            //console.log("create meteor");
        },
        renderTableUpdate: (bTable, planetCase, waterLevel, atmosphere) => {
            var uD = localStorage.getItem("uData");

            if (uD) {
                var uuu = JSON.parse(uD);
            }


            var eBoxes = UI.bySelAll(".eBoxes");

            //console.log(uuu.planetType);
            eBoxes[0].id = "planetNameCase";
            eBoxes[0].innerHTML = uuu.planetType;
            eBoxes[1].innerHTML = uuu.mass;
            
        }
    };

    app.start();

    window.onload = () => {
        //localStorage.clear();
        UI.init();
        //console.log(localStorage);
    };
})();
