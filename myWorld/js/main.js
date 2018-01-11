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
    var UI, uData;

    uData = {
        planetType: "",
        mass:  1,
        carbon:  1,
        silicon:  0,
        oxygen:  0,
        water:  0,
        iron:  0,
        zinc:  0,
        nitrogen:  0,
        totalLife:  0,
        plants:  0,
        animals:  0,
        sentience:  0,
        satellites:  0,
        wind:  0,
        alienAllied:  0,
        alienFriendly:  0,
        alienEnemy:  0,
        alienRogue:  0,
        heroes:  0
    };
    // game library
    var iNames = ["", "Mass", "Carbon", "Silicon", "Oxygen", "Water", "Iron", "Zinc", "Nitrogen", "Total Life", "Plants", "Animals", "Sentience", "Satellites", "Wind", "Alien Allied", "Alien Friendly", "Alien Enemy", "Alien Rogue", "Heroes"];
    var iKey = ["planetType", "mass", "carbon", "silicon", "oxygen", "water", "iron", "zinc", "nitrogen", "totalLife", "plants", "animals", "sentience", "satellites", "wind", "alienAllied", "alienFriendly", "alienEnemy", "alienRogue", "heroes"];
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

            if (!uD || uD === null) {
                localStorage.setItem("uData", JSON.stringify(uData));
            }

            //var x = localStorage.getItem("uData");
            //if (x) {
                //var xxx = JSON.parse(x);
               
            //}
            //console.log(xxx);
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
                eles, eBoxes,
                uD = localStorage.getItem("uData"),
                planetCase = UI.bySel(".planetCase"),
                waterLevel = UI.bySel(".waterLevel"),
                atmosphere = UI.bySel(".atmosphere");

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            bTable.innerHTML = "Year";
            bTable.className = "bTable";
            

            for (var i = 0; i < 20; i++) {
                eBoxes = "<div class='eBoxes'>" + uuu[iKey[i]] + "</div>";

                eles = UI.createEle("div");
                eles.innerHTML = iNames[i] + eBoxes;
                eles.className = "eles";

                bTable.appendChild(eles);
            }

            dvContain.appendChild(bTable);
            //console.log("Input block");
            UI.renderDialogBox(bTable, planetCase, waterLevel, atmosphere);
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
            var pT;

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

            localStorage.setItem("uData", JSON.stringify(uData));

            var x = localStorage.getItem("uData");
            if (x) {
                var xxx = JSON.parse(x);
            }

            //console.log(xxx);
        },
        renderDialogBox: (bTable, planetCase, waterLevel, atmosphere) => {
            //console.log(bTable);
        },
        renderTableUpdate: (bTable, planetCase, waterLevel, atmosphere) => {
            var uD = localStorage.getItem("uData");

            if (uD) {
                var uuu = JSON.parse(uD);
            }

            var eBoxes = UI.bySelAll(".eBoxes");
            for (var i = 0; i < eBoxes.length; i++) {
                //console.log(eBoxes[i]);
            }
            console.log(uuu.planetType);
            eBoxes[0].id = "planetNameCase";
            eBoxes[0].innerHTML = uuu.planetType;
        }
    };

    app.start();

    window.onload = () => {
        localStorage.clear();
        UI.init();
    };
})();
