const PEDRA = "Pedra";
const TESOURA = "Tesoura";
const PAPEL = "Papel";

function escolhaRandomica() {
    return [PEDRA, TESOURA, PAPEL][Math.floor(Math.random() * 3)];
}


class Jogador {
    constructor(nome = "npc") {
        this.nome = nome;
        this.vitorias = 0;
        this._escolha = null;
    }
    get escolha() { return this._escolha};
    set escolha(valor) { this._escolha = [PEDRA, TESOURA, PAPEL].includes(valor) ? valor : PEDRA };
}

const p1 = new Jogador("Bruno");
const npc = new Jogador();

npc.escolher = function() {
    this.escolha = escolhaRandomica();
};


((nome = "Chico") =>  console.log(`Seja bem vindo ${nome}. A partida vai começar`))(p1.nome);

console.log("É sua vez. Digite:");
console.log("P -> Papel");
console.log("T -> Tesoura");
console.log("L -> Papel");

function verificaEscolha(escolha) {
    switch (escolha) {
        case 'P':
            return PEDRA;
        case 'T':
            return TESOURA;
        case 'L':
            return PAPEL;
        default:
            return false;
    }
}

const deuEmpate = (escolhaJogador, escolharNPC) => escolhaJogador == escolharNPC;

const venceu = function (escolhaJogador, escolhaNPC) {
    if (
        (escolhaJogador == PEDRA && escolhaNPC == TESOURA) ||
        (escolhaJogador == TESOURA && escolhaNPC == PAPEL) ||
        (escolhaJogador == PAPEL && escolhaNPC == PEDRA)
    ){
        return true;
    }
    return false;
}

const imprimeResultado = (vitoriasJogador, vitoriasNPC) => {
    if(vitoriasJogador > vitoriasNPC) {
        console.log(`Parabéns vc venceu a melhor de 5, por ${vitoriasJogador} a ${vitoriasNPC}`);
    } else {
        console.log(`Infezlimente vc perdeu a melhor de 5, de ${vitoriasNPC} a ${vitoriasJogador}`);
    }
}

do {
    p1.escolha = PEDRA;
    npc.escolher();

    if (deuEmpate(p1.escolha, npc.escolha)) {
        console.log(`Empate. Vc e o computdor escolheram ${p1.escolha}`);
    } else {
        const venci = venceu(p1.escolha, npc.escolha);
        const resutaldo = venci ? "venceu" : "perdeu";
        venci ? p1.vitorias++ : npc.vitorias++;
        console.log(`Vc ${resutaldo}. Vc escolheu ${p1.escolha} e o computador escolheu ${npc.escolha}.`);
    }
} while (Math.max(p1.vitorias, npc.vitorias) < 3);

imprimeResultado(p1.vitorias, npc.vitorias);

