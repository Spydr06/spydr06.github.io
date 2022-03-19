"use strict";
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
        switch (e.code) {
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
    execute(str) {
        alert(str);
    }
    prompt() {
        let str = this.prompt_fmt
            .replace("%d", this.current_dir)
            .replace("%u", this.current_user)
            .replace("%h", this.current_host);
        this.append(str);
    }
    append(str) {
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
//# sourceMappingURL=index.js.map