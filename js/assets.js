let backgroundImage = new Image();
backgroundImage.src = "img/background.png";

let backgroundVentImage = new Image();
backgroundVentImage.src = "img/backgroundDark.png";

let background2Image = new Image();
background2Image.src = "img/background2.png";

let mayuriIdleImage = new Image();
mayuriIdleImage.src = "img/mayuri-idle.png";

let mayuriJumpscareImage = new Image();
mayuriJumpscareImage.src = "img/tuturudeath1.png";

let shootButtonImage = new Image();
shootButtonImage.src = "img/shoot-button.png";

let tuturuDeathSoundSrc = new Audio("audio/tuturudeath.mp3");
let happyOkabeSoundSrc = new Audio("audio/happyokabe.mp3");
let okabeSaysMayuriSoundSrc = new Audio("audio/okabesaysmayuri.mp3");

let ventEmptyImage = new Image();
ventEmptyImage.src = "img/vent-empty.png";

let ventOccupiedImage = new Image();
ventOccupiedImage.src = "img/vent-occupied.png";

let okabeHelpImage = new Image();
okabeHelpImage.src = "img/okabe-help.png";

let okabeHelpUrgentImage = new Image();
okabeHelpUrgentImage.src = "img/okabe-help-urgent.png";

let tabletImage = new Image();
tabletImage.src = "img/tablet.png";

myAudio = new Audio('audio/theme.mp3'); 
if (typeof myAudio.loop == 'boolean')
{
    myAudio.loop = true;
}
else
{
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}
