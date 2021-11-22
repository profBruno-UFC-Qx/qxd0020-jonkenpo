const PEDRA = "Pedra";
const TESOURA = "Tesoura";
const PAPEL = "Papel";



class Jogador {
    constructor(nome = "npc") {
        this.nome = nome;
        this.vitorias = 0;
        this._escolha = null;
    }
    get escolha() { return this._escolha};
    set escolha(valor) { this._escolha = [PEDRA, TESOURA, PAPEL].includes(valor) ? valor : PEDRA };
}

class Game {
    constructor() {
        this.p1Vitorias = 0;
        this.npcVitorias = 0;
        this.p1 = new Jogador("Bruno");
        this.npc = new Jogador();
    }

    iniciar() {
        this.npcVitorias = 0;
        this.p1Vitorias = 0;
    }

    escolher(escolha) {
        this.p1.escolha = escolha;
    }

    npcEscolher() {
        this.npc.escolha =[PEDRA, TESOURA, PAPEL][Math.floor(Math.random() * 3)];
    }

    deuEmpate() {
        return this.p1.escolha === this.npc.escolha;
    }

    venceu() {
        if (
            (this.p1.escolha == PEDRA && this.npc.escolha == TESOURA) ||
            (this.p1.escolha == TESOURA && this.npc.escolha == PAPEL) ||
            (this.p1.escolha == PAPEL && this.npc.escolha == PEDRA)
        ){
            this.p1Vitorias++;
            return true;
        }
        this.npcVitorias++;
        return false;

    }

    acabou() {
        return Math.max(this.p1Vitorias, this.npcVitorias) > 2;
    }

}

class UI {
    constructor(game) {
        this.divApresentacao = document.getElementById("apresentacao");
        this.btnComecar = document.getElementById("comecar");
        this.spanP1Score = document.getElementById("p1_score");
        this.spanNPCScore = document.getElementById("npc_score");
        this.divPlacar = document.getElementById("placar");
        this.imgP1 = document.getElementById("p1_escolha");
        this.imgNPC = document.getElementById("npc_escolha");
        this.divMensagem = document.getElementById("mensagem");
        this.btnPedra = document.getElementById("pedra");
        this.btnTesoura = document.getElementById("tesoura");
        this.btnPapel = document.getElementById("papel");
        this.game = game;

        this.btnComecar.addEventListener("click", () => this.comecar());

        this.btnPedra.addEventListener("click", () => this.escolher(PEDRA));
        this.btnTesoura.addEventListener("click", () => this.escolher(TESOURA));
        this.btnPapel.addEventListener("click", () => this.escolher(PAPEL));

        this.game.iniciar();


    }

    comecar() {
        this.divApresentacao.setAttribute("class", "invisible");
        this.reiniciarMensagem();
    }

    atualizarMensagem(mensagem, append= true) {
        if(append) {
            const novaLinha = document.createElement("br");
            this.divMensagem.appendChild(novaLinha);
            this.divMensagem.appendChild(document.createTextNode(mensagem));
        } else {
            this.divMensagem.textContent = mensagem;
        }
    }

    mostrarEscolha(opcao, player) {
        player.setAttribute("src", `img/${opcao}.png`);
        player.setAttribute("class", "visible");
    }

    esconderEscolhas() {
        this.imgNPC.setAttribute("class", "invisible");
        this.imgP1.setAttribute("class", "invisible");
    }


    atualizarPlacar() {
        if(this.game.deuEmpate()) {
            this.divPlacar.setAttribute("class", "alert-secondary");
            this.atualizarMensagem("Que azar, deu empate!", false);

        } else if (this.game.venceu()){
            this.divPlacar.setAttribute("class", "alert-success");
            let scoreAtual = parseInt(this.spanP1Score.textContent);
            scoreAtual++;
            this.spanP1Score.textContent = scoreAtual;
            this.atualizarMensagem("Parabéns você ganhou!", false);
        } else {
            this.divPlacar.setAttribute("class", "alert-danger");
            let scoreAtual = parseInt(this.spanNPCScore.textContent);
            scoreAtual++;
            this.spanNPCScore.textContent = scoreAtual;
            this.atualizarMensagem("Infelizmente você perdeu!", false);

        }

        setTimeout(() => {
            if(this.game.acabou()) {
                if(this.game.p1Vitorias > this.game.npcVitorias) {
                    this.divMensagem.setAttribute("class", "alert alert-success");
                } else {
                    this.divMensagem.setAttribute("class", "alert alert-danger");
                }

                const recomecar = document.createElement("button");
                recomecar.setAttribute("class", "btn btn-light");
                recomecar.appendChild(document.createTextNode("Recomeçar"));
                recomecar.addEventListener("click", () => this.recomecar());
                this.divMensagem.appendChild(document.createElement("br"));
                this.divMensagem.appendChild(recomecar);
                this.desabilitarBotoes();

            } else {
                this.proximaPartida();
            }
        }, 500);
    }

    zerarPlacar() {
        this.divPlacar.setAttribute("class", "alert-info");
        this.spanNPCScore.textContent = 0;
        this.spanP1Score.textContent = 0;
    }

    desabilitarBotoes() {
        this.btnPedra.setAttribute("disabled", "disabled");
        this.btnTesoura.setAttribute("disabled", "disabled");
        this.btnPapel.setAttribute("disabled", "disabled");
    }

    habilitarBotoes() {
        this.btnPedra.removeAttribute("disabled");
        this.btnTesoura.removeAttribute("disabled");
        this.btnPapel.removeAttribute("disabled");
    }

    reiniciarMensagem() {
        this.divMensagem.removeAttribute("class");
        this.atualizarMensagem("Escolha uma das opções abaixo.", false);
    }

    recomecar() {
        this.habilitarBotoes();
        this.reiniciarMensagem();
        this.esconderEscolhas();
        this.zerarPlacar();
        this.game.iniciar();
    }

    proximaPartida() {
        this.habilitarBotoes();
        this.imgP1.setAttribute("class", "invisible");
        this.imgNPC.setAttribute("class", "invisible");
        this.atualizarMensagem("É sua vez novamente.", false);
        this.atualizarMensagem("Escolha uma das opções abaixo.");
    }

    escolher(opcao) {
        this.game.escolher(opcao);
        this.game.npcEscolher();
        this.mostrarEscolha(opcao, this.imgP1);
        this.mostrarEscolha(this.game.npc.escolha, this.imgNPC);
        this.atualizarMensagem(`Você escolheu ${opcao}.`, false);
        this.atualizarMensagem("Aguarde o seu adversário.");
        this.atualizarMensagem(`Seu adversário escolheu ${this.game.npc.escolha}.`);
        this.desabilitarBotoes();
        setTimeout(() => this.atualizarPlacar(), 1000);


    }


}

window.onload = () => {
    const jokenpo = new Game();
    const ui = new UI(jokenpo);


}