module.exports = function (questions, callback, promptEnding) {
    var curr = 0, max = questions.length, prompt;
    var argList = [];
    var rawMode = false;
    var thisCmd = "";

    var getLastMatchingGroup = function (s) {
        var r=/\((.*?)\)/g, a=[], m;
        while (m = r.exec(s)) {
            a.push(m[1]);
        }
        return a.pop();
    };

    var nextPrompt = function () {
        prompt = questions[curr];
        rawMode = false;
        if (prompt[prompt.length-1] == '*') {
            rawMode = true;
            prompt = prompt.slice(0, -1);
        }
        prompt += promptEnding;
        if (rawMode) {
            process.stdin.setEncoding('hex');
            process.stdin.setRawMode(true);
        } else {
            process.stdin.setEncoding('utf8');
            process.stdin.setRawMode(false);
        }
    };

    var processInput = function (d) {
        var input = d.replace(/(\n|\r|\r\n)$/, '');
        if (input) {
            argList.push(input);
        } else {
            var def = getLastMatchingGroup(prompt);
            if (def) {
                argList.push(def);
            } else {
                process.stdout.write(prompt);
                return;
            }
        }
        if(++curr>=max) {
            process.stdin.setRawMode(false);
            process.stdin.pause();
            callback.apply(null, argList);
            return;
        }
        nextPrompt();
        process.stdout.write(prompt);
    };

    var processCharacter = function (d) {
        switch(d) {
        case '03': // ctrl-C
            process.stdout.write('^C');
            process.exit();
            break;
        case '7f': // backspace
            thisCmd = thisCmd.slice(0, -1);
            break;
        case '0d': // enter
            process.stdout.write('\n');
            processInput(thisCmd);
            break;
        default:
            var thisChar = String.fromCharCode(parseInt(d.substr(0, 2), 16));
            thisCmd += thisChar;
        }
    };

    promptEnding = promptEnding || " ";
    process.stdin.resume();

    nextPrompt();

    process.stdout.write(prompt);
    process.stdin.on('data', function (d) {
        if (rawMode) {
            processCharacter(d);
        } else {
            processInput(d);
        }
    });
};