type Color = "red" | "green" | "blue" | "magenta" | "yellow" | "cyan" | "orange";

const GREETING = 
`${bold('====== spydr06.github.io ======')}

Hi there and welcome to my (${colored("Spydr06's", "blue")}) homepage.
Feel free to type in some commands, if you need help,
type ${colored("help", "cyan")}.
`

const HELP_TEXT1 = `
${bold('====== spydr06.github.io ======')}

${colored('Commands:', 'yellow')}
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
It's an imperative/procedural low-level language written in pure C, while having many
similarities with C. You can find more information here: ${link("https://github.com/spydr06/cspydr.git", "https://github.com/spydr06/cspydr.git")}

You want to see a few more projects of me? type ${colored('projects', 'cyan')} into the console.
You can visit my other profiles, by typing ${colored('socials', 'cyan')}.
`;

const SOCIALS_TEXT = `
${bold("Spydr06's social media profiles:")}
${colored("*", "green")} GitHub:  ${link("Spydr06", "https://github.com/Spydr06")}
${colored("*", "green")} Reddit: ${link("u/mcspiderfe", "https://reddit.com/u/mcspiderfe")}
${colored("*", "green")} Discord: Spydr#7096
${colored("*", "green")} EMail: spydr06@web.de
`;

interface Command {
    id: string;
    description: string;
    expectedArgs: number;

    execute: (term: Terminal, args: string[]) => boolean;
};

const ERROR_COMMAND: Command = {
    id: '', 
    description: '', 
    expectedArgs: 0, 
    execute: function(term, args) { 
        term.append_colored("/bin/sh: command not found: " + args[0], "red");
        return false; 
    }
};

const COMMANDS: Command[] = [
    {
        id: 'clear', 
        description: 'Clears the Terminal.', 
        expectedArgs: 1,
        execute: function(term: Terminal, args: string[]) {
            if(args.length == this.expectedArgs) {
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
        execute: function(term: Terminal, args: string[]) {
            if(args.length == this.expectedArgs) {
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
        execute: function(term: Terminal, args: string[]) {
            if(args.length == this.expectedArgs) {
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
        execute: function(term: Terminal, args: string[]) {
            if(args.length == this.expectedArgs) {
                term.append(SOCIALS_TEXT);
                return true;
            }
            else {
                term.append_colored("socials: unexpected argument '" + args[1] + "'", "red");
                return false;
            }
        }
    },
    {
        id: 'projects',
        description: 'Displays a list of some of my projects I\'ve created so far',
        expectedArgs: 1,
        execute: function(term: Terminal, args: string[]) {
            term.append_colored('Coming soon...', 'orange');
            return false;
        }
    }
];

function command_list(): string {
    let str = '';
    COMMANDS.forEach((cmd: Command) => {
        str += colored('*', 'green') + ' ' + colored(cmd.id, 'cyan') + ': ' + cmd.description + '\n';
    });
    return str;
}

function find_command(id: string): Command {
    for(let i = 0; i < COMMANDS.length; i++) {
        if(COMMANDS[i].id == id)
            return COMMANDS[i];
    }
    return ERROR_COMMAND;
}

function link(label: string | undefined, link: string): string {
    return '<a href="' + link + '"><span class=link>' + label + '</span></a>';
}

function bold(str: string): string {
    return '<span class=bold>' + str + '</span>';
}

function colored(str: string, color: Color): string {
    return '<span style=\"color:' + color as string + '\">' + str + "</span>";
}

class Terminal {
    elem: HTMLInputElement;

    prompt_fmt = "[%u@%h %d]$ ";
    current_dir = "~";
    current_user = "spydr"
    current_host = "localhost";

    input = "";

    constructor(elem_id: string) {
        let el = document.getElementById(elem_id);
        this.elem = el as HTMLInputElement;
        
        this.elem.setAttribute("contentEditable", "true");
        this.elem.addEventListener("oncut", e => e.preventDefault(), false);
        this.elem.addEventListener("onpaste", e => e.preventDefault(), false);
        this.elem.addEventListener('keypress', e => this.update(e));
        this.elem.addEventListener('keydown', e => this.update(e));
        this.elem.addEventListener('click', e => this.updateCursor());
        
        this.append(GREETING);
        this.prompt();
        this.updateCursor();
    }
    
    update(e: KeyboardEvent) {
        if(e.key == 'Enter') {
            this.execute(this.input);
            this.input = "";
            this.prompt();
            e.preventDefault();
        }
        else if(e.key == 'Backspace') {
            if(this.input.length > 0) {
                this.input = this.input.slice(0, this.input.length - 1);
                this.elem.innerHTML = this.elem.innerHTML.slice(0, this.elem.innerHTML.length - 1);
            }
            e.preventDefault();
        }
        else if(e.key.length == 1 && !e.altKey && !e.ctrlKey && !e.metaKey){
            this.input += e.key;
            this.append(e.key);
            e.preventDefault();
        }

        this.updateCursor();
    }

    execute(str: string) {
        if(str.trim().length == 0)
            return;
        this.newline();
        
        let args = str.trim().split(' ');
        find_command(args[0]).execute(this, args);
    }

    parse_prompt(): string {
        return this.prompt_fmt
        .replace("%d", this.current_dir)
        .replace("%u", this.current_user)
        .replace("%h", this.current_host);
    }

    prompt() {
        if(this.elem.innerHTML !== '')
            this.newline();

        this.append(this.parse_prompt());
    }

    append_colored(str: string, color: Color) {
        this.elem.innerHTML += '<span style=\"color:' + color as string + '\">' + str + "</span>";
    }

    append(str: string) {
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

        sel?.removeAllRanges();
        sel?.addRange(range);

        this.elem.scrollTop = this.elem.scrollHeight;
    }
}

const term = new Terminal('terminal');

document.getElementById('socials-button')?.addEventListener('click', (e) => {
    term.append("socials");
    find_command("socials").execute(term, ["socials"]);
    term.prompt();
});

document.getElementById('help-button')?.addEventListener('click', (e) => {
    term.append("help")
    find_command("help").execute(term, ["help"]);
    term.prompt();
});

document.getElementById('about-button')?.addEventListener('click', (e) => {
    term.append("about")
    find_command("about").execute(term, ["about"]);
    term.prompt();
});
