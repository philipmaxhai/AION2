/*
 * Daevanion-Bretter aller Klassen: Raster (15×15), Knoten, Werte und Skill-Knoten je Klasse.
 * Quelle: Brett-Daten aus dem GameWith-Daevanion-Planer (aus den offiziellen AION2-Charakterseiten, Global),
 * für den Beschwörer Knoten für Knoten gegen die NCSOFT-Armory geprüft. Ariel (seit 21.10.2026, keine Skill-Knoten, eigene
 * Ariel-Punkte) aus dem AION2-Vault-Rechner (Client-Daten von questlog.gg), dort zuerst alle übrigen Bretter gegen GameWith
 * geprüft. Stand 26.10.2026. Neu erzeugen mit tools/daevanion_daten.py.
 * Bretter: art "skill" (Daevanion-Punkte), "pve" (Ariel-Punkte), "pvp" (Azphel-Punkte).
 * Knoten: [Zeile, Spalte, Typ (S Start, T Wert, K Skill), Seltenheit (c 1 Punkt, r 2, l 3, u 4), Index in stats oder -1].
 * Die Werte-Knoten sind für alle Klassen gleich; klassen[id].map[Brett] nennt für jeden Skill-Knoten (in Knoten-Reihenfolge) den Index in skills.
 * skills: [englischer Name, deutscher Name, a aktiv / p passiv].
 */
window.DK_DATA.daevanion = {
  "kosten": {
    "c": 1,
    "r": 2,
    "l": 3,
    "u": 4
  },
  "boards": [
    {
      "key": "nezekan",
      "name": "Nezekan",
      "level": 12,
      "punkte": 134,
      "pvp": false,
      "art": "skill",
      "nodes": [[3,3,"T","u",0],[3,4,"T","c",1],[3,5,"T","c",2],[3,7,"K","r",-1],[3,8,"T","c",2],[3,9,"K","l",-1],[3,11,"K","r",-1],[3,12,"T","c",3],[3,13,"T","u",4],[4,3,"T","c",3],[4,5,"K","l",-1],[4,6,"T","c",5],[4,7,"T","c",6],[4,9,"T","c",5],[4,10,"T","c",6],[4,11,"T","c",2],[4,13,"T","c",5],[5,3,"K","r",-1],[5,4,"T","c",6],[5,5,"T","c",7],[5,7,"T","c",3],[5,8,"K","l",-1],[5,9,"T","c",7],[5,11,"K","l",-1],[5,12,"T","c",7],[5,13,"K","r",-1],[6,4,"T","c",7],[6,7,"T","c",2],[6,9,"T","c",6],[6,11,"T","c",1],[6,13,"T","c",6],[7,3,"T","c",5],[7,4,"T","c",1],[7,5,"K","l",-1],[7,6,"T","c",7],[7,7,"T","c",5],[7,8,"T","c",1],[7,9,"T","c",2],[7,10,"K","r",-1],[7,11,"T","c",5],[7,12,"T","c",3],[7,13,"T","c",2],[8,3,"K","l",-1],[8,6,"T","c",6],[8,8,"S","n",-1],[8,10,"T","c",1],[8,13,"K","l",-1],[9,3,"T","c",3],[9,4,"T","c",2],[9,5,"T","c",7],[9,6,"K","r",-1],[9,7,"T","c",3],[9,8,"T","c",6],[9,9,"T","c",7],[9,10,"T","c",5],[9,11,"K","l",-1],[9,12,"T","c",6],[9,13,"T","c",7],[10,3,"T","c",1],[10,5,"T","c",6],[10,7,"T","c",1],[10,9,"T","c",3],[10,12,"T","c",5],[11,3,"K","r",-1],[11,4,"T","c",5],[11,5,"K","l",-1],[11,7,"T","c",5],[11,8,"K","l",-1],[11,9,"T","c",2],[11,11,"T","c",5],[11,12,"T","c",1],[11,13,"K","r",-1],[12,3,"T","c",7],[12,5,"T","c",3],[12,6,"T","c",1],[12,7,"T","c",7],[12,9,"T","c",1],[12,10,"T","c",7],[12,11,"K","l",-1],[12,13,"T","c",2],[13,3,"T","u",4],[13,4,"T","c",2],[13,5,"K","r",-1],[13,7,"K","l",-1],[13,8,"T","c",3],[13,9,"K","r",-1],[13,11,"T","c",3],[13,12,"T","c",6],[13,13,"T","u",0]]
    },
    {
      "key": "zikel",
      "name": "Zikel",
      "level": 20,
      "punkte": 134,
      "pvp": false,
      "art": "skill",
      "nodes": [[3,3,"T","u",8],[3,4,"T","c",3],[3,5,"T","c",5],[3,6,"T","c",2],[3,7,"K","l",-1],[3,8,"T","c",6],[3,9,"K","r",-1],[3,10,"T","c",1],[3,11,"K","l",-1],[3,12,"T","c",6],[3,13,"T","u",9],[4,3,"T","c",1],[4,5,"K","r",-1],[4,7,"T","c",7],[4,10,"T","c",5],[4,13,"T","c",3],[5,3,"K","l",-1],[5,4,"T","c",7],[5,5,"T","c",6],[5,7,"T","c",1],[5,8,"T","c",5],[5,9,"K","l",-1],[5,10,"T","c",2],[5,11,"T","c",5],[5,12,"K","r",-1],[5,13,"T","c",1],[6,3,"T","c",3],[6,5,"T","c",5],[6,6,"T","c",2],[6,7,"K","r",-1],[6,9,"T","c",3],[6,11,"T","c",3],[6,13,"T","c",2],[7,3,"T","c",6],[7,4,"T","c",7],[7,5,"K","l",-1],[7,7,"T","c",3],[7,9,"T","c",5],[7,10,"K","r",-1],[7,11,"T","c",7],[7,12,"T","c",1],[7,13,"K","l",-1],[8,4,"T","c",1],[8,7,"T","c",6],[8,8,"S","n",-1],[8,9,"T","c",1],[8,12,"T","c",6],[9,3,"K","l",-1],[9,4,"T","c",6],[9,5,"T","c",5],[9,6,"K","r",-1],[9,7,"T","c",7],[9,9,"T","c",2],[9,11,"K","l",-1],[9,12,"T","c",5],[9,13,"T","c",1],[10,3,"T","c",3],[10,5,"T","c",2],[10,7,"T","c",2],[10,9,"K","r",-1],[10,10,"T","c",3],[10,11,"T","c",7],[10,13,"T","c",2],[11,3,"T","c",6],[11,4,"K","r",-1],[11,5,"T","c",7],[11,6,"T","c",3],[11,7,"K","l",-1],[11,8,"T","c",7],[11,9,"T","c",6],[11,11,"T","c",1],[11,12,"T","c",5],[11,13,"K","l",-1],[12,3,"T","c",2],[12,6,"T","c",5],[12,9,"T","c",5],[12,11,"K","r",-1],[12,13,"T","c",6],[13,3,"T","u",9],[13,4,"T","c",1],[13,5,"K","l",-1],[13,6,"T","c",6],[13,7,"K","r",-1],[13,8,"T","c",1],[13,9,"K","l",-1],[13,10,"T","c",3],[13,11,"T","c",7],[13,12,"T","c",2],[13,13,"T","u",8]]
    },
    {
      "key": "vaizel",
      "name": "Vaizel",
      "level": 30,
      "punkte": 134,
      "pvp": false,
      "art": "skill",
      "nodes": [[3,3,"T","u",10],[3,4,"T","c",2],[3,5,"K","r",-1],[3,7,"T","c",2],[3,8,"K","l",-1],[3,9,"T","c",1],[3,10,"K","r",-1],[3,11,"T","c",2],[3,12,"T","c",7],[3,13,"T","u",11],[4,3,"T","c",3],[4,5,"T","c",1],[4,6,"T","c",3],[4,7,"T","c",5],[4,9,"T","c",6],[4,11,"T","c",6],[4,13,"T","c",5],[5,3,"T","c",6],[5,4,"K","l",-1],[5,5,"T","c",7],[5,7,"K","l",-1],[5,8,"T","c",3],[5,9,"T","c",5],[5,10,"T","c",7],[5,11,"K","l",-1],[5,12,"T","c",1],[5,13,"K","r",-1],[6,4,"T","c",2],[6,7,"T","c",3],[6,9,"K","r",-1],[6,12,"T","c",2],[7,3,"T","c",1],[7,4,"T","c",5],[7,5,"T","c",6],[7,6,"K","r",-1],[7,7,"T","c",7],[7,8,"T","c",1],[7,9,"T","c",2],[7,10,"T","c",6],[7,11,"K","l",-1],[7,12,"T","c",7],[7,13,"T","c",3],[8,3,"K","l",-1],[8,6,"T","c",5],[8,8,"S","n",-1],[8,10,"T","c",7],[8,13,"K","l",-1],[9,3,"T","c",2],[9,4,"T","c",5],[9,5,"K","l",-1],[9,6,"T","c",1],[9,7,"T","c",3],[9,8,"T","c",6],[9,9,"T","c",5],[9,10,"K","r",-1],[9,11,"T","c",1],[9,12,"T","c",7],[9,13,"T","c",6],[10,4,"T","c",3],[10,7,"K","r",-1],[10,9,"T","c",2],[10,12,"T","c",3],[11,3,"K","r",-1],[11,4,"T","c",6],[11,5,"K","l",-1],[11,6,"T","c",2],[11,7,"T","c",7],[11,8,"T","c",5],[11,9,"K","l",-1],[11,11,"T","c",5],[11,12,"K","l",-1],[11,13,"T","c",1],[12,3,"T","c",7],[12,5,"T","c",1],[12,7,"T","c",1],[12,9,"T","c",7],[12,10,"T","c",2],[12,11,"T","c",6],[12,13,"T","c",2],[13,3,"T","u",11],[13,4,"T","c",5],[13,5,"T","c",3],[13,6,"K","r",-1],[13,7,"T","c",6],[13,8,"K","l",-1],[13,9,"T","c",3],[13,11,"K","r",-1],[13,12,"T","c",3],[13,13,"T","u",10]]
    },
    {
      "key": "triniel",
      "name": "Triniel",
      "level": 40,
      "punkte": 168,
      "pvp": false,
      "art": "skill",
      "nodes": [[2,2,"T","u",12],[2,3,"T","c",1],[2,4,"T","c",3],[2,7,"T","c",1],[2,8,"T","u",13],[2,9,"T","c",6],[2,12,"T","c",6],[2,13,"T","c",7],[2,14,"T","u",12],[3,2,"T","c",5],[3,4,"K","l",-1],[3,5,"T","c",5],[3,6,"T","c",7],[3,7,"K","r",-1],[3,9,"K","r",-1],[3,10,"T","c",5],[3,11,"T","c",3],[3,12,"K","l",-1],[3,14,"T","c",3],[4,2,"T","c",3],[4,4,"T","c",7],[4,7,"T","c",6],[4,8,"T","c",7],[4,9,"T","c",2],[4,12,"T","c",1],[4,14,"T","c",2],[5,2,"K","l",-1],[5,3,"T","c",2],[5,4,"T","c",5],[5,5,"K","r",-1],[5,6,"T","c",2],[5,7,"T","c",1],[5,9,"T","c",6],[5,10,"K","l",-1],[5,11,"T","c",3],[5,12,"T","c",7],[5,13,"T","c",5],[5,14,"K","r",-1],[6,4,"T","c",6],[6,6,"T","c",3],[6,10,"T","c",7],[6,13,"T","c",2],[7,2,"T","c",2],[7,3,"T","c",3],[7,4,"T","c",7],[7,5,"T","c",1],[7,6,"K","l",-1],[7,7,"T","c",5],[7,8,"T","c",6],[7,9,"T","c",2],[7,10,"T","c",5],[7,11,"T","c",3],[7,12,"K","r",-1],[7,13,"T","c",6],[7,14,"T","c",5],[8,2,"K","l",-1],[8,4,"T","c",6],[8,6,"T","c",6],[8,8,"S","n",-1],[8,10,"T","c",1],[8,12,"T","c",1],[8,14,"K","l",-1],[9,2,"T","c",7],[9,3,"T","c",1],[9,4,"K","r",-1],[9,5,"T","c",2],[9,6,"T","c",7],[9,7,"T","c",3],[9,8,"T","c",1],[9,9,"T","c",7],[9,10,"K","l",-1],[9,11,"T","c",6],[9,12,"T","c",5],[9,13,"T","c",2],[9,14,"T","c",3],[10,3,"T","c",3],[10,6,"T","c",5],[10,10,"T","c",2],[10,12,"T","c",1],[11,2,"K","r",-1],[11,3,"T","c",7],[11,4,"T","c",5],[11,5,"T","c",2],[11,6,"K","l",-1],[11,7,"T","c",1],[11,9,"T","c",6],[11,10,"T","c",3],[11,11,"K","r",-1],[11,12,"T","c",7],[11,13,"T","c",3],[11,14,"K","l",-1],[12,2,"T","c",3],[12,4,"T","c",6],[12,7,"T","c",3],[12,8,"T","c",5],[12,9,"T","c",1],[12,12,"T","c",5],[12,14,"T","c",2],[13,2,"T","c",2],[13,4,"K","l",-1],[13,5,"T","c",2],[13,6,"T","c",7],[13,7,"K","r",-1],[13,9,"K","r",-1],[13,10,"T","c",5],[13,11,"T","c",7],[13,12,"K","l",-1],[13,14,"T","c",7],[14,2,"T","u",13],[14,3,"T","c",5],[14,4,"T","c",1],[14,7,"T","c",1],[14,8,"T","u",12],[14,9,"T","c",6],[14,12,"T","c",2],[14,13,"T","c",6],[14,14,"T","u",13]]
    },
    {
      "key": "ariel",
      "name": "Ariel",
      "level": 45,
      "punkte": 232,
      "pvp": false,
      "art": "pve",
      "nodes": [[1,1,"T","u",27],[1,2,"T","c",28],[1,3,"T","r",29],[1,7,"T","c",30],[1,8,"T","u",27],[1,9,"T","c",31],[1,11,"T","r",32],[1,12,"T","c",33],[1,13,"T","c",34],[1,14,"T","c",35],[1,15,"T","u",36],[2,1,"T","c",30],[2,3,"T","c",33],[2,4,"T","c",34],[2,5,"T","c",37],[2,6,"T","l",38],[2,7,"T","c",35],[2,9,"T","r",39],[2,11,"T","c",28],[2,13,"T","l",40],[2,15,"T","c",28],[3,1,"T","c",37],[3,2,"T","l",41],[3,4,"T","r",39],[3,7,"T","c",28],[3,8,"T","c",34],[3,9,"T","c",30],[3,10,"T","c",33],[3,11,"T","c",35],[3,12,"T","c",34],[3,13,"T","c",37],[3,14,"T","c",30],[3,15,"T","r",29],[4,2,"T","c",35],[4,4,"T","c",30],[4,5,"T","c",35],[4,6,"T","c",33],[4,7,"T","r",32],[4,10,"T","l",38],[4,12,"T","r",39],[4,14,"T","c",34],[5,1,"T","r",32],[5,2,"T","c",33],[5,3,"T","c",28],[5,4,"T","l",42],[5,7,"T","c",37],[5,10,"T","c",37],[5,12,"T","c",30],[5,13,"T","c",33],[5,14,"T","l",41],[6,1,"T","c",37],[6,4,"T","c",34],[6,6,"T","l",40],[6,7,"T","c",34],[6,8,"T","c",31],[6,9,"T","r",29],[6,10,"T","c",28],[6,12,"T","c",35],[6,14,"T","c",28],[7,1,"T","c",43],[7,2,"T","r",39],[7,3,"T","c",30],[7,4,"T","r",29],[7,5,"T","c",33],[7,6,"T","c",28],[7,8,"T","c",35],[7,10,"T","c",33],[7,11,"T","l",42],[7,12,"T","c",34],[7,13,"T","c",37],[7,14,"T","r",32],[7,15,"T","c",35],[8,1,"T","u",36],[8,3,"T","c",31],[8,6,"T","c",30],[8,7,"T","c",37],[8,8,"S","n",-1],[8,9,"T","c",37],[8,10,"T","c",30],[8,13,"T","c",43],[8,15,"T","u",36],[9,1,"T","c",35],[9,2,"T","r",32],[9,3,"T","c",37],[9,4,"T","c",34],[9,5,"T","l",42],[9,6,"T","c",33],[9,8,"T","c",35],[9,10,"T","c",28],[9,11,"T","c",33],[9,12,"T","r",39],[9,13,"T","c",30],[9,14,"T","r",29],[9,15,"T","c",31],[10,2,"T","c",28],[10,4,"T","c",35],[10,6,"T","c",28],[10,7,"T","r",39],[10,8,"T","c",43],[10,9,"T","c",34],[10,10,"T","l",40],[10,12,"T","c",34],[10,15,"T","c",37],[11,2,"T","l",41],[11,3,"T","c",33],[11,4,"T","c",30],[11,6,"T","c",37],[11,9,"T","c",37],[11,12,"T","l",42],[11,13,"T","c",28],[11,14,"T","c",33],[11,15,"T","r",32],[12,2,"T","c",34],[12,4,"T","r",29],[12,6,"T","l",38],[12,9,"T","r",32],[12,10,"T","c",33],[12,11,"T","c",35],[12,12,"T","c",30],[12,14,"T","c",35],[13,1,"T","r",39],[13,2,"T","c",30],[13,3,"T","c",37],[13,4,"T","c",34],[13,5,"T","c",35],[13,6,"T","c",33],[13,7,"T","c",30],[13,8,"T","c",34],[13,9,"T","c",28],[13,12,"T","r",29],[13,14,"T","l",41],[13,15,"T","c",37],[14,1,"T","c",28],[14,3,"T","l",40],[14,5,"T","c",28],[14,7,"T","r",29],[14,9,"T","c",35],[14,10,"T","l",38],[14,11,"T","c",37],[14,12,"T","c",34],[14,13,"T","c",33],[14,15,"T","c",30],[15,1,"T","u",36],[15,2,"T","c",35],[15,3,"T","c",34],[15,4,"T","c",33],[15,5,"T","r",32],[15,7,"T","c",43],[15,8,"T","u",27],[15,9,"T","c",30],[15,13,"T","r",39],[15,14,"T","c",28],[15,15,"T","u",27]]
    },
    {
      "key": "azphel",
      "name": "Azphel",
      "level": 45,
      "punkte": 232,
      "pvp": true,
      "art": "pvp",
      "nodes": [[1,1,"T","u",14],[1,2,"T","c",15],[1,3,"T","c",16],[1,4,"T","l",17],[1,6,"T","r",18],[1,7,"T","c",19],[1,8,"T","u",14],[1,10,"T","r",18],[1,11,"T","c",20],[1,12,"T","l",21],[1,13,"T","c",22],[1,14,"T","c",15],[1,15,"T","u",23],[2,1,"T","c",24],[2,4,"T","c",20],[2,5,"T","c",15],[2,6,"T","c",16],[2,8,"T","c",20],[2,10,"T","c",19],[2,13,"T","c",16],[2,15,"T","c",19],[3,1,"T","r",25],[3,2,"T","c",22],[3,3,"T","c",19],[3,4,"T","r",26],[3,6,"T","c",22],[3,7,"T","r",25],[3,8,"T","c",5],[3,9,"T","c",16],[3,10,"T","l",17],[3,11,"T","c",24],[3,12,"T","c",7],[3,13,"T","r",25],[3,14,"T","c",24],[3,15,"T","r",26],[4,3,"T","c",16],[4,7,"T","c",24],[4,9,"T","c",20],[4,11,"T","c",15],[4,13,"T","c",22],[5,1,"T","l",17],[5,2,"T","c",15],[5,3,"T","c",20],[5,5,"T","l",21],[5,6,"T","c",22],[5,7,"T","c",16],[5,8,"T","l",17],[5,9,"T","c",22],[5,10,"T","r",26],[5,11,"T","c",20],[5,12,"T","c",16],[5,13,"T","l",21],[6,1,"T","c",22],[6,3,"T","r",18],[6,4,"T","c",19],[6,5,"T","c",24],[6,7,"T","c",19],[6,10,"T","c",19],[6,13,"T","c",24],[6,14,"T","c",19],[6,15,"T","r",18],[7,1,"T","c",24],[7,5,"T","c",15],[7,6,"T","c",20],[7,7,"T","r",26],[7,8,"T","c",7],[7,9,"T","c",15],[7,10,"T","l",21],[7,11,"T","c",16],[7,12,"T","c",5],[7,13,"T","r",25],[7,15,"T","c",20],[8,1,"T","u",23],[8,2,"T","c",15],[8,3,"T","c",22],[8,6,"T","c",24],[8,8,"S","n",-1],[8,10,"T","c",24],[8,13,"T","c",22],[8,14,"T","c",15],[8,15,"T","u",23],[9,1,"T","c",20],[9,3,"T","r",25],[9,4,"T","c",7],[9,5,"T","c",16],[9,6,"T","l",21],[9,7,"T","c",15],[9,8,"T","c",5],[9,9,"T","r",18],[9,10,"T","c",20],[9,11,"T","c",15],[9,15,"T","c",24],[10,1,"T","r",18],[10,2,"T","c",19],[10,3,"T","c",24],[10,6,"T","c",19],[10,9,"T","c",19],[10,11,"T","c",24],[10,12,"T","c",19],[10,13,"T","r",26],[10,15,"T","c",22],[11,3,"T","l",21],[11,4,"T","c",16],[11,5,"T","c",20],[11,6,"T","r",26],[11,7,"T","c",22],[11,8,"T","l",17],[11,9,"T","c",16],[11,10,"T","c",22],[11,11,"T","l",21],[11,13,"T","c",20],[11,14,"T","c",15],[11,15,"T","l",17],[12,3,"T","c",22],[12,5,"T","c",15],[12,7,"T","c",20],[12,9,"T","c",24],[12,13,"T","c",16],[13,1,"T","r",26],[13,2,"T","c",24],[13,3,"T","r",25],[13,4,"T","c",5],[13,5,"T","c",24],[13,6,"T","l",17],[13,7,"T","c",16],[13,8,"T","c",7],[13,9,"T","r",25],[13,10,"T","c",22],[13,12,"T","r",18],[13,13,"T","c",19],[13,14,"T","c",22],[13,15,"T","r",25],[14,1,"T","c",19],[14,3,"T","c",16],[14,6,"T","c",19],[14,8,"T","c",20],[14,10,"T","c",16],[14,11,"T","c",15],[14,12,"T","c",20],[14,15,"T","c",24],[15,1,"T","u",23],[15,2,"T","c",15],[15,3,"T","c",22],[15,4,"T","l",21],[15,5,"T","c",20],[15,6,"T","r",18],[15,8,"T","u",14],[15,9,"T","c",19],[15,10,"T","r",26],[15,12,"T","l",17],[15,13,"T","c",16],[15,14,"T","c",15],[15,15,"T","u",14]]
    }
  ],
  "stats": [
    {
      "en": "Combat Speed",
      "de": "Kampftempo",
      "eff": ["Kampftempo +1.5%"],
      "effEn": ["Combat Speed +1.5%"],
      "kurz": "KT"
    },
    {
      "en": "Attack",
      "de": "Angriffskraft",
      "eff": ["Zusatzangriffskraft +3"],
      "effEn": ["Attack Bonus +3"],
      "kurz": "ANG"
    },
    {
      "en": "Critical Hit Resist",
      "de": "Krit.-Widerstand",
      "eff": ["Krit.-Widerstand +5"],
      "effEn": ["Critical Hit Resist +5"],
      "kurz": "KW"
    },
    {
      "en": "Critical Hit",
      "de": "Krit.-Treffer",
      "eff": ["Kritischer Treffer +5"],
      "effEn": ["Critical Hit +5"],
      "kurz": "KRIT"
    },
    {
      "en": "Cooldown Reduction",
      "de": "Abklingzeitverringerung",
      "eff": ["Abklingzeit −1.5%"],
      "effEn": ["Cooldown Reduction +1.5%"],
      "kurz": "AZ"
    },
    {
      "en": "Max MP",
      "de": "Max. MP",
      "eff": ["MP +50"],
      "effEn": ["MP +50"],
      "kurz": "MP"
    },
    {
      "en": "Defense",
      "de": "Verteidigung",
      "eff": ["Zusatzverteidigung +30"],
      "effEn": ["Defense Bonus +30"],
      "kurz": "VER"
    },
    {
      "en": "Max HP",
      "de": "Max. LP",
      "eff": ["LP +100"],
      "effEn": ["HP +100"],
      "kurz": "LP"
    },
    {
      "en": "Damage Tolerance",
      "de": "Schadensresistenz",
      "eff": ["Schadensresistenz +1.5%"],
      "effEn": ["Damage Tolerance +1.5%"],
      "kurz": "SR"
    },
    {
      "en": "Damage Boost",
      "de": "Schadensverstärkung",
      "eff": ["Schadensverstärkung +1.5%"],
      "effEn": ["Damage Boost +1.5%"],
      "kurz": "SV"
    },
    {
      "en": "Critical Damage Boost",
      "de": "Krit.-Schadensverstärkung",
      "eff": ["Krit.-Schadensverstärkung +1.5%"],
      "effEn": ["Critical Damage Boost +1.5%"],
      "kurz": "KSV"
    },
    {
      "en": "Critical Damage Tolerance",
      "de": "Krit.-Schadensresistenz",
      "eff": ["Krit.-Schadensresistenz +1.5%"],
      "effEn": ["Critical Damage Tolerance +1.5%"],
      "kurz": "KSR"
    },
    {
      "en": "Multi-Hit Resist",
      "de": "Widerstand (Mehrfachtreffer)",
      "eff": ["Widerstand (Mehrfachtreffer) +1.5%"],
      "effEn": ["Multi-hit Resist +1.5%"],
      "kurz": "MW"
    },
    {
      "en": "Multi-Hit Chance",
      "de": "Mehrfachtreffer",
      "eff": ["Mehrfachtreffer +1.5%"],
      "effEn": ["Multi-hit Chance +1.5%"],
      "kurz": "MT"
    },
    {
      "en": "PvP Damage Tolerance",
      "de": "Schadensresistenz (PvP)",
      "eff": ["Schadensresistenz (PvP) +1.5%"],
      "effEn": ["PvP Damage Tolerance +1.5%"],
      "kurz": "SR"
    },
    {
      "en": "PvP Attack",
      "de": "Angriffskraft (PvP)",
      "eff": ["Angriffskraft (PvP) +3"],
      "effEn": ["PvP Attack +3"],
      "kurz": "A"
    },
    {
      "en": "PvP Defense",
      "de": "Verteidigung (PvP)",
      "eff": ["Verteidigung (PvP) +30"],
      "effEn": ["PvP Defense +30"],
      "kurz": "V"
    },
    {
      "en": "Status Effect Chance",
      "de": "Statuseffekt-Trefferchance",
      "eff": ["Statuseffekt-Trefferchance +1%"],
      "effEn": ["Status Effect Chance +1%"],
      "kurz": "ST"
    },
    {
      "en": "PvP Critical Hit, PvP Critical Hit Resist",
      "de": "Krit.-Treffer (PvP), Krit.-Widerstand (PvP)",
      "eff": ["Krit.-Treffer (PvP) +5","Krit.-Widerstand (PvP) +5"],
      "effEn": ["PvP Critical Hit +5","PvP Critical Hit Resist +5"],
      "kurz": "K/KW"
    },
    {
      "en": "PvP Accuracy",
      "de": "Präzision (PvP)",
      "eff": ["Präzision (PvP) +5"],
      "effEn": ["PvP Accuracy +5"],
      "kurz": "P"
    },
    {
      "en": "PvP Evasion",
      "de": "Ausweichen (PvP)",
      "eff": ["Ausweichen (PvP) +3"],
      "effEn": ["PvP Evasion +3"],
      "kurz": "AW"
    },
    {
      "en": "Status Effect Resist",
      "de": "Widerstand (Statuseffekte)",
      "eff": ["Widerstand (Statuseffekte) +1%"],
      "effEn": ["Status Effect Resist +1%"],
      "kurz": "SW"
    },
    {
      "en": "PvP Critical Hit Resist",
      "de": "Krit.-Widerstand (PvP)",
      "eff": ["Krit.-Widerstand (PvP) +5"],
      "effEn": ["PvP Critical Hit Resist +5"],
      "kurz": "KW"
    },
    {
      "en": "PvP Damage Boost",
      "de": "Schadensverstärkung (PvP)",
      "eff": ["Schadensverstärkung (PvP) +1.5%"],
      "effEn": ["PvP Damage Boost +1.5%"],
      "kurz": "SV"
    },
    {
      "en": "PvP Critical Hit",
      "de": "Krit.-Treffer (PvP)",
      "eff": ["Krit.-Treffer (PvP) +5"],
      "effEn": ["PvP Critical Hit +5"],
      "kurz": "K"
    },
    {
      "en": "PvP Accuracy, PvP Evasion",
      "de": "Präzision (PvP), Ausweichen (PvP)",
      "eff": ["Präzision (PvP) +5","Ausweichen (PvP) +3"],
      "effEn": ["PvP Accuracy +5","PvP Evasion +3"],
      "kurz": "P/AW"
    },
    {
      "en": "PvP Attack, PvP Defense",
      "de": "Angriffskraft (PvP), Verteidigung (PvP)",
      "eff": ["Angriffskraft (PvP) +3","Verteidigung (PvP) +30"],
      "effEn": ["PvP Attack +3","PvP Defense +30"],
      "kurz": "A/V"
    },
    {
      "en": "PvE Damage Boost",
      "de": "Schadensverstärkung (PvE)",
      "eff": ["Schadensverstärkung (PvE) +1.5%"],
      "effEn": ["PvE Damage Boost +1.5%"],
      "kurz": "SV"
    },
    {
      "en": "Boss Attack",
      "de": "Angriffskraft (Boss)",
      "eff": ["Angriffskraft (Boss) +3"],
      "effEn": ["Boss Attack +3"],
      "kurz": "BA"
    },
    {
      "en": "PvE Attack, PvE Defense",
      "de": "Angriffskraft (PvE), Verteidigung (PvE)",
      "eff": ["Angriffskraft (PvE) +3","Verteidigung (PvE) +30"],
      "effEn": ["PvE Attack +3","PvE Defense +30"],
      "kurz": "A/V"
    },
    {
      "en": "PvE Accuracy",
      "de": "Präzision (PvE)",
      "eff": ["Präzision (PvE) +5"],
      "effEn": ["PvE Accuracy +5"],
      "kurz": "P"
    },
    {
      "en": "Max HP",
      "de": "Max. LP",
      "eff": ["LP +100"],
      "effEn": ["Max HP +100"],
      "kurz": "LP"
    },
    {
      "en": "PvE Accuracy, PvE Evasion",
      "de": "Präzision (PvE), Ausweichen (PvE)",
      "eff": ["Präzision (PvE) +5","Ausweichen (PvE) +5"],
      "effEn": ["PvE Accuracy +5","PvE Evasion +5"],
      "kurz": "P/AW"
    },
    {
      "en": "Boss Defense",
      "de": "Verteidigung (Boss)",
      "eff": ["Verteidigung (Boss) +30"],
      "effEn": ["Boss Defense +30"],
      "kurz": "BV"
    },
    {
      "en": "PvE Evasion",
      "de": "Ausweichen (PvE)",
      "eff": ["Ausweichen (PvE) +5"],
      "effEn": ["PvE Evasion +5"],
      "kurz": "AW"
    },
    {
      "en": "PvE Attack",
      "de": "Angriffskraft (PvE)",
      "eff": ["Angriffskraft (PvE) +3"],
      "effEn": ["PvE Attack +3"],
      "kurz": "A"
    },
    {
      "en": "PvE Damage Tolerance",
      "de": "Schadensresistenz (PvE)",
      "eff": ["Schadensresistenz (PvE) +1.5%"],
      "effEn": ["PvE Damage Tolerance +1.5%"],
      "kurz": "SR"
    },
    {
      "en": "PvE Defense",
      "de": "Verteidigung (PvE)",
      "eff": ["Verteidigung (PvE) +30"],
      "effEn": ["PvE Defense +30"],
      "kurz": "V"
    },
    {
      "en": "Critical Hit Resist",
      "de": "Krit.-Widerstand",
      "eff": ["Krit.-Widerstand +10"],
      "effEn": ["Critical Hit Resist +10"],
      "kurz": "KW"
    },
    {
      "en": "Boss Attack, Boss Defense",
      "de": "Angriffskraft (Boss), Verteidigung (Boss)",
      "eff": ["Angriffskraft (Boss) +3","Verteidigung (Boss) +30"],
      "effEn": ["Boss Attack +3","Boss Defense +30"],
      "kurz": "BA/BV"
    },
    {
      "en": "Critical Hit",
      "de": "Krit.-Treffer",
      "eff": ["Kritischer Treffer +10"],
      "effEn": ["Critical Hit +10"],
      "kurz": "KRIT"
    },
    {
      "en": "Boss Damage Boost",
      "de": "Schadensverstärkung (Boss)",
      "eff": ["Schadensverstärkung (Boss) +1%"],
      "effEn": ["Boss Damage Boost +1%"],
      "kurz": "BSV"
    },
    {
      "en": "Boss Damage Tolerance",
      "de": "Schadensresistenz (Boss)",
      "eff": ["Schadensresistenz (Boss) +1%"],
      "effEn": ["Boss Damage Tolerance +1%"],
      "kurz": "BSR"
    },
    {
      "en": "Max MP",
      "de": "Max. MP",
      "eff": ["MP +50"],
      "effEn": ["Max MP +50"],
      "kurz": "MP"
    }
  ],
  "klassen": {
    "gladiator": {
      "skills": [["Protection Armor","Schutzrüstung","p"],["Aerial Snare","Luftfesselung","a"],["Blood Absorption","Blutabsorption","p"],["Overhead Slam","Abwärtsschlag","a"],["Survival Stance","Überlebenshaltung","p"],["Leaping Slam","Sprungangriff","a"],["Crushing Wave","Zerschmetternde Welle","a"],["Identify Weakness","Schwächenanalyse","p"],["Rending Blow","Zerreißender Schlag","a"],["Attack Preparation","Angriffsvorbereitung","p"],["Defiance","Schockaufhebung","a"],["Sword Aura Rampage","Klingenraserei","a"],["Keen Strike","Scharfer Schlag","a"],["Rush Strike","Sturmhieb","a"],["Mocking Blade","Spottklinge","a"],["Ankle Slice","Knöchelschnitt","a"],["Ruinous Blow","Verheerender Schlag","a"],["Impact Hit","Schocktreffer","p"],["Murderous Burst","Tödliche Eruption","p"],["Survival Willpower","Überlebenswille","p"],["Experienced Counterstrike","Erfahrener Konterangriff","p"],["Destructive Impulse","Zerstörungsdrang","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "templar": {
      "skills": [["Warding Shield","Behütungsschild","p"],["Annihilate","Vernichtung","a"],["Punishing Benediction","Gnade der Verdammnis","p"],["Judgment","Urteil","a"],["Enhance Health","Vitalitätsverstärkung","p"],["Poach","Fesseln","a"],["Warding Strike","Behütender Schlag","a"],["Ironclad Defense","Eisenwall-Verteidigung","p"],["Pummel","Tobende Hiebe","a"],["Guarding Seal","Schutzsiegel","p"],["Defiance","Schockaufhebung","a"],["Flash Rampage","Lichtraserei","a"],["Vicious Strike","Brutaler Schlag","a"],["Shield Rush","Schildsturm","a"],["Shield Smite","Schildhieb","a"],["Debilitating Smash","Lähmender Schlag","a"],["Punishment","Bestrafung","a"],["Impact Hit","Schocktreffer","p"],["Block Pain","Schmerzblockade","p"],["Survival Willpower","Überlebenswille","p"],["Fury","Kampfrausch","p"],["Insulting Roar","Gebrüll der Verachtung","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "assassin": {
      "skills": [["Exploit Weakness","Schwachstellenfokus","p"],["Shadow Fall","Schattenfall","a"],["Apply Poison","Klingengift","p"],["Heart Gore","Herzstoß","a"],["Heightened Sixth Sense","Geschärfte Sinne","p"],["Shadowstrike","Schattenschlag","a"],["Flash Slice","Blitzhafter Schnitt","a"],["Rear Smite","Rückhieb","p"],["Savage Roar","Gebrüll der Bestie","a"],["Assault Stance","Sturmhaltung","p"],["Defiance","Schockaufhebung","a"],["Storm Rampage","Sturmwirbel","a"],["Quick Slice","Schneller Schnitt","a"],["Infiltrate","Infiltration","a"],["Ambush","Hinterhalt","a"],["Whirlwind Slice","Wirbelschnitt","a"],["Insignia Explosion","Glyphenexplosion","a"],["Impact Hit","Schocktreffer","p"],["Determination","Entschlossenheit","p"],["Revitalization Contract","Pakt der Revitalisierung","p"],["Defense Break","Verteidigungsbruch","p"],["Ambush Stance","Lauerhaltung","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "ranger": {
      "skills": [["Concentrated Fire","Fokussiertes Feuer","p"],["Suppressing Arrow","Unterdrückungspfeil","a"],["Wind Vigor","Elan des Windes","p"],["Drill Dart","Bohrpfeil","a"],["Vigilant Eye","Achtsames Auge","p"],["Snare Shot","Schlingenpfeil","a"],["Explosion Trap","Explosionsfalle","a"],["Focused Eye","Fokussiertes Auge","p"],["Tempest Shot","Schnellschuss","a"],["Hunter's Resolve","Entschlossenheit des Jägers","p"],["Defiance","Schockaufhebung","a"],["Arrow Scattershot","Pfeilhagel","a"],["Snipe","Scharfschuss","a"],["Burst Arrow","Sprengpfeil","a"],["Marking Shot","Markierungsschuss","a"],["Gale Arrow","Orkanpfeil","a"],["Deadshot","Zielpfeil","a"],["Unyielding Resolve","Entschlossenheit des Widerstands","p"],["Hunter's Soul","Jägerseele","p"],["Revitalization Contract","Pakt der Revitalisierung","p"],["Melee Fire","Nahschuss","p"],["Rooting Eye","Fesselndes Auge","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "sorcerer": {
      "skills": [["Robe of Earth","Robe der Erde","p"],["Wish of Concentration","Andacht der Konzentration","a"],["Cold Snap","Beschwörung der Kälte","p"],["Blaze","Flammenexplosion","a"],["Fire Mark","Feuerzeichen","p"],["Firestorm","Flammenschlag","a"],["Winter's Shackles","Winterbann","a"],["Robe of Flame","Robe der Flamme","p"],["Ice Chain","Eiskette","a"],["Absorb Essence","Essenzabsorption","p"],["Defiance","Schockaufhebung","a"],["Flame Scattershot","Flammenfeuer","a"],["Flame Arrow","Flammenpfeil","a"],["Frost Burst","Eisexplosion","a"],["Bittercold Wind","Bitterkalter Wind","a"],["Frost","Einfrieren","a"],["Hellfire","Höllenflamme","a"],["Grace of Resistance","Gnade des Widerstands","p"],["Vitality Evaporation","Entzug der Lebensenergie","p"],["Revitalization Contract","Pakt der Revitalisierung","p"],["Grace of Enhancement","Gnade der Verstärkung","p"],["Robe of Cold","Robe der Kälte","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "spiritmaster": {
      "skills": [["Spirit Protection","Naturgeistschutz","p"],["Soul's Cry","Seelenschrei","a"],["Spirit's Descent","Herabkunft des Naturgeists","p"],["Jointstrike: Curse","Koordinationsangriff: Fluch","a"],["Spirit Strike","Geisterschlag","p"],["Summon: Fire Spirit","Beschwörung: Feuergeist","a"],["Dimensional Control","Raumbeherrschung","a"],["Corrode","Erosion","p"],["Combustion","Einäscherung","a"],["Spirit Revitalization","Revitalisierung des Naturgeists","p"],["Defiance","Schockaufhebung","a"],["Rapid Scattershot","Schnellfeuer","a"],["Cold Shock","Kälteschock","a"],["Summon: Wind Spirit","Beschwörung: Windgeist","a"],["Summon: Water Spirit","Beschwörung: Wassergeist","a"],["Summon: Earth Spirit","Beschwörung: Erdgeist","a"],["Elemental Fusion","Elementarfusion","a"],["Mental Focus","Mentale Konzentration","p"],["Element Unification","Elementarvereinigung","p"],["Revitalization Contract","Pakt der Revitalisierung","p"],["Spirit Communion","Geisterbindung","p"],["Consecutive Countercurrent","Kontinuierlicher Rückfluss","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "cleric": {
      "skills": [["Empyrean Lords' Benediction","Gnade des Gebieters","p"],["Radiant Recovery","Glanz der Genesung","a"],["Empyrean Lord's Grace","Segen des Gebieters","p"],["Chain of Torment","Kette des Schmerzes","a"],["Warm Benediction","Warme Gnade","p"],["Debilitating Mark","Mal der Schwächung","a"],["Condemnation","Verdammnis","a"],["Healing Enhancement","Heilungsverstärkung","p"],["Judgment Thunder","Blitz des Urteils","a"],["Immortal Veil","Schleier der Unsterblichkeit","p"],["Defiance","Schockaufhebung","a"],["Lightning Strike Scattershot","Blitzfeuer","a"],["Earth's Retribution","Rache der Erde","a"],["Healing Light","Licht der Heilung","a"],["Divine Aura","Heilige Aura","a"],["Light of Regeneration","Licht der Regeneration","a"],["Bolt","Donnerschlag","a"],["Heal Block","Regenerationsblockade","p"],["Radiant Benediction","Strahlende Gnade","p"],["Survival Willpower","Überlebenswille","p"],["Earth's Grace","Segen der Erde","p"],["Prayer of Concentration","Gebet der Konzentration","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    },
    "chanter": {
      "skills": [["Crossguard","Kreuzverteidigung","p"],["Wave Blow","Wellenschlag","a"],["Protection Circle","Schutzformation","p"],["Dark Crush","Finsterbruch","a"],["Blessing of Life","Segen des Lebens","p"],["Rushing Smash","Sturmschlag","a"],["Recuperation","Zauber der Genesung","a"],["Inspiring Spell","Zauber der Eingebung","p"],["Incandescent Blow","Gleißschlag","a"],["Attack Preparation","Angriffsvorbereitung","p"],["Defiance","Schockaufhebung","a"],["Gust Rampage","Sturmraserei","a"],["Onslaught","Zerschmetterungsschlag","a"],["Tremor Crush","Erschütterungsschlag","a"],["Impactful Crush","Wuchtschlag","a"],["Heat Wave Blow","Hitzewellenschlag","a"],["Spinning Strike","Wirbelschlag","a"],["Impact Hit","Schocktreffer","p"],["Wind's Promise","Gelübde des Windes","p"],["Survival Willpower","Überlebenswille","p"],["Earth's Promise","Gelübde der Erde","p"],["Raging Spell","Zauber des Furors","p"]],
      "map": [[0,1,2,3,4,5,6,7,8,9,10,11,7,12,9,13,14,0,15,2,16,4],[11,17,16,18,12,5,19,20,14,21,8,6,19,1,18,21,13,15,20,3,17,10],[4,11,2,5,1,6,9,20,19,3,15,12,16,18,17,21,8,14,13,7,10,0],[14,18,17,8,11,0,13,7,6,21,1,16,9,3,2,15,4,10,5,20,19,12],[],[]]
    }
  }
};
