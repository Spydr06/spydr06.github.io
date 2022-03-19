"use strict";
var _a, _b, _c;
const HELP_TEXT = `
====== spydr06.github.io ======

Commands:     Description:
    clear    | Clears the terminal
    help     | Displays this help text
    about    | Displays some information about me,
             | and my projects
    socials  | Displays a list of my social media profiles
    projects | Displays a list of some of my best projects

How do you run commands?
    Just type the name of one of the commands listed above
    and hit "Enter"
`;
const ABOUT_TEXT = `
====== About Spydr06 ======

Hi there, I'm Spydr06.
I'm a 10th grade student in Germany who is interested in Linux and programming.

I especially like developing "low(er)-level" stuff and really enjoy finding out how things
like programming languages, operating systems and network connections work internally.

I've been coding since 4 years by now. I started with the Arduino microcontrollers,
then discovered Processing (a program to easily write java), with which I wrote a
few little games and applications. Since two years now I mainly program in C and Rust.

My current, and biggest project so far is my own programming language called "CSpydr".
It's a imperative/procedural low-level language written in pure C, while having many
similarities with C. You can find more information here: https://github.com/spydr06/cspydr.git

You want to see a few more projects of me?: type "projects" into the console.
You can visit my other profiles, by typing "socials".
`;
const SOCIALS_TEXT = `
Spydr06's social media profiles:
    GitHub: (Spydr06) https://github.com/Spydr06
    Reddit: (u/mcspiderfe) https://reddit.com/u/mcspiderfe
    Discord: Spydr#7096
    EMail: spydr06@web.de
`;

var CommandType;
(function (CommandType) {
    CommandType["CLEAR"] = "clear";
    CommandType["HELP"] = "help";
    CommandType["ABOUT"] = "about";
    CommandType["SOCIALS"] = "socials";
})(CommandType || (CommandType = {}));
;
class Command {
    constructor(type) {
        this.type = type;
    }
    isError() {
        return typeof (this.type) == 'boolean';
    }
    static parse(str) {
        if (Object.values(CommandType).includes(str))
            return new Command(str);
        else
            return new Command(true);
    }
    execute(term) {
        switch (this.type) {
            case CommandType.CLEAR:
                term.clear();
                break;
            case CommandType.HELP:
                term.append("\n" + HELP_TEXT);
                break;
            case CommandType.ABOUT:
                term.append("\n" + ABOUT_TEXT);
                break;
            case CommandType.SOCIALS:
                term.append("\n" + SOCIALS_TEXT);
        }
    }
}
class Terminal {
    constructor(elem_id) {
        this.prompt_fmt = "[%u@%h %d]$ ";
        this.current_dir = "~";
        this.current_user = "spydr";
        this.current_host = "localhost";
        this.input = "";
        let el = document.getElementById(elem_id);
        this.elem = el;
        this.elem.addEventListener('keypress', (e) => this.update(e));
        this.prompt();
        this.updateCursor();
    }
    update(e) {
        e.preventDefault();
        switch (e.code) {
            case 'Enter':
                this.execute(this.input);
                this.input = "";
                this.prompt();
                break;
            case 'Backspace':
                break;
            default:
                this.input += e.key;
                this.append(e.key);
                break;
        }
        this.updateCursor();
    }
    execute(str) {
        if (str.replace(" ", "").length == 0)
            return;
        let command = Command.parse(str);
        if (command.isError()) {
            this.append("\n/bin/sh: command not found: " + str);
            return;
        }
        command.execute(this);
    }
    prompt() {
        if (this.elem.innerHTML !== '')
            this.newline();
        let str = this.prompt_fmt
            .replace("%d", this.current_dir)
            .replace("%u", this.current_user)
            .replace("%h", this.current_host);
        this.append(str);
    }
    append_colored(str, color) {
        this.elem.innerHTML += '<span style=\"color:' + color + '\">' + str + "</span>";
    }
    append(str) {
        this.elem.innerHTML += str;
    }
    newline() {
        this.elem.innerHTML += '\n';
        this.elem.scrollTo(0, this.elem.scrollHeight);
    }
    clear() {
        this.elem.innerHTML = "";
    }
    updateCursor() {
        this.elem.focus();
        this.elem.setSelectionRange(this.elem.value.length, this.elem.value.length);
    }
}
const term = new Terminal('terminal');
(_a = document.getElementById('socials-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
    term.append("socials");
    new Command(CommandType.SOCIALS).execute(term);
    term.input = "";
    term.prompt();
});
(_b = document.getElementById('help-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
    term.append("help");
    new Command(CommandType.HELP).execute(term);
    term.input = "";
    term.prompt();
});
(_c = document.getElementById('about-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (e) => {
    term.append("about");
    new Command(CommandType.ABOUT).execute(term);
    term.input = "";
    term.prompt();
});
//# sourceMappingURL=index.js.map