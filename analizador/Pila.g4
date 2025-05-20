grammar Pila;

programa: 'pila' ID '{' comandos '}';
comandos: (operacion)*;
operacion: push | pop | peek | crear | imprimir;

crear: 'crear' '(' lista ')' '!';
push: 'empujar' '(' valor ')' '!';
pop: 'sacar' '(' ')' '!';
peek: 'mirar' '(' ')' '!';
imprimir: 'imprimir' '(' ')' '!';

valor: NUMERO | TEXTO;
lista: '[' (valor (',' valor)*)? ']';

NUMERO: [0-9]+;
TEXTO: '"' .*? '"';
ID: [a-zA-Z][a-zA-Z0-9_]*;

WS: [ \t\r\n]+ -> skip;
COMMENT: '#' .*? '\n' -> skip;