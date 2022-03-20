"use strict";
var _a, _b, _c;
const SPAN_BOLD = "<span class='bold'>";
const SPAN_UNDERLINED = "<span class='underline>";
const SPAN_END = "</span>";
const HELP_TEXT1 = `
${SPAN_BOLD}====== spydr06.github.io ======${SPAN_END}

Commands:
`;
const HELP_TEXT2 = `
${colored("How do you run commands?", "yellow")}
    Just type the name of one of the commands listed above
    and hit "Enter"
`;
const ABOUT_TEXT = `
${bold("====== About Spydr06 ======")}

Hi there, I'm Spydr06.
I'm a 10th grade student from Germany who is interested in Linux and programming.

I especially like developing "low(er)-level" stuff and really enjoy finding out how things
like programming languages, operating systems and network connections work internally.

I've been coding since 4 years by now. I started with the Arduino microcontrollers,
then discovered Processing (a program to easily write java), with which I wrote a
few little games and applications. Since two years now I mainly program in C and Rust.

My current, and biggest project so far is my own programming language called "CSpydr".
It's a imperative/procedural low-level language written in pure C, while having many
similarities with C. You can find more information here: ${link("https://github.com/spydr06/cspydr.git", "https://github.com/spydr06/cspydr.git")}

You want to see a few more projects of me? type "projects" into the console.
You can visit my other profiles, by typing "socials".
`;
const SOCIALS_TEXT = `
${bold("Spydr06's social media profiles:")}
${colored("*", "green")} GitHub:  ${link("Spydr06", "https://github.com/Spydr06")}
${colored("*", "green")} Reddit: ${link("u/mcspiderfe", "https://reddit.com/u/mcspiderfe")}
${colored("*", "green")} Discord: Spydr#7096
${colored("*", "green")} EMail: spydr06@web.de
`;
;
const ERROR_COMMAND = {
    id: '',
    description: '',
    expectedArgs: 0,
    execute: function (term, args) {
        term.append_colored("/bin/sh: command not found: " + args[0], "red");
        return false;
    }
};
const COMMANDS = [
    {
        id: 'clear',
        description: 'Clears the Terminal.',
        expectedArgs: 1,
        execute: function (term, args) {
            if (args.length == this.expectedArgs) {
                term.clear();
                return true;
            }
            else {
                term.append_colored("clear: unexpected argument '" + args[1] + "'", "red");
                return false;
            }
        }
    },
    {
        id: 'help',
        description: 'Displays this help text',
        expectedArgs: 1,
        execute: function (term, args) {
            if (args.length == this.expectedArgs) {
                term.append(HELP_TEXT1);
                term.append(command_list());
                term.append(HELP_TEXT2);
                return true;
            }
            else {
                term.append_colored("help: unexpected argument '" + args[1] + "'", "red");
                return false;
            }
        }
    },
    {
        id: 'about',
        description: 'Displays some information about me and my projects',
        expectedArgs: 1,
        execute: function (term, args) {
            if (args.length == this.expectedArgs) {
                term.append(ABOUT_TEXT);
                return true;
            }
            else {
                term.append_colored("about: unexpected argument '" + args[1] + "'", "red");
                return false;
            }
        }
    },
    {
        id: 'socials',
        description: 'Displays a list of my social media profiles',
        expectedArgs: 1,
        execute: function (term, args) {
            if (args.length == this.expectedArgs) {
                term.append(SOCIALS_TEXT);
                return true;
            }
            else {
                term.append_colored("socials: unexpected argument '" + args[1] + "'", "red");
                return false;
            }
        }
    }
];
function command_list() {
    let str = '';
    COMMANDS.forEach((cmd) => {
        str += colored('*', 'green') + ' ' + cmd.id + ': ' + cmd.description + '\n';
    });
    return str;
}
function find_command(id) {
    for (let i = 0; i < COMMANDS.length; i++) {
        if (COMMANDS[i].id == id)
            return COMMANDS[i];
    }
    return ERROR_COMMAND;
}
function link(label, link) {
    return '<a href="' + link + '"><span class=link>' + label + '</span></a>';
}
function bold(str) {
    return '<span class=bold>' + str + '</span>';
}
function colored(str, color) {
    return '<span style=\"color:' + color + '\">' + str + "</span>";
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
        this.elem.addEventListener('keypress', e => this.update(e));
        this.elem.addEventListener('keydown', e => this.update(e));
        this.elem.addEventListener('click', e => this.updateCursor());
        this.prompt();
        this.updateCursor();
    }
    update(e) {
        if (e.key == 'Enter') {
            this.execute(this.input);
            this.input = "";
            this.prompt();
            e.preventDefault();
        }
        else if (e.key == 'Backspace') {
            if (this.input.length > 0) {
                this.input = this.input.slice(0, this.input.length - 1);
                this.elem.innerHTML = this.elem.innerHTML.slice(0, this.elem.innerHTML.length - 1);
            }
            e.preventDefault();
        }
        else if (e.key.length == 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
            this.input += e.key;
            this.append(e.key);
            e.preventDefault();
        }
        this.updateCursor();
    }
    execute(str) {
        if (str.trim().length == 0)
            return;
        this.newline();
        let args = str.trim().split(' ');
        find_command(args[0]).execute(this, args);
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
        this.elem.scrollTop = this.elem.scrollHeight;
    }
}
const term = new Terminal('terminal');
(_a = document.getElementById('socials-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
    term.append("socials");
    find_command("socials").execute(term, ["socials"]);
    term.prompt();
});
(_b = document.getElementById('help-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', (e) => {
    term.append("help");
    find_command("help").execute(term, ["help"]);
    term.prompt();
});
(_c = document.getElementById('about-button')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', (e) => {
    term.append("about");
    find_command("about").execute(term, ["about"]);
    term.prompt();
});
//# sourceMappingURL=index.js.map