type Color = "red" | "green" | "blue" | "magenta" | "yellow" | "cyan";

const HELP_TEXT = "";

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
        this.elem.addEventListener('keypress', (e) => this.update(e));

        this.prompt();
        this.updateCursor();
    }
    
    update(e: KeyboardEvent) {
        e.preventDefault();
        switch(e.code) {
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

    execute(str: string) {
        if(str.replace(" ", "").length == 0)
            return;
        else if(str == 'clear')
            this.elem.innerHTML = '';
        else if(str == 'help')
            this.append(HELP_TEXT);
        else 
            this.append("\n/bin/sh: command not found: " + str);
    }

    prompt() {
        if(this.elem.innerHTML !== '')
            this.newline();

        let str = this.prompt_fmt
            .replace("%d", this.current_dir)
            .replace("%u", this.current_user)
            .replace("%h", this.current_host);
        this.append(str);
    }

    append_colored(str: string, color: Color) {
        this.elem.innerHTML += '<span style=\"color:' + color as string + '\">' + str + "</span>";
    }

    append(str: string) {
        this.elem.innerHTML += str;
    }

    newline() {
        this.elem.innerHTML += '\n';
        this.elem.scrollTo(0, this.elem.scrollHeight);
    }

    updateCursor() {
        this.elem.focus();
        this.elem.setSelectionRange(this.elem.value.length, this.elem.value.length);
    }
}

new Terminal('terminal');