import { MorsePlayer } from './morse-player.js';
import '/node_modules/jquery/dist/jquery.min.js';
import '/node_modules/tone/build/Tone.js';
import { Score } from './score.js';

const morsePlayer = new MorsePlayer();
let scoreIndex = 0;

const url = '192.168.0.3:8000';
const socket = new WebSocket(`ws://${url}?role=player`);
let morseString = '';
let thisPlayer = 0;

socket.addEventListener('message', function (event) {
    const data = JSON.parse(event.data);
    console.log(data);
    if (data.scoreIndex !== undefined) {
        scoreIndex = data.scoreIndex;
        $('#score').html(Score[scoreIndex]);  
    }
});

$(function () {
    $(document).keydown(function (e) {
        if (e.which == 37) { // left arrow key
            scoreIndex = (scoreIndex > 0) ? scoreIndex - 1 : Score.length - 1;
        } else if (e.which == 39) { // right arrow key
            scoreIndex = (scoreIndex < Score.length - 1) ? scoreIndex + 1 : 0;
        }

        updateScore();
    });

    $('#textInput').keydown(function (e) {
        if (e.which == 13) {
            textToMorse();
            $(this).blur();

            if (morsePlayer.running) {
                restartMorse();
            }
        }
    });

    $('#textInput').on('focusout', function () {
        textToMorse();
        if (morsePlayer.running) {
            restartMorse();
        }
    });

    $('#clearBtn').click(function () {
        $('#textInput').val('');
        $('#textOutput').empty();
        $('#textInput').focus();
    });

    $('#ditSample').on('change', async function () {
        await morsePlayer.setDit(this.files[0]);
        checkForSamples();
    });

    $('#dahSample').on('change', async function () {
        await morsePlayer.setDah(this.files[0]);
        checkForSamples();
    });

    $('#playBtn').on('click', async function () {
        await Tone.start();
        let morse = $('#textOutput').html();

        if (morse.length > 0) {
            morseString = morse;
            morsePlayer.running = true;
            $('.playing-icon').show();
        }
    });

    $('#stopBtn').on('click', function () {
        morsePlayer.running = false;
        $('.playing-icon').hide();
    });

    $('#rateRange').on('input', function () {
        morsePlayer.rate = $(this).val();
        $('#rateLabel').html(morsePlayer.rate + 'ms');
    });

    $('#loopToggle').on('change', function () {
        let loop = $(this).prop('checked');
        morsePlayer.loop = loop;
    });

    $('#playerSelector').on('change', function () {
        thisPlayer = parseInt($(this).val());
    });

    $('#susToggle').on('change', function() {
        let sus = $(this).prop('checked');
        morsePlayer.sustain = sus;
    });

    $('#verbToggle').on('change', function() {
        morsePlayer.toggleVerb();
    });

    $('#score').html(Score[0]);
});

function restartMorse() {
    $("#stopBtn").click();
    $("#playBtn").click();
}

function checkForSamples() {
    if (morsePlayer.dit.loaded && morsePlayer.dah.loaded) {
        $('#textInput').prop('disabled', false);
        $('#playBtn').prop('disabled', false);
    }
}

function textToMorse() {
    let text = $('#textInput').val();
    let morse = morsePlayer.encode(text);
    morsePlayer.changeMorseString(morse);
    $('#textOutput').empty();
    $('#textOutput').append(morse);
}

function updateScore() {
    socket.send(JSON.stringify({scoreIndex: scoreIndex}));
}

window.max.bindInlet('beat', () => {
    if (morsePlayer.running) {
        if (morsePlayer.morseString != morseString) {
            morsePlayer.changeMorseString(morseString);
            textToMorse();
        }

        morsePlayer.playMorse();
        if (morsePlayer.morseArr[morsePlayer.index] != '') {
            const message = {
                player: thisPlayer,
                type: morsePlayer.morseArr[morsePlayer.index],
            };
            socket.send(JSON.stringify(message));
            window.max.outlet(thisPlayer);
        }
    }
});