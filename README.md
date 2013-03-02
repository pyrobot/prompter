#prompter
---

Simple, lightweight, functional way to get user input.

Usage

    var prompter = require('./prompter');
    prompter([
        'Demo of a prompt?', // cannot be empty
        'Prompt with a default? (No prob)', // the last parenthesized term will be the default if empty
        'Dont echo text?*' // end with an asterisk to turn off echoing to console
    ],
    function (answer1, answer2, answer3) {
        console.log("You responded with:\n'%s'\n'%s'\n'%s'", answer1, answer2, answer3);
    });
