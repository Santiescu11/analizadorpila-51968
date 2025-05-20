import antlr4 from 'antlr4';
import { PilaLexer } from './generated/PilaLexer.js';
import { PilaParser } from './generated/PilaParser.js';
import { PilaTranslator } from './translator.js';
import fs from 'fs';

function analyze(input) {
    // 1. Análisis léxico/sintáctico
    const chars = new antlr4.InputStream(input);
    const lexer = new PilaLexer(chars);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new PilaParser(tokens);

    // Manejo de errores
    let syntaxErrors = [];
    parser.addErrorListener({
        syntaxError: (recognizer, offendingSymbol, line, column, msg, err) => {
            syntaxErrors.push({
                line,
                column,
                message: msg,
                offendingSymbol: offendingSymbol?.text || ''
            });
        }
    });

    const tree = parser.programa();

    // 2. Tabla de tokens
    const tokenTable = [];
    for (let token of tokens.tokens) {
        if (token.channel !== antlr4.Lexer.HIDDEN && token.type !== antlr4.Token.EOF) {
            tokenTable.push({
                Lexema: token.text,
                Token: lexer.symbolicNames[token.type] || `TOKEN_${token.type}`,
                Línea: token.line,
                Columna: token.column
            });
        }
    }

    // 3. Traducción a JavaScript
    const translator = new PilaTranslator();
    antlr4.tree.ParseTreeWalker.DEFAULT.walk(translator, tree);

    // 4. Ejecución simulada (opcional)
    const executionLog = translator.getExecutionLog();

    return {
        syntaxErrors,
        tokenTable,
        syntaxTree: tree.toStringTree(parser.ruleNames, parser),
        translatedCode: translator.jsCode,
        executionLog,
        pilaState: translator.getPilaState()
    };
}

// Ejemplo de uso
try {
    const input = fs.readFileSync('input.txt', 'utf-8');
    const result = analyze(input);

    // Mostrar resultados
    console.log("=== ERRORES SINTÁCTICOS ===");
    if (result.syntaxErrors.length > 0) {
        console.table(result.syntaxErrors);
    } else {
        console.log("No se encontraron errores sintácticos.");
    }

    console.log("\n=== TABLA DE TOKENS ===");
    console.table(result.tokenTable);

    console.log("\n=== ÁRBOL SINTÁCTICO ===");
    console.log(result.syntaxTree);

    console.log("\n=== CÓDIGO TRADUCIDO ===");
    console.log(result.translatedCode);

    console.log("\n=== REGISTRO DE EJECUCIÓN ===");
    console.log(result.executionLog.join('\n'));

    console.log("\n=== ESTADO FINAL DE LA PILA ===");
    console.log(result.pilaState);

} catch (error) {
    console.error("Error al analizar el archivo:", error.message);
}

export { analyze };