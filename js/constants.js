/* HELP CONSTANTS */
const MIN_HELP_TIME = 45000; // Milliseconds
const MAX_HELP_TIME = 90000; // Milliseconds
const DECIPHER_DEFAULT_CODE_LENGTH = 7;
const TIME_TILL_URGENT = 30000;
const TIME_TILL_PAST_URGENT = 10000;
const possibleLetters = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "=", "[", "]"];
const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/* ENEMY CONSTANTS */
const START_ENEMY_SPAWN_MIN = 30000;
const START_ENEMY_SPAWN_MAX = 40000;
const ENEMY_SPAWN_DECREMENT_PER_HELP = 2500;
const ENEMY_TIME_TO_KILL = 3000;

/* BATTERY CONSTANTS */
const BATTERY_DRAIN_ON_HOVER = 0.02;
const BATTERY_DRAIN_ON_SHOOT = 0.1;


/* MISC CONSTANTS */
const POSSIBLE_TIMES = ["5:00PM", "5:30PM", "6:00PM", "6:30PM", "7:00PM", "7:30PM", "8:00PM"];