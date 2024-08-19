const path = require('path');
const fs = require('fs');

[
    path.resolve(__dirname, 'src/docs'),
    path.resolve(__dirname, 'src/images')
].forEach(dir => {
    fs.watch(dir, {recursive: true}, onFileChanged)
});

let debounceTimer = null;

function onFileChanged(type, name) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        triggerStencil();
    }, 500);
}

function triggerStencil() {
    fs.writeFileSync(path.resolve(__dirname, 'src/crc.ts'), `// ${Date.now()}`);
}
