import { PilaListener } from '../generated/PilaListener.js';

export class PilaTranslator extends PilaListener {
    constructor() {
        super();
        this.jsCode = [];
        this.executionLog = [];
        this.pilaState = {};
        this.currentPila = null;
    }

    enterPrograma(ctx) {
        const nombre = ctx.ID().getText();
        this.currentPila = `pila_${nombre}`;
        this.pilaState[this.currentPila] = [];
        this.jsCode.push(`let ${this.currentPila} = [];`);
        this.executionLog.push(`Pila '${nombre}' creada`);
    }

    enterCrear(ctx) {
        const elementos = ctx.lista().getText();
        this.jsCode.push(`${this.currentPila} = ${elementos};`);
        this.executionLog.push(`Pila inicializada con valores: ${elementos}`);
        this.pilaState[this.currentPila] = JSON.parse(elementos.replace(/'/g, '"'));
    }

    enterPush(ctx) {
        const valor = ctx.valor().getText();
        this.jsCode.push(`${this.currentPila}.push(${valor});`);
        this.executionLog.push(`Empujando valor: ${valor}`);
        this.pilaState[this.currentPila].push(eval(valor));
    }

    enterPop(ctx) {
        this.jsCode.push(`let popped = ${this.currentPila}.pop();`);
        const poppedValue = this.pilaState[this.currentPila].pop();
        this.executionLog.push(`Sacando valor: ${poppedValue}`);
    }

    enterPeek(ctx) {
        this.jsCode.push(`let top = ${this.currentPila}[${this.currentPila}.length - 1];`);
        const topValue = this.pilaState[this.currentPila][this.pilaState[this.currentPila].length - 1];
        this.executionLog.push(`Valor en tope: ${topValue}`);
    }

    getExecutionLog() {
        return this.executionLog;
    }

    getPilaState() {
        return this.pilaState;
    }
}