/* Manuel's Taco Clicker v2 — game data (lives, producers, chapters, rebirths, achievements, copy). */
const DATA = {
 "version": 2,
 "lives": [
  {
   "n": 1,
   "name": "Taco Life",
   "producers": [
    "press",
    "cousin",
    "salsa",
    "stand",
    "truck",
    "fleet",
    "catering"
   ],
   "chapters": [
    1,
    2,
    3,
    4
   ],
   "scale": {
    "cost": 1,
    "income": 1,
    "click": 1
   },
   "rebirthAt": 25000000.0,
   "startCash": 200,
   "skin": "classic",
   "hustle": {
    "title": "Catering Orders",
    "lockedTeaser": "Someone asked if Manuel does parties. He said maybe. Abuela said yes. Keep growing and the phone will ring.",
    "unlockChapter": 2,
    "items": [
     {
      "id": "quince",
      "name": "Quinceañera Party",
      "desc": "A taco tower shaped like a crown. Diego carries it in. Diego does not trip. Usually.",
      "costSeconds": 60,
      "minCost": 1000,
      "sellSeconds": 120,
      "payout": 1.5,
      "hype": 10
     },
     {
      "id": "wedding",
      "name": "Backyard Wedding",
      "desc": "Four hundred tacos, white tablecloths, and Manuel gets asked to dance anyway.",
      "costSeconds": 300,
      "minCost": 5000,
      "sellSeconds": 480,
      "payout": 1.8,
      "hype": 25
     },
     {
      "id": "office",
      "name": "Office Lunch",
      "desc": "Forty desks, one truck, zero productivity for the rest of the afternoon.",
      "costSeconds": 1200,
      "minCost": 25000,
      "sellSeconds": 1800,
      "payout": 2.2,
      "hype": 50
     },
     {
      "id": "stadium",
      "name": "Stadium Halftime",
      "desc": "Fifty thousand fans and the whole family on the griddles. Abuela runs the clock.",
      "costSeconds": 3600,
      "minCost": 100000,
      "sellSeconds": 7200,
      "payout": 3,
      "hype": 100,
      "requiresChapter": 4
     }
    ],
    "buyerLines": [
     "The mayor ordered extra guac.",
     "Mrs. Ortega's nephew turned fifteen. Nobody knew she had a nephew.",
     "The fire station booked the whole crew. They brought their own hose.",
     "The barber on 5th got married. The haircuts were free.",
     "A whole seventh grade class. Paid in exact change.",
     "The bride requested extra guac in her vows.",
     "An office of accountants. They tipped precisely.",
     "The marching band ate between songs. The songs got shorter.",
     "The home team lost. The tacos did not.",
     "Chorizo the dog's birthday party. Twelve guests, all dogs."
    ],
    "soldWord": "SERVED",
    "viralWord": "talk of the town",
    "flopLine": "The party got rained out. Abuela froze the leftovers for later."
   }
  },
  {
   "n": 2,
   "name": "Depop Life",
   "producers": [
    "depop",
    "thrift",
    "studio",
    "drop",
    "sneaker",
    "collab",
    "brand"
   ],
   "chapters": [
    5,
    6,
    7,
    8
   ],
   "scale": {
    "cost": 2000,
    "income": 6000,
    "click": 2500
   },
   "rebirthAt": 150000000000.0,
   "startCash": 120000,
   "skin": "neon",
   "hustle": {
    "title": "Depop Drops",
    "lockedTeaser": "Something is going to happen with that crooked sign. Keep growing and you will find out.",
    "unlockChapter": 5,
    "items": [
     {
      "id": "tee",
      "name": "Crooked Logo Tee",
      "desc": "The crooked logo on a soft cotton tee. The first run smelled faintly of onions.",
      "costSeconds": 60,
      "minCost": 2000000,
      "sellSeconds": 120,
      "payout": 1.5,
      "hype": 10
     },
     {
      "id": "hoodie",
      "name": "Salsa Hoodie",
      "desc": "Five salsas on the back, one of them a dare. Warm enough for early morning prep.",
      "costSeconds": 300,
      "minCost": 10000000,
      "sellSeconds": 480,
      "payout": 1.8,
      "hype": 25
     },
     {
      "id": "jacket",
      "name": "Truck #1 Jacket",
      "desc": "Hand-stitched patch of the original truck, crooked sign and all. Diego wants one.",
      "costSeconds": 1200,
      "minCost": 50000000,
      "sellSeconds": 1800,
      "payout": 2.2,
      "hype": 50
     },
     {
      "id": "sneakers",
      "name": "Grail Sneakers",
      "desc": "Tortilla-colored, salsa-red laces, limited to a whisper. Chorizo the dog has approved them.",
      "costSeconds": 3600,
      "minCost": 200000000,
      "sellSeconds": 7200,
      "payout": 3,
      "hype": 100,
      "requires": "depop_radar"
     }
    ],
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
     "Sold to a taco fan in Buenos Aires."
    ],
    "soldWord": "SOLD",
    "viralWord": "went viral",
    "flopLine": "It did not sell. Abuela is wearing it now."
   }
  },
  {
   "n": 3,
   "name": "Empire Life",
   "producers": [
    "franchise",
    "app",
    "factory",
    "global",
    "airship",
    "orbital",
    "moon"
   ],
   "chapters": [
    9,
    10,
    11,
    12
   ],
   "scale": {
    "cost": 4000000.0,
    "income": 30000000.0,
    "click": 6000000.0
   },
   "rebirthAt": 750000000000000.0,
   "startCash": 240000000.0,
   "skin": "cosmic",
   "hustle": {
    "title": "Global Launches",
    "lockedTeaser": "A map is taped to Abuela's kitchen wall. Manuel keeps adding pins. Keep growing and the pins get farther away.",
    "unlockChapter": 9,
    "items": [
     {
      "id": "city",
      "name": "City Launch",
      "desc": "A new city wakes up to the crooked sign. Abuela flies in with a spoon and a suitcase.",
      "costSeconds": 60,
      "minCost": 4000000000.0,
      "sellSeconds": 120,
      "payout": 1.5,
      "hype": 10
     },
     {
      "id": "country",
      "name": "Country Launch",
      "desc": "Trucks, franchises and hoodies land in a whole country at once. All signs lean left.",
      "costSeconds": 300,
      "minCost": 20000000000.0,
      "sellSeconds": 480,
      "payout": 1.8,
      "hype": 25
     },
     {
      "id": "continent",
      "name": "Continent Launch",
      "desc": "Every time zone on the continent gets a drop and a taco. Diego has not slept.",
      "costSeconds": 1200,
      "minCost": 100000000000.0,
      "sellSeconds": 1800,
      "payout": 2.2,
      "hype": 50
     },
     {
      "id": "moonlaunch",
      "name": "Moon Launch",
      "desc": "The moon, but tacos. Low gravity, extra fluffy tortillas, and one very proud Abuela.",
      "costSeconds": 3600,
      "minCost": 400000000000.0,
      "sellSeconds": 7200,
      "payout": 3,
      "hype": 100,
      "requiresChapter": 12
     }
    ],
    "buyerLines": [
     "The mayor ordered extra guac. A different mayor this time.",
     "A whole island ordered fish tacos. The penguins were consulted.",
     "The prime minister wore the hoodie to a meeting.",
     "A city renamed a street Manuel's Way. It is a little crooked.",
     "Every airport gate on the continent smells like Sunday morning.",
     "A mountain village ordered by radio. Abuela answered.",
     "The astronauts requested the skull salsa. Mission control said no.",
     "A kid in Tokyo who bought the first tee ordered for his whole school.",
     "The queen sent another thank-you card. Still did not finish the salsa.",
     "The moon crew reports zero crumbs and one very happy Diego."
    ],
    "soldWord": "LAUNCHED",
    "viralWord": "went global",
    "flopLine": "The launch got delayed. The tacos were eaten by the crew instead."
   }
  }
 ],
 "producers": [
  {
   "id": "press",
   "name": "Tortilla Press",
   "desc": "Abuela's old cast-iron press. Still works.",
   "flavor": "It squeaks, but so does Abuela, and she still makes the best tortillas in town.",
   "cost": 15,
   "income": 0.1,
   "life": 1,
   "chapter": 1,
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
   ],
   "news": [
    "Manuel's presses are so hot the whole block smells like fresh tortillas by 6 AM.",
    "Abuela's original press still sits in the middle of the room. The others are 'just helpers.'",
    "The presses run so fast Manuel has invented a tortilla stacking technique."
   ]
  },
  {
   "id": "cousin",
   "name": "Cousin Diego",
   "desc": "Paid in tacos. Surprisingly efficient.",
   "flavor": "Diego is fourteen, eats like he is forty, and works like he is paid. He is not.",
   "cost": 100,
   "income": 1,
   "life": 1,
   "chapter": 1,
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
   ],
   "news": [
    "Cousin Diego has asked for a raise. In tacos.",
    "Diego has hired his friends. They are also all called Diego now for simplicity.",
    "The Diegos have formed a union. Their demands are simple: more guac."
   ]
  },
  {
   "id": "salsa",
   "name": "Salsa Bar",
   "desc": "Five salsas. One is a dare.",
   "flavor": "Verde, roja, pineapple, roasted, and the one Abuela labels only with a skull.",
   "cost": 1100,
   "income": 8,
   "life": 1,
   "chapter": 1,
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
   ],
   "news": [
    "The salsa bar now has a salsa that people have to sign a waiver for. It is very popular.",
    "Abuela tested every salsa personally. She did not flinch once.",
    "Customers now come just for the salsa and forget to order tacos."
   ]
  },
  {
   "id": "stand",
   "name": "Taco Stand",
   "desc": "A real stand on the corner of 5th and Main.",
   "flavor": "The line goes around the block on Fridays. On Saturdays it goes around twice.",
   "cost": 12000,
   "income": 47,
   "life": 1,
   "chapter": 2,
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
   ],
   "news": [
    "Manuel's stands now occupy every good corner in town. The bad corners are next.",
    "Someone proposed at the 5th and Main stand. She said yes. They ordered al pastor.",
    "City council debated renaming the corner 'Manuel's Corner.' The vote was unanimous."
   ]
  },
  {
   "id": "truck",
   "name": "Food Truck",
   "desc": "MANUEL'S painted on the side. Slightly crooked.",
   "flavor": "It was a bread truck. Now it is a dream. The dream leans a little to the left.",
   "cost": 130000,
   "income": 260,
   "life": 1,
   "chapter": 3,
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
   ],
   "news": [
    "Manuel's trucks have started forming a convoy. It is very loud and smells amazing.",
    "Every truck has a slightly crooked sign. Manuel insists it is for consistency.",
    "Traffic report: a taco truck on every hill. Drive slowly, roll the windows down."
   ]
  },
  {
   "id": "fleet",
   "name": "Truck Fleet",
   "desc": "Trucks in every neighborhood. Dispatch is Abuela.",
   "flavor": "Abuela has a map, a landline, and opinions. The trucks arrive early or else.",
   "cost": 1400000.0,
   "income": 1400,
   "life": 1,
   "chapter": 4,
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
   ],
   "news": [
    "Abuela's dispatch map now covers the entire kitchen wall and part of the ceiling.",
    "Manuel's fleet is bigger than the city bus system. It runs on time more often, too.",
    "Fleet drivers have started signaling each other with jingle horn codes."
   ]
  },
  {
   "id": "catering",
   "name": "Catering Crew",
   "desc": "Weddings, quinceañeras, corporate lunches.",
   "flavor": "Manuel folded 400 tacos for a wedding and still got asked to dance. He said yes.",
   "cost": 20000000.0,
   "income": 7800,
   "life": 1,
   "chapter": 4,
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
   ],
   "news": [
    "Manuel's crew has catered so many quinceañeras they own their own dance floor.",
    "Corporate lunches are now scheduled around taco day. Productivity has never been higher.",
    "The catering crew set up in a stadium last night. They ran out of nothing."
   ]
  },
  {
   "id": "depop",
   "name": "Depop Listing",
   "desc": "Taco tees, salsa hoodies. Ships worldwide.",
   "flavor": "Manuel drew the logo on a napkin. Diego uploaded it. A kid in Tokyo bought it in an hour.",
   "cost": 30000,
   "income": 600.0,
   "life": 2,
   "chapter": 5,
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
   ],
   "news": [
    "Manuel's Depop shop is shipping to countries Diego cannot find on a map.",
    "Someone in Tokyo sent a photo wearing a Taco Tee. Abuela framed it.",
    "The shop has so many orders that folding hoodies is now a family event on Sundays."
   ]
  },
  {
   "id": "thrift",
   "name": "Thrift Flip Run",
   "desc": "Diego digs through bins. Somebody buys it.",
   "flavor": "Diego finds a jacket for four dollars and sells it for forty. He also finds three left shoes.",
   "cost": 200000,
   "income": 6000,
   "life": 2,
   "chapter": 5,
   "icon": "box",
   "tiers": [
    {
     "name": "Diego's Bin Elbows",
     "flavor": "He has learned to lean into the bin like it owes him money. The bin gives up first."
    },
    {
     "name": "Abuela's Garage Sale Map",
     "flavor": "Hand-drawn, coffee-stained, and never wrong. The good sales have a little star."
    },
    {
     "name": "Chorizo Sniffs Out Vintage",
     "flavor": "The dog barks at anything from before the year 2000. He is right about eighty percent."
    },
    {
     "name": "Every Thrift Store in Town",
     "flavor": "Store clerks see Diego coming and hide the good racks. Diego finds them anyway."
    },
    {
     "name": "Estate Sale Speed Van",
     "flavor": "It is the old bread truck. It still leans. It now leans toward bargains."
    },
    {
     "name": "Thrift Time Machine",
     "flavor": "Diego buys the jacket brand new in 1987 and lists it as vintage in an hour. Technically true."
    }
   ],
   "news": [
    "Cousin Diego came home with 400 vintage jackets and one lamp. The lamp is not for sale. The lamp is his friend.",
    "Every thrift store in the state now has a sign that says NO DIEGOS BEFORE 9 AM. Diego arrives at 9:01.",
    "Abuela found a sweater in a bin that she donated in 1992. She bought it back. She says it was never this expensive."
   ]
  },
  {
   "id": "studio",
   "name": "Ring Light Studio",
   "desc": "Product photos so good the hoodies blush.",
   "flavor": "Diego holds the phone. Abuela holds the cookie tray. The hoodie has never looked this loved.",
   "cost": 2200000,
   "income": 48000,
   "life": 2,
   "chapter": 5,
   "icon": "camera",
   "tiers": [
    {
     "name": "Second Cookie Tray",
     "flavor": "Twice the reflection. Abuela says it is the good tray and it goes back in the kitchen after."
    },
    {
     "name": "White Bedsheet Backdrop",
     "flavor": "It is Diego's bedsheet. The hoodies look clean. Diego is now sleeping under a towel."
    },
    {
     "name": "Chorizo the Model",
     "flavor": "He sits, he stays, he wears the salsa hoodie. Every listing with the dog sells first."
    },
    {
     "name": "Abuela's Kitchen Set",
     "flavor": "Photos taken next to the actual press. Buyers say they can smell the tortillas."
    },
    {
     "name": "Golden Hour on Demand",
     "flavor": "Manuel bought a lamp that is the sunset. The corner store next door is confused about the time."
    },
    {
     "name": "Photos Taken From Space",
     "flavor": "The hoodie is on the roof. The camera is in orbit. The lighting is perfect. Diego is cold."
    }
   ],
   "news": [
    "Manuel's hoodie photos are so good that people are buying the hoodies and framing the photos.",
    "Chorizo the dog has modeled in 10,000 listings. He has not learned a second pose. He does not need one.",
    "Mrs. Ortega came by to see the studio and left with a full portrait session. She sent the photo to her nephew."
   ]
  },
  {
   "id": "drop",
   "name": "Hype Drop",
   "desc": "Limited runs that sell out in seconds.",
   "flavor": "Fifty hoodies. Ten thousand refresh buttons. Diego watches the counter and screams.",
   "cost": 24000000,
   "income": 282000,
   "life": 2,
   "chapter": 6,
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
   ],
   "news": [
    "Another drop sold out in seconds. Diego set an alarm and still missed it.",
    "Resellers are camping outside the truck for merch. Manuel gives them tacos anyway.",
    "The latest drop had a secret salsa recipe printed inside the hood. It has been decoded."
   ]
  },
  {
   "id": "sneaker",
   "name": "Sneaker Resale Desk",
   "desc": "Grails in, grails out. Chorizo checks the laces.",
   "flavor": "Diego can name a shoe from across the street. He cannot name the state capital. Priorities.",
   "cost": 260000000,
   "income": 1560000,
   "life": 2,
   "chapter": 7,
   "icon": "shield",
   "tiers": [
    {
     "name": "Diego's Shoe Wall",
     "flavor": "Forty boxes stacked to the ceiling. Abuela calls it the shoe tower and dusts it weekly."
    },
    {
     "name": "Lace Inspection by Chorizo",
     "flavor": "One sniff, one bark, one nod. No fake pair has ever gotten past the dog."
    },
    {
     "name": "The Tortilla Colorway",
     "flavor": "A shoe the color of a warm tortilla with salsa-red laces. It sells out before it exists."
    },
    {
     "name": "Sneaker Trading Floor",
     "flavor": "Diego wears a vest and yells numbers. Abuela sits in the corner and yells louder numbers."
    },
    {
     "name": "Pairs Signed by Abuela",
     "flavor": "She signs the sole with a marker and a frown. The frown is worth thousands."
    },
    {
     "name": "Shoes That Walk to the Buyer",
     "flavor": "You buy them, they leave the shelf, they arrive at your door. Do not ask how. Do not tie them."
    }
   ],
   "news": [
    "Cousin Diego has one million pairs of sneakers and still says he has nothing to wear.",
    "Chorizo the dog has inspected ten million pairs of shoes and chewed exactly one. It was a fake. Probably.",
    "The Tortilla Colorway is now more valuable than an actual tortilla. Abuela finds this personally offensive."
   ]
  },
  {
   "id": "collab",
   "name": "Influencer Collab",
   "desc": "Every unboxing is free advertising.",
   "flavor": "A guy with two million followers ate a taco on camera and forgot to talk for a minute.",
   "cost": 2800000000.0,
   "income": 8400000,
   "life": 2,
   "chapter": 8,
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
   ],
   "news": [
    "So many unboxing videos exist that watching them all would take longer than a school year.",
    "An influencer collab featured Abuela. Her video has more views than everyone else's combined.",
    "Manuel's collab partners keep asking for tacos instead of payment. He respects that."
   ]
  },
  {
   "id": "brand",
   "name": "Crooked Co.",
   "desc": "Manuel's own label. The lean is the logo.",
   "flavor": "Manuel drew the crooked sign on a napkin at twelve. Now it is on a tag and the tag is on everybody.",
   "cost": 40000000000.0,
   "income": 46800000,
   "life": 2,
   "chapter": 8,
   "icon": "shirt",
   "tiers": [
    {
     "name": "The Napkin Logo, Framed",
     "flavor": "The original napkin hangs in the office. It has a salsa stain. That is part of the brand now."
    },
    {
     "name": "Abuela Approves the Fit",
     "flavor": "She tugs every sleeve and says 'too tight' or 'fine.' Only 'fine' ships."
    },
    {
     "name": "Crooked Co. Lookbook",
     "flavor": "Diego is every model. Chorizo is every other model. It is a very short book that sells a lot."
    },
    {
     "name": "Flagship Store on 5th and Main",
     "flavor": "Right where the stand was. The taco stand is still there too. It is in the store. Yes, inside."
    },
    {
     "name": "Crooked Co. Fashion Week",
     "flavor": "Models walk the runway slightly to the left. Critics call it bold. Manuel calls it accurate."
    },
    {
     "name": "The Whole World Leans",
     "flavor": "Every logo on Earth is now a little crooked out of respect. Straight lines are so last season."
    }
   ],
   "news": [
    "Crooked Co. is now worn by ten million people and one dog. The dog was first.",
    "Manuel's original napkin logo went to a museum for one day. Abuela went to get it back. She used it to wipe her hands.",
    "Fashion critics agree Crooked Co. has changed clothing forever. Diego agrees it has changed his laundry forever."
   ]
  },
  {
   "id": "franchise",
   "name": "Taco Franchise",
   "desc": "Manuel's face on 4,000 storefronts.",
   "flavor": "Every owner learns the recipe from Abuela herself. She grades them. Most pass eventually.",
   "cost": 60000000.0,
   "income": 3000000.0,
   "life": 3,
   "chapter": 9,
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
   ],
   "news": [
    "Manuel's franchises opened in three new countries this week. All signs slightly crooked.",
    "A franchise handbook now exists. Page one says: talk nicely to the tortillas.",
    "Franchise owners fly in every year for Abuela's tasting exam. Most pass. Some cry."
   ]
  },
  {
   "id": "app",
   "name": "Manuel's App",
   "desc": "Tacos and merch in one tap. Abuela has a tab.",
   "flavor": "Diego wrote the first version. It only had one button. The button said TACO. It was enough.",
   "cost": 400000000.0,
   "income": 30000000.0,
   "life": 3,
   "chapter": 9,
   "icon": "depop",
   "tiers": [
    {
     "name": "The Second Button",
     "flavor": "It says HOODIE. Diego added it under protest. He feels one button was pure."
    },
    {
     "name": "Abuela Mode",
     "flavor": "Big letters, one screen, and a button that calls Manuel directly. She uses it a lot."
    },
    {
     "name": "Chorizo Push Alerts",
     "flavor": "A little bark when your order is ready. Every dog in the city now answers Manuel's app."
    },
    {
     "name": "Salsa Level Slider",
     "flavor": "It goes from mild to skull. Nobody has slid it all the way. The app asks if you are sure."
    },
    {
     "name": "The App Knows You're Hungry",
     "flavor": "It sends a taco before you order. It is right every time. Diego is worried about his phone."
    },
    {
     "name": "App Installed on Everything",
     "flavor": "Fridges, watches, toasters, one submarine. The submarine orders fish tacos and nothing else."
    }
   ],
   "news": [
    "Manuel's App has been downloaded by every phone on Earth and, mysteriously, two microwaves.",
    "Abuela has ordered from the app 4,000 times. Every order is one taco and a note that says 'test.'",
    "The app's most popular feature is the button that makes Chorizo bark. Nobody uses the menu."
   ]
  },
  {
   "id": "factory",
   "name": "Taco Factory",
   "desc": "Tortillas by the megaton.",
   "flavor": "Manuel walked the floor on day one and stopped every machine to taste. Twice.",
   "cost": 4400000000.0,
   "income": 240000000.0,
   "life": 3,
   "chapter": 9,
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
   ],
   "news": [
    "The taco factory runs day and night. The night shift gets the best salsa.",
    "Tortillas by the megaton, and Abuela still checks the first one off the line each morning.",
    "Factory engineers designed a press that copies Abuela's exact wrist flick. She approved it."
   ]
  },
  {
   "id": "global",
   "name": "Global Drops",
   "desc": "A drop in every time zone. Diego never sleeps.",
   "flavor": "Midnight in Tokyo, noon in Mexico City, breakfast in Iceland. Diego has a clock for each and one for naps.",
   "cost": 48000000000.0,
   "income": 1410000000.0,
   "life": 3,
   "chapter": 10,
   "icon": "radar",
   "tiers": [
    {
     "name": "Diego's Wall of Clocks",
     "flavor": "Twenty-four clocks, one Diego, zero naps. Abuela brought him a blanket anyway."
    },
    {
     "name": "Napkin Notes in Every Language",
     "flavor": "Abuela learned to write 'eat something' in forty languages. The meaning never changes."
    },
    {
     "name": "Mr. Bell Goes International",
     "flavor": "Mr. Bell the mail carrier now has a passport, a boat, and a first-name relationship with customs."
    },
    {
     "name": "Drop Follows the Sunrise",
     "flavor": "The hoodies go on sale exactly as each city wakes up. Nobody has slept in yet."
    },
    {
     "name": "Antarctica Drop Day",
     "flavor": "The penguins line up politely and buy the fish taco tee. They also want the hoodie. It is cold."
    },
    {
     "name": "Drops Beyond the Time Zones",
     "flavor": "There is a drop happening in a time zone nobody has invented yet. It sold out. It always does."
    }
   ],
   "news": [
    "Global Drops has sold out in every country on Earth, including one that was founded this morning.",
    "Diego has not slept since the Tokyo launch. He says he is fine. He is wearing two different shoes. Both are grails.",
    "Mr. Bell delivered a hoodie to Antarctica. The penguin signed for it. Mr. Bell says it was very polite."
   ]
  },
  {
   "id": "airship",
   "name": "Airship Taquería",
   "desc": "A blimp with a griddle. Tacos from above.",
   "flavor": "It floats over the city with MANUEL'S on the side. Crooked, of course. You can read it from the ground.",
   "cost": 520000000000.0,
   "income": 7800000000.0,
   "life": 3,
   "chapter": 11,
   "icon": "rocket",
   "tiers": [
    {
     "name": "Lower the Taco Basket",
     "flavor": "A basket on a rope. You put in money, it goes up, it comes down warm. Diego works the rope."
    },
    {
     "name": "Abuela Gets a Window Seat",
     "flavor": "She sits by the window and points at where the trucks should be. They move."
    },
    {
     "name": "Chorizo, Sky Security",
     "flavor": "He barks at birds. The birds leave. The birds come back for the crumbs. It is a cycle."
    },
    {
     "name": "Salsa Rain Nozzle",
     "flavor": "A gentle mist of roja over the parade route. Umbrellas up, mouths open. Nobody complained."
    },
    {
     "name": "A Whole Fleet of Blimps",
     "flavor": "The sky over the city is now mostly tacos. Pilots use them to find the airport."
    },
    {
     "name": "Blimp That Blocks the Sun",
     "flavor": "For thirty seconds at noon the whole city is in the shade of a taco. Everybody looks up and orders."
    }
   ],
   "news": [
    "The Airship Taquería fleet now covers the sky over 200 cities. Weather forecasts just say 'blimps.'",
    "Abuela has taken over navigation on Blimp One. She does not use the instruments. The blimp arrives early anyway.",
    "A pilot reported a crooked MANUEL'S sign at 3,000 feet. Air traffic control confirmed it. It is a vibe."
   ]
  },
  {
   "id": "orbital",
   "name": "Orbital Taquería",
   "desc": "Tacos in zero gravity. Somehow no crumbs.",
   "flavor": "The crumbs float away and nobody knows where they go. Manuel is fine with that.",
   "cost": 5600000000000.0,
   "income": 42000000000.0,
   "life": 3,
   "chapter": 12,
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
   ],
   "news": [
    "The orbital taquería reported its first zero-gravity guac incident. It was beautiful.",
    "Astronauts now request Manuel's for every launch. Mission control has a salsa preference.",
    "Somehow, still no crumbs in orbit. The scientists have stopped asking."
   ]
  },
  {
   "id": "moon",
   "name": "Taco Moon",
   "desc": "The moon, but tacos. Abuela packed a sweater.",
   "flavor": "Manuel looked up one night and thought it looked like a tortilla. Then he bought it. Then he folded it.",
   "cost": 80000000000000.0,
   "income": 234000000000.0,
   "life": 3,
   "chapter": 12,
   "icon": "moon",
   "tiers": [
    {
     "name": "Plant the Crooked Flag",
     "flavor": "The flag leans a little in the moon dust. There is no wind. It leans on purpose."
    },
    {
     "name": "Abuela's Lunar Kitchen",
     "flavor": "Same press, same radio, same station. It comes in clearer up here for some reason."
    },
    {
     "name": "Low Gravity Tortilla Toss",
     "flavor": "Manuel flips a tortilla and it just keeps going. Diego caught one three days later."
    },
    {
     "name": "Chorizo's First Moonwalk",
     "flavor": "He bounced, he barked, he found a crumb. Scientists are unsure how there was a crumb."
    },
    {
     "name": "Salsa Sea of Tranquility",
     "flavor": "The crater is now roja. Astronauts come for the view and stay for the chips."
    },
    {
     "name": "The Moon Is Now a Taco",
     "flavor": "From Earth it looks the same. Up close it has a filling. Tides are unaffected. Appetites are not."
    }
   ],
   "news": [
    "The Taco Moon is now visible from every backyard on Earth. Kids are dragging out folding tables all over again.",
    "Abuela has moved to the moon for the season. She says the tortillas are fluffier and the neighbors are quieter.",
    "Diego tried to eat the Taco Moon. He got one bite. Astronomers report a small new crater shaped like a mouth."
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
 "eraBonus": 0.2,
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
   "cost": 1000000.0,
   "icon": "hand",
   "kind": "click",
   "effect": {
    "clickPct": 0.02
   },
   "unlock": {
    "lifetime": 500000.0
   },
   "desc": "Each click earns another 2% of your income per second."
  },
  {
   "id": "click_sauce",
   "name": "Signature Sauce",
   "flavor": "Nobody knows the recipe. Manuel knows the recipe. Manuel is not telling Diego.",
   "cost": 5000000.0,
   "icon": "drop",
   "kind": "click",
   "effect": {
    "clickPct": 0.02
   },
   "unlock": {
    "lifetime": 2000000.0
   },
   "desc": "Each click earns another 2% of your income per second."
  },
  {
   "id": "click_magic",
   "name": "Manuel's Magic Hands",
   "flavor": "He still folds the first taco of the day by hand, even now. Especially now.",
   "cost": 20000000.0,
   "icon": "sparkle",
   "kind": "click",
   "effect": {
    "clickMult": 2,
    "clickPct": 0.03
   },
   "unlock": {
    "lifetime": 8000000.0
   },
   "desc": "Clicks are twice as strong and earn another 3% of income per second."
  },
  {
   "id": "gold_lucky",
   "name": "Lucky Charm",
   "flavor": "A tiny wooden taco from Abuela's keychain. She says it works. It works.",
   "cost": 77777,
   "icon": "star",
   "kind": "golden",
   "effect": {
    "goldenFreq": 2
   },
   "unlock": {
    "lifetime": 20000.0
   },
   "desc": "Golden tacos appear twice as often."
  },
  {
   "id": "gold_hour",
   "name": "Golden Hour",
   "flavor": "The light hits the truck just right and the whole corner slows down to look.",
   "cost": 777777,
   "icon": "sun",
   "kind": "golden",
   "effect": {
    "goldenStay": 2
   },
   "unlock": {
    "lifetime": 300000.0
   },
   "desc": "Golden tacos stay on screen twice as long."
  },
  {
   "id": "gold_fortune",
   "name": "Salsa Fortune",
   "flavor": "Diego found a fortune in a taco. It said 'more.' He took it seriously.",
   "cost": 7777777,
   "icon": "sparkle",
   "kind": "golden",
   "effect": {
    "goldenDur": 2
   },
   "unlock": {
    "lifetime": 3000000.0
   },
   "desc": "Golden taco effects last twice as long."
  },
  {
   "id": "rep_1",
   "name": "Five-Star Reviews",
   "flavor": "Every review mentions Abuela. One just says 'grandma??? five stars.'",
   "cost": 900000.0,
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
   "cost": 9000000.0,
   "icon": "star",
   "kind": "rep",
   "effect": {
    "repMult": 0.125
   },
   "unlock": {
    "achievements": 25
   },
   "desc": "Income +12.5% for every 10% of Reputation."
  },
  {
   "id": "rep_3",
   "name": "The Video",
   "flavor": "Diego filmed the crooked truck sideways. It did not matter. A million views.",
   "cost": 90000000.0,
   "icon": "camera",
   "kind": "rep",
   "effect": {
    "repMult": 0.15
   },
   "unlock": {
    "achievements": 45
   },
   "desc": "Income +15% for every 10% of Reputation."
  },
  {
   "id": "rep_4",
   "name": "The Critic Came Back Twice",
   "flavor": "A quiet man in a suit ate three tacos, wrote one word in a notebook, and smiled.",
   "cost": 900000000.0,
   "icon": "chef",
   "kind": "rep",
   "effect": {
    "repMult": 0.2
   },
   "unlock": {
    "achievements": 70
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
   "cost": 500000.0,
   "icon": "book",
   "kind": "global",
   "effect": {
    "globalMult": 0.15
   },
   "unlock": {
    "lifetime": 1000000.0
   },
   "desc": "All income +15%."
  },
  {
   "id": "glob_3",
   "name": "City Famous",
   "flavor": "People give directions by the truck now. 'Left at Manuel's, then two blocks.'",
   "cost": 5000000.0,
   "icon": "flag",
   "kind": "global",
   "effect": {
    "globalMult": 0.15
   },
   "unlock": {
    "lifetime": 5000000.0
   },
   "desc": "All income +15%."
  },
  {
   "id": "glob_4",
   "name": "Statewide Craze",
   "flavor": "Kids three counties over are drawing crooked trucks on their notebooks.",
   "cost": 20000000.0,
   "icon": "flag",
   "kind": "global",
   "effect": {
    "globalMult": 0.2
   },
   "unlock": {
    "lifetime": 12000000.0
   },
   "desc": "All income +20%."
  },
  {
   "id": "glob_5",
   "name": "National Treasure",
   "flavor": "A museum asked for the folding table. Abuela said no. She still uses it.",
   "cost": 60000000.0,
   "icon": "crown",
   "kind": "global",
   "effect": {
    "globalMult": 0.25
   },
   "unlock": {
    "lifetime": 20000000.0
   },
   "desc": "All income +25%."
  },
  {
   "id": "depop_ring",
   "name": "Diego's Ring Light",
   "flavor": "Diego's face has never looked so good. The hoodies look pretty good too.",
   "cost": 50000.0,
   "icon": "camera",
   "kind": "depop",
   "effect": {
    "dropSpeed": 1.25
   },
   "unlock": {
    "depop": true
   },
   "desc": "Drops sell 25% faster."
  },
  {
   "id": "depop_bulk",
   "name": "Garage Full of Mailers",
   "flavor": "A pallet of boxes and a pallet of napkin notes. Abuela writes each one.",
   "cost": 300000.0,
   "icon": "box",
   "kind": "depop",
   "effect": {
    "dropSlots": 1
   },
   "unlock": {
    "depop": true
   },
   "desc": "One more slot. Abuela's car now lives outside."
  },
  {
   "id": "depop_radar",
   "name": "Diego Reads the Comments",
   "flavor": "Diego scrolls for a living now. He says he can feel a trend coming. He is often right.",
   "cost": 1500000.0,
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
   "cost": 5000000.0,
   "icon": "shield",
   "kind": "depop",
   "effect": {
    "dropPayout": 1.25
   },
   "unlock": {
    "depop": true
   },
   "desc": "Drop payouts +25%."
  },
  {
   "id": "depop_auto",
   "name": "Mr. Bell Knows the Route",
   "flavor": "Mr. Bell the mail carrier knows the route by heart now. He also knows Manuel by name.",
   "cost": 2000000.0,
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
   "cost": 200000.0,
   "icon": "moon",
   "kind": "offline",
   "effect": {
    "offlineRate": 0.8,
    "offlineCap": 14
   },
   "unlock": {
    "lifetime": 100000.0
   },
   "desc": "Earn 80% of income while away, for up to 14 hours."
  }
 ],
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
   "id": "syn_stand_catering",
   "name": "Stands Feed the Parties",
   "a": "stand",
   "b": "catering",
   "pct": 0.05,
   "icon": "catering",
   "flavor": "Every catering job ends with a stand outside. Nobody planned it."
  },
  {
   "id": "syn_thrift_cousin",
   "name": "Diego Knows the Bins",
   "a": "thrift",
   "b": "cousin",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every Diego from the taco days remembers where the good racks are. Thrift runs go faster."
  },
  {
   "id": "syn_studio_salsa",
   "name": "Salsa Red Backdrop",
   "a": "studio",
   "b": "salsa",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every salsa bar you ever ran taught you what red looks like. The photos pop. The hoodies sell."
  },
  {
   "id": "syn_brand_truck",
   "name": "The Original Lean",
   "a": "brand",
   "b": "truck",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every crooked truck sign was practice for the logo. The more trucks you painted, the truer the lean."
  },
  {
   "id": "syn_app_depop",
   "name": "Shop in Your Pocket",
   "a": "app",
   "b": "depop",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every Depop shop taught Manuel what people tap on. The app knows before you do."
  },
  {
   "id": "syn_global_drop",
   "name": "Hype Around the Clock",
   "a": "global",
   "b": "drop",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every hype drop you ever ran was a rehearsal. Now the countdown rings in every time zone."
  },
  {
   "id": "syn_moon_press",
   "name": "Abuela's Press Goes Up",
   "a": "moon",
   "b": "press",
   "pct": 0.03,
   "icon": null,
   "flavor": "Every cast-iron press from the backyard is on the moon now. They squeak less up there. Barely."
  }
 ],
 "chapters": [
  {
   "n": 1,
   "life": 1,
   "name": "Backyard Table",
   "title": "The Backyard Table",
   "age": 12,
   "threshold": 0,
   "flagship": null,
   "hint": null,
   "buttonHint": "Sell a taco. Abuela's recipe.",
   "icon": "table",
   "text": "Manuel is twelve years old, and this morning he dragged Abuela's folding table into the backyard and propped up a sign that says TACOS in three colors of marker. Abuela handed him her tortilla recipe on a card that smells like cinnamon and said, 'Talk nicely to them and they will behave.' His first customer was Abuela. She paid full price.",
   "news": [
    "A folding table appeared in Abuela's backyard this morning. Line forms at the gate.",
    "Abuela's cast-iron press is older than Manuel's dad. It still wins every argument.",
    "Manuel's first customer was Abuela. She paid full price and left a tip.",
    "Neighbors have started bringing their own plates to the backyard. Manuel is thrilled.",
    "The backyard hose is now the official hand-washing station.",
    "Manuel hung a paper sign on the fence. It says TACOS in three colors of marker.",
    "Local boy, 12, insists the secret ingredient is 'love.' Abuela says it is actually lime.",
    "Neighbors report a 'suspiciously good smell' coming from the backyard again.",
    "Manuel's math homework found covered in salsa. Teacher gives partial credit.",
    "The folding table has a wobbly leg. Abuela says it builds character.",
    "Manuel's mom says he can keep selling tacos 'as long as the grades stay up.' The grades are up.",
    "Reports of a kid on a bike delivering tacos to the fire station. Firefighters give it five stars.",
    "Local kids have started a rumor that Manuel's tacos help you pass tests. Sales up on Thursdays."
   ]
  },
  {
   "n": 2,
   "life": 1,
   "name": "Corner Stand",
   "title": "The Corner Stand",
   "age": 13,
   "threshold": 50000.0,
   "flagship": "stand",
   "hint": "Something on the corner of 5th and Main. Manuel keeps looking at it.",
   "buttonHint": "Sell a taco from the corner stand.",
   "icon": "stand",
   "text": "Manuel is thirteen now, and the backyard could not hold the line anymore. He rented a real stand on the corner of 5th and Main, and on Fridays the line wraps around the block and past the barber shop. Cousin Diego is in charge of napkins, which is going about as well as you would expect.",
   "news": [
    "A brand-new stand opened on 5th and Main. The kid running it looks about twelve.",
    "Friday lines at the corner stand now go around the block and past the barber shop.",
    "The barber next door has started giving haircuts to people waiting in the taco line.",
    "City bus drivers now honk twice when they pass Manuel's stand. It means 'save me two.'",
    "Manuel got a real cash register. He rings it up even when nobody is buying.",
    "Abuela brings a folding chair to the corner every afternoon to 'supervise.'"
   ]
  },
  {
   "n": 3,
   "life": 1,
   "name": "Food Truck",
   "title": "The Food Truck",
   "age": 15,
   "threshold": 1000000.0,
   "flagship": "truck",
   "hint": "A used truck with a FOR SALE sign. Manuel took a photo and taped it to the press.",
   "buttonHint": "Sell a taco from the truck window.",
   "icon": "truck",
   "text": "At fifteen, Manuel saved up enough for a used truck that stalls on hills and smells faintly of the taco dreams of whoever owned it before. He painted MANUEL'S on the side himself, and it came out a little crooked. He decided to leave it that way, and now the whole neighborhood calls it the crooked truck like it is a compliment. Diego took a picture of the crooked letters. He said it was a vibe.",
   "news": [
    "Manuel bought a used truck. He painted MANUEL'S on the side himself. It is a little crooked.",
    "The truck's crooked sign has become a local landmark. Nobody wants it fixed.",
    "Manuel's truck stalled twice on the hill today. The tacos were still on time.",
    "Diego passed his driving test on the third try. The truck has a new driver.",
    "A food critic ate at the truck and cried a little. He says it was the onions.",
    "The truck's horn plays Diego's four-word jingle now. Neighbors are divided."
   ]
  },
  {
   "n": 4,
   "life": 1,
   "name": "Truck Fleet",
   "title": "The Truck Fleet",
   "age": 17,
   "threshold": 15000000.0,
   "flagship": "fleet",
   "hint": "Diego keeps saying the word fleet. Abuela keeps saying the word no.",
   "buttonHint": "Sell a taco. Any truck. Every truck.",
   "icon": "fleet",
   "text": "Manuel is seventeen and there are trucks in every neighborhood in the city, each with a slightly crooked sign because he insists on painting them himself. Abuela runs dispatch from her kitchen with three phones and a paper map taped to the wall. When truck seven got lost, she found it by listening for the jingle.",
   "news": [
    "Manuel's trucks have been spotted in every neighborhood in the city.",
    "Abuela runs dispatch from her kitchen with a landline and a paper map.",
    "Truck number seven got lost. Abuela found it by listening for the jingle.",
    "A rival truck tried to park on 5th and Main. It left after one taste test.",
    "Abuela's kitchen now has three phones. She answers all of them at once.",
    "Manuel's fleet catered a wedding. The bride requested extra guac in her vows.",
    "A customer asked if the crooked logo comes on a shirt. Manuel said no. Diego said not yet.",
    "Diego's video of Truck #1 has 400 views. He says that is a lot."
   ]
  },
  {
   "n": 5,
   "life": 2,
   "name": "Bedroom Listing",
   "title": "The Bedroom Listing",
   "age": 18,
   "threshold": 0,
   "flagship": null,
   "hint": "A ring light in a shopping cart. Manuel keeps saying it is for the tacos.",
   "buttonHint": "Sell a taco-shaped tee. Ships worldwide.",
   "icon": "camera",
   "text": "Manuel is eighteen, and this morning he handed the truck keys to Diego and the dispatch phones to Abuela, who already had them. Then he went upstairs, clipped a ring light to his bookshelf, hung a bedsheet for a backdrop, and listed the very first Crooked Logo Tee on Depop. It sold to a kid in Tokyo before he finished writing the description. Abuela taped the receipt to the fridge.",
   "news": [
    "Manuel photographed a tee on his bedroom floor. The floor is now part of the brand.",
    "Diego took the trucks out on his first solo day and only got lost once. Abuela found him by the jingle.",
    "The ring light is clipped to a bookshelf. The bookshelf leans, just like the truck.",
    "Mrs. Ortega bought the second tee ever sold. She says it is for her nephew. She is wearing it.",
    "Mr. Bell picked up his first package from the porch. He asked if there was a taco in it. There was not.",
    "Abuela knocked on the bedroom door with a plate of tacos. Manuel was live. Abuela did not care."
   ]
  },
  {
   "n": 6,
   "life": 2,
   "name": "Viral Drop",
   "title": "The Viral Drop",
   "age": 18,
   "threshold": 300000000.0,
   "flagship": "drop",
   "hint": "Diego keeps refreshing something on his phone and yelling. Something is coming.",
   "buttonHint": "Sell a taco tee before the drop sells out.",
   "icon": "bolt",
   "text": "Manuel is still eighteen when a stranger films the crooked sign for a laugh and the video hits ten million views overnight. Suddenly the whole internet wants the crooked logo on a shirt, so he prints fifty hoodies and calls it a drop. It sells out in four minutes, the restock in ninety seconds, and Diego, who runs the trucks now, has missed both of them.",
   "news": [
    "A video of the crooked sign hit ten million views overnight. Manuel watched it forty times to be sure.",
    "Fifty hoodies sold out in four minutes. Ten thousand people are angry at Manuel in a friendly way.",
    "Chorizo the dog walked through the drop livestream. Views doubled. Chorizo has been offered a contract.",
    "Diego set three alarms for the restock and still missed it. He is filming a reaction video about it.",
    "Abuela set an alarm for the drop too. She does not know why. She did not miss it.",
    "The barber on 5th wears the hoodie while cutting hair. His line is longer than the taco line now."
   ]
  },
  {
   "n": 7,
   "life": 2,
   "name": "Reseller Empire",
   "title": "The Reseller Empire",
   "age": 19,
   "threshold": 6000000000.0,
   "flagship": "sneaker",
   "hint": "Abuela's car is parked on the street. She is not happy. The garage is very full.",
   "buttonHint": "Sell a taco tee. Or a hoodie. Or sneakers.",
   "icon": "box",
   "text": "At nineteen, Manuel's bedroom cannot hold the boxes anymore, so the operation moves into Abuela's garage and Abuela's car moves onto the street. Diego hunts thrift stores on the weekends for vintage to flip, and there is a whole desk now just for sneakers. Abuela still writes a napkin note for every single box, and she is starting to get hand cramps.",
   "news": [
    "Abuela's car now lives on the street. The garage holds four hundred boxes and one very proud Manuel.",
    "Diego found a vintage jacket at a thrift store for three dollars. It sold for three hundred. He fainted a little.",
    "The sneaker desk has a waiting list. Chorizo the dog has approved every pair.",
    "Mr. Bell now brings a bigger truck on Tuesdays. He calls it Taco Tuesday for reasons that are not tacos.",
    "Abuela has written eleven thousand napkin notes. She has started signing them just A.",
    "Mrs. Ortega runs a resale account on the side. She only sells things Manuel sold her. Manuel is fine with it."
   ]
  },
  {
   "n": 8,
   "life": 2,
   "name": "Own Brand",
   "title": "Crooked Co.",
   "age": 20,
   "threshold": 90000000000.0,
   "flagship": "brand",
   "hint": "Someone asked Manuel if the logo was trademarked. He did not know that word yesterday.",
   "buttonHint": "Sell a taco tee. Brand name: Crooked Co.",
   "icon": "shirt",
   "text": "Manuel is twenty, and the crooked logo is no longer a joke on a truck. It is a brand called Crooked Co., with a real studio, real tags, and a real lawyer who keeps asking if the lean is on purpose. It is. Diego is Creative Director, which mostly means he picks the music, and Abuela is Quality Control, which means every shirt gets folded twice.",
   "news": [
    "Crooked Co. is officially a company. The paperwork lists the lean as a design feature.",
    "Diego is Creative Director now. His first decision was a hoodie the color of salsa verde. It sold out.",
    "Abuela folds every shirt twice before it ships. The lawyer asked why. The lawyer now folds shirts too.",
    "A famous singer wore Crooked Co. on stage and spelled it right. Manuel framed the photo next to the fridge receipt.",
    "Mr. Bell got a Crooked Co. jacket for his route. He says it is the warmest thing he owns.",
    "Kids three counties over are drawing the crooked logo on notebooks. Manuel used to draw it on napkins."
   ]
  },
  {
   "n": 9,
   "life": 3,
   "name": "Taco Franchise",
   "title": "Back to Tacos",
   "age": 22,
   "threshold": 0.0,
   "flagship": null,
   "hint": "Someone in a suit left a business card under the tip jar. It says FRANCHISE. Manuel is smiling.",
   "buttonHint": "Sell a taco. The real kind. Merch is extra.",
   "icon": "franchise",
   "text": "Manuel is twenty-two, and Crooked Co. has made more money than the trucks ever did, so he does the only thing that makes sense to him: he spends it on tacos. The first franchise opens on the corner of 5th and Main, right where the stand used to be, with hoodies hanging next to the menu. Abuela trains every new owner herself, with a spoon, and most of them pass eventually.",
   "news": [
    "Manuel spent the merch money on tacos. Diego says this is the least surprising thing that has ever happened.",
    "The first franchise opened on 5th and Main. The barber cut the ribbon. He used real scissors.",
    "Every franchise sells hoodies next to the salsa. The hoodies sell out first. The salsa is not offended.",
    "Abuela grades every new owner with a spoon. Three passed this week. One cried. He also passed.",
    "Diego drives the original crooked truck to every grand opening. It still leans. It is contractual.",
    "Mrs. Ortega applied to own a franchise. She was approved before she finished the sentence."
   ]
  },
  {
   "n": 10,
   "life": 3,
   "name": "Tortilla Factory",
   "title": "The Tortilla Factory",
   "age": 23,
   "threshold": 1500000000000.0,
   "flagship": "factory",
   "hint": "Manuel toured an empty warehouse and said the word megaton out loud. Abuela said nothing. Yet.",
   "buttonHint": "Sell a taco. The factory makes the rest.",
   "icon": "factory",
   "text": "At twenty-three, Manuel builds a factory that makes tortillas by the megaton, and on day one he stops every machine to taste. Twice. Abuela's old cast-iron press sits on top of the megapress like a crown, and she sits at the end of the line tapping every tortilla with one finger. Manuel's App launches the same week, so you can order tacos and a hoodie in one tap and Diego can complain about the notifications.",
   "news": [
    "The factory made its first megaton of tortillas. Abuela tapped every one. Allegedly.",
    "Manuel's App launched with one button. It orders tacos and a hoodie. Diego wanted a second button. Denied.",
    "Abuela's original press sits on top of the megapress. Engineers call it the crown. She calls it hers.",
    "Mr. Bell delivers to the factory now. He got a tour and a tortilla and a hat. He wears the hat.",
    "Chorizo the dog is banned from the factory floor. He has a chair by the door and a small salary.",
    "The robot folding arms were trained on Manuel. They fold slightly crooked. Nobody is fixing it."
   ]
  },
  {
   "n": 11,
   "life": 3,
   "name": "Global Brand",
   "title": "The Global Brand",
   "age": 25,
   "threshold": 30000000000000.0,
   "flagship": "global",
   "hint": "Diego bought a globe and started sticking pins in it. He ran out of pins.",
   "buttonHint": "Sell a taco. Somewhere it is lunchtime.",
   "icon": "radar",
   "text": "Manuel is twenty-five, and there are drops in every time zone and franchises with his face on them in countries Diego cannot find on a map. A blimp with a griddle floats over the city dropping tacos by parachute, and Abuela insists on riding along to check the limes. Manuel still folds the first taco of every morning by hand in her kitchen, before any of that wakes up.",
   "news": [
    "Global Drops launched in every time zone. Somewhere it is always midnight and Diego is always awake.",
    "The Airship Taquería made its first parachute delivery. The taco landed warm. The parachute landed on a cat.",
    "Abuela rode the blimp to inspect the limes. She approved the limes. She did not approve the height.",
    "Franchises opened in six new countries this week. Every sign is crooked. It is in the handbook.",
    "Mrs. Ortega owns eleven franchises now. She still says they are for her nephew.",
    "A museum asked for the original bedroom ring light. Diego said no. He still uses it for vlogs."
   ]
  },
  {
   "n": 12,
   "life": 3,
   "name": "Orbital Taqueria",
   "title": "The Orbital Taqueria",
   "age": 26,
   "threshold": 450000000000000.0,
   "flagship": "orbital",
   "hint": "Manuel has been looking up a lot lately. Abuela asked if there is lime up there.",
   "buttonHint": "Sell a taco. Manuel still folds the first one.",
   "icon": "orbital",
   "text": "Manuel is twenty-six, and there is a taquería in orbit that somehow produces no crumbs and a franchise on the moon where the tortillas come out extra fluffy. Every morning, before the trucks fly up to dock and the drops go live and the blimp untethers, he goes to Abuela's kitchen and warms the old cast-iron press. He folds the first taco of the day by hand, and she tastes it, nods, and says what she said when he was twelve: 'Good. Now make another.'",
   "news": [
    "The Orbital Taquería opened for business. Zero crumbs. Scientists are baffled. Abuela is not.",
    "The Taco Moon franchise reports extra fluffy tortillas. Low gravity, high sales, one very proud Abuela.",
    "The original crooked truck docked in orbit today. It leans gently to the left up there too.",
    "Diego is Chief Taste Officer of the solar system. He asked for a bigger title. There is not one.",
    "Mr. Bell delivered a napkin note to the moon. It said 'more lime.' It was from Abuela.",
    "Manuel folded the first taco of the day by hand this morning. Abuela said good, now make another."
   ]
  }
 ],
 "rebirths": [
  {
   "id": "rebirth1",
   "title": "Hang Up the Apron",
   "kicker": "REBIRTH",
   "text": "Manuel is eighteen, and the trucks run fine without him now. He hands the keys to Diego and the dispatch phones to Abuela, who already had them, and goes upstairs to clip a ring light to his bookshelf. Everything starts over, but he keeps what he learned, and he is going to sell the crooked logo to the whole world.",
   "button": "Go Upstairs",
   "toast": "Manuel hung up the apron and lit the ring light. Clout x2. The trucks are in good hands.",
   "achievementName": "Hang Up the Apron",
   "achievementDesc": "Rebirth into Depop Life. Diego got the keys. Abuela got the phones. Manuel got a ring light."
  },
  {
   "id": "rebirth2",
   "title": "Tacos and Merch",
   "kicker": "REBIRTH",
   "text": "Manuel is twenty-two, and Crooked Co. has made more money than the trucks ever did. He looks at the pile and knows exactly what to do with it, because it is the same thing he always wanted to do with it. He is bringing the tacos back, and this time the hoodies are coming too.",
   "button": "Bring Back the Tacos",
   "toast": "Manuel spent the merch money on tacos. Clout x4. Diego is not surprised at all.",
   "achievementName": "Tacos and Merch",
   "achievementDesc": "Rebirth into Empire Life. Manuel put every dollar of merch money back into tacos."
  },
  {
   "id": "legend",
   "title": "A New Summer",
   "kicker": "LEGEND",
   "text": "Somewhere a kid in a backyard just heard Manuel's story and dragged out a folding table. Manuel hands Diego the keys to everything, keeps Abuela's notebook, and drives to a new neighborhood with the old cast-iron press in the passenger seat. He missed the sound of it.",
   "button": "Start a New Summer",
   "toast": "A new summer. A folding table. The press still squeaks. Salsa Points saved.",
   "achievementName": "A New Summer",
   "achievementDesc": "Complete all three lives and start over from the backyard with Salsa Points in your apron."
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
   "weight": 8,
   "kind": "storm",
   "duration": 8,
   "minChapter": 3,
   "toast": "Taco Storm! Grab every taco you can!"
  }
 ],
 "recipes": [
  {
   "id": "headstart",
   "name": "Head Start",
   "cost": 1,
   "desc": "Start every life with four times the usual starting cash.",
   "effect": {
    "startCash": 4
   },
   "icon": "coin",
   "flavor": "Abuela slips a few bills into your apron pocket. 'For tortillas. Not candy.'"
  },
  {
   "id": "palate",
   "name": "Golden Palate",
   "cost": 2,
   "desc": "Golden tacos appear 25% more often.",
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
   "cost": 8,
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
   "cost": 10,
   "desc": "The side hustle panel is open from the very start of every life.",
   "effect": {
    "depopStart": true
   },
   "icon": "tag",
   "flavor": "The crooked sign never stopped being famous. The shop is open from day one."
  },
  {
   "id": "empire",
   "name": "Empire Mindset",
   "cost": 15,
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
   "cost": 30,
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
   "desc": "Earn $1 million lifetime. Manuel still does not know what taxes are.",
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
   "id": "salsabar_1",
   "name": "One Is a Dare",
   "desc": "Own 1 Salsa Bar. Five salsas. Diego tried the dare one. Diego is fine.",
   "icon": "salsa",
   "secret": false,
   "kind": "owned",
   "producer": "salsa",
   "v": 1
  },
  {
   "id": "salsabar_50",
   "name": "Salsa Rainbow",
   "desc": "Own 50 Salsa Bars. That's 250 salsas and 50 dares.",
   "icon": "salsa",
   "secret": false,
   "kind": "owned",
   "producer": "salsa",
   "v": 50
  },
  {
   "id": "salsabar_100",
   "name": "Hot Sauce Headquarters",
   "desc": "Own 100 Salsa Bars. The fire department stops by. To eat.",
   "icon": "salsa",
   "secret": false,
   "kind": "owned",
   "producer": "salsa",
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
   "desc": "Own 1 Depop Listing. Taco tees, salsa hoodies. Ships worldwide.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "depop",
   "v": 1
  },
  {
   "id": "depop_50",
   "name": "Streetwear Sizzle",
   "desc": "Own 50 Depop Listings. Abuela models the hoodies. She is very serious.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "depop",
   "v": 50
  },
  {
   "id": "depop_100",
   "name": "Drip Empire",
   "desc": "Own 100 Depop Listings. Diego finally got the jacket. It is crooked too.",
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
   "id": "era_6",
   "name": "Went Viral",
   "desc": "Reach the Viral Drop chapter. One video. Ten million views. Zero sleep.",
   "icon": "bolt",
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
   "id": "salsapts_10",
   "name": "Ten Point Salsa",
   "desc": "Earn 10 Salsa Points total. Permanent flavor. Permanent income.",
   "icon": "chef",
   "secret": false,
   "kind": "salsa",
   "v": 10
  },
  {
   "id": "salsapts_100",
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
   "desc": "Complete 1 side hustle order. Abuela wrapped it. There was a thank-you note.",
   "icon": "shirt",
   "secret": false,
   "kind": "depopSales",
   "v": 1
  },
  {
   "id": "depop_sale_10",
   "name": "Ten Happy Mailboxes",
   "desc": "Complete 10 side hustle orders. The post office knows Manuel by name.",
   "icon": "shirt",
   "secret": false,
   "kind": "depopSales",
   "v": 10
  },
  {
   "id": "depop_viral_1",
   "name": "It's Everywhere",
   "desc": "Have a side hustle order go viral. Double payout. Diego took the credit.",
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
  },
  {
   "id": "era_5",
   "name": "Ring Light On",
   "desc": "Reach the Bedroom Listing chapter. The first tee sold before the description was done.",
   "icon": "camera",
   "secret": false,
   "kind": "era",
   "v": 5
  },
  {
   "id": "era_7",
   "name": "Abuela's Car Is Outside",
   "desc": "Reach the Reseller Empire chapter. The garage is full of mailers.",
   "icon": "box",
   "secret": false,
   "kind": "era",
   "v": 7
  },
  {
   "id": "era_8",
   "name": "The Lean Is the Logo",
   "desc": "Reach the Crooked Co. chapter. The napkin is framed.",
   "icon": "shirt",
   "secret": false,
   "kind": "era",
   "v": 8
  },
  {
   "id": "era_9",
   "name": "Back to Tacos",
   "desc": "Reach the Taco Franchise chapter. Merch money, taco dreams.",
   "icon": "franchise",
   "secret": false,
   "kind": "era",
   "v": 9
  },
  {
   "id": "era_10",
   "name": "Megaton",
   "desc": "Reach the Tortilla Factory chapter. Abuela inspects the first one.",
   "icon": "factory",
   "secret": false,
   "kind": "era",
   "v": 10
  },
  {
   "id": "era_11",
   "name": "Pins in the Globe",
   "desc": "Reach the Global Brand chapter. Somewhere it is lunchtime.",
   "icon": "radar",
   "secret": false,
   "kind": "era",
   "v": 11
  },
  {
   "id": "era_12",
   "name": "Tacos in Orbit",
   "desc": "Reach the Orbital Taqueria chapter. Still no crumbs.",
   "icon": "orbital",
   "secret": false,
   "kind": "era",
   "v": 12
  },
  {
   "id": "thrift_1",
   "name": "One Man's Trash",
   "desc": "Own 1 Thrift Flip Run. Diego found a jacket. Diego found three left shoes.",
   "icon": "box",
   "secret": false,
   "kind": "owned",
   "producer": "thrift",
   "v": 1
  },
  {
   "id": "thrift_50",
   "name": "Bin Diver",
   "desc": "Own 50 Thrift Flip Runs. The thrift stores know Diego by name and by elbow.",
   "icon": "box",
   "secret": false,
   "kind": "owned",
   "producer": "thrift",
   "v": 50
  },
  {
   "id": "thrift_100",
   "name": "Nothing Left to Thrift",
   "desc": "Own 100 Thrift Flip Runs. Every closet in the county has been flipped.",
   "icon": "box",
   "secret": false,
   "kind": "owned",
   "producer": "thrift",
   "v": 100
  },
  {
   "id": "studio_1",
   "name": "Lights, Camera, Hoodie",
   "desc": "Own 1 Ring Light Studio. The cookie tray has been promoted to reflector.",
   "icon": "camera",
   "secret": false,
   "kind": "owned",
   "producer": "studio",
   "v": 1
  },
  {
   "id": "studio_50",
   "name": "Well Lit Empire",
   "desc": "Own 50 Ring Light Studios. The whole street glows at night. The moths are thrilled.",
   "icon": "camera",
   "secret": false,
   "kind": "owned",
   "producer": "studio",
   "v": 50
  },
  {
   "id": "studio_100",
   "name": "No Bad Angles",
   "desc": "Own 100 Ring Light Studios. Every hoodie in the world looks a little bit better now.",
   "icon": "camera",
   "secret": false,
   "kind": "owned",
   "producer": "studio",
   "v": 100
  },
  {
   "id": "sneaker_1",
   "name": "Grail Hunter",
   "desc": "Own 1 Sneaker Resale Desk. Diego knows the shoe. Chorizo knows the laces.",
   "icon": "shield",
   "secret": false,
   "kind": "owned",
   "producer": "sneaker",
   "v": 1
  },
  {
   "id": "sneaker_50",
   "name": "Sole Provider",
   "desc": "Own 50 Sneaker Resale Desks. Every closet on the block is now a shoe closet.",
   "icon": "shield",
   "secret": false,
   "kind": "owned",
   "producer": "sneaker",
   "v": 50
  },
  {
   "id": "sneaker_100",
   "name": "Laced Up Forever",
   "desc": "Own 100 Sneaker Resale Desks. Diego has a shoe for every day of the century.",
   "icon": "shield",
   "secret": false,
   "kind": "owned",
   "producer": "sneaker",
   "v": 100
  },
  {
   "id": "brand_1",
   "name": "A Napkin and a Dream",
   "desc": "Own 1 Crooked Co. Manuel's own brand. The tag leans a little. It is supposed to.",
   "icon": "shirt",
   "secret": false,
   "kind": "owned",
   "producer": "brand",
   "v": 1
  },
  {
   "id": "brand_50",
   "name": "Slightly Off Center",
   "desc": "Own 50 Crooked Co. The crooked logo is on every third hoodie in the country.",
   "icon": "shirt",
   "secret": false,
   "kind": "owned",
   "producer": "brand",
   "v": 50
  },
  {
   "id": "brand_100",
   "name": "Leaning Into It",
   "desc": "Own 100 Crooked Co. The lean is now a recognized fashion direction.",
   "icon": "shirt",
   "secret": false,
   "kind": "owned",
   "producer": "brand",
   "v": 100
  },
  {
   "id": "app_1",
   "name": "One Tap Taco",
   "desc": "Own 1 Manuel's App. One button, one taco. Diego says it was perfect already.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "app",
   "v": 1
  },
  {
   "id": "app_50",
   "name": "Notification Nation",
   "desc": "Own 50 Manuel's Apps. Every phone in the country barks when a taco is ready.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "app",
   "v": 50
  },
  {
   "id": "app_100",
   "name": "Always Loading Tacos",
   "desc": "Own 100 Manuel's Apps. The app now runs on things that are not computers.",
   "icon": "depop",
   "secret": false,
   "kind": "owned",
   "producer": "app",
   "v": 100
  },
  {
   "id": "global_1",
   "name": "Twenty-Four Time Zones",
   "desc": "Own 1 Global Drops. Somewhere it is midnight. Somewhere it is sold out.",
   "icon": "radar",
   "secret": false,
   "kind": "owned",
   "producer": "global",
   "v": 1
  },
  {
   "id": "global_50",
   "name": "Around the World in Hoodies",
   "desc": "Own 50 Global Drops. Every sunrise on Earth comes with a drop.",
   "icon": "radar",
   "secret": false,
   "kind": "owned",
   "producer": "global",
   "v": 50
  },
  {
   "id": "global_100",
   "name": "The Sun Never Sets on Diego",
   "desc": "Own 100 Global Drops. Diego has a clock for every time zone and none for sleep.",
   "icon": "radar",
   "secret": false,
   "kind": "owned",
   "producer": "global",
   "v": 100
  },
  {
   "id": "airship_1",
   "name": "Look Up, It's Tacos",
   "desc": "Own 1 Airship Taquería. A blimp with a griddle. The sign is crooked from up there too.",
   "icon": "rocket",
   "secret": false,
   "kind": "owned",
   "producer": "airship",
   "v": 1
  },
  {
   "id": "airship_50",
   "name": "Cloudy With a Chance of Tacos",
   "desc": "Own 50 Airship Taquerías. The sky is mostly blimps and the blimps are mostly tacos.",
   "icon": "rocket",
   "secret": false,
   "kind": "owned",
   "producer": "airship",
   "v": 50
  },
  {
   "id": "airship_100",
   "name": "Air Taco Control",
   "desc": "Own 100 Airship Taquerías. Diego wears the headset. He says 'cleared for salsa' a lot.",
   "icon": "rocket",
   "secret": false,
   "kind": "owned",
   "producer": "airship",
   "v": 100
  },
  {
   "id": "moon_1",
   "name": "One Small Bite",
   "desc": "Own 1 Taco Moon. The moon, but tacos. Abuela brought her own press.",
   "icon": "moon",
   "secret": false,
   "kind": "owned",
   "producer": "moon",
   "v": 1
  },
  {
   "id": "moon_50",
   "name": "Fifty Full Moons",
   "desc": "Own 50 Taco Moons. The night sky is getting crowded and delicious.",
   "icon": "moon",
   "secret": false,
   "kind": "owned",
   "producer": "moon",
   "v": 50
  },
  {
   "id": "moon_100",
   "name": "A Sky Full of Tacos",
   "desc": "Own 100 Taco Moons. Somewhere a kid is looking up and drawing a crooked sign.",
   "icon": "moon",
   "secret": false,
   "kind": "owned",
   "producer": "moon",
   "v": 100
  },
  {
   "id": "rebirth_1",
   "name": "Hang Up the Apron",
   "desc": "Rebirth into Depop Life. Diego got the keys. Abuela got the phones. Manuel got a ring light.",
   "icon": "sun",
   "secret": false,
   "kind": "rebirths",
   "v": 1
  },
  {
   "id": "rebirth_2",
   "name": "Tacos and Merch",
   "desc": "Rebirth into Empire Life. Manuel put every dollar of merch money back into tacos.",
   "icon": "crown",
   "secret": false,
   "kind": "rebirths",
   "v": 2
  },
  {
   "id": "combo_max",
   "name": "Full Sizzle",
   "desc": "Fill the Sizzle meter all the way. The griddle is on fire.",
   "icon": "bolt",
   "secret": false,
   "kind": "combo",
   "v": 40
  },
  {
   "id": "crit_10",
   "name": "Abuela's Wrist Flick",
   "desc": "Land 10 lucky big clicks.",
   "icon": "hand",
   "secret": false,
   "kind": "crits",
   "v": 10
  },
  {
   "id": "skins_3",
   "name": "Fully Dressed",
   "desc": "Unlock all three taco skins.",
   "icon": "sparkle",
   "secret": false,
   "kind": "skins",
   "v": 3
  }
 ],
 "news": {
  "generic": [
   "Abuela has approved exactly one change to the recipe since 1974. Nobody knows what it was.",
   "Cousin Diego claims he can eat eleven tacos in one sitting. Sources confirm he stopped at nine.",
   "Mrs. Ortega from next door has ordered 'the usual.' Nobody has told her what the usual is.",
   "Manuel practiced his tortilla flip for two hours. Ceiling is fine. Mostly.",
   "Diego was put in charge of napkins. Napkins are now somehow missing.",
   "Abuela's radio plays the same station every day. Customers have started to sing along.",
   "A dog named Chorizo has appointed himself head of security. He accepts payment in crumbs.",
   "Abuela says the tortillas taste better if you talk nicely to them. Manuel talks nicely to them.",
   "The cilantro debate has divided the block. Manuel refuses to take a side.",
   "Diego suggested a taco with pineapple. The motion was tabled. The pineapple was eaten.",
   "Manuel's sneakers now permanently smell like onions. He has accepted this.",
   "Weather report: sunny with a chance of salsa verde.",
   "Someone left a thank-you note under the tip jar. Manuel taped it to the wall.",
   "Abuela says she is 'just supervising.' She has been supervising for six hours.",
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
  "life2Generic": [
   "Abuela packs every box with a napkin note. Nobody has ever thrown one away.",
   "Diego set an alarm for the drop. He slept through the alarm. He blames the alarm.",
   "The ring light is brighter than the sun. Chorizo refuses to enter the room.",
   "A kid in Tokyo wore the Taco Tee to school. Three classmates ordered one by lunch.",
   "Mr. Bell the mail carrier now shows up with a hand truck. He also stays for a taco.",
   "The comments section is mostly people asking for a taco. Diego replies to each one.",
   "Someone asked Manuel to fix the crooked logo. Manuel said no. Sales went up.",
   "Abuela's car lives outside now. The garage is full of mailers. She is not happy. She is fine.",
   "Mrs. Ortega bought a hoodie for her nephew. She is wearing it.",
   "A hoodie arrived in Iceland a little cold. The customer says it was still warm inside.",
   "Diego reviewed his own unboxing video. He gave it five stars.",
   "Manuel misses the griddle. He fried a taco between shipping runs. Nobody complained.",
   "The crooked logo was spotted on a marching band. The band is now slightly crooked too."
  ],
  "life3Generic": [
   "Manuel still folds the first taco of every day by hand in Abuela's kitchen.",
   "Abuela inspects franchises with a spoon. If she nods, you are family.",
   "The airship taquería floated over the city today. The whole city looked up and got hungry.",
   "Diego, Chief Taste Officer, has requested a bigger badge. The badge is already very big.",
   "The moon tortillas come out extra fluffy. Scientists want to know why. Abuela knows why.",
   "Manuel's App lets you order a taco and a hoodie in one tap. Abuela uses the landline.",
   "A franchise owner cried during Abuela's tasting exam. He passed. He still cries about it.",
   "Every crooked sign on every continent leans exactly the same way. Consistency.",
   "The orbital taquería still reports zero crumbs. The scientists have stopped asking.",
   "Mr. Bell retired. He was given a hoodie, a truck, and a lifetime of tacos. He still visits.",
   "Manuel wore sunglasses to a meeting. Abuela made him take them off. The meeting went well.",
   "Mrs. Ortega finally said what the usual is. Nobody heard her. The mystery continues.",
   "Chorizo the dog has a statue outside headquarters. He sits next to it and judges it."
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
   "thrift": [
    "Cousin Diego came home with 400 vintage jackets and one lamp. The lamp is not for sale. The lamp is his friend.",
    "Every thrift store in the state now has a sign that says NO DIEGOS BEFORE 9 AM. Diego arrives at 9:01.",
    "Abuela found a sweater in a bin that she donated in 1992. She bought it back. She says it was never this expensive."
   ],
   "studio": [
    "Manuel's hoodie photos are so good that people are buying the hoodies and framing the photos.",
    "Chorizo the dog has modeled in 10,000 listings. He has not learned a second pose. He does not need one.",
    "Mrs. Ortega came by to see the studio and left with a full portrait session. She sent the photo to her nephew."
   ],
   "drop": [
    "Another drop sold out in seconds. Diego set an alarm and still missed it.",
    "Resellers are camping outside the truck for merch. Manuel gives them tacos anyway.",
    "The latest drop had a secret salsa recipe printed inside the hood. It has been decoded."
   ],
   "sneaker": [
    "Cousin Diego has one million pairs of sneakers and still says he has nothing to wear.",
    "Chorizo the dog has inspected ten million pairs of shoes and chewed exactly one. It was a fake. Probably.",
    "The Tortilla Colorway is now more valuable than an actual tortilla. Abuela finds this personally offensive."
   ],
   "collab": [
    "So many unboxing videos exist that watching them all would take longer than a school year.",
    "An influencer collab featured Abuela. Her video has more views than everyone else's combined.",
    "Manuel's collab partners keep asking for tacos instead of payment. He respects that."
   ],
   "brand": [
    "Crooked Co. is now worn by ten million people and one dog. The dog was first.",
    "Manuel's original napkin logo went to a museum for one day. Abuela went to get it back. She used it to wipe her hands.",
    "Fashion critics agree Crooked Co. has changed clothing forever. Diego agrees it has changed his laundry forever."
   ],
   "franchise": [
    "Manuel's franchises opened in three new countries this week. All signs slightly crooked.",
    "A franchise handbook now exists. Page one says: talk nicely to the tortillas.",
    "Franchise owners fly in every year for Abuela's tasting exam. Most pass. Some cry."
   ],
   "app": [
    "Manuel's App has been downloaded by every phone on Earth and, mysteriously, two microwaves.",
    "Abuela has ordered from the app 4,000 times. Every order is one taco and a note that says 'test.'",
    "The app's most popular feature is the button that makes Chorizo bark. Nobody uses the menu."
   ],
   "factory": [
    "The taco factory runs day and night. The night shift gets the best salsa.",
    "Tortillas by the megaton, and Abuela still checks the first one off the line each morning.",
    "Factory engineers designed a press that copies Abuela's exact wrist flick. She approved it."
   ],
   "global": [
    "Global Drops has sold out in every country on Earth, including one that was founded this morning.",
    "Diego has not slept since the Tokyo launch. He says he is fine. He is wearing two different shoes. Both are grails.",
    "Mr. Bell delivered a hoodie to Antarctica. The penguin signed for it. Mr. Bell says it was very polite."
   ],
   "airship": [
    "The Airship Taquería fleet now covers the sky over 200 cities. Weather forecasts just say 'blimps.'",
    "Abuela has taken over navigation on Blimp One. She does not use the instruments. The blimp arrives early anyway.",
    "A pilot reported a crooked MANUEL'S sign at 3,000 feet. Air traffic control confirmed it. It is a vibe."
   ],
   "orbital": [
    "The orbital taquería reported its first zero-gravity guac incident. It was beautiful.",
    "Astronauts now request Manuel's for every launch. Mission control has a salsa preference.",
    "Somehow, still no crumbs in orbit. The scientists have stopped asking."
   ],
   "moon": [
    "The Taco Moon is now visible from every backyard on Earth. Kids are dragging out folding tables all over again.",
    "Abuela has moved to the moon for the season. She says the tortillas are fluffier and the neighbors are quieter.",
    "Diego tried to eat the Taco Moon. He got one bite. Astronomers report a small new crater shaped like a mouth."
   ]
  }
 },
 "ui": {
  "offlineToast": "While you were away, the stand kept running for {time} and earned {amount}. Abuela was supervising.",
  "prestigeConfirm": "Franchise Out? Manuel hands over the keys and starts again from the backyard with {salsa} Salsa Points. Cash, producers, upgrades and eras reset. Achievements, salsa and recipes stay.",
  "prestigeLocked": "Not yet. Manuel needs to earn a lot more before anyone wants to buy the recipe.",
  "depopLockedTeaser": "Something is going to happen with that crooked sign. Keep growing and you will find out.",
  "hardResetConfirm": "Hard reset erases EVERYTHING: cash, producers, achievements, salsa points, recipes, all of it. Manuel goes back to being twelve with a wobbly table. Are you sure?",
  "firstVisitWelcome": "Manuel is twelve, he has Abuela's tortilla recipe, and he just set up a folding table in the backyard. Click the taco to sell one and see how far this goes.",
  "tacoButtonHint": "Click or press Space to sell a taco.",
  "rebirthReadyTitle": "Manuel is ready for what comes next.",
  "rebirthReadyText": "Everything resets, but Manuel keeps his Clout. Start {life}?",
  "rebirthLockedText": "Not yet. Manuel needs {amount} before Abuela lets him hand over the keys.",
  "cloutLabel": "Clout",
  "sellMode": "Diego's Garage Sale: sell businesses for 25% back.",
  "newSummer": "Manuel hands Diego the keys, keeps Abuela's notebook, and sets up a folding table in a new neighborhood. He missed the sound of the press.",
  "flopToast": "It did not sell. Abuela is wearing it now.",
  "storageOff": "Saving is off in this browser. Use Options, then Export, to keep your progress."
 },
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
  "life1": [
   "Twelve years old and already a businessman. Eat your breakfast first.",
   "The hose is for hands, not for Diego.",
   "Your mom says grades first. I say tortillas first. We compromise.",
   "The corner is nice. The chairs are nicer. I brought the chairs.",
   "Tell the barber his haircut line is blocking my line.",
   "The truck leans. You lean. It is a family trait.",
   "I will ride in it when it has real tires. Now it has real tires.",
   "Truck seven forgot the limes. Truck seven knows what it did.",
   "Three phones. One Abuela. It is enough."
  ],
  "life2": [
   "People wear your crooked letters on their chests now. I taped the first one to the fridge.",
   "Ten million views. Zero of them ate a taco. Fix that.",
   "Ten million views and not one of them ate a taco. Fix that.",
   "This ring light is very bright. Turn it off, the tortillas are sleeping.",
   "I wrote a napkin note for every box. My hand is fine. Ask again and it will not be.",
   "A hoodie is not a meal. Put a taco in the box too.",
   "Diego, stop reading the comments and read a recipe.",
   "The crooked letters are on a kid in Tokyo now. Your grandfather would have laughed. Then bought one.",
   "Mr. Bell is family now. Give him a hoodie. Give him lunch.",
   "Verified seller. I have been verified since 1974, mijo."
  ],
  "life3": [
   "Four thousand stores and you still forget the napkins.",
   "Space tacos. Fine. Do they have lime up there?",
   "Four thousand stores and you still forget the napkins.",
   "Space tacos. Fine. Do they have lime up there?",
   "A blimp. With a griddle. Your grandfather would have said yes before I finished the sentence.",
   "The moon is very far for a delivery. Tell them to come here.",
   "Take off the sunglasses when you talk to me. Better.",
   "I will taste every franchise myself. Bring the spoon. Bring a bigger spoon.",
   "An empire is just a very big kitchen. Wipe the table.",
   "You folded the first one by hand today. Good. Now make another."
  ]
 },
 "manuelLines": {
  "any": [
   "Abuela says talk nicely to the tortillas. So I do. They listen.",
   "The first taco of the day is always by hand. That is the rule.",
   "Diego, that is not a break. That is a nap.",
   "I keep the recipe card in my shoe. Do not ask which shoe.",
   "The sign leans a little. So do I. It is fine.",
   "Mrs. Ortega wants the usual. I still do not know what the usual is.",
   "Chorizo is head of security. He has never caught anyone. He has caught many crumbs.",
   "Mr. Bell says hi. Mr. Bell always says hi.",
   "More lime. Abuela is right. She is always right about lime.",
   "One day I will beat Abuela at folding. Not today. Probably not tomorrow.",
   "I wrote thank you on every napkin. My hand hurts. Worth it.",
   "Good. Now make another. She says it, so I say it."
  ],
  "life1": [
   "I am twelve and this is a business. Please do not tell my math teacher.",
   "The folding table wobbles. Abuela says it builds character. I have a lot of character now.",
   "Diego ate two of the tacos I was supposed to sell. He says it was quality control.",
   "I painted the sign myself. The S is backwards. I am keeping it.",
   "The truck stalls on hills. I just yell encouragement. It works, sometimes.",
   "Firefighters gave me five stars. FIVE. I told Abuela. She said good, now make another.",
   "The line goes past the barber shop now. The barber is not mad. He is eating.",
   "Truck seven got lost again. Abuela found it by the jingle. She always does.",
   "I saved up for real tires. Abuela finally rode in the truck. She did not say anything. She smiled.",
   "Homework is done. Salsa is done. I am also done, but there is a line."
  ],
  "life2": [
   "Ten million views of my crooked sign. I did not even fix the lighting.",
   "The ring light makes Diego's face look famous. The hoodies look pretty good too.",
   "Diego reads the comments so I do not have to. He says they are nice. Mostly.",
   "Somebody in Iceland bought a hoodie. Abuela put a napkin note in the box.",
   "I drew the logo on a napkin. Now it is on a kid in Tokyo. That is a weird sentence.",
   "The drop sold out in ninety seconds. Diego missed it. Again.",
   "Mr. Bell picks up the boxes now. He knows the route by heart. He knows me by name.",
   "A comment said the logo is crooked. Yes. Thank you. That is the point.",
   "I miss the griddle a little. I told Abuela. She said it misses me too.",
   "I fold the hoodies the same way I fold tacos. Diego says it shows. I say good."
  ],
  "life3": [
   "Four thousand storefronts and I still fold the first taco of the day by hand.",
   "There is a blimp with a griddle on it. I did not think that would work. It works.",
   "Diego is Chief Taste Officer. He made a badge. He made a whistle. Nobody asked for the whistle.",
   "The moon tortillas come out extra fluffy. Abuela says they still need lime.",
   "The sunglasses are for the cameras. Underneath I am still the kid with the wobbly table.",
   "Every franchise owner learns the recipe from Abuela. She grades them. Most pass eventually.",
   "We ship to every time zone. Abuela still writes a napkin note for every box.",
   "The orbital taquería has zero crumbs. I do not know where they go. I am fine with that.",
   "Some kid somewhere just dragged a folding table into a backyard. I hope the leg wobbles.",
   "I bought Abuela a new stove. She uses the old one. I understand completely."
  ]
 },
 "skins": [
  {
   "id": "classic",
   "name": "Classic Taco",
   "desc": "Abuela's recipe on a paper plate. Slightly crooked fold, like the sign."
  },
  {
   "id": "neon",
   "name": "Neon Taco",
   "desc": "Glows like a ring light. Diego says it photographs better than he does."
  },
  {
   "id": "cosmic",
   "name": "Cosmic Taco",
   "desc": "Folded in zero gravity, sprinkled with stars. Somehow still no crumbs."
  }
 ],
 "combo": {
  "meterName": "Sizzle",
  "tiers": [
   "Warm Griddle",
   "Sizzling",
   "Salsa Splash",
   "Taco Storm"
  ],
  "critLine": "Abuela's wrist flick! Big taco!"
 },
 "secretHints": {
  "fast_clicks": "Something about very fast hands.",
  "upgrades_100": "Read every manual in the shop.",
  "playtime_1h": "Stay for dinner."
 },
 "tacoPrice": 2.5,
 "hypeDecayPer": 30,
 "flopChance": 0.05,
 "viralBase": 0.05,
 "legacyCut": 0.02,
 "menuItem": {
  "name": "New Menu Item",
  "baseCost": 30000000.0,
  "costMult": 20,
  "bonus": 0.03,
  "flavor": "Diego suggested it. Abuela vetoed it. It is on the menu anyway."
 }
};
