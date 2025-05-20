import PilaListener from '../generated/PilaListener.js';

export default class CustomPilaListener extends PilaListener {
    constructor() {
        super();
        this.symbolTable = new Map(); // Tabla de símbolos
        this.operations = [];         // Registro de operaciones
        this.currentPila = null;      // Pila actual
    }

    // Evento al entrar a un programa
    enterPrograma(ctx) {
        const nombrePila = ctx.ID().getText();
        this.currentPila = [];
        this.symbolTable.set(nombrePila, this.currentPila);
        this.operations.push(`INICIO: Pila '${nombrePila}' creada`);
    }

    // Evento al salir de un programa
    exitPrograma(ctx) {
        this.operations.push(`FIN: Programa ejecutado correctamente`);
    }

    // Evento al completar operación crear
    exitCrear(ctx) {
        this.operations.push(`OPERACIÓN: crear ejecutada`);
    }

    // Evento al completar operación empujar
    exitPush(ctx) {
        const valor = ctx.valor().getText();
        this.operations.push(`OPERACIÓN: empujar(${valor}) ejecutada`);
    }

    // Evento al completar operación sacar
    exitPop(ctx) {
        this.operations.push(`OPERACIÓN: sacar() ejecutada`);
    }

    // Evento al completar operación mirar
    exitPeek(ctx) {
        this.operations.push(`OPERACIÓN: mirar() ejecutada`);
    }

    // Evento al completar operación imprimir
    exitImprimir(ctx) {
        this.operations.push(`OPERACIÓN: imprimir() ejecutada`);
    }

    // Métodos auxiliares
    getSymbolTable() {
        return Object.fromEntries(this.symbolTable);
    }

    getOperations() {
        return this.operations;
    }
}