/*
 * Skills aller Klassen und was die Top-Spieler damit machen. Stand 11.10.2026. Neu erzeugen mit tools/skills_daten.py.
 * skills: [englischer Name, deutscher Name (Client), a aktiv / p passiv / s Stigma, Lernstufe, Symbol].
 *   Symbol-Datei: https://assets.playnccdn.com/static-aion2-gamedata/resources/<Symbol>.png
 *   Quelle: GameWith-Klassendatenbank (Daten der offiziellen AION2-Seite), gegen data-daevanion.js und die Armory geprüft.
 * top: MetaBot.GG, Top-Spieler je Klasse (Stufe 45, höchste Kampfkraft je Region).
 *   spieler: ausgewertete Charaktere, stand: Datum der Auswertung.
 *   skills / stigmen: { Name: [Anteil in %, Durchschnittsstufe inkl. Daevanion und Ausrüstung] }.
 *   builds.endgame: was die Top-Spieler trainieren [Name, Stufe mit Skillpunkten, Bonus aus Daevanion/Ausrüstung];
 *   builds.leveling / builds.pvp: Empfehlung der Redaktion [Name, Stufe]. stigmen: [Name, Stufe] in Slot-Reihenfolge.
 */
window.DK_DATA.skills = {
  "quellen": {
    "skills": "https://gamewith.ai/aion2/de/classes",
    "top": "https://metabot.gg/en/aion-2/guides/class-builds-guide"
  },
  "klassen": {
    "gladiator": {
      "skills": [
        ["Rending Blow","Zerreißender Schlag","a",1,"ICON_GL_SKILL_001"],
        ["Keen Strike","Scharfer Schlag","a",1,"ICON_GL_SKILL_002"],
        ["Leaping Slam","Sprungangriff","a",1,"ICON_GL_SKILL_019"],
        ["Mocking Blade","Spottklinge","a",3,"ICON_GL_SKILL_028"],
        ["Overhead Slam","Abwärtsschlag","a",4,"ICON_GL_SKILL_017"],
        ["Sword Aura Rampage","Klingenraserei","a",5,"ICON_TE_SKILL_034"],
        ["Ankle Slice","Knöchelschnitt","a",7,"ICON_GL_SKILL_020"],
        ["Crushing Wave","Zerschmetternde Welle","a",8,"ICON_GL_SKILL_005"],
        ["Rush Strike","Sturmhieb","a",10,"ICON_GL_SKILL_036"],
        ["Aerial Snare","Luftfesselung","a",12,"ICON_GL_SKILL_015"],
        ["Ruinous Blow","Verheerender Schlag","a",14,"ICON_GL_SKILL_010"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Survival Stance","Überlebenshaltung","p",1,"ICON_GL_SKILL_Passive_001"],
        ["Protection Armor","Schutzrüstung","p",6,"ICON_GL_SKILL_Passive_002"],
        ["Blood Absorption","Blutabsorption","p",9,"ICON_GL_SKILL_Passive_003"],
        ["Identify Weakness","Schwächenanalyse","p",11,"ICON_GL_SKILL_Passive_004"],
        ["Attack Preparation","Angriffsvorbereitung","p",13,"ICON_GL_SKILL_Passive_005"],
        ["Impact Hit","Schocktreffer","p",15,"ICON_GL_SKILL_Passive_006"],
        ["Destructive Impulse","Zerstörungsdrang","p",17,"ICON_GL_SKILL_Passive_007"],
        ["Experienced Counterstrike","Erfahrener Konterangriff","p",21,"ICON_GL_SKILL_Passive_008"],
        ["Survival Willpower","Überlebenswille","p",23,"ICON_GL_SKILL_Passive_009"],
        ["Murderous Burst","Tödliche Eruption","p",25,"ICON_GL_SKILL_Passive_010"],
        ["Blade Toss","Klingenwurf","s",22,"ICON_GL_SKILL_008"],
        ["Focused Block","Fokussierter Block","s",22,"ICON_GL_SKILL_011"],
        ["Armor of Balance","Rüstung des Gleichgewichts","s",22,"ICON_GL_SKILL_013"],
        ["Wrath Wave","Zornwelle","s",22,"ICON_GL_SKILL_007"],
        ["Zikel's Blessing","Zikels Segen","s",22,"ICON_GL_SKILL_040"],
        ["Lifestealing Blade","Klinge des Lebensraubs","s",22,"ICON_GL_SKILL_034"],
        ["Tenaciousness","Beharrlichkeit","s",22,"ICON_GL_SKILL_038"],
        ["Rage Burst","Furorausbruch","s",22,"ICON_GL_SKILL_039"],
        ["Lunge Stance","Angriffsstellung","s",22,"ICON_GL_SKILL_024"],
        ["Wave Armor","Rüstung der Welle","s",22,"ICON_GL_SKILL_041"],
        ["Forced Restraint","Zwangsfesselung","s",22,"ICON_GL_SKILL_043"],
        ["Fracturing Rush","Zerschmetternder Ansturm","s",22,"ICON_GL_SKILL_045"],
        ["Assault Strike","Ansturmschlag","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 151,
        "stand": "2026-10-03",
        "skills": {
          "Rending Blow": [99,13.9],
          "Keen Strike": [99,13.2],
          "Ruinous Blow": [99,13.5],
          "Overhead Slam": [99,14],
          "Leaping Slam": [99,12.3],
          "Rush Strike": [99,11.5],
          "Mocking Blade": [96,9.8],
          "Sword Aura Rampage": [95,11],
          "Ankle Slice": [94,10.3],
          "Crushing Wave": [93,10.9],
          "Aerial Snare": [89,7.8],
          "Survival Stance": [99,12.5],
          "Protection Armor": [99,7.9],
          "Blood Absorption": [99,12.8],
          "Identify Weakness": [99,13.6],
          "Attack Preparation": [99,14.4],
          "Impact Hit": [99,13.3],
          "Destructive Impulse": [99,9.8],
          "Experienced Counterstrike": [99,13.8],
          "Survival Willpower": [99,10.1],
          "Murderous Burst": [99,13.4]
        },
        "stigmen": {
          "Lunge Stance": [91,7.5],
          "Zikel's Blessing": [91,8.6],
          "Rage Burst": [73,6.1],
          "Focused Block": [62,5.2],
          "Lifestealing Blade": [42,6.3],
          "Wrath Wave": [26,3.1],
          "Tenaciousness": [17,1.8],
          "Blade Toss": [11,2.5],
          "Wave Armor": [5.3,5.9],
          "Forced Restraint": [3.3,3]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Keen Strike",7,2],
              ["Ruinous Blow",7,3],
              ["Rending Blow",7,3],
              ["Leaping Slam",7,2],
              ["Rush Strike",7,1],
              ["Overhead Slam",7,3],
              ["Mocking Blade",7,3],
              ["Sword Aura Rampage",7,2],
              ["Ankle Slice",7,1],
              ["Crushing Wave",7,2],
              ["Aerial Snare",7,1],
              ["Survival Stance",7,1],
              ["Impact Hit",7,2],
              ["Protection Armor",7,0],
              ["Destructive Impulse",7,1],
              ["Blood Absorption",7,2],
              ["Experienced Counterstrike",7,3],
              ["Identify Weakness",7,3],
              ["Survival Willpower",8,0],
              ["Attack Preparation",7,3],
              ["Murderous Burst",9,0]
            ],
            "stigmen": [
              ["Lunge Stance",5],
              ["Zikel's Blessing",8],
              ["Rage Burst",6],
              ["Focused Block",5]
            ]
          },
          "leveling": {
            "skills": [
              ["Keen Strike",10,0],
              ["Rending Blow",10,0],
              ["Leaping Slam",10,0],
              ["Overhead Slam",10,0],
              ["Rush Strike",10,0],
              ["Ruinous Blow",10,0],
              ["Survival Stance",10,0],
              ["Identify Weakness",10,0],
              ["Attack Preparation",10,0],
              ["Crushing Wave",7,0],
              ["Mocking Blade",5,0]
            ],
            "stigmen": [
              ["Zikel's Blessing",8],
              ["Lunge Stance",7],
              ["Lifestealing Blade",5],
              ["Rage Burst",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Keen Strike",10,0],
              ["Rending Blow",10,0],
              ["Leaping Slam",10,0],
              ["Mocking Blade",10,0],
              ["Overhead Slam",10,0],
              ["Rush Strike",10,0],
              ["Ruinous Blow",10,0],
              ["Survival Stance",10,0],
              ["Identify Weakness",10,0],
              ["Aerial Snare",7,0],
              ["Survival Willpower",5,0]
            ],
            "stigmen": [
              ["Zikel's Blessing",8],
              ["Lunge Stance",7],
              ["Tenaciousness",5],
              ["Wrath Wave",4]
            ]
          }
        }
      }
    },
    "templar": {
      "skills": [
        ["Vicious Strike","Brutaler Schlag","a",1,"ICON_TE_SKILL_001"],
        ["Pummel","Tobende Hiebe","a",1,"ICON_TE_SKILL_006"],
        ["Poach","Fesseln","a",1,"ICON_TE_SKILL_013"],
        ["Shield Smite","Schildhieb","a",3,"ICON_TE_SKILL_010"],
        ["Judgment","Urteil","a",4,"ICON_TE_SKILL_004"],
        ["Flash Rampage","Lichtraserei","a",5,"ICON_GL_SKILL_027"],
        ["Debilitating Smash","Lähmender Schlag","a",7,"ICON_TE_SKILL_025"],
        ["Warding Strike","Behütender Schlag","a",8,"ICON_TE_SKILL_035"],
        ["Shield Rush","Schildsturm","a",10,"ICON_TE_SKILL_015"],
        ["Annihilate","Vernichtung","a",12,"ICON_TE_SKILL_028"],
        ["Punishment","Bestrafung","a",14,"ICON_TE_SKILL_009"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Enhance Health","Vitalitätsverstärkung","p",1,"ICON_TE_SKILL_Passive_001"],
        ["Warding Shield","Behütungsschild","p",6,"ICON_TE_SKILL_Passive_002"],
        ["Punishing Benediction","Gnade der Verdammnis","p",9,"ICON_TE_SKILL_Passive_003"],
        ["Ironclad Defense","Eisenwall-Verteidigung","p",11,"ICON_TE_SKILL_Passive_004"],
        ["Guarding Seal","Schutzsiegel","p",13,"ICON_TE_SKILL_Passive_005"],
        ["Impact Hit","Schocktreffer","p",15,"ICON_GL_SKILL_Passive_006"],
        ["Insulting Roar","Gebrüll der Verachtung","p",17,"ICON_TE_SKILL_Passive_007"],
        ["Fury","Kampfrausch","p",21,"ICON_TE_SKILL_Passive_008"],
        ["Survival Willpower","Überlebenswille","p",23,"ICON_GL_SKILL_Passive_009"],
        ["Block Pain","Schmerzblockade","p",25,"ICON_TE_SKILL_Passive_010"],
        ["Doom Shield","Schild des Verderbens","s",22,"ICON_TE_SKILL_007"],
        ["Shield of Protection","Wachtschild","s",22,"ICON_TE_SKILL_011"],
        ["Taunt","Provokation","s",22,"ICON_TE_SKILL_012"],
        ["Second Skin","Doppelpanzer","s",22,"ICON_TE_SKILL_018"],
        ["Armor of Balance","Rüstung des Gleichgewichts","s",22,"ICON_GL_SKILL_013"],
        ["Grapple","Kaperung","s",22,"ICON_TE_SKILL_021"],
        ["Noble Armor","Edle Rüstung","s",22,"ICON_TE_SKILL_022"],
        ["Comrade in Arms","Kameradenschutz","s",22,"ICON_TE_SKILL_024"],
        ["Empyrean Lord's Punishment","Strafe des Gebieters","s",22,"ICON_TE_SKILL_029"],
        ["Nezekan's Shield","Nezekans Schild","s",22,"ICON_TE_SKILL_030"],
        ["Executing Blade","Schwert der Hinrichtung","s",22,"ICON_TE_SKILL_041"],
        ["Battlefield Banner","Banner des Schlachtfelds","s",22,"ICON_TE_SKILL_045"],
        ["Assault Fury","Stürmischer Wutanfall","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 153,
        "stand": "2026-10-03",
        "skills": {
          "Vicious Strike": [98,13.6],
          "Punishment": [98,13.3],
          "Poach": [98,11.6],
          "Judgment": [98,13.8],
          "Warding Strike": [98,13.4],
          "Shield Rush": [98,11.1],
          "Annihilate": [97,12],
          "Shield Smite": [96,12.2],
          "Pummel": [95,13.3],
          "Debilitating Smash": [94,11.3],
          "Flash Rampage": [88,10.4],
          "Enhance Health": [98,13.2],
          "Warding Shield": [98,7.8],
          "Punishing Benediction": [98,12.7],
          "Ironclad Defense": [98,12.5],
          "Guarding Seal": [98,8.3],
          "Impact Hit": [98,12.7],
          "Insulting Roar": [98,13.2],
          "Fury": [98,14],
          "Survival Willpower": [98,8.6],
          "Block Pain": [98,10.5]
        },
        "stigmen": {
          "Taunt": [76,5.1],
          "Empyrean Lord's Punishment": [67,6],
          "Battlefield Banner": [65,7.8],
          "Doom Shield": [61,5.9],
          "Shield of Protection": [61,4.8],
          "Noble Armor": [37,7.1],
          "Nezekan's Shield": [24,4.8],
          "Executing Blade": [19,5.4],
          "Second Skin": [9.8,3.9],
          "Grapple": [7.8,2]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Vicious Strike",7,3],
              ["Punishment",7,2],
              ["Poach",7,2],
              ["Warding Strike",7,2],
              ["Shield Rush",7,1],
              ["Judgment",7,3],
              ["Annihilate",7,2],
              ["Shield Smite",7,1],
              ["Pummel",7,2],
              ["Debilitating Smash",7,1],
              ["Flash Rampage",7,1],
              ["Enhance Health",7,2],
              ["Impact Hit",7,2],
              ["Warding Shield",7,0],
              ["Insulting Roar",7,2],
              ["Punishing Benediction",7,3],
              ["Fury",10,0],
              ["Ironclad Defense",7,3],
              ["Survival Willpower",6,0],
              ["Guarding Seal",7,0],
              ["Block Pain",8,0]
            ],
            "stigmen": [
              ["Taunt",5],
              ["Empyrean Lord's Punishment",5],
              ["Battlefield Banner",8],
              ["Doom Shield",6]
            ]
          },
          "leveling": {
            "skills": [
              ["Vicious Strike",10,0],
              ["Pummel",10,0],
              ["Poach",10,0],
              ["Shield Smite",10,0],
              ["Judgment",10,0],
              ["Warding Strike",10,0],
              ["Punishment",10,0],
              ["Enhance Health",10,0],
              ["Punishing Benediction",10,0],
              ["Annihilate",7,0],
              ["Ironclad Defense",5,0]
            ],
            "stigmen": [
              ["Taunt",8],
              ["Empyrean Lord's Punishment",7],
              ["Battlefield Banner",5],
              ["Doom Shield",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Vicious Strike",10,0],
              ["Pummel",10,0],
              ["Poach",10,0],
              ["Shield Smite",10,0],
              ["Judgment",10,0],
              ["Shield Rush",10,0],
              ["Annihilate",10,0],
              ["Punishment",10,0],
              ["Enhance Health",10,0],
              ["Ironclad Defense",7,0],
              ["Guarding Seal",5,0]
            ],
            "stigmen": [
              ["Doom Shield",8],
              ["Empyrean Lord's Punishment",7],
              ["Noble Armor",5],
              ["Grapple",4]
            ]
          }
        }
      }
    },
    "assassin": {
      "skills": [
        ["Quick Slice","Schneller Schnitt","a",1,"ICON_AS_SKILL_001"],
        ["Shadowstrike","Schattenschlag","a",1,"ICON_AS_SKILL_007"],
        ["Savage Roar","Gebrüll der Bestie","a",1,"ICON_AS_SKILL_009"],
        ["Ambush","Hinterhalt","a",3,"ICON_AS_SKILL_006"],
        ["Heart Gore","Herzstoß","a",4,"ICON_AS_SKILL_035"],
        ["Storm Rampage","Sturmwirbel","a",5,"ICON_AS_SKILL_034"],
        ["Whirlwind Slice","Wirbelschnitt","a",7,"ICON_AS_SKILL_019"],
        ["Flash Slice","Blitzhafter Schnitt","a",8,"ICON_AS_SKILL_005"],
        ["Infiltrate","Infiltration","a",10,"ICON_AS_SKILL_036"],
        ["Shadow Fall","Schattenfall","a",12,"ICON_AS_SKILL_020"],
        ["Insignia Explosion","Glyphenexplosion","a",14,"ICON_AS_SKILL_013"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Heightened Sixth Sense","Geschärfte Sinne","p",1,"ICON_AS_SKILL_Passive_001"],
        ["Exploit Weakness","Schwachstellenfokus","p",6,"ICON_AS_SKILL_Passive_002"],
        ["Apply Poison","Klingengift","p",9,"ICON_AS_SKILL_Passive_003"],
        ["Rear Smite","Rückhieb","p",11,"ICON_AS_SKILL_Passive_004"],
        ["Assault Stance","Sturmhaltung","p",13,"ICON_AS_SKILL_Passive_006"],
        ["Impact Hit","Schocktreffer","p",15,"ICON_AS_SKILL_Passive_011"],
        ["Ambush Stance","Lauerhaltung","p",17,"ICON_AS_SKILL_Passive_007"],
        ["Defense Break","Verteidigungsbruch","p",21,"ICON_AS_SKILL_Passive_008"],
        ["Revitalization Contract","Pakt der Revitalisierung","p",23,"ICON_AS_SKILL_Passive_009"],
        ["Determination","Entschlossenheit","p",25,"ICON_AS_SKILL_Passive_010"],
        ["Throw Shadowblade","Wurf der Schattenklinge","s",22,"ICON_AS_SKILL_031"],
        ["Evasion Stance","Ausweichhaltung","s",22,"ICON_AS_SKILL_024"],
        ["Shadowstep","Schattengang","s",22,"ICON_AS_SKILL_014"],
        ["Shadow Walk","Schattenlauf","s",22,"ICON_AS_SKILL_016"],
        ["Aerial Bind","Luftfessel","s",22,"ICON_AS_SKILL_026"],
        ["Smoke Bomb","Rauchgranate","s",22,"ICON_AS_SKILL_023"],
        ["Savage Fang","Reißzahn der Bestie","s",22,"ICON_AS_SKILL_025"],
        ["Spiral Slice","Spiralschnitt","s",22,"ICON_AS_SKILL_022"],
        ["Triniel's Dagger","Triniels Dolch","s",22,"ICON_AS_SKILL_028"],
        ["Illusive Clone","Illusion","s",22,"ICON_AS_SKILL_029"],
        ["Evasion Contract","Pakt des Ausweichens","s",22,"ICON_AS_SKILL_039"],
        ["Swift Contract","Pakt der Flinkheit","s",22,"ICON_AS_SKILL_037"],
        ["Assault Ambush","Sturmüberfall","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 150,
        "stand": "2026-10-03",
        "skills": {
          "Quick Slice": [99,13.9],
          "Shadowstrike": [99,11.6],
          "Insignia Explosion": [99,13.6],
          "Heart Gore": [99,13.9],
          "Flash Slice": [99,11.5],
          "Infiltrate": [99,11.3],
          "Savage Roar": [97,13],
          "Ambush": [95,11.6],
          "Storm Rampage": [95,11.3],
          "Whirlwind Slice": [90,9.8],
          "Shadow Fall": [90,8.1],
          "Heightened Sixth Sense": [99,11.2],
          "Exploit Weakness": [99,13.5],
          "Apply Poison": [99,8.3],
          "Rear Smite": [99,13.7],
          "Assault Stance": [99,13.6],
          "Impact Hit": [99,12.7],
          "Ambush Stance": [99,11.9],
          "Defense Break": [99,11.1],
          "Revitalization Contract": [99,8.9],
          "Determination": [99,12.4]
        },
        "stigmen": {
          "Illusive Clone": [95,9.4],
          "Swift Contract": [90,6.8],
          "Savage Fang": [77,3.6],
          "Triniel's Dagger": [71,6.9],
          "Evasion Stance": [39,3.5],
          "Throw Shadowblade": [24,5.7],
          "Shadow Walk": [17,1.9],
          "Spiral Slice": [6,2.3],
          "Shadowstep": [2,5],
          "Smoke Bomb": [2,1.7]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Quick Slice",7,3],
              ["Insignia Explosion",7,3],
              ["Shadowstrike",7,2],
              ["Heart Gore",7,3],
              ["Flash Slice",7,1],
              ["Infiltrate",7,0],
              ["Savage Roar",7,2],
              ["Storm Rampage",7,1],
              ["Ambush",7,2],
              ["Whirlwind Slice",7,2],
              ["Shadow Fall",7,0],
              ["Heightened Sixth Sense",7,0],
              ["Impact Hit",8,1],
              ["Exploit Weakness",7,3],
              ["Ambush Stance",8,0],
              ["Apply Poison",7,0],
              ["Defense Break",8,0],
              ["Rear Smite",7,3],
              ["Revitalization Contract",6,0],
              ["Assault Stance",7,3],
              ["Determination",8,0]
            ],
            "stigmen": [
              ["Illusive Clone",6],
              ["Swift Contract",7],
              ["Savage Fang",4],
              ["Triniel's Dagger",7]
            ]
          },
          "leveling": {
            "skills": [
              ["Quick Slice",10,0],
              ["Savage Roar",10,0],
              ["Shadowstrike",10,0],
              ["Ambush",10,0],
              ["Heart Gore",10,0],
              ["Flash Slice",10,0],
              ["Insignia Explosion",10,0],
              ["Exploit Weakness",10,0],
              ["Rear Smite",10,0],
              ["Infiltrate",7,0],
              ["Assault Stance",5,0]
            ],
            "stigmen": [
              ["Illusive Clone",8],
              ["Swift Contract",7],
              ["Savage Fang",5],
              ["Triniel's Dagger",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Quick Slice",10,0],
              ["Savage Roar",10,0],
              ["Shadowstrike",10,0],
              ["Ambush",10,0],
              ["Heart Gore",10,0],
              ["Flash Slice",10,0],
              ["Infiltrate",10,0],
              ["Insignia Explosion",10,0],
              ["Exploit Weakness",10,0],
              ["Shadow Fall",7,0],
              ["Rear Smite",5,0]
            ],
            "stigmen": [
              ["Illusive Clone",8],
              ["Swift Contract",7],
              ["Triniel's Dagger",5],
              ["Shadow Walk",4]
            ]
          }
        }
      }
    },
    "ranger": {
      "skills": [
        ["Snipe","Scharfschuss","a",1,"ICON_RA_SKILL_001"],
        ["Snare Shot","Schlingenpfeil","a",1,"ICON_RA_SKILL_013"],
        ["Tempest Shot","Schnellschuss","a",1,"ICON_RA_SKILL_034"],
        ["Marking Shot","Markierungsschuss","a",3,"ICON_RA_SKILL_031"],
        ["Drill Dart","Bohrpfeil","a",4,"ICON_RA_SKILL_005"],
        ["Arrow Scattershot","Pfeilhagel","a",5,"ICON_RA_SKILL_033"],
        ["Gale Arrow","Orkanpfeil","a",7,"ICON_RA_SKILL_011"],
        ["Explosion Trap","Explosionsfalle","a",8,"ICON_RA_SKILL_017"],
        ["Burst Arrow","Sprengpfeil","a",10,"ICON_RA_SKILL_008"],
        ["Suppressing Arrow","Unterdrückungspfeil","a",12,"ICON_RA_SKILL_007"],
        ["Deadshot","Zielpfeil","a",14,"ICON_RA_SKILL_002"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Vigilant Eye","Achtsames Auge","p",1,"ICON_RA_SKILL_Passive_004"],
        ["Concentrated Fire","Fokussiertes Feuer","p",6,"ICON_RA_SKILL_Passive_003"],
        ["Wind Vigor","Elan des Windes","p",9,"ICON_RA_SKILL_Passive_006"],
        ["Focused Eye","Fokussiertes Auge","p",11,"ICON_RA_SKILL_Passive_001"],
        ["Hunter's Resolve","Entschlossenheit des Jägers","p",13,"ICON_RA_SKILL_Passive_011"],
        ["Unyielding Resolve","Entschlossenheit des Widerstands","p",15,"ICON_RA_SKILL_Passive_012"],
        ["Rooting Eye","Fesselndes Auge","p",17,"ICON_RA_SKILL_Passive_008"],
        ["Melee Fire","Nahschuss","p",21,"ICON_RA_SKILL_Passive_013"],
        ["Revitalization Contract","Pakt der Revitalisierung","p",23,"ICON_AS_SKILL_Passive_009"],
        ["Hunter's Soul","Jägerseele","p",25,"ICON_RA_SKILL_Passive_007"],
        ["Griffon Arrow","Greifenpfeil","s",22,"ICON_RA_SKILL_006"],
        ["Ambush Kick","Überraschungstritt","s",22,"ICON_RA_SKILL_012"],
        ["Illusory Arrow","Illusionspfeil","s",22,"ICON_RA_SKILL_015"],
        ["Sealing Arrow","Siegelpfeil","s",22,"ICON_RA_SKILL_016"],
        ["Ensnaring Trap","Fesselfalle","s",22,"ICON_RA_SKILL_018"],
        ["Stealth","Tarnung","s",22,"ICON_RA_SKILL_019"],
        ["Bow of Blessing","Segensbogen","s",22,"ICON_RA_SKILL_030"],
        ["Arrow Storm","Pfeilsturm","s",22,"ICON_RA_SKILL_026"],
        ["Vaizel's Authority","Vaizels Hoheit","s",22,"ICON_RA_SKILL_022"],
        ["Mother Nature's Breath","Atem der Natur","s",22,"ICON_RA_SKILL_035"],
        ["Explosive Arrow","Explosionspfeil","s",22,"ICON_RA_SKILL_023"],
        ["Supporting Fire","Unterstützungsfeuer","s",22,"ICON_RA_SKILL_038"],
        ["Assault Smite","Sturmwucht","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 151,
        "stand": "2026-10-03",
        "skills": {
          "Deadshot": [99,13.3],
          "Snipe": [99,13.7],
          "Drill Dart": [99,13.4],
          "Marking Shot": [99,12.2],
          "Gale Arrow": [99,13.3],
          "Tempest Shot": [99,13.7],
          "Burst Arrow": [99,13.2],
          "Snare Shot": [96,11.8],
          "Explosion Trap": [94,8.4],
          "Suppressing Arrow": [83,8.8],
          "Arrow Scattershot": [75,9.5],
          "Vigilant Eye": [99,10.5],
          "Concentrated Fire": [99,12.3],
          "Wind Vigor": [99,9.9],
          "Focused Eye": [99,14],
          "Hunter's Resolve": [99,13.8],
          "Unyielding Resolve": [99,7.3],
          "Rooting Eye": [99,11.7],
          "Melee Fire": [99,11.4],
          "Revitalization Contract": [99,8.7],
          "Hunter's Soul": [99,13.5]
        },
        "stigmen": {
          "Vaizel's Authority": [93,8.7],
          "Bow of Blessing": [87,7.2],
          "Supporting Fire": [75,7.2],
          "Griffon Arrow": [60,5.5],
          "Explosive Arrow": [37,5],
          "Arrow Storm": [26,3.1],
          "Sealing Arrow": [2,3.3],
          "Stealth": [2,4],
          "Mother Nature's Breath": [2,0],
          "Ambush Kick": [1.3,2.5]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Deadshot",7,2],
              ["Snipe",7,3],
              ["Gale Arrow",7,2],
              ["Tempest Shot",7,3],
              ["Marking Shot",7,1],
              ["Drill Dart",7,2],
              ["Burst Arrow",7,2],
              ["Snare Shot",7,1],
              ["Explosion Trap",7,1],
              ["Suppressing Arrow",7,2],
              ["Arrow Scattershot",7,3],
              ["Vigilant Eye",7,3],
              ["Unyielding Resolve",7,0],
              ["Concentrated Fire",7,2],
              ["Rooting Eye",7,2],
              ["Wind Vigor",7,2],
              ["Melee Fire",7,3],
              ["Focused Eye",7,3],
              ["Revitalization Contract",7,2],
              ["Hunter's Resolve",7,3],
              ["Hunter's Soul",10,0]
            ],
            "stigmen": [
              ["Vaizel's Authority",5],
              ["Bow of Blessing",6],
              ["Supporting Fire",7],
              ["Griffon Arrow",6]
            ]
          },
          "leveling": {
            "skills": [
              ["Snipe",10,0],
              ["Tempest Shot",10,0],
              ["Marking Shot",10,0],
              ["Drill Dart",10,0],
              ["Gale Arrow",10,0],
              ["Burst Arrow",10,0],
              ["Deadshot",10,0],
              ["Focused Eye",10,0],
              ["Hunter's Resolve",10,0],
              ["Snare Shot",7,0],
              ["Concentrated Fire",5,0]
            ],
            "stigmen": [
              ["Vaizel's Authority",8],
              ["Bow of Blessing",7],
              ["Supporting Fire",5],
              ["Griffon Arrow",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Snipe",10,0],
              ["Tempest Shot",10,0],
              ["Snare Shot",10,0],
              ["Marking Shot",10,0],
              ["Drill Dart",10,0],
              ["Gale Arrow",10,0],
              ["Burst Arrow",10,0],
              ["Suppressing Arrow",10,0],
              ["Deadshot",10,0],
              ["Focused Eye",7,0],
              ["Wind Vigor",5,0]
            ],
            "stigmen": [
              ["Vaizel's Authority",8],
              ["Bow of Blessing",7],
              ["Arrow Storm",5],
              ["Explosive Arrow",4]
            ]
          }
        }
      }
    },
    "sorcerer": {
      "skills": [
        ["Firestorm","Flammenschlag","a",1,"ICON_SO_SKILL_004"],
        ["Ice Chain","Eiskette","a",1,"ICON_SO_SKILL_009"],
        ["Flame Arrow","Flammenpfeil","a",1,"ICON_SO_SKILL_020"],
        ["Bittercold Wind","Bitterkalter Wind","a",3,"ICON_SO_SKILL_025"],
        ["Blaze","Flammenexplosion","a",4,"ICON_SO_SKILL_005"],
        ["Flame Scattershot","Flammenfeuer","a",5,"ICON_SO_SKILL_001"],
        ["Frost","Einfrieren","a",7,"ICON_SO_SKILL_015"],
        ["Winter's Shackles","Winterbann","a",8,"ICON_SO_SKILL_011"],
        ["Frost Burst","Eisexplosion","a",10,"ICON_SO_SKILL_022"],
        ["Wish of Concentration","Andacht der Konzentration","a",12,"ICON_SO_SKILL_028"],
        ["Hellfire","Höllenflamme","a",14,"ICON_SO_SKILL_006"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Fire Mark","Feuerzeichen","p",1,"ICON_SO_SKILL_Passive_002"],
        ["Robe of Earth","Robe der Erde","p",6,"ICON_SO_SKILL_Passive_006"],
        ["Cold Snap","Beschwörung der Kälte","p",9,"ICON_SO_SKILL_Passive_003"],
        ["Robe of Flame","Robe der Flamme","p",11,"ICON_SO_SKILL_Passive_004"],
        ["Absorb Essence","Essenzabsorption","p",13,"ICON_SO_SKILL_Passive_001"],
        ["Grace of Resistance","Gnade des Widerstands","p",15,"ICON_SO_SKILL_038"],
        ["Robe of Cold","Robe der Kälte","p",17,"ICON_SO_SKILL_Passive_005"],
        ["Grace of Enhancement","Gnade der Verstärkung","p",21,"ICON_SO_SKILL_Passive_007"],
        ["Revitalization Contract","Pakt der Revitalisierung","p",23,"ICON_AS_SKILL_Passive_009"],
        ["Vitality Evaporation","Entzug der Lebensenergie","p",25,"ICON_SO_SKILL_Passive_008"],
        ["Glacial Smite","Gletscherwucht","s",22,"ICON_SO_SKILL_012"],
        ["Soul Freeze","Seelenfrost","s",22,"ICON_SO_SKILL_013"],
        ["Curse: Tree","Fluch: Baum","s",22,"ICON_SO_SKILL_014"],
        ["Steel Barrier","Stahlbarriere","s",22,"ICON_SO_SKILL_016"],
        ["Cold Storm","Kältesturm","s",22,"ICON_SO_SKILL_019"],
        ["Arctic Armor","Arktische Rüstung","s",22,"ICON_SO_SKILL_021"],
        ["Lumiel's Space","Lumiels Raum","s",22,"ICON_SO_SKILL_027"],
        ["Delayed Explosion","Verzögerte Explosion","s",22,"ICON_SO_SKILL_032"],
        ["Divine Burst","Göttliche Explosion","s",22,"ICON_SO_SKILL_036"],
        ["Fire Wall","Flammenbarriere","s",22,"ICON_SO_SKILL_039"],
        ["Element Enhancement","Elementarverstärkung","s",22,"ICON_SO_SKILL_040"],
        ["Hibernation","Winterschlaf","s",22,"ICON_SO_SKILL_041"],
        ["Assault Bombardment","Sturmbombardement","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 150,
        "stand": "2026-10-03",
        "skills": {
          "Firestorm": [100,13.7],
          "Blaze": [100,13.7],
          "Hellfire": [100,13.7],
          "Flame Arrow": [100,13.8],
          "Bittercold Wind": [100,13.1],
          "Wish of Concentration": [100,13.3],
          "Flame Scattershot": [98,10.6],
          "Ice Chain": [98,11.2],
          "Winter's Shackles": [98,12.4],
          "Frost Burst": [97,11.9],
          "Frost": [96,10.5],
          "Fire Mark": [100,12.9],
          "Robe of Earth": [100,12.3],
          "Cold Snap": [100,10.7],
          "Robe of Flame": [100,14.1],
          "Robe of Cold": [100,10.3],
          "Absorb Essence": [100,8.5],
          "Grace of Resistance": [100,6],
          "Grace of Enhancement": [100,12.5],
          "Revitalization Contract": [100,8.4],
          "Vitality Evaporation": [100,12.5]
        },
        "stigmen": {
          "Element Enhancement": [93,9.9],
          "Delayed Explosion": [83,6.2],
          "Fire Wall": [76,6],
          "Cold Storm": [43,4.2],
          "Steel Barrier": [35,4.6],
          "Divine Burst": [34,3.1],
          "Glacial Smite": [18,5.1],
          "Arctic Armor": [9.3,4.1],
          "Soul Freeze": [7.3,1.5],
          "Hibernation": [5.3,3.3]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Hellfire",7,3],
              ["Flame Arrow",7,3],
              ["Firestorm",7,3],
              ["Bittercold Wind",7,2],
              ["Blaze",7,3],
              ["Wish of Concentration",7,2],
              ["Flame Scattershot",7,1],
              ["Ice Chain",7,1],
              ["Winter's Shackles",7,1],
              ["Frost Burst",7,2],
              ["Frost",7,1],
              ["Fire Mark",7,2],
              ["Grace of Resistance",6,0],
              ["Robe of Earth",7,2],
              ["Robe of Cold",7,2],
              ["Cold Snap",7,2],
              ["Grace of Enhancement",8,1],
              ["Robe of Flame",7,3],
              ["Revitalization Contract",8,0],
              ["Absorb Essence",7,1],
              ["Vitality Evaporation",9,0]
            ],
            "stigmen": [
              ["Element Enhancement",8],
              ["Delayed Explosion",6],
              ["Fire Wall",6],
              ["Cold Storm",4]
            ]
          },
          "leveling": {
            "skills": [
              ["Flame Arrow",10,0],
              ["Ice Chain",10,0],
              ["Firestorm",10,0],
              ["Bittercold Wind",10,0],
              ["Blaze",10,0],
              ["Winter's Shackles",10,0],
              ["Hellfire",10,0],
              ["Fire Mark",10,0],
              ["Robe of Flame",10,0],
              ["Wish of Concentration",7,0],
              ["Frost",5,0]
            ],
            "stigmen": [
              ["Element Enhancement",8],
              ["Delayed Explosion",7],
              ["Fire Wall",5],
              ["Cold Storm",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Flame Arrow",10,0],
              ["Ice Chain",10,0],
              ["Firestorm",10,0],
              ["Bittercold Wind",10,0],
              ["Blaze",10,0],
              ["Frost",10,0],
              ["Winter's Shackles",10,0],
              ["Frost Burst",10,0],
              ["Hellfire",10,0],
              ["Wish of Concentration",7,0],
              ["Robe of Cold",5,0]
            ],
            "stigmen": [
              ["Element Enhancement",8],
              ["Steel Barrier",7],
              ["Delayed Explosion",5],
              ["Curse: Tree",4]
            ]
          }
        }
      }
    },
    "spiritmaster": {
      "skills": [
        ["Cold Shock","Kälteschock","a",1,"ICON_EL_SKILL_001"],
        ["Combustion","Einäscherung","a",1,"ICON_EL_SKILL_004"],
        ["Summon: Fire Spirit","Beschwörung: Feuergeist","a",1,"ICON_EL_SKILL_010"],
        ["Summon: Water Spirit","Beschwörung: Wassergeist","a",3,"ICON_EL_SKILL_011"],
        ["Jointstrike: Curse","Koordinationsangriff: Fluch","a",4,"ICON_EL_SKILL_014"],
        ["Rapid Scattershot","Schnellfeuer","a",5,"ICON_EL_SKILL_034"],
        ["Summon: Earth Spirit","Beschwörung: Erdgeist","a",7,"ICON_EL_SKILL_013"],
        ["Dimensional Control","Raumbeherrschung","a",8,"ICON_EL_SKILL_033"],
        ["Summon: Wind Spirit","Beschwörung: Windgeist","a",10,"ICON_EL_SKILL_012"],
        ["Soul's Cry","Seelenschrei","a",12,"ICON_EL_SKILL_007"],
        ["Elemental Fusion","Elementarfusion","a",14,"ICON_EL_SKILL_030"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Spirit Strike","Geisterschlag","p",1,"ICON_EL_SKILL_Passive_004"],
        ["Spirit Protection","Naturgeistschutz","p",6,"ICON_EL_SKILL_Passive_002"],
        ["Spirit's Descent","Herabkunft des Naturgeists","p",9,"ICON_EL_SKILL_Passive_003"],
        ["Corrode","Erosion","p",11,"ICON_EL_SKILL_Passive_012"],
        ["Spirit Revitalization","Revitalisierung des Naturgeists","p",13,"ICON_EL_SKILL_Passive_011"],
        ["Mental Focus","Mentale Konzentration","p",15,"ICON_EL_SKILL_Passive_006"],
        ["Consecutive Countercurrent","Kontinuierlicher Rückfluss","p",17,"ICON_EL_SKILL_Passive_013"],
        ["Spirit Communion","Geisterbindung","p",21,"ICON_EL_SKILL_Passive_007"],
        ["Revitalization Contract","Pakt der Revitalisierung","p",23,"ICON_AS_SKILL_Passive_009"],
        ["Element Unification","Elementarvereinigung","p",25,"ICON_EL_SKILL_Passive_008"],
        ["Siphon","Sog","s",22,"ICON_EL_SKILL_006"],
        ["Cry of Terror","Furchtschrei","s",22,"ICON_EL_SKILL_008"],
        ["Jointstrike: Corrode","Koordinationsangriff: Korrosion","s",22,"ICON_EL_SKILL_015"],
        ["Command: Proxy","Befehl: Stellvertretung","s",22,"ICON_EL_SKILL_017"],
        ["Enhance: Spirit's Benediction","Verstärkung: Gnade des Naturgeists","s",22,"ICON_EL_SKILL_019"],
        ["Cursed Cloud","Fluchwolke","s",22,"ICON_EL_SKILL_022"],
        ["Seize Magic","Magieraub","s",22,"ICON_EL_SKILL_023"],
        ["Jointstrike: Destructive Attack","Koordinationsangriff: Offensive der Vernichtung","s",22,"ICON_EL_SKILL_024"],
        ["Summon: Ancient Spirit","Beschwörung: Uralter Naturgeist","s",22,"ICON_EL_SKILL_025"],
        ["Magic Block","Magieblockade","s",22,"ICON_EL_SKILL_026"],
        ["Kaisinel's Power","Kaisinels Hoheit","s",22,"ICON_EL_SKILL_036"],
        ["Flame Blessing","Flammensegen","s",22,"ICON_EL_SKILL_037"],
        ["Assault Terror","Schreckensüberfall","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 151,
        "stand": "2026-10-03",
        "skills": {
          "Cold Shock": [99,13.5],
          "Summon: Fire Spirit": [99,13.4],
          "Jointstrike: Curse": [99,13.2],
          "Elemental Fusion": [99,13.4],
          "Dimensional Control": [99,13.3],
          "Combustion": [99,13.7],
          "Summon: Water Spirit": [98,12.8],
          "Summon: Earth Spirit": [96,11.8],
          "Rapid Scattershot": [89,9.6],
          "Soul's Cry": [85,7.3],
          "Summon: Wind Spirit": [83,9.4],
          "Spirit Strike": [99,14.4],
          "Spirit Protection": [99,11.8],
          "Spirit's Descent": [99,12.4],
          "Corrode": [99,12.7],
          "Spirit Revitalization": [99,11.3],
          "Mental Focus": [99,13.5],
          "Spirit Communion": [99,9],
          "Element Unification": [99,13.2],
          "Revitalization Contract": [99,7.5],
          "Consecutive Countercurrent": [99,11.3]
        },
        "stigmen": {
          "Summon: Ancient Spirit": [96,9.8],
          "Enhance: Spirit's Benediction": [95,6.9],
          "Jointstrike: Corrode": [83,5.2],
          "Flame Blessing": [74,5.1],
          "Jointstrike: Destructive Attack": [30,3.6],
          "Siphon": [14,4],
          "Command: Proxy": [4.6,1.9],
          "Cry of Terror": [2,3.3],
          "Seize Magic": [1.3,5.5],
          "Magic Block": [0.7,8]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Cold Shock",7,2],
              ["Elemental Fusion",7,2],
              ["Summon: Fire Spirit",7,2],
              ["Dimensional Control",7,2],
              ["Jointstrike: Curse",7,2],
              ["Combustion",7,3],
              ["Summon: Water Spirit",7,2],
              ["Summon: Earth Spirit",7,1],
              ["Rapid Scattershot",7,3],
              ["Soul's Cry",7,0],
              ["Summon: Wind Spirit",7,0],
              ["Spirit Strike",7,3],
              ["Mental Focus",7,3],
              ["Spirit Protection",7,3],
              ["Consecutive Countercurrent",9,0],
              ["Spirit's Descent",7,2],
              ["Spirit Communion",7,1],
              ["Corrode",7,3],
              ["Revitalization Contract",5,0],
              ["Spirit Revitalization",7,0],
              ["Element Unification",9,0]
            ],
            "stigmen": [
              ["Summon: Ancient Spirit",7],
              ["Enhance: Spirit's Benediction",7],
              ["Jointstrike: Corrode",5],
              ["Flame Blessing",5]
            ]
          },
          "leveling": {
            "skills": [
              ["Cold Shock",10,0],
              ["Combustion",10,0],
              ["Summon: Fire Spirit",10,0],
              ["Summon: Water Spirit",10,0],
              ["Jointstrike: Curse",10,0],
              ["Dimensional Control",10,0],
              ["Elemental Fusion",10,0],
              ["Spirit Strike",10,0],
              ["Corrode",10,0],
              ["Summon: Earth Spirit",7,0],
              ["Spirit's Descent",5,0]
            ],
            "stigmen": [
              ["Summon: Ancient Spirit",8],
              ["Enhance: Spirit's Benediction",7],
              ["Jointstrike: Corrode",5],
              ["Flame Blessing",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Cold Shock",10,0],
              ["Combustion",10,0],
              ["Summon: Fire Spirit",10,0],
              ["Summon: Water Spirit",10,0],
              ["Jointstrike: Curse",10,0],
              ["Dimensional Control",10,0],
              ["Soul's Cry",10,0],
              ["Elemental Fusion",10,0],
              ["Spirit Strike",10,0],
              ["Summon: Wind Spirit",7,0],
              ["Spirit Protection",5,0]
            ],
            "stigmen": [
              ["Summon: Ancient Spirit",8],
              ["Enhance: Spirit's Benediction",7],
              ["Jointstrike: Corrode",5],
              ["Cry of Terror",4]
            ]
          }
        }
      }
    },
    "cleric": {
      "skills": [
        ["Earth's Retribution","Rache der Erde","a",1,"ICON_CL_SKILL_001"],
        ["Judgment Thunder","Blitz des Urteils","a",1,"ICON_CL_SKILL_004"],
        ["Debilitating Mark","Mal der Schwächung","a",1,"ICON_CL_SKILL_008"],
        ["Divine Aura","Heilige Aura","a",3,"ICON_CL_SKILL_015"],
        ["Chain of Torment","Kette des Schmerzes","a",4,"ICON_CL_SKILL_007"],
        ["Lightning Strike Scattershot","Blitzfeuer","a",5,"ICON_CL_SKILL_037"],
        ["Light of Regeneration","Licht der Regeneration","a",7,"ICON_CL_SKILL_009"],
        ["Condemnation","Verdammnis","a",8,"ICON_CL_SKILL_035"],
        ["Healing Light","Licht der Heilung","a",10,"ICON_CL_SKILL_010"],
        ["Radiant Recovery","Glanz der Genesung","a",12,"ICON_CL_SKILL_012"],
        ["Bolt","Donnerschlag","a",14,"ICON_CL_SKILL_006"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Warm Benediction","Warme Gnade","p",1,"ICON_CL_SKILL_Passive_001"],
        ["Empyrean Lords' Benediction","Gnade des Gebieters","p",6,"ICON_CL_SKILL_Passive_002"],
        ["Empyrean Lord's Grace","Segen des Gebieters","p",9,"ICON_CL_SKILL_Passive_012"],
        ["Healing Enhancement","Heilungsverstärkung","p",11,"ICON_CL_SKILL_Passive_003"],
        ["Immortal Veil","Schleier der Unsterblichkeit","p",13,"ICON_CL_SKILL_Passive_011"],
        ["Heal Block","Regenerationsblockade","p",15,"ICON_CL_SKILL_Passive_005"],
        ["Prayer of Concentration","Gebet der Konzentration","p",17,"ICON_CL_SKILL_Passive_006"],
        ["Earth's Grace","Segen der Erde","p",21,"ICON_CL_SKILL_Passive_008"],
        ["Survival Willpower","Überlebenswille","p",23,"ICON_GL_SKILL_Passive_009"],
        ["Radiant Benediction","Strahlende Gnade","p",25,"ICON_CL_SKILL_Passive_007"],
        ["Benevolence","Hoheit des Lebens","s",22,"ICON_CL_SKILL_047"],
        ["Root","Bann","s",22,"ICON_CL_SKILL_019"],
        ["Salvation","Erlösung","s",22,"ICON_CL_SKILL_026"],
        ["Power Burst","Hoheitsexplosion","s",22,"ICON_CL_SKILL_027"],
        ["Absolution","Absolution","s",22,"ICON_CL_SKILL_028"],
        ["Voice of Doom","Stimme des Verderbens","s",22,"ICON_CL_SKILL_029"],
        ["Summon Resurrection","Wiederbelebung durch Beschwörung","s",22,"ICON_CL_SKILL_039"],
        ["Earth Punishment","Strafe der Erde","s",22,"ICON_CL_SKILL_040"],
        ["Light of Protection","Licht des Schutzes","s",22,"ICON_CL_SKILL_041"],
        ["Yustiel's Power","Yustiels Hoheit","s",22,"ICON_CL_SKILL_042"],
        ["Prayer of Amplification","Gebet der Verstärkung","s",22,"ICON_CL_SKILL_044"],
        ["Noble Aura","Edle Aura","s",22,"ICON_CL_SKILL_046"],
        ["Assault Mark","Mal des Angriffs","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 151,
        "stand": "2026-10-03",
        "skills": {
          "Earth's Retribution": [99,13.1],
          "Judgment Thunder": [99,13.4],
          "Chain of Torment": [99,13.1],
          "Light of Regeneration": [99,13.1],
          "Healing Light": [99,13.1],
          "Radiant Recovery": [99,13],
          "Divine Aura": [99,12.6],
          "Condemnation": [99,13.5],
          "Bolt": [97,12.1],
          "Debilitating Mark": [97,13],
          "Lightning Strike Scattershot": [90,10.5],
          "Warm Benediction": [99,12.6],
          "Empyrean Lords' Benediction": [99,7.4],
          "Empyrean Lord's Grace": [99,13.5],
          "Healing Enhancement": [99,12.7],
          "Immortal Veil": [99,11.8],
          "Heal Block": [99,4.9],
          "Prayer of Concentration": [99,9],
          "Earth's Grace": [99,12.9],
          "Survival Willpower": [99,9.3],
          "Radiant Benediction": [99,10.9]
        },
        "stigmen": {
          "Light of Protection": [87,9.3],
          "Noble Aura": [79,5.5],
          "Earth Punishment": [65,7.2],
          "Summon Resurrection": [64,3],
          "Prayer of Amplification": [50,5.3],
          "Absolution": [23,5],
          "Power Burst": [20,2.5],
          "Salvation": [16,2.2],
          "Benevolence": [13,4.6],
          "Yustiel's Power": [9.3,3.6]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Earth's Retribution",7,2],
              ["Judgment Thunder",7,2],
              ["Light of Regeneration",7,2],
              ["Condemnation",7,2],
              ["Healing Light",7,2],
              ["Divine Aura",7,2],
              ["Chain of Torment",7,2],
              ["Radiant Recovery",7,3],
              ["Bolt",7,2],
              ["Debilitating Mark",7,2],
              ["Lightning Strike Scattershot",7,2],
              ["Warm Benediction",7,3],
              ["Heal Block",5,0],
              ["Empyrean Lords' Benediction",6,0],
              ["Prayer of Concentration",7,0],
              ["Empyrean Lord's Grace",7,3],
              ["Earth's Grace",10,0],
              ["Healing Enhancement",7,3],
              ["Survival Willpower",7,0],
              ["Immortal Veil",8,2],
              ["Radiant Benediction",8,0]
            ],
            "stigmen": [
              ["Light of Protection",7],
              ["Noble Aura",6],
              ["Earth Punishment",7],
              ["Summon Resurrection",3]
            ]
          },
          "leveling": {
            "skills": [
              ["Earth's Retribution",10,0],
              ["Judgment Thunder",10,0],
              ["Chain of Torment",10,0],
              ["Condemnation",10,0],
              ["Divine Aura",10,0],
              ["Healing Light",10,0],
              ["Light of Regeneration",10,0],
              ["Empyrean Lord's Grace",10,0],
              ["Earth's Grace",10,0],
              ["Debilitating Mark",7,0],
              ["Radiant Recovery",5,0]
            ],
            "stigmen": [
              ["Light of Protection",8],
              ["Noble Aura",7],
              ["Earth Punishment",5],
              ["Summon Resurrection",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Earth's Retribution",10,0],
              ["Judgment Thunder",10,0],
              ["Debilitating Mark",10,0],
              ["Chain of Torment",10,0],
              ["Condemnation",10,0],
              ["Healing Light",10,0],
              ["Radiant Recovery",10,0],
              ["Light of Regeneration",10,0],
              ["Immortal Veil",10,0],
              ["Healing Enhancement",7,0],
              ["Divine Aura",5,0]
            ],
            "stigmen": [
              ["Light of Protection",8],
              ["Absolution",7],
              ["Salvation",5],
              ["Earth Punishment",4]
            ]
          }
        }
      }
    },
    "chanter": {
      "skills": [
        ["Onslaught","Zerschmetterungsschlag","a",1,"ICON_CH_SKILL_001"],
        ["Incandescent Blow","Gleißschlag","a",1,"ICON_CH_SKILL_004"],
        ["Rushing Smash","Sturmschlag","a",1,"ICON_CH_SKILL_009"],
        ["Impactful Crush","Wuchtschlag","a",3,"ICON_CH_SKILL_006"],
        ["Dark Crush","Finsterbruch","a",4,"ICON_CH_SKILL_010"],
        ["Gust Rampage","Sturmraserei","a",5,"ICON_CH_SKILL_030"],
        ["Heat Wave Blow","Hitzewellenschlag","a",7,"ICON_CH_SKILL_015"],
        ["Recuperation","Zauber der Genesung","a",8,"ICON_CH_SKILL_013"],
        ["Tremor Crush","Erschütterungsschlag","a",10,"ICON_CH_SKILL_021"],
        ["Wave Blow","Wellenschlag","a",12,"ICON_CH_SKILL_008"],
        ["Spinning Strike","Wirbelschlag","a",14,"ICON_CH_SKILL_029"],
        ["Defiance","Schockaufhebung","a",16,"ICON_CO_SKILL_002"],
        ["Blessing of Life","Segen des Lebens","p",1,"ICON_CH_SKILL_Passive_012"],
        ["Crossguard","Kreuzverteidigung","p",6,"ICON_CH_SKILL_Passive_002"],
        ["Protection Circle","Schutzformation","p",9,"ICON_CH_SKILL_Passive_001"],
        ["Inspiring Spell","Zauber der Eingebung","p",11,"ICON_CH_SKILL_Passive_011"],
        ["Attack Preparation","Angriffsvorbereitung","p",13,"ICON_GL_SKILL_Passive_005"],
        ["Impact Hit","Schocktreffer","p",15,"ICON_GL_SKILL_Passive_006"],
        ["Raging Spell","Zauber des Furors","p",17,"ICON_CH_SKILL_Passive_007"],
        ["Earth's Promise","Gelübde der Erde","p",21,"ICON_CH_SKILL_Passive_010"],
        ["Survival Willpower","Überlebenswille","p",23,"ICON_GL_SKILL_Passive_009"],
        ["Wind's Promise","Gelübde des Windes","p",25,"ICON_CH_SKILL_Passive_008"],
        ["Fracturing Blow","Schmetterschlag","s",22,"ICON_CH_SKILL_043"],
        ["Focused Defense","Fokussierte Verteidigung","s",22,"ICON_CH_SKILL_014"],
        ["Sprint Mantra","Invokation des Sprints","s",22,"ICON_CH_SKILL_016"],
        ["Healing Touch","Heilende Berührung","s",22,"ICON_CH_SKILL_017"],
        ["Undefeated Mantra","Invokation der Unbesiegbarkeit","s",22,"ICON_CH_SKILL_019"],
        ["Obliterate","Flammenauslöschung","s",22,"ICON_CH_SKILL_022"],
        ["Ensnaring Mark","Mal der Fesselung","s",22,"ICON_CH_SKILL_023"],
        ["Impeding Authority","Hoheit der Blockade","s",22,"ICON_CH_SKILL_024"],
        ["Power of the Storm","Hoheit des Sturmwinds","s",22,"ICON_CH_SKILL_025"],
        ["Marchutan's Wrath","Marchutans Zorn","s",22,"ICON_CH_SKILL_033"],
        ["Guardian Blessing","Segen des Schutzes","s",22,"ICON_CH_SKILL_042"],
        ["Barrier Spell","Barriere-Zauber","s",22,"ICON_CH_SKILL_044"],
        ["Assault Shock","Ansturmschock","s",22,"ICON_CO_SKILL_003"]
      ],
      "top": {
        "spieler": 150,
        "stand": "2026-10-03",
        "skills": {
          "Onslaught": [99,13.8],
          "Incandescent Blow": [99,13.5],
          "Impactful Crush": [99,12.6],
          "Rushing Smash": [99,12.5],
          "Dark Crush": [99,13.9],
          "Recuperation": [99,13.2],
          "Tremor Crush": [99,10.3],
          "Spinning Strike": [99,13.3],
          "Wave Blow": [94,8.6],
          "Heat Wave Blow": [93,10.9],
          "Gust Rampage": [88,9.8],
          "Blessing of Life": [99,13.2],
          "Crossguard": [99,7.2],
          "Protection Circle": [99,11.2],
          "Inspiring Spell": [99,13.1],
          "Attack Preparation": [99,14.2],
          "Impact Hit": [99,13.2],
          "Raging Spell": [99,9.7],
          "Earth's Promise": [99,12.6],
          "Survival Willpower": [99,9.8],
          "Wind's Promise": [99,13.6]
        },
        "stigmen": {
          "Undefeated Mantra": [99,12.4],
          "Sprint Mantra": [95,5.1],
          "Power of the Storm": [65,4.4],
          "Marchutan's Wrath": [47,3.5],
          "Focused Defense": [37,3.3],
          "Obliterate": [29,2.2],
          "Healing Touch": [13,3.9],
          "Fracturing Blow": [11,2.8],
          "Impeding Authority": [9.3,4.5],
          "Guardian Blessing": [7.3,2.7]
        },
        "builds": {
          "endgame": {
            "skills": [
              ["Onslaught",7,3],
              ["Spinning Strike",7,2],
              ["Incandescent Blow",7,3],
              ["Rushing Smash",7,1],
              ["Recuperation",7,2],
              ["Impactful Crush",7,2],
              ["Tremor Crush",7,0],
              ["Dark Crush",7,3],
              ["Wave Blow",7,1],
              ["Heat Wave Blow",7,2],
              ["Gust Rampage",7,3],
              ["Blessing of Life",7,2],
              ["Impact Hit",7,2],
              ["Crossguard",7,0],
              ["Raging Spell",7,1],
              ["Protection Circle",7,2],
              ["Earth's Promise",7,3],
              ["Inspiring Spell",7,3],
              ["Survival Willpower",7,0],
              ["Attack Preparation",7,3],
              ["Wind's Promise",10,0]
            ],
            "stigmen": [
              ["Undefeated Mantra",10],
              ["Sprint Mantra",5],
              ["Power of the Storm",4],
              ["Marchutan's Wrath",3]
            ]
          },
          "leveling": {
            "skills": [
              ["Onslaught",10,0],
              ["Incandescent Blow",10,0],
              ["Rushing Smash",10,0],
              ["Impactful Crush",10,0],
              ["Dark Crush",10,0],
              ["Spinning Strike",10,0],
              ["Recuperation",10,0],
              ["Blessing of Life",10,0],
              ["Attack Preparation",10,0],
              ["Tremor Crush",7,0],
              ["Inspiring Spell",5,0]
            ],
            "stigmen": [
              ["Undefeated Mantra",8],
              ["Sprint Mantra",7],
              ["Power of the Storm",5],
              ["Marchutan's Wrath",4]
            ]
          },
          "pvp": {
            "skills": [
              ["Onslaught",10,0],
              ["Incandescent Blow",10,0],
              ["Rushing Smash",10,0],
              ["Impactful Crush",10,0],
              ["Dark Crush",10,0],
              ["Tremor Crush",10,0],
              ["Wave Blow",10,0],
              ["Spinning Strike",10,0],
              ["Recuperation",10,0],
              ["Blessing of Life",7,0],
              ["Attack Preparation",5,0]
            ],
            "stigmen": [
              ["Undefeated Mantra",8],
              ["Sprint Mantra",7],
              ["Power of the Storm",5],
              ["Obliterate",4]
            ]
          }
        }
      }
    }
  }
};
