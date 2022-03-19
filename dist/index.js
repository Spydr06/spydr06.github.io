"use strict";
const HELP_TEXT = "";
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
        else if (str == 'clear')
            this.elem.innerHTML = '';
        else if (str == 'help')
            this.append(HELP_TEXT);
        else
            this.append("\n/bin/sh: command not found: " + str);
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
    updateCursor() {
        this.elem.focus();
        this.elem.setSelectionRange(this.elem.value.length, this.elem.value.length);
    }
}
new Terminal('terminal');
//# sourceMappingURL=index.js.map