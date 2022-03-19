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
        switch(e.code) {
            case 'Enter': 
                this.execute(this.input);
                this.input = "";
                this.newline();
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
        e.preventDefault();
    }

    execute(str: string) {
        alert(str);
    }

    prompt() {
        let str = this.prompt_fmt
            .replace("%d", this.current_dir)
            .replace("%u", this.current_user)
            .replace("%h", this.current_host);
        this.append(str);
    }

    append(str: string) {
        this.elem.innerHTML += str;
    }

    newline() {
        this.elem.innerHTML += '\n';
    }

    updateCursor() {
        this.elem.focus();
        this.elem.setSelectionRange(this.elem.value.length, this.elem.value.length);
    }
}

new Terminal('terminal');