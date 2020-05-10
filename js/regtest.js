document.getElementById('convert-btn').addEventListener('click', (event) => {
    let inputText = document.getElementById('input-text').value;
    outputText = inputText.replace(/(\s')|('\s)|('$)|(^')/g, function (match, p1, p2, p3, p4) {
        if (p1 != null)
            return ' "';
        else if (p2 != null)
            return '" ';
        else
            return '"';
    });
    
    document.getElementById('output-text').value = outputText;
});

