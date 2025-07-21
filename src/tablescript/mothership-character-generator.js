// Content is copyright Tuesday Knight Games. I've written the script to
// generate random profiles, but the skills, classes, loadouts, trinkets,
// patches, etc. are all copyright TKG.

export const script = `
skills = fn() {
  make_skill = fn(id, name, level, bonus, prereq_for) { { id, name, level, bonus, prereq_for }; };
  make_trained_skill = fn(id, name, prereq_for) { make_skill(id, name, "trained", 10, prereq_for); };
  make_expert_skill = fn(id, name, prereq_for) { make_skill(id, name, "expert", 15, prereq_for); };
  make_master_skill = fn(id, name) { make_skill(id, name, "master", 20, []); };

  all_skills = [
    make_trained_skill("linguistics", "Linguistics", ["psychology"]),
    make_trained_skill("zoology", "Zoology", ["pathology"]),
    make_trained_skill("botany", "Botany", ["pathology", "ecology", "wilderness_survival"]),
    make_trained_skill("geology", "Geology", ["asteroid_mining"]),
    make_trained_skill("industrial_equipment", "Industrial Equipment", ["mechanical_repair", "asteroid_mining"]),
    make_trained_skill("jury_rigging", "Jury-Rigging", ["mechanical_repair", "explosives"]),
    make_trained_skill("chemistry", "Chemistry", ["explosives", "pharmacology"]),
    make_trained_skill("computers", "Computers", ["hacking"]),
    make_trained_skill("zero_g", "Zero-G", ["piloting"]),
    make_trained_skill("mathematics", "Mathematics", ["physics"]),
    make_trained_skill("art", "Art", ["mysticism"]),
    make_trained_skill("archaeology", "Archaeology", ["mysticism"]),
    make_trained_skill("theology", "Theology", ["mysticism"]),
    make_trained_skill("military_training", "Military Training", ["explosives", "wilderness_survival", "firearms", "hand_to_hand_combat"]),
    make_trained_skill("rimwise", "Rimwise", ["firearms", "hand_to_hand_combat"]),
    make_trained_skill("athletics", "Athletics", ["hand_to_hand_combat"]),

    make_expert_skill("psychology", "Psychology", ["sophontology"]),
    make_expert_skill("pathology", "Pathology", ["exobiology", "surgery"]),
    make_expert_skill("field_medicine", "Field Medicine", ["surgery"]),
    make_expert_skill("ecology", "Ecology", ["planetology"]),
    make_expert_skill("asteroid_mining", "Asteroid Mining", ["planetology"]),
    make_expert_skill("mechanical_repair", "Mechanical Repair", ["robotics", "engineering", "cybernetics"]),
    make_expert_skill("explosives", "Explosives", []),
    make_expert_skill("pharmacology", "Pharmacology", []),
    make_expert_skill("hacking", "Hacking", ["artificial_intelligence"]),
    make_expert_skill("piloting", "Piloting", ["hyperspace", "command"]),
    make_expert_skill("physics", "Physics", ["hyperspace"]),
    make_expert_skill("mysticism", "Mysticism", ["hyperspace", "xenoesotericism"]),
    make_expert_skill("wilderness_survival", "Wilderness Survival", []),
    make_expert_skill("firearms", "Firearms", ["command"]),
    make_expert_skill("hand_to_hand_combat", "Hand-To-Hand Combat", []),

    make_master_skill("sophontology", "Sophontology"),
    make_master_skill("exobiology", "Exobiology"),
    make_master_skill("surgery", "Surgery"),
    make_master_skill("planetology", "Planetology"),
    make_master_skill("robotics", "Robotics"),
    make_master_skill("engineering", "Engineering"),
    make_master_skill("cybernetics", "Cybernetics"),
    make_master_skill("artificial_intelligence", "Artificial Intelligence"),
    make_master_skill("hyperspace", "Hyperspace"),
    make_master_skill("xenoesotericism", "Xenoesotericism"),
    make_master_skill("command", "Command")
  ];

  skills_by_id = all_skills.reduce(fn(acc, s) { {...acc, [s.id]: s}; }, {});
  prop = fn(p) { fn(o) { o[p]; }; };
  prop_eq = fn(p, v) { fn(o) { o[p] == v; }; };
  by_level = fn(v) { prop_eq("level", v); };
  trained_skill_ids = all_skills.filter(by_level("trained")).map(prop("id"));
  expert_skill_ids = all_skills.filter(by_level("expert")).map(prop("id"));
  master_skill_ids = all_skills.filter(by_level("master")).map(prop("id"));

  always = fn(v) { fn() { v; }; };
  either_or = fn(this_fn, that_fn) {
    fn() {
      if (d2 == 1) {
        this_fn(...arguments);
      } else {
        that_fn(...arguments);
      };
    };
  };

  random_skills = fn(skills_list, n, is_valid_fn) {
    fn(skillsSoFar) {
      to_add = [];
      for (i in range(0, n)) {
        candidate = '';
        ok = false;
        while (not ok) {
          candidate = choose(skills_list);
          accumulated_skills = [...skillsSoFar, ...to_add];
          ok = not accumulated_skills.includes(candidate) and is_valid_fn(accumulated_skills, candidate);
        };
        to_add = to_add.append(candidate);
      };
      to_add;
    };
  };

  has_prereqs = fn(accumulated_skills, candidate) {
    accumulated_skills.reduce(
      fn(acc, skill) {
        [...acc, ...skills_by_id[skill].prereq_for];
      },
      trained_skill_ids
    ).includes(candidate);
  };

  random_trained_skills = fn(n) { random_skills(trained_skill_ids, n, always(true)); };
  random_expert_skills = fn(n) { random_skills(expert_skill_ids, n, has_prereqs); };

  prerequisites_for = fn(skill) {
    all_skills.filter(fn(s) { s.prereq_for.includes(skill); }).map(prop("id"));
  };

  random_master_with_prereqs = fn() {
    master_skill = choose(master_skill_ids);
    expert_skill = choose(prerequisites_for(master_skill));
    trained_skill = choose(prerequisites_for(expert_skill));
    [master_skill, expert_skill, trained_skill];
  };

  class_skills = {
    marine: [
      always(["military_training", "athletics"]),
      either_or(random_expert_skills(1), random_trained_skills(2))
    ],
    android: [
      always(["linguistics", "computers", "mathematics"]),
      either_or(random_expert_skills(1), random_trained_skills(2))
    ],
    scientist: [
      random_master_with_prereqs,
      random_trained_skills(1)
    ],
    teamster: [
      always(["industrial_equipment", "zero_g"]),
      random_trained_skills(1),
      random_expert_skills(1)
    ]
  };

  skills_for_class = fn(class) {
    class_skills[class].reduce(fn(acc, f) { [...acc, ...f(acc)]; }, []).map(fn(id) { skills_by_id[id]; });
  };

  {
    all_skills,
    skills_by_id,
    class_skills,
    skills_for_class
  };
}();
trinkets = fn() {
  trinkets = choice {
    Manual: PANIC: Harbinger of Catastrophe
    Antique Company Scrip (Asteroid Mine)
    Manual: SURVIVAL: Eat Soup With a Knife
    Desiccated Husk Doll
    Pressed Alien Flower (common)
    Necklace of Shell Casings
    Corroded Android Logic Core
    Pamphlet: Signs of Parasitical Infection
    Manual: Treat Your Rifle Like A Lady
    Bone Knife
    Calendar: Alien Pin-Up Art
    Rejected Application (Colony Ship)
    Holographic Serpentine Dancer
    Snake Whiskey
    Medical Container, Purple Powder
    Pills: Male Enhancement, Shoddy
    Casino Playing Cards
    Lagomorph Foot
    Moonstone Ring
    Manual: Mining Safety and You
    Pamphlet: Against Human Simulacra
    Animal Skull, 3 Eyes, Curled Horns
    Bartender's Certification (Expired)
    Bunraku Puppet
    Prospecting Mug, Dented
    Eerie Mask
    Ultrablack Marble
    Ivory Dice
    Tarot Cards, Worn, Pyrite Gilded Edges
    Bag of Assorted Teeth
    Ashes (A Relative)
    DNR Beacon Necklace
    Cigarettes (Grinning Skull)
    Pills: Areca Nut
    Pendant: Shell Fragments Suspended in Plastic
    Pamphlet: Zen and the Art of Cargo Arrangement
    Pair of Shot Glasses (Spent Shotgun Shells)
    Key (Childhood Home)
    Dog Tags (Heirloom)
    Token: "Is Your Morale Improving?"
    Pamphlet: The Relic of Flesh
    Pamphlet: The Indifferent Stars
    Calendar: Military Battles
    Manual: Rich Captain, Poor Captain
    Campaign Poster (Home Planet)
    Preserved Insectile Aberration
    Titanium Toothpick
    Gloves, Leather (Xenomorph Hide)
    Smut (Seditious): The Captain, Ordered
    Towel, Slightly Frayed
    Brass Knuckles
    Fuzzy Handcuffs
    Journal of Grudges
    Stylized Cigarette Case
    Ball of Assorted Gauge Wire
    Spanner
    Switchblade, Ornamental
    Powdered Xenomorph Horn
    Bonsai Tree, Potted
    Golf Club (Putter)
    Trilobite Fossil
    Pamphlet: A Lover In Every Port
    Patched Overalls, Personalized
    Fleshy Thing Sealed in a Murky Jar
    Spiked Bracelet
    Harmonica
    Pictorial Pornography, Dog-eared, Well-thumbed
    Coffee Cup, Chipped, reads: HAPPINESS IS MANDATORY
    Manual: Moonshining With Gun Oil & Fuel
    Miniature Chess Set, Bone, Pieces Missing
    Gyroscope, Bent, Tin
    Faded Green Poker Chip
    Ukulele
    Spray Paint
    Wanted Poster, Weathered
    Locket, Hair Braid
    Sculpture of a Rat (Gold)
    Blanket, Fire Retardant
    Hooded Parka, Fleece-Lined
    BB Gun
    Flint Hatchet
    Pendant: Two Astronauts form a Skull
    Rubik's Cube
    Stress Ball, reads: Zero Stress in Zero G
    Sputnik Pin
    Ushanka
    Trucker Cap, Mesh, Grey Alien Logo
    Menthol Balm
    Pith Helmet
    10m x 10m Tarp
    I Ching, Missing Sticks
    Kukri
    Trench Shovel
    Shiv, Sharpened Butter Knife
    Taxidermied Cat
    Pamphlet: Interpreting Sheep Dreams
    Faded Photograph, A Windswept Heath
    Opera Glasses
    Pamphlet: Android Overlords
    Interstellar Compass, Always Points to Homeworld
  };

  trinkets;
}();
patches = fn() {
  patches = choice {
    "I'm Not A Rocket Scientist / But You're An Idiot"
    Medic Patch (Skull and Crossbones over Cross)
    "Don't Run You'll Only Die Tired" Backpatch
    Red Shirt Logo
    Blood Type (Reference Patch)
    "Do I LOOK Like An Expert?"
    Biohazard Symbol
    Mr. Yuck
    Nuclear Symbol
    "Eat The Rich"
    "Be Sure: Doubletap"
    Flame Emoji
    Smiley Face (Glow in the Dark)
    "Smile: Big Brother is Watching"
    Jolly Roger
    Viking Skull
    "APEX PREDATOR" (Sabertooth Skull)
    Pin-Up Model (Ace of Spades)
    Queen of Hearts
    Security Guard
    "LONER"
    "Front Towards Enemy" (Claymore Mine)
    Pin-Up Model (Riding Missile)
    FUBAR
    "I'm A (Love) Machine"
    Pin-Up Model (Mechanic)
    "HELLO MY NAME IS:"
    "Powered By Coffee"
    "Take Me To Your Leader" (UFO)
    "DO YOUR JOB"
    "Take My Life (Please)"
    "Upstanding Citizen"
    "Allergic To Bullshit" (Medical Style Patch)
    "Fix Me First" (Caduceus)
    "I Like My Tools Clean / And My Lovers Dirty"
    "The Louder You Scream the Faster I Come" (Nurse Pin-Up)
    HMFIC (Head Mother Fucker In Charge)
    Dove in Crosshairs
    Chibi Cthulhu
    "Welcome to the DANGER ZONE"
    Skull and Crossed Wrenches
    Pin-Up Model (Succubus)
    "DILLIGAF?"
    "DRINK / FIGHT / FUCK"
    "Work Hard / Party Harder"
    Mudflap Girl
    Fun Meter (reads: Bad Time)
    "GAME OVER" (Bride & Groom)
    Heart
    "IMPROVE / ADAPT / OVERCOME"
    "SUCK IT UP"
    "Cowboy Up" (Crossed Revolvers)
    "Troubleshooter"
    NASA Logo
    Crossed Hammers with Wings
    "Keep Well Lubricated"
    Soviet Hammer & Sickle
    "Plays Well With Others"
    "Live Free and Die"
    "IF I'M RUNNING KEEP UP" Backpatch
    "Meat Bag"
    "I Am Not A Robot"
    Red Gear
    "I Can't Fix Stupid"
    "Space IS My Home" (Sad Astronaut)
    All Seeing Eye
    "Solve Et Coagula" (Baphomet)
    "All Out of Fucks To Give" (Astronaut with Turned Out Pockets)
    "Travel To Distant Places / Meet Unusual Things / Get Eaten"
    BOHICA (Bend Over Here It Comes Again)
    "I Am My Brother's Keeper"
    "Mama Tried"
    Black Widow Spider
    "My Other Ride Married You"
    "One Size Fits All" (Grenade)
    Grim Reaper Backpatch
    отъебись ("Fuck Off," Russian)
    "Smooth Operator"
    Atom Symbol
    "For Science!"
    "Actually, I AM A Rocket Scientist"
    "Help Wanted"
    Princess
    "NOMAD"
    "GOOD BOY"
    Dice (Snake Eyes)
    "#1 Worker"
    "Good" (Brain)
    "Bad Bitch"
    "Too Pretty To Die"
    "Fuck Forever" (Roses)
    Icarus
    "Girl's Best Friend" (Diamond)
    Risk of Electrocution Symbol
    Inverted Cross
    "Do You Sign My Paychecks?" Backpatch
    "I ♥ Myself"
    Double Cherry
    "Volunteer"
    Poker Hand: Dead Man's Hand (Aces Full of Eights)
  };

  patches;
}();
loadouts = fn() {
  weapon = fn(name) { { type: "weapon", name }; };
  equipment = fn(name) { { type: "equipment", name }; };

  marine_loadouts =  choice {
    > [equipment("Tank Top and Camo Pants (AP 1)"), weapon("Combat Knife (as Scalpel DMG[+])"), equipment("Stimpak (x5)")];
    > [equipment("Advanced Battle Dress (AP 10)"), weapon("Flamethrower (4 shots)"), weapon("Boarding Axe")];
    > [equipment("Standard Battle Dress (AP 7)"), weapon("Combat Shotgun (4 rounds)"), equipment("Rucksack"), equipment("Camping Gear")];
    > [equipment("Standard Battle Dress (AP 7)"), weapon("Pulse Rifle (3 mags)"), equipment("Infrared Goggles")];
    > [equipment("Standard Battle Dress (AP 7)"), weapon("Smart Rifle (3 mags)"), equipment("Binoculars"), equipment("Personal Locator")];
    > [equipment("Standard Battle Dress (AP 7)"), weapon("SMG (3 mags)"), equipment("MRE (x7)")];
    > [equipment("Fatigues (AP 2)"), weapon("Combat Shotgun (2 rounds)"), equipment("Dog (pet)"), equipment("Leash"), equipment("Tennis Ball")];
    > [equipment("Fatigues (AP 2)"), weapon("Revolver (12 rounds)"), weapon("Frag Grenade")];
    > [equipment("Dress Uniform (AP 1)"), weapon("Revolver (1 round)"), equipment("Challenge Coin")];
    > [equipment("Advanced Battle Dress (AP 10)"), weapon("General-Purpose Machine Gun (1 Can of ammo)"), equipment("HUD")];
  };

  android_loadouts = choice {
    > [equipment("Vaccsuit (AP 3)"), weapon("Smart Rifle (2 mags)"), equipment("Infrared Goggles"), equipment("Mylar Blanket")];
    > [equipment("Vaccsuit (AP 3)"), weapon("Revolver (12 rounds)"), equipment("Long-range Comms"), equipment("Satchel")];
    > [equipment("Hazard Suit (AP 5)"), weapon("Revolver (6 rounds)"), equipment("Defibrillator"), equipment("First Aid Kit"), equipment("Flashlight")];
    > [equipment("Hazard Suit (AP 5)"), weapon("Foam Gun (2 charges)"), equipment("Sample Collection Kit"), equipment("Screwdriver (as Assorted Tools)")];
    > [equipment("Standard Battle Dress (AP 7)"), weapon("Tranq Pistol (3 shots)"), equipment("Paracord (100m)")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Stun Baton"), equipment("Small Pet (organic)")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Scalpel"), equipment("Bioscanner")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Frag Grenade"), weapon("Pen Knife")];
    > [equipment("Manufacturer Supplied Attire (AP 1)"), equipment("Jump-9 Ticket (destination blank)")];
    > [equipment("Corporate Attire (AP 1)"), equipment("VIP Corporate Key Card")];
  };

  scientist_loadouts = choice {
    > [equipment("Hazard Suite (AP 5)"), weapon("Tranq Pistol (3 shots)"), equipment("Bioscanner"), equipment("Sample Collection Kit")];
    > [equipment("Hazard Suit (AP 5)"), weapon("Flamethrower (1 charge)"), equipment("Stimpak"), equipment("Electronic Tool Set")];
    > [equipment("Vaccsuit (AP 3)"), weapon("Rigging Gun"), equipment("Sample Collection Kit"), equipment("Flashlight"), equipment("Lab Rat (pet)")];
    > [equipment("Vaccsuit (AP 3)"), weapon("Foam Gun (2 charges)"), equipment("Foldable Stretcher"), equipment("First Aid Kit"), equipment("Radiation Pills (x5)")];
    > [equipment("Lab Coat (AP 1)"), equipment("Screwdriver (as Assorted Tools)"), equipment("Medscanner"), equipment("Vaccine (1 dose)")];
    > [equipment("Lab Coat (AP 1)"), equipment("Cybernetic Diagnostic Scanner"), equipment("Portable Computer Terminal")];
    > [equipment("Scrubs (AP 1)"), weapon("Scalpel"), equipment("Automed (x5)"), equipment("Oxygen Tank with Filter Mask")];
    > [equipment("Scrubs (AP 1)"), weapon("Vial of Acid"), equipment("Mylar Blanket"), equipment("First Aid Kit")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Utility Knife (as Scalpel)"), equipment("Cybernetic Diagnostic Scanner"), equipment("Duct Tape")];
    > [equipment("Civilian Clothes (AP 1)"), equipment("Briefcase"), equipment("Prescription Pad"), weapon("Fountain Pen (Poison Injector)")];
  };

  teamster_loadouts = choice {
    > [equipment("Vaccsuit (AP 3)"), weapon("Laser Cutter (1 extra battery)"), equipment("Patch Kit (x3)"), equipment("Toolbelt with Assorted Tools")];
    > [equipment("Vaccsuit (AP 3)"), weapon("Revolver (6 rounds)"), weapon("Crowbar"), equipment("Flashlight")];
    > [equipment("Vaccsuit (AP 3)"), weapon("Rigging Gun (1 shot)"), weapon("Shovel"), equipment("Salvage Drone")];
    > [equipment("Hazard Suit (AP 5)"), weapon("Vibechete"), weapon("Spanner"), equipment("Camping Gear"), equipment("Water Filtration Device")];
    > [equipment("Heavy Duty Work Clothes (AP 2)"), weapon("Explosives & Detonator"), equipment("Cigarettes")];
    > [equipment("Heavy Duty Work Clothes (AP 2)"), equipment("Drill (as Assorted Tools)"), equipment("Paracord (100m)"), equipment("Salvage Drone")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Combat Shotgun (4 rounds)"), equipment("Extension Cord (20m)"), equipment("Cat (pet)")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Nail Gun (32 rounds)"), equipment("Head Lamp"), equipment("Toolbelt with Assorted Tools"), equipment("Lunch Box")];
    > [equipment("Standard Crew Attire (AP 1)"), weapon("Flare Gun (2 rounds)"), equipment("Water Filtration Device"), equipment("Personal Locator"), equipment("Subsurface Scanner")];
    > [equipment("Lounge Wear (AP 1)"), weapon("Crowbar"), equipment("Stimpak"), equipment("Six Pack of Beer")];
  };

  loadouts_by_class = {
    marine: marine_loadouts,
    android: android_loadouts,
    scientist: scientist_loadouts,
    teamster: teamster_loadouts
  };

  loadout_for_class = fn(class) { loadouts_by_class[class](); };

  {
    loadouts_by_class,
    loadout_for_class
  };
}();

character_classes = [
  {
    id: "marine",
    name: "Marine",
    trauma_response: "Whenever you panic, every close friendly player must make a fear save."
  },
  {
    id: "android",
    name: "Android",
    trauma_response: "Fear saves made by close friendly players are at disadvantage."
  },
  {
    id: "scientist",
    name: "Scientist",
    trauma_response: "Whenever you fail a sanity save, all close friendly players gain 1 stress."
  },
  {
    id: "teamster",
    name: "Teamster",
    trauma_response: "Once per session, you may take advantage on a panic check."
  }
];

character_class_ids = character_classes.map(fn(c) { c.id; });
character_classes_by_id = character_classes.reduce(fn(acc, c) { {...acc, [c.id]: c}; }, {});

all_stats = ["strength", "speed", "intellect", "combat"];
all_saves = ["sanity", "fear", "body"];

adjust_stat = fn(stat, amount) {
  fn(character) {
    character.stats[stat] += amount;
  };
};

adjust_all_stats = fn(amount) {
  fn(character) {
    for (stat in all_stats) {
      character.stats[stat] += amount;
    };
  };
};

adjust_random_stat = fn(amount) {
  fn(character) {
    character.stats[choose(["strength", "speed", "intellect", "combat"])] += amount;
  };
};

adjust_save = fn(save, amount) {
  fn(character) {
    character.saves[save] += amount;
  };
};

adjust_all_saves = fn(amount) {
  fn(character) {
    for (save in all_saves) {
      character.saves[save] += amount;
    };
  };
};

adjust_max_wounds = fn(amount) {
  fn(character) {
    character.wounds.max += amount;
  };
};

adjustments_by_class = {
  marine: [
    adjust_stat("combat", 10),
    adjust_save("body", 10),
    adjust_save("fear", 20),
    adjust_max_wounds(1)
  ],
  android: [
    adjust_stat("intellect", 20),
    adjust_random_stat(-10),
    adjust_save("fear", 60),
    adjust_max_wounds(1)
  ],
  scientist: [
    adjust_stat("intellect", 10),
    adjust_random_stat(5),
    adjust_save("sanity", 30)
  ],
  teamster: [
    adjust_all_stats(5),
    adjust_all_saves(10)
  ]
};

adjust_for_class = fn(character) {
  for (adjust in adjustments_by_class[character.class.id]) {
    adjust(character);
  };
};

health = fn() {
  max_health = 1d10 + 10;
  {
    max: max_health,
    current: max_health
  };
};

character = {
  class: choose(character_classes),
  stats: {
    strength: 2d10 + 25,
    speed: 2d10 + 25,
    intellect: 2d10 + 25,
    combat: 2d10 + 25
  },
  saves: {
    sanity: 2d10 + 10,
    fear: 2d10 + 10,
    body: 2d10 + 10
  },
  health: health(),
  wounds: {
    max: 2,
    current: 0
  },
  stress: {
    min: 2,
    current: 2
  },
  credits: 2d10 * 10
};

adjust_for_class(character);

character["skills"] = skills.skills_for_class(character.class.id);

loadout = loadouts.loadout_for_class(character.class.id);
character["equipment"] = loadout.filter(fn(l) { l.type == "equipment"; }).map(fn(e) { e.name; });
character["weapons"] = loadout.filter(fn(l) { l.type == "weapon"; }).map(fn(w) { w.name; });

character["trinket"] = trinkets();
character["patch"] = patches();

character;
`;
