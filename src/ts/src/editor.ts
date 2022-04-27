/* eslint-disable */
let PROJECT_NAME: string;
let filesOpen: any[];

let textEditorNoFiles: any;
let textEditor: any;

let terminalInput: any;
let terminal: any;

let first: boolean = true;

function init() {
    PROJECT_NAME = 'Project';
    filesOpen = [];

    textEditorNoFiles = document.querySelectorAll('.text-editor-no-files')[0];
    textEditor = document.querySelectorAll('.text-editor')[0];

    terminalInput = document.querySelectorAll('.terminal-input')[0];
    terminal = document.getElementById('terminal-text');

    // @ts-ignore
    terminalInput.addEventListener('keyup', ({ key }) => {
        if (key !== 'Enter') return;

        const command = terminalInput.value;

        const output = `Output for command ${command}`;

        addTerminalOutput(command, output);

        terminal.scrollTop = terminal.scrollHeight;

        terminalInput.value = '';
    });
}

function openFirstFile() {
    if (filesOpen.length > 0) return;
    if (
        textEditor.classList.contains('active') ||
        !textEditorNoFiles.classList.contains('active')
    )
        return;

    textEditorNoFiles.classList.remove('active');
    textEditor.classList.add('active');
}

function closeFiles() {
    //if (filesOpen.length < 1) return;
    if (
        textEditorNoFiles.classList.contains('active') ||
        !textEditor.classList.contains('active')
    )
        return;

    textEditorNoFiles.classList.add('active');
    textEditor.classList.remove('active');
}

function addTerminalOutput(command: string, output: string) {
    if (first) terminal.innerHTML = '';
    terminal.innerHTML += `<span class="bold"><span class="blue">~/${PROJECT_NAME}</span> $ ${command}</span><br>${output}<br>`;
    first = false;
}

function initTerminal() {
    if (terminal.innerHTML !== '') return;
    terminal.innerHTML += `<span class="bold"><span class="blue">~/${PROJECT_NAME}</span> $</span><br>`;
}
