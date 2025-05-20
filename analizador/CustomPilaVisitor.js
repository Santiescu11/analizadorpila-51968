import PilaVisitor from '../generated/PilaVisitor.js';

export default class CustomPilaVisitor extends PilaVisitor {
    constructor() {
        super();
        this.pilas = new Map();  // Mapa para múltiples pilas
        this.currentPila = null;  // Pila actual
        this.executionLog = [];   // Registro de operaciones
        this.output = [];         // Salida de impresiones
    }

    // Visita el nodo raíz (programa)
    visitPrograma(ctx) {
        const nombrePila = ctx.ID().getText();
        this.currentPila = [];
        this.pilas.set(nombrePila, this.currentPila);
        this.executionLog.push(`Pila '${nombrePila}' creada`);
        return this.visitChildren(ctx);
    }

    // Operación crear
    visitCrear(ctx) {
        const valores = this.visit(ctx.lista());
        this.currentPila.push(...valores);
        this.executionLog.push(`Pila inicializada con valores: [${valores.join(', ')}]`);
        return null;
    }

    // Operación empujar (push)
    visitPush(ctx) {
        const valor = this.visit(ctx.valor());
        this.currentPila.push(valor);
        this.executionLog.push(`Valor empujado: ${valor}. Estado: [${this.currentPila.join(', ')}]`);
        return null;
    }

    // Operación sacar (pop)
    visitPop(ctx) {
        if (this.currentPila.length === 0) {
            this.executionLog.push('¡Error! No se puede sacar de pila vacía');
            return null;
        }
        const valor = this.currentPila.pop();
        this.executionLog.push(`Valor sacado: ${valor}. Estado: [${this.currentPila.join(', ')}]`);
        return valor;
    }

    // Operación mirar (peek)
    visitPeek(ctx) {
        if (this.currentPila.length === 0) {
            this.executionLog.push('¡Error! No se puede mirar pila vacía');
            return null;
        }
        const valor = this.currentPila[this.currentPila.length - 1];
        this.executionLog.push(`Valor en tope: ${valor}`);
        return valor;
    }

    // Operación imprimir
    visitImprimir(ctx) {
        const contenido = `[${this.currentPila.join(', ')}]`;
        this.output.push(contenido);
        this.executionLog.push(`Impresión: ${contenido}`);
        return null;
    }

    // Visita una lista de valores
    visitLista(ctx) {
        return ctx.valor() ? ctx.valor().map(valCtx => this.visit(valCtx)) : [];
    }

    // Visita un valor (número o texto)
    visitValor(ctx) {
        if (ctx.NUMERO()) {
            return parseInt(ctx.NUMERO().getText());
        } else if (ctx.TEXTO()) {
            return ctx.TEXTO().getText().slice(1, -1); // Elimina comillas
        }
    }

    // Métodos auxiliares
    getExecutionLog() {
        return this.executionLog;
    }

    getOutput() {
        return this.output;
    }

    getPilaState() {
        return Object.fromEntries(this.pilas);
    }
}