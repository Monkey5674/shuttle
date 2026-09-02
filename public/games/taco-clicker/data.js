/* Manuel's Taco Clicker — game data (producers, upgrades, eras, achievements, copy). */
// eslint-disable-next-line no-unused-vars
const DATA = {
 "version": 1,
 "producers": [
  {
   "id": "press",
   "name": "Tortilla Press",
   "desc": "Abuela's old cast-iron press. Still works.",
   "flavor": "It squeaks, but so does Abuela, and she still makes the best tortillas in town.",
   "cost": 15,
   "income": 0.1,
   "era": 1,
   "icon": "press",
   "tiers": [
    {
     "name": "Oiled Hinges",
     "flavor": "A drop of oil and it stops screaming. Abuela says it just needed to be listened to."
    },
    {
     "name": "Double-Decker Press",
     "flavor": "Two tortillas at once. Manuel feels like a wizard. Diego feels hungry."
    },
    {
     "name": "Stone-Ground Masa",
     "flavor": "Real masa, ground the old way. The whole block smells like Sunday morning."
    },
    {
     "name": "Hydraulic Press",
     "flavor": "Manuel found it at a garage sale. The tortillas come out perfect and slightly scared."
    },
    {
     "name": "Tortilla Conveyor Belt",
     "flavor": "They just keep coming. Nobody knows where the end of the belt is."
    },
    {
     "name": "Quantum Tortilla Folding",
     "flavor": "Each tortilla is folded and unfolded until you look. Then it's a taco."
    }
   ]
  },
  {
   "id": "cousin",
   "name": "Cousin Diego",
   "desc": "Paid in tacos. Surprisingly efficient.",
   "flavor": "Diego is fourteen, eats like he is forty, and works like he is paid. He is not.",
   "cost": 100,
   "income": 1,
   "era": 1,
   "icon": "cousin",
   "tiers": [
    {
     "name": "Diego Learns to Chop",
     "flavor": "Only two band-aids. A new record. Abuela is very proud, kind of."
    },
    {
     "name": "Diego's Lucky Apron",
     "flavor": "It says WORLD'S OKAYEST COUSIN. He washes it every third week."
    },
    {
     "name": "Diego Brings Friends",
     "flavor": "Half the seventh grade now works for tacos. The school is concerned but full."
    },
    {
     "name": "Diego Gets a Bike",
     "flavor": "Deliveries within six blocks. Within seven blocks if the taco is already paid for."
    },
    {
     "name": "Diego, Shift Manager",
     "flavor": "He made a clipboard. He made a whistle. Nobody asked for the whistle."
    },
    {
     "name": "A Thousand Diegos",
     "flavor": "Manuel is not sure how. Abuela says every family has a Diego. Now yours has more."
    }
   ]
  },
  {
   "id": "salsa",
   "name": "Salsa Bar",
   "desc": "Five salsas. One is a dare.",
   "flavor": "Verde, roja, pineapple, roasted, and the one Abuela labels only with a skull.",
   "cost": 1100,
   "income": 8,
   "era": 1,
   "icon": "salsa",
   "tiers": [
    {
     "name": "Fresh Cilantro Daily",
     "flavor": "Picked from the backyard. Diego says it tastes like soap. Diego is outvoted."
    },
    {
     "name": "Roasted Garlic Batch",
     "flavor": "You can smell it from the bus stop. Bus ridership is up."
    },
    {
     "name": "Abuela's Habanero Secret",
     "flavor": "The secret is that she just keeps adding habaneros. Nobody has finished a cup."
    },
    {
     "name": "Salsa Flight Tasting",
     "flavor": "Five little cups on a wooden board. The skull cup is always still full."
    },
    {
     "name": "Salsa Sommelier",
     "flavor": "A man in a vest describes the notes. The notes are: hot, hotter, and regret."
    },
    {
     "name": "Salsa Volcano",
     "flavor": "Abuela is not sure this counts as a salsa. Customers are not sure it counts as safe."
    }
   ]
  },
  {
   "id": "stand",
   "name": "Taco Stand",
   "desc": "A real stand on the corner of 5th and Main.",
   "flavor": "The line goes around the block on Fridays. On Saturdays it goes around twice.",
   "cost": 12000,
   "income": 47,
   "era": 2,
   "icon": "stand",
   "tiers": [
    {
     "name": "Hand-Painted Sign",
     "flavor": "MANUEL'S TACOS, in Diego's best letters. The S is backwards. It stays."
    },
    {
     "name": "Folding Chairs",
     "flavor": "Four of them. Abuela sits in one and judges everybody's order."
    },
    {
     "name": "String Lights",
     "flavor": "The corner is now the nicest corner. The city has not noticed. The moths have."
    },
    {
     "name": "Second Register",
     "flavor": "Diego runs it. Diego is fast. Diego also accepts baseball cards."
    },
    {
     "name": "Tiny Mariachi Corner",
     "flavor": "Three guys from the neighborhood. They only know four songs, but they play them loud."
    },
    {
     "name": "Landmark Status",
     "flavor": "Tour buses stop here now. The S on the sign is still backwards. It is protected."
    }
   ]
  },
  {
   "id": "truck",
   "name": "Food Truck",
   "desc": "MANUEL'S painted on the side. Slightly crooked.",
   "flavor": "It was a bread truck. Now it is a dream. The dream leans a little to the left.",
   "cost": 130000,
   "income": 260,
   "era": 3,
   "icon": "truck",
   "tiers": [
    {
     "name": "New Tires",
     "flavor": "The old ones were mostly hope and duct tape. Abuela refused to ride until now."
    },
    {
     "name": "Real Griddle",
     "flavor": "Big, flat, and hot enough to sear a taco and a lesson at the same time."
    },
    {
     "name": "Loudspeaker Jingle",
     "flavor": "Diego wrote it. It rhymes taco with taco. The neighborhood sings along anyway."
    },
    {
     "name": "Solar Panels",
     "flavor": "The truck now runs on sunshine and salsa. Mostly salsa."
    },
    {
     "name": "Window Service AI",
     "flavor": "It takes your order, guesses your favorite salsa, and is never wrong. Diego is mad."
    },
    {
     "name": "Truck Hover Conversion",
     "flavor": "Why drive to the customer when you can float? The lean is still there. It is tradition."
    }
   ]
  },
  {
   "id": "fleet",
   "name": "Truck Fleet",
   "desc": "Trucks in every neighborhood. Dispatch is Abuela.",
   "flavor": "Abuela has a map, a landline, and opinions. The trucks arrive early or else.",
   "cost": 1400000.0,
   "income": 1400,
   "era": 4,
   "icon": "fleet",
   "tiers": [
    {
     "name": "Walkie-Talkies",
     "flavor": "Truck three, this is Abuela. You forgot the limes. Over. And out. And come back."
    },
    {
     "name": "Matching Paint Jobs",
     "flavor": "All crooked the same way now. That is what consistency looks like."
    },
    {
     "name": "Route Optimizer",
     "flavor": "It is a whiteboard in the kitchen. Abuela is faster than the app anyway."
    },
    {
     "name": "Night Shift Trucks",
     "flavor": "For the hungry, the sleepy, and the people who just left the movies."
    },
    {
     "name": "Taco Traffic Control",
     "flavor": "Diego wears a headset and says things like 'cleared for salsa.'"
    },
    {
     "name": "Trucks on Every Continent",
     "flavor": "Even Antarctica. The penguins are polite and always order the fish taco."
    }
   ]
  },
  {
   "id": "catering",
   "name": "Catering Crew",
   "desc": "Weddings, quinceañeras, corporate lunches.",
   "flavor": "Manuel folded 400 tacos for a wedding and still got asked to dance. He said yes.",
   "cost": 20000000.0,
   "income": 7800,
   "era": 4,
   "icon": "catering",
   "tiers": [
    {
     "name": "White Tablecloths",
     "flavor": "Abuela ironed them herself. Nobody is allowed to spill. Somebody always spills."
    },
    {
     "name": "Chafing Dish Setup",
     "flavor": "The tacos stay warm for hours. The guests do not last that long."
    },
    {
     "name": "Quinceañera Package",
     "flavor": "A taco tower shaped like a crown. Diego carries it in. Diego does not trip. Usually."
    },
    {
     "name": "Corporate Lunch Deal",
     "flavor": "Office workers cry a little when the truck pulls up. Productivity drops. Morale soars."
    },
    {
     "name": "Stadium Contract",
     "flavor": "Fifty thousand fans, one halftime, and Manuel's whole family on the griddles."
    },
    {
     "name": "Royal Banquet License",
     "flavor": "A queen tried the skull salsa. She did not finish it. She did send a thank-you card."
    }
   ]
  },
  {
   "id": "depop",
   "name": "Depop Shop",
   "desc": "Taco tees, salsa hoodies. Ships worldwide.",
   "flavor": "Manuel drew the logo on a napkin. Diego uploaded it. A kid in Tokyo bought it in an hour.",
   "cost": 330000000.0,
   "income": 44000,
   "era": 5,
   "icon": "depop",
   "tiers": [
    {
     "name": "Better Photos",
     "flavor": "Diego holds the phone. Abuela holds the reflector. The reflector is a cookie tray."
    },
    {
     "name": "Soft-Wash Cotton",
     "flavor": "The tees now feel like a hug from someone who smells like cilantro."
    },
    {
     "name": "Embroidered Logo",
     "flavor": "Stitched, not printed. The crooked lean of the truck is faithfully reproduced."
    },
    {
     "name": "Global Shipping Rates",
     "flavor": "Australia, Iceland, the moon (pending). Abuela packs every box with a napkin note."
    },
    {
     "name": "Seasonal Collections",
     "flavor": "Spring Salsa. Summer Guac. Fall Crunch. Winter is just hoodies and hot sauce."
    },
    {
     "name": "Interdimensional Storefront",
     "flavor": "Orders arrive from timelines where Manuel sold burritos. They are jealous."
    }
   ]
  },
  {
   "id": "drop",
   "name": "Hype Drop",
   "desc": "Limited runs that sell out in seconds.",
   "flavor": "Fifty hoodies. Ten thousand refresh buttons. Diego watches the counter and screams.",
   "cost": 5100000000.0,
   "income": 260000,
   "era": 5,
   "icon": "drop",
   "tiers": [
    {
     "name": "Countdown Timer",
     "flavor": "The suspense is real. Abuela set an alarm. Abuela does not know why."
    },
    {
     "name": "Numbered Tags",
     "flavor": "Number one always goes to Abuela. Number two goes to whoever is fastest."
    },
    {
     "name": "Midnight Release",
     "flavor": "Manuel has a bedtime. The drop does not. Diego handles the midnight shift."
    },
    {
     "name": "Collab Sticker Packs",
     "flavor": "Little tacos for laptops and water bottles. They stick to Diego's forehead too."
    },
    {
     "name": "Mystery Box Drop",
     "flavor": "Could be a tee. Could be a hoodie. Could be a jar of the skull salsa. Good luck."
    },
    {
     "name": "Drop So Fast It Sells Early",
     "flavor": "The run sells out before it is announced. Physicists want to talk to Manuel."
    }
   ]
  },
  {
   "id": "collab",
   "name": "Influencer Collab",
   "desc": "Every unboxing is free advertising.",
   "flavor": "A guy with two million followers ate a taco on camera and forgot to talk for a minute.",
   "cost": 75000000000.0,
   "income": 1600000.0,
   "era": 5,
   "icon": "collab",
   "tiers": [
    {
     "name": "Free Tacos for Creators",
     "flavor": "The creators eat free. The creators post. The creators come back with friends."
    },
    {
     "name": "Behind-the-Scenes Video",
     "flavor": "Twenty minutes of Abuela ignoring the camera. Seven million views."
    },
    {
     "name": "Diego's Vlog Channel",
     "flavor": "Diego reviews every salsa. Diego cries on every episode. Ratings are excellent."
    },
    {
     "name": "Celebrity Shoutout",
     "flavor": "A famous singer wore the hoodie. She spelled the truck's name right. Manuel framed it."
    },
    {
     "name": "Abuela's Cooking Show",
     "flavor": "She does not measure. She does not explain. She just looks at you and it works."
    },
    {
     "name": "Collab With the Universe",
     "flavor": "Every star in the sky briefly formed a taco. Nobody can prove Diego did not do it."
    }
   ]
  },
  {
   "id": "franchise",
   "name": "Taco Franchise",
   "desc": "Manuel's face on 4,000 storefronts.",
   "flavor": "Every owner learns the recipe from Abuela herself. She grades them. Most pass eventually.",
   "cost": 500000000000.0,
   "income": 10000000.0,
   "era": 6,
   "icon": "franchise",
   "tiers": [
    {
     "name": "Training Manual",
     "flavor": "Chapter one: wash your hands. Chapter two: the S is supposed to be backwards."
    },
    {
     "name": "Abuela's Inspection Tour",
     "flavor": "She visits every store with a spoon. If she nods, you are family."
    },
    {
     "name": "Drive-Thru Lanes",
     "flavor": "Diego designed the menu board. It has a joke on it. The joke is also a taco."
    },
    {
     "name": "Franchise Loyalty Cards",
     "flavor": "Buy ten tacos, get a hug from Abuela. Redemption rates are through the roof."
    },
    {
     "name": "Mall Food Court Domination",
     "flavor": "Every pretzel stand has quietly surrendered."
    },
    {
     "name": "Franchise on the Moon",
     "flavor": "Low gravity, high sales. The tortillas come out extra fluffy up there."
    }
   ]
  },
  {
   "id": "factory",
   "name": "Taco Factory",
   "desc": "Tortillas by the megaton.",
   "flavor": "Manuel walked the floor on day one and stopped every machine to taste. Twice.",
   "cost": 6000000000000.0,
   "income": 65000000.0,
   "era": 6,
   "icon": "factory",
   "tiers": [
    {
     "name": "Quality Control Abuela",
     "flavor": "She sits at the end of the line and taps every tortilla. She has never been wrong."
    },
    {
     "name": "Robot Folding Arms",
     "flavor": "They fold like Manuel. They were trained on Manuel. They are slightly crooked."
    },
    {
     "name": "Salsa Pipeline",
     "flavor": "A river of roja runs through the building. Bridges are provided. Spoons are not."
    },
    {
     "name": "Guacamole Reactor",
     "flavor": "Avocados go in ripe. Guac comes out perfect. Do not ask about the browning."
    },
    {
     "name": "Tortilla Megapress",
     "flavor": "It presses ten thousand at once. Abuela's old press sits on top, as a crown."
    },
    {
     "name": "Taco Singularity Core",
     "flavor": "All the tacos, everywhere, at once. Diego got a shift on the day shift. He is thrilled."
    }
   ]
  },
  {
   "id": "orbital",
   "name": "Orbital Taquería",
   "desc": "Tacos in zero gravity. Somehow no crumbs.",
   "flavor": "The crumbs float away and nobody knows where they go. Manuel is fine with that.",
   "cost": 60000000000000.0,
   "income": 430000000.0,
   "era": 6,
   "icon": "orbital",
   "tiers": [
    {
     "name": "Space Suit Aprons",
     "flavor": "Bright red, extra pockets, Abuela's name stitched inside every one."
    },
    {
     "name": "Zero-G Salsa Dispensers",
     "flavor": "The salsa floats out in little spheres. Diego catches them with his mouth."
    },
    {
     "name": "Docking Port for Trucks",
     "flavor": "The trucks fly up, unload, and lean gently to the left in orbit."
    },
    {
     "name": "Orbital Delivery Pods",
     "flavor": "Order from Earth, receive from space. The taco is warm. The pod is a little dented."
    },
    {
     "name": "Lunar Tortilla Farm",
     "flavor": "Corn grows fine on the moon. It just needs Abuela to yell at it a little."
    },
    {
     "name": "Galactic Taco Federation",
     "flavor": "Every planet sends a delegate. Every delegate leaves with a hoodie and a full belly."
    }
   ]
  }
 ],
 "tierThresholds": [
  1,
  5,
  25,
  50,
  75,
  100
 ],
 "tierCostMult": [
  10,
  50,
  300,
  3000,
  30000,
  300000
 ],
 "costGrowth": 1.15,
 "sellRefund": 0.25,
 "eraBonus": 0.15,
 "upgrades": [
  {
   "id": "click_2h",
   "name": "Two-Handed Roll",
   "flavor": "Manuel learns to roll with both hands. Abuela has done that since before phones.",
   "cost": 100,
   "icon": "hand",
   "kind": "click",
   "effect": {
    "clickMult": 2
   },
   "unlock": {
    "lifetime": 50
   },
   "desc": "Clicks are twice as strong."
  },
  {
   "id": "click_splash",
   "name": "Salsa Splash",
   "flavor": "A spoon of roja on every taco. Faster, messier, and the customers love it.",
   "cost": 500,
   "icon": "salsa",
   "kind": "click",
   "effect": {
    "clickMult": 2
   },
   "unlock": {
    "lifetime": 250
   },
   "desc": "Clicks are twice as strong."
  },
  {
   "id": "click_tip",
   "name": "Tip Jar",
   "flavor": "It says GRACIAS in Diego's handwriting. The neighborhood is generous.",
   "cost": 10000.0,
   "icon": "coin",
   "kind": "click",
   "effect": {
    "clickPct": 0.01
   },
   "unlock": {
    "lifetime": 5000.0
   },
   "desc": "Each click also earns 1% of your income per second."
  },
  {
   "id": "click_napkin",
   "name": "Napkin Speed",
   "flavor": "Napkin, taco, napkin, taco. Manuel's hands are a blur. The napkins are a mountain.",
   "cost": 100000.0,
   "icon": "hand",
   "kind": "click",
   "effect": {
    "clickPct": 0.01
   },
   "unlock": {
    "lifetime": 50000.0
   },
   "desc": "Each click earns another 1% of your income per second."
  },
  {
   "id": "click_guac",
   "name": "Extra Guac",
   "flavor": "Yes, it costs extra. Yes, everyone says yes. Yes, Abuela mashes it by hand.",
   "cost": 10000000.0,
   "icon": "hand",
   "kind": "click",
   "effect": {
    "clickPct": 0.02
   },
   "unlock": {
    "lifetime": 5000000.0
   },
   "desc": "Each click earns another 2% of your income per second."
  },
  {
   "id": "click_sauce",
   "name": "Signature Sauce",
   "flavor": "Nobody knows the recipe. Manuel knows the recipe. Manuel is not telling Diego.",
   "cost": 1000000000.0,
   "icon": "drop",
   "kind": "click",
   "effect": {
    "clickPct": 0.02
   },
   "unlock": {
    "lifetime": 500000000.0
   },
   "desc": "Each click earns another 2% of your income per second."
  },
  {
   "id": "click_magic",
   "name": "Manuel's Magic Hands",
   "flavor": "He still folds the first taco of the day by hand, even now. Especially now.",
   "cost": 100000000000.0,
   "icon": "sparkle",
   "kind": "click",
   "effect": {
    "clickMult": 2,
    "clickPct": 0.03
   },
   "unlock": {
    "lifetime": 50000000000.0
   },
   "desc": "Clicks are twice as strong and earn another 3% of income per second."
  },
  {
   "id": "gold_lucky",
   "name": "Lucky Charm",
   "flavor": "A tiny wooden taco from Abuela's keychain. She says it works. It works.",
   "cost": 777777,
   "icon": "star",
   "kind": "golden",
   "effect": {
    "goldenFreq": 2
   },
   "unlock": {
    "lifetime": 100000.0
   },
   "desc": "Golden tacos appear twice as often."
  },
  {
   "id": "gold_hour",
   "name": "Golden Hour",
   "flavor": "The light hits the truck just right and the whole corner slows down to look.",
   "cost": 77777777,
   "icon": "sun",
   "kind": "golden",
   "effect": {
    "goldenStay": 2
   },
   "unlock": {
    "lifetime": 10000000.0
   },
   "desc": "Golden tacos stay on screen twice as long."
  },
  {
   "id": "gold_fortune",
   "name": "Salsa Fortune",
   "flavor": "Diego found a fortune in a taco. It said 'more.' He took it seriously.",
   "cost": 7777777777,
   "icon": "sparkle",
   "kind": "golden",
   "effect": {
    "goldenDur": 2
   },
   "unlock": {
    "lifetime": 1000000000.0
   },
   "desc": "Golden taco effects last twice as long."
  },
  {
   "id": "rep_1",
   "name": "Five-Star Reviews",
   "flavor": "Every review mentions Abuela. One just says 'grandma??? five stars.'",
   "cost": 9000000.0,
   "icon": "star",
   "kind": "rep",
   "effect": {
    "repMult": 0.1
   },
   "unlock": {
    "achievements": 10
   },
   "desc": "Income +10% for every 10% of Reputation."
  },
  {
   "id": "rep_2",
   "name": "Food Blogger Feature",
   "flavor": "Two thousand words about a two-dollar taco. Manuel read every one of them.",
   "cost": 9000000000.0,
   "icon": "star",
   "kind": "rep",
   "effect": {
    "repMult": 0.125
   },
   "unlock": {
    "achievements": 20
   },
   "desc": "Income +12.5% for every 10% of Reputation."
  },
  {
   "id": "rep_3",
   "name": "The Video",
   "flavor": "Diego filmed the crooked truck sideways. It did not matter. A million views.",
   "cost": 90000000000.0,
   "icon": "camera",
   "kind": "rep",
   "effect": {
    "repMult": 0.15
   },
   "unlock": {
    "achievements": 35
   },
   "desc": "Income +15% for every 10% of Reputation."
  },
  {
   "id": "rep_4",
   "name": "The Critic Came Back Twice",
   "flavor": "A quiet man in a suit ate three tacos, wrote one word in a notebook, and smiled.",
   "cost": 90000000000000.0,
   "icon": "chef",
   "kind": "rep",
   "effect": {
    "repMult": 0.2
   },
   "unlock": {
    "achievements": 50
   },
   "desc": "Income +20% for every 10% of Reputation."
  },
  {
   "id": "glob_1",
   "name": "Abuela's Blessing",
   "flavor": "She put her hand on Manuel's head and said 'go.' That was the whole speech.",
   "cost": 50000.0,
   "icon": "heart",
   "kind": "global",
   "effect": {
    "globalMult": 0.1
   },
   "unlock": {
    "lifetime": 100000.0
   },
   "desc": "All income +10%."
  },
  {
   "id": "glob_2",
   "name": "Family Recipe",
   "flavor": "An index card stained with forty years of salsa. Manuel keeps it in his shoe.",
   "cost": 5000000.0,
   "icon": "book",
   "kind": "global",
   "effect": {
    "globalMult": 0.15
   },
   "unlock": {
    "lifetime": 10000000.0
   },
   "desc": "All income +15%."
  },
  {
   "id": "glob_3",
   "name": "City Famous",
   "flavor": "People give directions by the truck now. 'Left at Manuel's, then two blocks.'",
   "cost": 500000000.0,
   "icon": "flag",
   "kind": "global",
   "effect": {
    "globalMult": 0.15
   },
   "unlock": {
    "lifetime": 1000000000.0
   },
   "desc": "All income +15%."
  },
  {
   "id": "glob_4",
   "name": "Statewide Craze",
   "flavor": "Kids three counties over are drawing crooked trucks on their notebooks.",
   "cost": 50000000000.0,
   "icon": "flag",
   "kind": "global",
   "effect": {
    "globalMult": 0.2
   },
   "unlock": {
    "lifetime": 100000000000.0
   },
   "desc": "All income +20%."
  },
  {
   "id": "glob_5",
   "name": "National Treasure",
   "flavor": "A museum asked for the folding table. Abuela said no. She still uses it.",
   "cost": 5000000000000.0,
   "icon": "crown",
   "kind": "global",
   "effect": {
    "globalMult": 0.25
   },
   "unlock": {
    "lifetime": 10000000000000.0
   },
   "desc": "All income +25%."
  },
  {
   "id": "depop_ring",
   "name": "Diego's Ring Light",
   "flavor": "Diego's face has never looked so good. The hoodies look pretty good too.",
   "cost": 1000000000.0,
   "icon": "camera",
   "kind": "depop",
   "effect": {
    "dropSpeed": 1.25
   },
   "unlock": {
    "depop": true
   },
   "desc": "Depop drops sell 25% faster."
  },
  {
   "id": "depop_bulk",
   "name": "Garage Full of Mailers",
   "flavor": "A pallet of boxes and a pallet of napkin notes. Abuela writes each one.",
   "cost": 10000000000.0,
   "icon": "box",
   "kind": "depop",
   "effect": {
    "dropSlots": 1
   },
   "unlock": {
    "depop": true
   },
   "desc": "One more Depop slot. Abuela's car now lives outside."
  },
  {
   "id": "depop_radar",
   "name": "Diego Reads the Comments",
   "flavor": "Diego scrolls for a living now. He says he can feel a trend coming. He is often right.",
   "cost": 50000000000.0,
   "icon": "radar",
   "kind": "depop",
   "effect": {
    "viral": 0.15,
    "unlockItem": "sneakers"
   },
   "unlock": {
    "depop": true
   },
   "desc": "Viral chance 5% to 15%, and unlocks Grail Sneakers."
  },
  {
   "id": "depop_verified",
   "name": "Verified Seller",
   "flavor": "A little blue check next to the crooked truck. Manuel screenshotted it for Abuela.",
   "cost": 250000000000.0,
   "icon": "shield",
   "kind": "depop",
   "effect": {
    "dropPayout": 1.25
   },
   "unlock": {
    "depop": true
   },
   "desc": "Depop payouts +25%."
  },
  {
   "id": "depop_auto",
   "name": "Mr. Bell Knows the Route",
   "flavor": "Mr. Bell the mail carrier knows the route by heart now. He also knows Manuel by name.",
   "cost": 30000000000.0,
   "icon": "rocket",
   "kind": "depop",
   "effect": {
    "autoShip": true
   },
   "unlock": {
    "depop": true
   },
   "desc": "Sold drops collect and relist themselves."
  },
  {
   "id": "offline_prep",
   "name": "Overnight Prep",
   "flavor": "Abuela preps the masa before bed. The morning takes care of itself.",
   "cost": 1000000.0,
   "icon": "moon",
   "kind": "offline",
   "effect": {
    "offlineRate": 0.75,
    "offlineCap": 12
   },
   "unlock": {
    "lifetime": 500000.0
   },
   "desc": "Earn 75% of income while away, for up to 12 hours."
  }
 ],
 "eras": [
  {
   "n": 1,
   "name": "Backyard Table",
   "threshold": 0,
   "icon": "table",
   "title": "The Backyard Table",
   "text": "Manuel is twelve years old, and this morning he dragged Abuela's folding table into the backyard and propped up a sign that says TACOS in three colors of marker. Abuela handed him her tortilla recipe on a card that smells like cinnamon and said, 'Talk nicely to them and they will behave.' His first customer was Abuela. She paid full price.",
   "age": 12,
   "flagship": null,
   "hint": null
  },
  {
   "n": 2,
   "name": "Corner Stand",
   "threshold": 50000.0,
   "icon": "stand",
   "title": "The Corner Stand",
   "text": "Manuel is thirteen now, and the backyard could not hold the line anymore. He rented a real stand on the corner of 5th and Main, and on Fridays the line wraps around the block and past the barber shop. Cousin Diego is in charge of napkins, which is going about as well as you would expect.",
   "age": 13,
   "flagship": "stand",
   "hint": "Something on the corner of 5th and Main. Manuel keeps looking at it."
  },
  {
   "n": 3,
   "name": "Food Truck",
   "threshold": 1000000.0,
   "icon": "truck",
   "title": "The Food Truck",
   "text": "At fifteen, Manuel saved up enough for a used truck that stalls on hills and smells faintly of the taco dreams of whoever owned it before. He painted MANUEL'S on the side himself, and it came out a little crooked. He decided to leave it that way, and now the whole neighborhood calls it the crooked truck like it is a compliment. Diego took a picture of the crooked letters. He said it was a vibe.",
   "age": 15,
   "flagship": "truck",
   "hint": "A used truck with a FOR SALE sign. Manuel took a photo and taped it to the press."
  },
  {
   "n": 4,
   "name": "Truck Fleet",
   "threshold": 50000000.0,
   "icon": "fleet",
   "title": "The Truck Fleet",
   "text": "Manuel is seventeen and there are trucks in every neighborhood in the city, each with a slightly crooked sign because he insists on painting them himself. Abuela runs dispatch from her kitchen with three phones and a paper map taped to the wall. When truck seven got lost, she found it by listening for the jingle.",
   "age": 17,
   "flagship": "fleet",
   "hint": "Diego keeps saying the word fleet. Abuela keeps saying the word no."
  },
  {
   "n": 5,
   "name": "Depop Drip",
   "threshold": 10000000000.0,
   "icon": "tag",
   "title": "Depop Drip",
   "text": "Manuel is nineteen when a stranger films the crooked truck sign for a laugh and the video hits ten million views overnight. Suddenly everyone wants the crooked logo on a shirt, so he opens a little shop on Depop and prints a few Taco Tees and Salsa Hoodies. The first drop sells out in four minutes, the second in ninety seconds, and Diego has missed both of them.",
   "age": 19,
   "flagship": "depop",
   "hint": "Diego took a picture of the crooked letters. He says it is a vibe."
  },
  {
   "n": 6,
   "name": "Taco Empire",
   "threshold": 1000000000000.0,
   "icon": "crown",
   "title": "The Taco Empire",
   "text": "Manuel is twenty-two now, and there are franchises with his face on them, a factory that makes tortillas by the megaton, and a taquería in orbit that somehow produces no crumbs. Every morning, before any of that wakes up, he goes to Abuela's kitchen, warms the old cast-iron press, and folds the first taco of the day by hand. Abuela tastes it, nods, and says the same thing she said when he was twelve: 'Good. Now make another.'",
   "age": 22,
   "flagship": "franchise",
   "hint": "Someone in a suit left a business card under the tip jar."
  }
 ],
 "golden": [
  {
   "id": "lunchRush",
   "name": "Lunch Rush",
   "weight": 40,
   "kind": "income",
   "mult": 7,
   "duration": 77,
   "toast": "Lunch Rush! The whole block showed up hungry. Income x7!"
  },
  {
   "id": "bigTipper",
   "name": "Big Tipper",
   "weight": 40,
   "kind": "cash",
   "toast": "Big Tipper! Someone left {amount} in the jar and winked."
  },
  {
   "id": "clickFiesta",
   "name": "Click Fiesta",
   "weight": 12,
   "kind": "click",
   "mult": 777,
   "duration": 13,
   "toast": "Click Fiesta! Manuel's hands are a blur. Clicks x777!"
  },
  {
   "id": "abuela",
   "name": "Abuela Takes the Griddle",
   "weight": 5,
   "kind": "income",
   "mult": 15,
   "duration": 30,
   "toast": "Abuela takes the griddle! She shooed Manuel out of the way. Income x15!"
  },
  {
   "id": "storm",
   "name": "Taco Storm",
   "weight": 6,
   "kind": "storm",
   "duration": 8,
   "minEra": 3,
   "toast": "Taco Storm! Grab every taco you can!"
  }
 ],
 "depopItems": [
  {
   "id": "tee",
   "name": "Crooked Logo Tee",
   "desc": "The crooked logo on a soft cotton tee. The first run smelled faintly of onions.",
   "costSeconds": 60,
   "minCost": 1000,
   "sellSeconds": 120,
   "payout": 1.5,
   "hype": 10
  },
  {
   "id": "hoodie",
   "name": "Salsa Hoodie",
   "desc": "Five salsas on the back, one of them a dare. Warm enough for early morning prep.",
   "costSeconds": 300,
   "minCost": 5000,
   "sellSeconds": 480,
   "payout": 1.8,
   "hype": 25
  },
  {
   "id": "jacket",
   "name": "Truck #1 Jacket",
   "desc": "Hand-stitched patch of the original truck, crooked sign and all. Diego wants one.",
   "costSeconds": 1200,
   "minCost": 25000,
   "sellSeconds": 1800,
   "payout": 2.2,
   "hype": 50
  },
  {
   "id": "sneakers",
   "name": "Grail Sneakers",
   "desc": "Tortilla-colored, salsa-red laces, limited to a whisper. Chorizo the dog has approved them.",
   "costSeconds": 3600,
   "minCost": 100000,
   "sellSeconds": 7200,
   "payout": 3,
   "hype": 100,
   "requires": "depop_radar"
  }
 ],
 "recipes": [
  {
   "id": "headstart",
   "name": "Head Start",
   "cost": 1,
   "desc": "Start every run with $10,000.",
   "effect": {
    "startCash": 10000
   },
   "icon": "coin",
   "flavor": "Abuela slips a few bills into your apron pocket. 'For tortillas. Not candy.'"
  },
  {
   "id": "palate",
   "name": "Golden Palate",
   "cost": 2,
   "desc": "Golden tacos appear 20% more often.",
   "effect": {
    "goldenFreq": 1.25
   },
   "icon": "star",
   "flavor": "You can taste when something special is about to happen. Usually, it is."
  },
  {
   "id": "overnight",
   "name": "Overnight Prep II",
   "cost": 3,
   "desc": "Earn 100% of income while away, for up to 24 hours.",
   "effect": {
    "offlineRate": 1,
    "offlineCap": 24
   },
   "icon": "moon",
   "flavor": "The onions are chopped, the salsa is resting, and the press is already warm when you wake up."
  },
  {
   "id": "muscle",
   "name": "Muscle Memory",
   "cost": 5,
   "desc": "Clicks are twice as strong, forever.",
   "effect": {
    "clickMult": 2
   },
   "icon": "hand",
   "flavor": "Your hands know the fold before your brain does. Abuela calls this 'finally.'"
  },
  {
   "id": "playbook",
   "name": "Franchise Playbook",
   "cost": 10,
   "desc": "Every business costs 10% less.",
   "effect": {
    "costMult": 0.9
   },
   "icon": "book",
   "flavor": "A worn binder with everything you learned. Page one: talk nicely to the tortillas."
  },
  {
   "id": "viral",
   "name": "Viral Legacy",
   "cost": 15,
   "desc": "The Depop shop is open from the very start of every run.",
   "effect": {
    "depopStart": true
   },
   "icon": "tag",
   "flavor": "The crooked sign never stopped being famous. The shop is open from day one."
  },
  {
   "id": "empire",
   "name": "Empire Mindset",
   "cost": 25,
   "desc": "All income +25%.",
   "effect": {
    "globalMult": 0.25
   },
   "icon": "crown",
   "flavor": "Think bigger than the block. Then remember the block is where it started."
  },
  {
   "id": "legend",
   "name": "Manuel's Legend",
   "cost": 50,
   "desc": "All income +50% and golden tacos stay 50% longer.",
   "effect": {
    "globalMult": 0.5,
    "goldenStay": 1.5
   },
   "icon": "sparkle",
   "flavor": "Some kid in some backyard just heard your story and dragged out a folding table."
  }
 ],
 "achievements": [
  {
   "id": "cash_1e3",
   "name": "Lunch Money",
   "desc": "Earn $1,000 lifetime. Abuela is proud. Diego wants a cut.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 1000.0
  },
  {
   "id": "cash_1e4",
   "name": "Piggy Bank Overflow",
   "desc": "Earn $10,000 lifetime. The piggy bank is retired. Long live the shoebox.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 10000.0
  },
  {
   "id": "cash_1e5",
   "name": "Shoebox Full",
   "desc": "Earn $100,000 lifetime. The shoebox is now three shoeboxes.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 100000.0
  },
  {
   "id": "cash_1e6",
   "name": "Actual Millionaire",
   "desc": "Earn $1 million lifetime. Manuel is 12 and does not know what taxes are.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 1000000.0
  },
  {
   "id": "cash_1e7",
   "name": "Ten Million Tacos Later",
   "desc": "Earn $10 million lifetime. Abuela still checks the price of tomatoes.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 10000000.0
  },
  {
   "id": "cash_1e8",
   "name": "Nine Zeroes Minus One",
   "desc": "Earn $100 million lifetime. Diego asked if he can have a boat. No.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 100000000.0
  },
  {
   "id": "cash_1e9",
   "name": "Billion Dollar Kid",
   "desc": "Earn $1 billion lifetime. Someone wrote a book about Manuel. He hasn't read it.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 1000000000.0
  },
  {
   "id": "cash_1e10",
   "name": "New Stove, Old Stove",
   "desc": "Earn $10 billion lifetime. Manuel bought Abuela a new stove. She uses the old.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 10000000000.0
  },
  {
   "id": "cash_1e11",
   "name": "Hundred Billion Bites",
   "desc": "Earn $100 billion lifetime. The bank called to ask if everything is okay.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 100000000000.0
  },
  {
   "id": "cash_1e12",
   "name": "Trillion Dollar Tortilla",
   "desc": "Earn $1 trillion lifetime. Manuel's allowance is now a rounding error.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 1000000000000.0
  },
  {
   "id": "cash_1e13",
   "name": "Bigger Than a Country",
   "desc": "Earn $10 trillion lifetime. Diego stopped asking for a raise. He owns a country.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 10000000000000.0
  },
  {
   "id": "cash_1e14",
   "name": "Calculator Gave Up",
   "desc": "Earn $100 trillion lifetime. The calculator app on Manuel's phone just quit.",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 100000000000000.0
  },
  {
   "id": "cash_1e15",
   "name": "Quadrillion Reasons",
   "desc": "Earn $1 quadrillion lifetime. Abuela says nice, but did you eat something?",
   "icon": "coin",
   "secret": false,
   "kind": "lifetime",
   "v": 1000000000000000.0
  },
  {
   "id": "cps_1",
   "name": "Money While You Nap",
   "desc": "Earn $1 per second. Abuela does not approve of naps. The tacos do.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 1.0
  },
  {
   "id": "cps_10",
   "name": "Steady Sizzle",
   "desc": "Earn $10 per second. That's a taco every ten seconds and change.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 10.0
  },
  {
   "id": "cps_100",
   "name": "Rush Hour",
   "desc": "Earn $100 per second. The line now has a line.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 100.0
  },
  {
   "id": "cps_1e3",
   "name": "Money Faucet",
   "desc": "Earn $1,000 per second. Diego tried to count it and got dizzy.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 1000.0
  },
  {
   "id": "cps_1e4",
   "name": "Cash Waterfall",
   "desc": "Earn $10,000 per second. Abuela's dispatch radio never stops crackling.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 10000.0
  },
  {
   "id": "cps_1e5",
   "name": "Salsa Tsunami",
   "desc": "Earn $100,000 per second. Health inspectors just come for lunch now.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 100000.0
  },
  {
   "id": "cps_1e6",
   "name": "Millions Per Second",
   "desc": "Earn $1 million per second. Manuel still asks for a receipt.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 1000000.0
  },
  {
   "id": "cps_1e7",
   "name": "Vice Cousin",
   "desc": "Earn $10 million per second. Diego's job title is now Vice Cousin.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 10000000.0
  },
  {
   "id": "cps_1e8",
   "name": "The Manuel Economy",
   "desc": "Earn $100 million per second. Economists have started a support group.",
   "icon": "bolt",
   "secret": false,
   "kind": "cps",
   "v": 100000000.0
  },
  {
   "id": "click_10",
   "name": "Ten Little Tacos",
   "desc": "Hand-sell 10 tacos. Manuel folded every one. Diego ate two.",
   "icon": "hand",
   "secret": false,
   "kind": "clicks",
   "v": 10.0
  },
  {
   "id": "click_100",
   "name": "Warm Tortilla Hands",
   "desc": "Hand-sell 100 tacos. Your thumb is a local celebrity.",
   "icon": "hand",
   "secret": false,
   "kind": "clicks",
   "v": 100.0
  },
  {
   "id": "click_1e3",
   "name": "Thousand Taco Thumb",
   "desc": "Hand-sell 1,000 tacos. Abuela offered you a stool. You refused.",
   "icon": "hand",
   "secret": false,
   "kind": "clicks",
   "v": 1000.0
  },
  {
   "id": "click_1e4",
   "name": "Hands of Steel",
   "desc": "Hand-sell 10,000 tacos. Diego thinks you're a robot. You're not sure anymore.",
   "icon": "hand",
   "secret": false,
   "kind": "clicks",
   "v": 10000.0
  },
  {
   "id": "click_1e5",
   "name": "The Hundred Thousand",
   "desc": "Hand-sell 100,000 tacos. Manuel's hands are now a protected landmark.",
   "icon": "hand",
   "secret": false,
   "kind": "clicks",
   "v": 100000.0
  },
  {
   "id": "press_1",
   "name": "Cast Iron Beginnings",
   "desc": "Own 1 Tortilla Press. Older than Manuel's dad. Still works.",
   "icon": "press",
   "secret": false,
   "kind": "owned",
   "producer": "press",
   "v": 1
  },
  {
   "id": "press_50",
   "name": "Press Conference",
   "desc": "Own 50 Tortilla Presses. The backyard sounds like applause.",
   "icon": "press",
   "secret": false,
   "kind": "owned",
   "producer": "press",
   "v": 50
  },
  {
   "id": "press_100",
   "name": "Pressing Matters",
   "desc": "Own 100 Tortilla Presses. Abuela has named each one.",
   "icon": "press",
   "secret": false,
   "kind": "owned",
   "producer": "press",
   "v": 100
  },
  {
   "id": "cousin_1",
   "name": "Family Business",
   "desc": "Own 1 Cousin Diego. Paid in tacos. Union: pending.",
   "icon": "cousin",
   "secret": false,
   "kind": "owned",
   "producer": "cousin",
   "v": 1
  },
  {
   "id": "cousin_50",
   "name": "Fifty Diegos",
   "desc": "Own 50 Cousin Diegos. Family reunions are now very confusing.",
   "icon": "cousin",
   "secret": false,
   "kind": "owned",
   "producer": "cousin",
   "v": 50
  },
  {
   "id": "cousin_100",
   "name": "Diego Multiverse",
   "desc": "Own 100 Cousin Diegos. One of them is the original. Probably.",
   "icon": "cousin",
   "secret": false,
   "kind": "owned",
   "producer": "cousin",
   "v": 100
  },
  {
   "id": "salsa_1",
   "name": "One Is a Dare",
   "desc": "Own 1 Salsa Bar. Five salsas. Diego tried the dare one. Diego is fine.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 1
  },
  {
   "id": "salsa_50",
   "name": "Salsa Rainbow",
   "desc": "Own 50 Salsa Bars. That's 250 salsas and 50 dares.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 50
  },
  {
   "id": "salsa_100",
   "name": "Hot Sauce Headquarters",
   "desc": "Own 100 Salsa Bars. The fire department stops by. To eat.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 100
  },
  {
   "id": "stand_1",
   "name": "Corner of 5th and Main",
   "desc": "Own 1 Taco Stand. The corner has never smelled better.",
   "icon": "stand",
   "secret": false,
   "kind": "owned",
   "producer": "stand",
   "v": 1
  },
  {
   "id": "stand_50",
   "name": "Every Corner Counts",
   "desc": "Own 50 Taco Stands. You can't cross the street without buying a taco.",
   "icon": "stand",
   "secret": false,
   "kind": "owned",
   "producer": "stand",
   "v": 50
  },
  {
   "id": "stand_100",
   "name": "Stand Up Empire",
   "desc": "Own 100 Taco Stands. The city map is mostly little taco icons now.",
   "icon": "stand",
   "secret": false,
   "kind": "owned",
   "producer": "stand",
   "v": 100
  },
  {
   "id": "truck_1",
   "name": "Slightly Crooked",
   "desc": "Own 1 Food Truck. MANUEL'S painted on the side. Nobody mention the tilt.",
   "icon": "truck",
   "secret": false,
   "kind": "owned",
   "producer": "truck",
   "v": 1
  },
  {
   "id": "truck_50",
   "name": "Crooked Convoy",
   "desc": "Own 50 Food Trucks. Every sign is crooked. It's tradition now.",
   "icon": "truck",
   "secret": false,
   "kind": "owned",
   "producer": "truck",
   "v": 50
  },
  {
   "id": "truck_100",
   "name": "Traffic Jam of Flavor",
   "desc": "Own 100 Food Trucks. The parking situation is a family secret.",
   "icon": "truck",
   "secret": false,
   "kind": "owned",
   "producer": "truck",
   "v": 100
  },
  {
   "id": "fleet_1",
   "name": "Dispatch: Abuela",
   "desc": "Own 1 Truck Fleet. Abuela runs dispatch from the kitchen. Do not be late.",
   "icon": "fleet",
   "secret": false,
   "kind": "owned",
   "producer": "fleet",
   "v": 1
  },
  {
   "id": "fleet_50",
   "name": "Fleet Week",
   "desc": "Own 50 Truck Fleets. Abuela got a headset. She does not need it.",
   "icon": "fleet",
   "secret": false,
   "kind": "owned",
   "producer": "fleet",
   "v": 50
  },
  {
   "id": "fleet_100",
   "name": "Roads Are Suggestions",
   "desc": "Own 100 Truck Fleets. Traffic reports now just say 'tacos.'",
   "icon": "fleet",
   "secret": false,
   "kind": "owned",
   "producer": "fleet",
   "v": 100
  },
  {
   "id": "catering_1",
   "name": "Say Yes to the Taco",
   "desc": "Own 1 Catering Crew. Weddings, quinceañeras, awkward office lunches.",
   "icon": "catering",
   "secret": false,
   "kind": "owned",
   "producer": "catering",
   "v": 1
  },
  {
   "id": "catering_50",
   "name": "Quince Season",
   "desc": "Own 50 Catering Crews. Every party in the state has one job: Manuel.",
   "icon": "catering",
   "secret": false,
   "kind": "owned",
   "producer": "catering",
   "v": 50
  },
  {
   "id": "catering_100",
   "name": "The Whole Guest List",
   "desc": "Own 100 Catering Crews. Manuel catered the mayor's dog's birthday.",
   "icon": "catering",
   "secret": false,
   "kind": "owned",
   "producer": "catering",
   "v": 100
  },
  {
   "id": "depop_1",
   "name": "Taco Tee Tycoon",
   "desc": "Own 1 Depop Shop. Taco tees, salsa hoodies. Ships worldwide.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "depop",
   "v": 1
  },
  {
   "id": "depop_50",
   "name": "Streetwear Sizzle",
   "desc": "Own 50 Depop Shops. Abuela models the hoodies. She is very serious.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "depop",
   "v": 50
  },
  {
   "id": "depop_100",
   "name": "Drip Empire",
   "desc": "Own 100 Depop Shops. Diego finally got the jacket. It's crooked too.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "depop",
   "v": 100
  },
  {
   "id": "drop_1",
   "name": "Sold Out in Seconds",
   "desc": "Own 1 Hype Drop. Limited runs. Blink and it's gone.",
   "icon": "drop",
   "secret": false,
   "kind": "owned",
   "producer": "drop",
   "v": 1
  },
  {
   "id": "drop_50",
   "name": "Refresh, Refresh, Refresh",
   "desc": "Own 50 Hype Drops. Fans set alarms. Abuela sets the alarm for them.",
   "icon": "drop",
   "secret": false,
   "kind": "owned",
   "producer": "drop",
   "v": 50
  },
  {
   "id": "drop_100",
   "name": "Hype Hurricane",
   "desc": "Own 100 Hype Drops. The internet has a Manuel countdown clock now.",
   "icon": "drop",
   "secret": false,
   "kind": "owned",
   "producer": "drop",
   "v": 100
  },
  {
   "id": "collab_1",
   "name": "Unboxed",
   "desc": "Own 1 Influencer Collab. Every unboxing is free advertising.",
   "icon": "collab",
   "secret": false,
   "kind": "owned",
   "producer": "collab",
   "v": 1
  },
  {
   "id": "collab_50",
   "name": "Everyone's Talking",
   "desc": "Own 50 Influencer Collabs. Manuel's face is on a shirt with his face on it.",
   "icon": "collab",
   "secret": false,
   "kind": "owned",
   "producer": "collab",
   "v": 50
  },
  {
   "id": "collab_100",
   "name": "Main Character Energy",
   "desc": "Own 100 Influencer Collabs. Manuel still can't work the ring light.",
   "icon": "collab",
   "secret": false,
   "kind": "owned",
   "producer": "collab",
   "v": 100
  },
  {
   "id": "franchise_1",
   "name": "Face on the Storefront",
   "desc": "Own 1 Taco Franchise. Manuel's face on 4,000 storefronts. He hates the photo.",
   "icon": "franchise",
   "secret": false,
   "kind": "owned",
   "producer": "franchise",
   "v": 1
  },
  {
   "id": "franchise_50",
   "name": "Coast to Coast",
   "desc": "Own 50 Taco Franchises. There's a Manuel's next to every other Manuel's.",
   "icon": "franchise",
   "secret": false,
   "kind": "owned",
   "producer": "franchise",
   "v": 50
  },
  {
   "id": "franchise_100",
   "name": "Franchise Frenzy",
   "desc": "Own 100 Taco Franchises. The training video stars Diego. Unfortunately.",
   "icon": "franchise",
   "secret": false,
   "kind": "owned",
   "producer": "franchise",
   "v": 100
  },
  {
   "id": "factory_1",
   "name": "Tortillas by the Megaton",
   "desc": "Own 1 Taco Factory. Abuela toured it and said the old press was better.",
   "icon": "factory",
   "secret": false,
   "kind": "owned",
   "producer": "factory",
   "v": 1
  },
  {
   "id": "factory_50",
   "name": "Industrial Strength",
   "desc": "Own 50 Taco Factories. Fifty smokestacks. All smell like cumin.",
   "icon": "factory",
   "secret": false,
   "kind": "owned",
   "producer": "factory",
   "v": 50
  },
  {
   "id": "factory_100",
   "name": "Assembly Line Abuela",
   "desc": "Own 100 Taco Factories. Abuela still inspects the first tortilla every shift.",
   "icon": "factory",
   "secret": false,
   "kind": "owned",
   "producer": "factory",
   "v": 100
  },
  {
   "id": "orbital_1",
   "name": "Tacos in Space",
   "desc": "Own 1 Orbital Taquería. Zero gravity. Somehow no crumbs.",
   "icon": "orbital",
   "secret": false,
   "kind": "owned",
   "producer": "orbital",
   "v": 1
  },
  {
   "id": "orbital_50",
   "name": "Taco Constellation",
   "desc": "Own 50 Orbital Taquerías. You can see the sign from Abuela's backyard.",
   "icon": "orbital",
   "secret": false,
   "kind": "owned",
   "producer": "orbital",
   "v": 50
  },
  {
   "id": "orbital_100",
   "name": "Ring Around the Planet",
   "desc": "Own 100 Orbital Taquerías. The planet now has a delicious ring.",
   "icon": "orbital",
   "secret": false,
   "kind": "owned",
   "producer": "orbital",
   "v": 100
  },
  {
   "id": "golden_1",
   "name": "Lucky Bite",
   "desc": "Click 1 golden taco. It shimmered. You did not hesitate.",
   "icon": "star",
   "secret": false,
   "kind": "golden",
   "v": 1
  },
  {
   "id": "golden_7",
   "name": "Seven Shiny Shells",
   "desc": "Click 7 golden tacos. Diego thinks you're cheating. You're just fast.",
   "icon": "star",
   "secret": false,
   "kind": "golden",
   "v": 7
  },
  {
   "id": "golden_27",
   "name": "Midas Touch Salsa",
   "desc": "Click 27 golden tacos. Abuela made you get your eyes checked. They're fine.",
   "icon": "star",
   "secret": false,
   "kind": "golden",
   "v": 27
  },
  {
   "id": "era_2",
   "name": "Around the Block",
   "desc": "Reach the Corner Stand era. The Friday line goes around the block.",
   "icon": "stand",
   "secret": false,
   "kind": "era",
   "v": 2
  },
  {
   "id": "era_3",
   "name": "MANUEL'S (Crooked)",
   "desc": "Reach the Food Truck era. The paint dried before anyone noticed the tilt.",
   "icon": "truck",
   "secret": false,
   "kind": "era",
   "v": 3
  },
  {
   "id": "era_4",
   "name": "Citywide",
   "desc": "Reach the Truck Fleet era. Abuela runs dispatch from the kitchen table.",
   "icon": "fleet",
   "secret": false,
   "kind": "era",
   "v": 4
  },
  {
   "id": "era_5",
   "name": "Went Viral",
   "desc": "Reach the Depop Drip era. One video. Four million views. Zero sleep.",
   "icon": "tag",
   "secret": false,
   "kind": "era",
   "v": 5
  },
  {
   "id": "era_6",
   "name": "Taco Empire",
   "desc": "Reach the Taco Empire era. Manuel still folds the first taco by hand.",
   "icon": "crown",
   "secret": false,
   "kind": "era",
   "v": 6
  },
  {
   "id": "prestige_1",
   "name": "A New Summer",
   "desc": "Start a new summer for the first time. Manuel keeps the notebook and the salsa.",
   "icon": "refresh",
   "secret": false,
   "kind": "prestiges",
   "v": 1
  },
  {
   "id": "salsa_10",
   "name": "Ten Point Salsa",
   "desc": "Earn 10 Salsa Points total. Permanent flavor. Permanent income.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 10
  },
  {
   "id": "salsa_100",
   "name": "Century of Salsa",
   "desc": "Earn 100 Salsa Points total. The secret recipe is basically you now.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 100
  },
  {
   "id": "depop_sale_1",
   "name": "First Sale, Shipped",
   "desc": "Collect 1 Depop sale. Abuela wrapped it. There was a thank-you note.",
   "icon": "shirt",
   "secret": false,
   "kind": "depopSales",
   "v": 1
  },
  {
   "id": "depop_sale_10",
   "name": "Ten Happy Mailboxes",
   "desc": "Collect 10 Depop sales. The post office knows Manuel by name.",
   "icon": "shirt",
   "secret": false,
   "kind": "depopSales",
   "v": 10
  },
  {
   "id": "depop_viral_1",
   "name": "It's Everywhere",
   "desc": "Have a Depop sale go viral. Double payout. Diego took the credit.",
   "icon": "sparkle",
   "secret": false,
   "kind": "depopViral",
   "v": 1
  },
  {
   "id": "hype_100",
   "name": "Maximum Hype",
   "desc": "Fill the Hype meter to 100. The internet is chanting Manuel's name.",
   "icon": "drop",
   "secret": false,
   "kind": "hype",
   "v": 100
  },
  {
   "id": "fast_clicks",
   "name": "Turbo Thumbs",
   "desc": "Sell 100 tacos by hand within 10 seconds. Nobody saw your hands move.",
   "icon": "mouse",
   "secret": true,
   "kind": "fastClicks",
   "v": 100
  },
  {
   "id": "upgrades_100",
   "name": "Fully Upgraded",
   "desc": "Own 100 upgrades. Manuel has read every manual. Twice.",
   "icon": "gear",
   "secret": true,
   "kind": "upgrades",
   "v": 100
  },
  {
   "id": "playtime_1h",
   "name": "Dinner's Ready",
   "desc": "Play for 1 hour total. Abuela says the tacos are getting cold. Go eat.",
   "icon": "clock",
   "secret": true,
   "kind": "playtime",
   "v": 3600
  }
 ],
 "news": {
  "generic": [
   "Local boy, 12, insists the secret ingredient is 'love.' Abuela says it is actually lime.",
   "Abuela has approved exactly one change to the recipe since 1974. Nobody knows what it was.",
   "Cousin Diego claims he can eat eleven tacos in one sitting. Sources confirm he stopped at nine.",
   "Neighbors report a 'suspiciously good smell' coming from the backyard again.",
   "Manuel's math homework found covered in salsa. Teacher gives partial credit.",
   "The folding table has a wobbly leg. Abuela says it builds character.",
   "Mrs. Ortega from next door has ordered 'the usual.' Nobody has told her what the usual is.",
   "Manuel practiced his tortilla flip for two hours. Ceiling is fine. Mostly.",
   "Diego was put in charge of napkins. Napkins are now somehow missing.",
   "Abuela's radio plays the same station every day. Customers have started to sing along.",
   "A dog named Chorizo has appointed himself head of security. He accepts payment in crumbs.",
   "Manuel's mom says he can keep selling tacos 'as long as the grades stay up.' The grades are up.",
   "Reports of a kid on a bike delivering tacos to the fire station. Firefighters give it five stars.",
   "Abuela says the tortillas taste better if you talk nicely to them. Manuel talks nicely to them.",
   "The cilantro debate has divided the block. Manuel refuses to take a side.",
   "Diego suggested a taco with pineapple. The motion was tabled. The pineapple was eaten.",
   "Manuel's sneakers now permanently smell like onions. He has accepted this.",
   "Weather report: sunny with a chance of salsa verde.",
   "Someone left a thank-you note under the tip jar. Manuel taped it to the wall.",
   "Abuela says she is 'just supervising.' She has been supervising for six hours.",
   "Local kids have started a rumor that Manuel's tacos help you pass tests. Sales up on Thursdays.",
   "Manuel was seen practicing his 'thank you, come again' in the mirror.",
   "The mailman now takes his lunch break at the exact time the first batch comes out.",
   "Diego wrote a jingle. It only has four words. It is stuck in everyone's head.",
   "Manuel's little notebook of orders now has a second notebook."
  ],
  "lowCash": [
   "Manuel counts the tip jar again. Still mostly buttons.",
   "Abuela says money is not everything. Manuel agrees, but tortillas cost money.",
   "The cash box is so empty it echoes.",
   "Diego offered to lend Manuel three dollars. Diego does not have three dollars.",
   "Manuel has started saving the good foil to reuse. Abuela taught him that.",
   "Business update: two customers, one of them a dog.",
   "The change purse is lighter than a tortilla today.",
   "Manuel checked under the couch cushions for coins. Found a sock."
  ],
  "era1": [
   "A folding table appeared in Abuela's backyard this morning. Line forms at the gate.",
   "Abuela's cast-iron press is older than Manuel's dad. It still wins every argument.",
   "Manuel's first customer was Abuela. She paid full price and left a tip.",
   "Neighbors have started bringing their own plates to the backyard. Manuel is thrilled.",
   "The backyard hose is now the official hand-washing station.",
   "Manuel hung a paper sign on the fence. It says TACOS in three colors of marker."
  ],
  "era2": [
   "A brand-new stand opened on 5th and Main. The kid running it looks about twelve.",
   "Friday lines at the corner stand now go around the block and past the barber shop.",
   "The barber next door has started giving haircuts to people waiting in the taco line.",
   "City bus drivers now honk twice when they pass Manuel's stand. It means 'save me two.'",
   "Manuel got a real cash register. He rings it up even when nobody is buying.",
   "Abuela brings a folding chair to the corner every afternoon to 'supervise.'"
  ],
  "era3": [
   "Manuel bought a used truck. He painted MANUEL'S on the side himself. It is a little crooked.",
   "The truck's crooked sign has become a local landmark. Nobody wants it fixed.",
   "Manuel's truck stalled twice on the hill today. The tacos were still on time.",
   "Diego passed his driving test on the third try. The truck has a new driver.",
   "A food critic ate at the truck and cried a little. He says it was the onions.",
   "The truck's horn plays Diego's four-word jingle now. Neighbors are divided."
  ],
  "era4": [
   "Manuel's trucks have been spotted in every neighborhood in the city.",
   "Abuela runs dispatch from her kitchen with a landline and a paper map.",
   "Truck number seven got lost. Abuela found it by listening for the jingle.",
   "A rival truck tried to park on 5th and Main. It left after one taste test.",
   "Abuela's kitchen now has three phones. She answers all of them at once.",
   "Manuel's fleet catered a wedding. The bride requested extra guac in her vows.",
   "A customer asked if the crooked logo comes on a shirt. Manuel said no. Diego said not yet.",
   "Diego's video of Truck #1 has 400 views. He says that is a lot."
  ],
  "era5": [
   "A video of Manuel's crooked truck sign hit ten million views overnight. Hoodies are next.",
   "Manuel's Depop shop sold out its first drop in four minutes. Diego missed it.",
   "People are wearing Manuel's face on their chest now. Manuel finds this a little weird.",
   "The Salsa Hoodie restock crashed the shop for an hour. Abuela was unbothered.",
   "Fans are trading Taco Tees like baseball cards. Original run is worth double.",
   "Diego's unboxing video got more views than the truck video. He will not stop mentioning it."
  ],
  "era6": [
   "Manuel's face now appears on 4,000 storefronts. He still gets embarrassed about it.",
   "Tortilla production reached one megaton this week. Abuela tasted every batch. Allegedly.",
   "The orbital taquería reports zero crumbs. Scientists are baffled. Abuela is not.",
   "Manuel still folds the first taco of every day by hand. The recipe is still in Abuela's notebook.",
   "A franchise owner in Ohio called to ask about the crooked sign. Manuel said 'keep it crooked.'",
   "Diego was named Chief Taste Officer. He says it is the job he was born for."
  ],
  "producers": {
   "press": [
    "Manuel's presses are so hot the whole block smells like fresh tortillas by 6 AM.",
    "Abuela's original press still sits in the middle of the room. The others are 'just helpers.'",
    "The presses run so fast Manuel has invented a tortilla stacking technique."
   ],
   "cousin": [
    "Cousin Diego has asked for a raise. In tacos.",
    "Diego has hired his friends. They are also all called Diego now for simplicity.",
    "The Diegos have formed a union. Their demands are simple: more guac."
   ],
   "salsa": [
    "The salsa bar now has a salsa that people have to sign a waiver for. It is very popular.",
    "Abuela tested every salsa personally. She did not flinch once.",
    "Customers now come just for the salsa and forget to order tacos."
   ],
   "stand": [
    "Manuel's stands now occupy every good corner in town. The bad corners are next.",
    "Someone proposed at the 5th and Main stand. She said yes. They ordered al pastor.",
    "City council debated renaming the corner 'Manuel's Corner.' The vote was unanimous."
   ],
   "truck": [
    "Manuel's trucks have started forming a convoy. It is very loud and smells amazing.",
    "Every truck has a slightly crooked sign. Manuel insists it is for consistency.",
    "Traffic report: a taco truck on every hill. Drive slowly, roll the windows down."
   ],
   "fleet": [
    "Abuela's dispatch map now covers the entire kitchen wall and part of the ceiling.",
    "Manuel's fleet is bigger than the city bus system. It runs on time more often, too.",
    "Fleet drivers have started signaling each other with jingle horn codes."
   ],
   "catering": [
    "Manuel's crew has catered so many quinceañeras they own their own dance floor.",
    "Corporate lunches are now scheduled around taco day. Productivity has never been higher.",
    "The catering crew set up in a stadium last night. They ran out of nothing."
   ],
   "depop": [
    "Manuel's Depop shop is shipping to countries Diego cannot find on a map.",
    "Someone in Tokyo sent a photo wearing a Taco Tee. Abuela framed it.",
    "The shop has so many orders that folding hoodies is now a family event on Sundays."
   ],
   "drop": [
    "Another drop sold out in seconds. Diego set an alarm and still missed it.",
    "Resellers are camping outside the truck for merch. Manuel gives them tacos anyway.",
    "The latest drop had a secret salsa recipe printed inside the hood. It has been decoded."
   ],
   "collab": [
    "So many unboxing videos exist that watching them all would take longer than a school year.",
    "An influencer collab featured Abuela. Her video has more views than everyone else's combined.",
    "Manuel's collab partners keep asking for tacos instead of payment. He respects that."
   ],
   "franchise": [
    "Manuel's franchises opened in three new countries this week. All signs slightly crooked.",
    "A franchise handbook now exists. Page one says: talk nicely to the tortillas.",
    "Franchise owners fly in every year for Abuela's tasting exam. Most pass. Some cry."
   ],
   "factory": [
    "The taco factory runs day and night. The night shift gets the best salsa.",
    "Tortillas by the megaton, and Abuela still checks the first one off the line each morning.",
    "Factory engineers designed a press that copies Abuela's exact wrist flick. She approved it."
   ],
   "orbital": [
    "The orbital taquería reported its first zero-gravity guac incident. It was beautiful.",
    "Astronauts now request Manuel's for every launch. Mission control has a salsa preference.",
    "Somehow, still no crumbs in orbit. The scientists have stopped asking."
   ]
  }
 },
 "ui": {
  "offlineToast": "While you were away, the stand kept running for {time} and earned {amount}. Abuela was supervising.",
  "prestigeConfirm": "Franchise Out? Manuel hands over the keys and starts again from the backyard with {salsa} Salsa Points. Cash, producers, upgrades and eras reset. Achievements, salsa and recipes stay.",
  "prestigeLocked": "Not yet. Manuel needs to earn a lot more before anyone wants to buy the recipe. Come back at $1 billion lifetime.",
  "depopLockedTeaser": "Something is going to happen with that crooked sign. Keep growing and you will find out.",
  "hardResetConfirm": "Hard reset erases EVERYTHING: cash, producers, achievements, salsa points, recipes, all of it. Manuel goes back to being twelve with a wobbly table. Are you sure?",
  "firstVisitWelcome": "Manuel is twelve, he has Abuela's tortilla recipe, and he just set up a folding table in the backyard. Click the taco to sell one and see how far this goes.",
  "tacoButtonHint": "Click or press Space to sell a taco.",
  "sellMode": "Diego's Garage Sale: sell businesses for 25% back.",
  "newSummer": "Manuel hands Diego the keys, keeps Abuela's notebook, and sets up a folding table in a new neighborhood. He missed the sound of the press.",
  "flopToast": "It did not sell. Abuela is wearing it now.",
  "storageOff": "Saving is off in this browser. Use Options, then Export, to keep your progress."
 },
 "synergies": [
  {
   "id": "syn_dispatch",
   "name": "Diego Runs Dispatch",
   "a": "cousin",
   "b": "fleet",
   "pct": 0.05,
   "icon": "fleet",
   "flavor": "Diego has a headset and a map. Abuela has the real map."
  },
  {
   "id": "syn_salsa_truck",
   "name": "Salsa in Every Truck",
   "a": "truck",
   "b": "salsa",
   "pct": 0.01,
   "icon": "salsa",
   "flavor": "Five little cups in every window. The skull cup rides shotgun."
  },
  {
   "id": "syn_press_factory",
   "name": "Abuela's Press, Factory Scale",
   "a": "press",
   "b": "factory",
   "pct": 0.1,
   "icon": "factory",
   "flavor": "The factory copied her wrist flick. She approved it, eventually."
  },
  {
   "id": "syn_merch_truck",
   "name": "Merch on Every Truck",
   "a": "depop",
   "b": "fleet",
   "pct": 0.02,
   "icon": "shirt",
   "flavor": "Hoodies hang in the window next to the menu. They sell out first."
  },
  {
   "id": "syn_stand_franchise",
   "name": "Stand Sponsors",
   "a": "stand",
   "b": "franchise",
   "pct": 0.03,
   "icon": "franchise",
   "flavor": "Every franchise adopts a corner stand. The corner stands do not know."
  },
  {
   "id": "syn_catering_collab",
   "name": "Catering the Collab",
   "a": "catering",
   "b": "collab",
   "pct": 0.05,
   "icon": "collab",
   "flavor": "Every unboxing video ends with lunch. Lunch is catered."
  }
 ],
 "abuelaLines": {
  "any": [
   "Mijo, wipe the table.",
   "Talk nicely to the tortillas.",
   "Did you eat something? Not a taco. Something.",
   "The second batch is always better.",
   "More lime. Always more lime.",
   "Your grandfather would have said the sign is fine.",
   "I am just supervising.",
   "Sit up straight, the customers can see you.",
   "Diego, put that down.",
   "We do not run out of napkins in this family.",
   "Good. Now make another."
  ],
  "1": [
   "Twelve years old and already a businessman. Eat your breakfast first.",
   "The hose is for hands, not for Diego.",
   "Your mom says grades first. I say tortillas first. We compromise."
  ],
  "2": [
   "The corner is nice. The chairs are nicer. I brought the chairs.",
   "Tell the barber his haircut line is blocking my line."
  ],
  "3": [
   "The truck leans. You lean. It is a family trait.",
   "I will ride in it when it has real tires. Now it has real tires."
  ],
  "4": [
   "Truck seven forgot the limes. Truck seven knows what it did.",
   "Three phones. One Abuela. It is enough."
  ],
  "5": [
   "People wear your crooked letters on their chests now. I taped the first one to the fridge.",
   "Ten million views. Zero of them ate a taco. Fix that."
  ],
  "6": [
   "Four thousand stores and you still forget the napkins.",
   "Space tacos. Fine. Do they have lime up there?"
  ]
 },
 "buyerLines": [
  "Sold to a taco fan in Oslo.",
  "Sold to Mrs. Ortega, who says it is for her nephew.",
  "Sold to a kid in Tokyo who wore it to school.",
  "Sold to a mail carrier named Bell.",
  "Sold to the barber on 5th. He wears it while cutting hair.",
  "Sold to a whole marching band.",
  "Sold to a firefighter with excellent taste.",
  "Sold to someone in Iceland. It arrived a little cold.",
  "Sold to Diego. He used the employee discount.",
  "Sold to a taco fan in Buenos Aires.",
  "Sold to a dog named Chorizo's owner.",
  "Sold to a teacher who gives extra credit for wearing it."
 ],
 "buttonHints": [
  null,
  "Sell a taco. Abuela's recipe.",
  "Sell a taco from the corner stand.",
  "Sell a taco from the truck window.",
  "Sell a taco. Any truck. Every truck.",
  "Sell a taco (and maybe a tee).",
  "Sell a taco. Manuel still folds the first one."
 ],
 "secretHints": {
  "fast_clicks": "Something about very fast hands.",
  "upgrades_100": "Read every manual in the shop.",
  "playtime_1h": "Stay for dinner."
 },
 "tacoPrice": 2.5,
 "hypeDecayPer": 30,
 "flopChance": 0.05,
 "viralBase": 0.05,
 "menuItem": {
  "name": "New Menu Item",
  "baseCost": 1000000000000.0,
  "costMult": 20,
  "bonus": 0.03,
  "flavor": "Diego suggested it. Abuela vetoed it. It is on the menu anyway."
 }
};
