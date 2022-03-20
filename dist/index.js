"use strict";
var _a, _b, _c;
const SPAN_BOLD = "<span class='bold'>";
const SPAN_UNDERLINED = "<span class='underline>";
const SPAN_END = "</span>";
function span_link(label, link) {
    return '<a href="' + link + '"><span class=link>' + label + '</span></a>';
}
function bold(str) {
    return '<span class=bold>' + str + '</span>';
}
function colored(str, color) {
    return '<span style=\"color:' + color + '\">' + str + "</span>";
}
const HELP_TEXT = `
${SPAN_BOLD}====== spydr06.github.io ======${SPAN_END}

Commands:
 ${colored("*", "green")} ${bold("clear")}: Clears the terminal
 ${colored("*", "green")} ${bold("help")}: Displays this help text
 ${colored("*", "green")} ${bold("about")}: Displays some information about me, and my projects
 ${colored("*", "green")} ${bold("socials")}: Displays a list of my social media profiles
 ${colored("*", "green")} ${bold("projects")}: Displays a list of some of my best projects

${colored("How do you run commands?", "yellow")}
    Just type the name of one of the commands listed above
    and hit "Enter"
`;
const ABOUT_TEXT = `
${bold("====== About Spydr06 ======")}

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

You want to see a few more projects of me? type "projects" into the console.
You can visit my other profiles, by typing "socials".
`;
const SOCIALS_TEXT = `
${bold("Spydr06's social media profiles:")}
${colored("*", "green")} GitHub:  ${span_link("Spydr06", "https://github.com/Spydr06")}
${colored("*", "green")} Reddit: ${span_link("u/mcspiderfe", "https://reddit.com/u/mcspiderfe")}
${colored("*", "green")} Discord: Spydr#7096
${colored("*", "green")} EMail: spydr06@web.de
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
        this.elem.setAttribute("contentEditable", "true");
        this.elem.addEventListener("oncut", e => e.preventDefault(), false);
        this.elem.addEventListener("onpaste", e => e.preventDefault(), false);
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
                this.input = this.input.slice(0, this.input.length - 2);
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
            this.newline();
            this.append_colored("/bin/sh: command not found: " + str, "red");
            return;
        }
        command.execute(this);
    }
    parse_prompt() {
        return this.prompt_fmt
            .replace("%d", this.current_dir)
            .replace("%u", this.current_user)
            .replace("%h", this.current_host);
    }
    prompt() {
        if (this.elem.innerHTML !== '')
            this.newline();
        this.append(this.parse_prompt());
    }
    append_colored(str, color) {
        this.elem.innerHTML += '<span style=\"color:' + color + '\">' + str + "</span>";
    }
    append(str) {
        str = str.replace(/\n/g, '<br/>');
        this.elem.innerHTML += str;
    }
    newline() {
        this.elem.innerHTML += '<br/>';
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    clear() {
        this.elem.innerHTML = "";
    }
    updateCursor() {
        let range = document.createRange();
        let sel = window.getSelection();
        range.setStart(this.elem.childNodes[this.elem.childNodes.length - 1], this.parse_prompt().length + this.input.length);
        range.collapse(true);
        sel === null || sel === void 0 ? void 0 : sel.removeAllRanges();
        sel === null || sel === void 0 ? void 0 : sel.addRange(range);
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