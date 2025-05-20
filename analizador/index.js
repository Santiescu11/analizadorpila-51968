import antlr4 from 'antlr4';
import { InputStream, CommonTokenStream } from 'antlr4';
import PilaLexer from './generated/PilaLexer.js';
import PilaParser from './generated/PilaParser.js';
import CustomPilaVisitor from './CustomPilaVisitor.js';
import fs from 'fs';

async function main() {
    try {
        // 1. Leer entrada
        const input = fs.readFileSync('input.txt', 'utf8');
        console.log("=== Entrada ===");
        console.log(input);

        // 2. Configurar analizadores
        const chars = new InputStream(input);
        const lexer = new PilaLexer(chars);
        const tokens = new CommonTokenStream(lexer);
        const parser = new PilaParser(tokens);

        // 3. Manejo de errores
        let syntaxErrors = [];
        parser.removeErrorListeners();
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

        // 4. Construir árbol sintáctico
        const tree = parser.programa();

        // 5. Mostrar tokens
        console.log("\n=== Tokens ===");
        tokens.getTokens().forEach(token => {
            if (token.channel !== antlr4.Lexer.HIDDEN && token.type !== antlr4.Token.EOF) {
                const typeName = PilaLexer.symbolicNames[token.type] || `TOKEN_${token.type}`;
                console.log(`${typeName.padEnd(10)}: '${token.text}' (Línea ${token.line}:${token.column})`);
            }
        });

        // 6. Mostrar árbol sintáctico
        console.log("\n=== Árbol Sintáctico ===");
        console.log(tree.toStringTree(parser.ruleNames));

        // 7. Manejar errores
        if (syntaxErrors.length > 0) {
            console.error("\n=== Errores Sintácticos ===");
            syntaxErrors.forEach(err => {
                console.error(`Línea ${err.line}:${err.column} - ${err.message}`);
                console.error(`Símbolo: "${err.offendingSymbol}"\n`);
            });
            return;
        }

        // 8. Usar el Visitor
        console.log("\n=== Ejecución ===");
        const visitor = new CustomPilaVisitor();
        const result = visitor.visit(tree);

        // 9. Mostrar resultados
        console.log("\n=== Estado Final ===");
        console.log(result);

    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

main();