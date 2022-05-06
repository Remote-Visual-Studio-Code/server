/* eslint-disable */
let PROJECT_NAME: string;
let filesOpen: any[];

let textEditorNoFiles: any;
let textEditor: any;

let terminalInput: any;
let terminal: any;

let first: boolean = true;

const ACE_MODES = {
    js: 'ace/mode/javascript',
    ts: 'ace/mode/typescript',
    css: 'ace/mode/css',
    html: 'ace/mode/html',
    json: 'ace/mode/json',
    java: 'ace/mode/java',
    c: 'ace/mode/c_cpp',
    cpp: 'ace/mode/c_cpp',
    py: 'ace/mode/python',
    rb: 'ace/mode/ruby',
    php: 'ace/mode/php',
    sql: 'ace/mode/sql',
    scss: 'ace/mode/scss',
    less: 'ace/mode/less',
    styl: 'ace/mode/stylus',
    yml: 'ace/mode/yaml',
    yaml: 'ace/mode/yaml',
    md: 'ace/mode/markdown',
    markdown: 'ace/mode/markdown',
    txt: 'ace/mode/text',
};

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

    initTerminal();
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

function openFile(file: string, content: string) {
    if (filesOpen.length === 0) openFirstFile();

    const oldFile = document.querySelectorAll('.file')[0];
    if (oldFile) oldFile.remove();

    const fileContainer = document.createElement('div');
    fileContainer.classList.add('file');
    fileContainer.id = 'editor';

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        fileContainer.innerHTML += line;

        if (i !== lines.length - 1) fileContainer.innerHTML += '\n';
    }

    fileContainer.style.width = '1fr';
    fileContainer.style.height = '90vh';
    fileContainer.style.overflowX = 'hidden';
    fileContainer.style.overflowY = 'hidden';

    fileContainer.style.marginLeft = '50px';
    fileContainer.style.marginRight = '50px';

    fileContainer.style.marginBottom = '100px';

    // @ts-ignore
    document
        .getElementById('text-editor-files-container')
        .appendChild(fileContainer);

    // @ts-ignore
    ace.edit('editor', {
        theme: 'ace/theme/one_dark',
        // @ts-ignore
        mode: ACE_MODES[file.split('.').pop()],
        autoScrollEditorIntoView: true,
        showGutter: true,
        minLines: lines.length < 100 ? lines.length : 100,
    });
}

function closeFiles() {
    if (filesOpen.length < 1) return;
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
