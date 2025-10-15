document.addEventListener('DOMContentLoaded', () => {
    M.AutoInit();
    carregaTabela();
});

function carregaTabela(){
    const req = new XMLHttpRequest();
    req.open('GET','http://localhost:8080/instrumentosMusicais');

    req.onload = () => {
        if(req.status !== 200){
            M.toast({html: 'Erro ao carregar a tabela'});
            return;
        }

        const instrumentos = JSON.parse(req.responseText);
        let tab = '';
        instrumentos.forEach(p => {
            // Substituir aspas simples para evitar conflito no onclick
            const pJson = JSON.stringify(p).replace(/'/g, "&apos;");
            tab += `<tr id="linha${p.id}">
                <td>${p.id}</td>
                <td>${p.instrumento}</td>
                <td>${p.quantidade}</td>
                <td>${p.tipo}</td>
                <td>
                    <button class="btn red lighten-1 waves-effect waves-light" title="Apagar" onclick="apagarInstrumento(${p.id})">
                        <i class="material-icons">delete</i>
                    </button>
                    <button class="btn blue lighten-1 waves-effect waves-light" title="Editar" onclick="abaAlterar('${pJson}')">
                        <i class="material-icons">edit</i>
                    </button>
                </td>
            </tr>`;
        });
        document.getElementById('tabInstrumentos').innerHTML = tab;
    };

    req.onerror = () => {
        M.toast({html: 'Erro na comunicação com o servidor'});
    };

    req.send();
}

function incluirInstrumentos() {
    const instrumento = document.querySelector('input[name="instrumento"]:checked');
    const quantidade = document.querySelector('input[name="quantidade"]:checked');
    const tipo = document.querySelector('input[name="tipo"]:checked');

    if (!instrumento) {
        M.toast({html: 'Selecione um instrumento musical'});
        return;
    }
    if (!quantidade) {
        M.toast({html: 'Selecione a quantidade'});
        return;
    }
    if (!tipo) {
        M.toast({html: 'Selecione canhoto ou destro'});
        return;
    }

    const novoInstrumento = {
        instrumento: instrumento.value,
        quantidade: parseInt(quantidade.value),
        tipo: tipo.value
    };

    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:8080/instrumentosMusicais');
    req.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    req.onload = () => {
        if (req.status === 200) {
            M.toast({html: 'Instrumento incluído com sucesso!'});
            carregaTabela();
            // Limpa seleção
            document.querySelectorAll('input[name="instrumento"]').forEach(i => i.checked = false);
            document.querySelectorAll('input[name="quantidade"]').forEach(i => i.checked = false);
            document.querySelectorAll('input[name="tipo"]').forEach(i => i.checked = false);
        } else {
            M.toast({html: 'Erro ao incluir instrumento'});
            console.error(req.responseText);
        }
    };

    req.onerror = () => {
        M.toast({html: 'Erro na comunicação com o servidor'});
    };

    req.send(JSON.stringify(novoInstrumento));
}

function abaAlterar(p) {
    const instrumentoAlt = JSON.parse(p);
    const id = instrumentoAlt.id;

    const formAlt = `
        <td>${id}</td>
        <td>
            <label><input type="radio" name="instrumento" value="Guitarra" ${instrumentoAlt.instrumento === 'Guitarra' ? 'checked' : ''} /><span>Guitarra</span></label>
            <label><input type="radio" name="instrumento" value="Baixo" ${instrumentoAlt.instrumento === 'Baixo' ? 'checked' : ''} /><span>Baixo</span></label>
            <label><input type="radio" name="instrumento" value="Violão" ${instrumentoAlt.instrumento === 'Violão' ? 'checked' : ''} /><span>Violão</span></label>
            <label><input type="radio" name="instrumento" value="Bateria" ${instrumentoAlt.instrumento === 'Bateria' ? 'checked' : ''} /><span>Bateria</span></label>
            <label><input type="radio" name="instrumento" value="Piano" ${instrumentoAlt.instrumento === 'Piano' ? 'checked' : ''} /><span>Piano</span></label>
            <label><input type="radio" name="instrumento" value="Violino" ${instrumentoAlt.instrumento === 'Violino' ? 'checked' : ''} /><span>Violino</span></label>
        </td>
        <td>
            <label><input type="radio" name="quantidade" value="1" ${instrumentoAlt.quantidade == 1 ? 'checked' : ''} /><span>1</span></label>
            <label><input type="radio" name="quantidade" value="2" ${instrumentoAlt.quantidade == 2 ? 'checked' : ''} /><span>2</span></label>
            <label><input type="radio" name="quantidade" value="3" ${instrumentoAlt.quantidade == 3 ? 'checked' : ''} /><span>3</span></label>
            <label><input type="radio" name="quantidade" value="4" ${instrumentoAlt.quantidade == 4 ? 'checked' : ''} /><span>4</span></label>
            <label><input type="radio" name="quantidade" value="5" ${instrumentoAlt.quantidade == 5 ? 'checked' : ''} /><span>5</span></label>
        </td>
        <td>
            <label><input type="radio" name="tipo" value="canhoto" ${instrumentoAlt.tipo === 'canhoto' ? 'checked' : ''} /><span>Canhoto</span></label>
            <label><input type="radio" name="tipo" value="destro" ${instrumentoAlt.tipo === 'destro' ? 'checked' : ''} /><span>Destro</span></label>
        </td>
        <td>
            <button class="btn green waves-effect waves-light" onclick="alterarInstrumentos(${id})">Salvar Alterações</button>
            <button class="btn grey lighten-1 waves-effect waves-light" onclick="carregaTabela()">Cancelar</button>
        </td>`;

    const linha = document.getElementById('linha' + id);
    linha.innerHTML = formAlt;
}

function alterarInstrumentos(id) {
    const linha = document.getElementById('linha' + id);

    const instrumento = linha.querySelector(`input[name="instrumento"]:checked`);
    const quantidade = linha.querySelector(`input[name="quantidade"]:checked`);
    const tipo = linha.querySelector(`input[name="tipo"]:checked`);

    if (!instrumento || !quantidade || !tipo) {
        M.toast({html: 'Por favor, selecione todos os campos antes de salvar.'});
        return;
    }

    const instrumentoAlterado = {
        id: id,
        instrumento: instrumento.value,
        quantidade: parseInt(quantidade.value),
        tipo: tipo.value,
    };

    const req = new XMLHttpRequest();
    req.open('PUT', `http://localhost:8080/instrumentosMusicais/${id}`);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = () => {
        if (req.status === 200) {
            M.toast({html: 'Registro alterado com sucesso!'});
            carregaTabela();
        } else {
            M.toast({html: 'Erro ao alterar registro'});
            console.error(req.responseText);
        }
    };
    req.onerror = () => {
        M.toast({html: 'Erro na comunicação com o servidor'});
    };
    req.send(JSON.stringify(instrumentoAlterado));
}

function apagarInstrumento(id){
    if(!confirm('Confirma apagar este instrumento?')) return;

    const req = new XMLHttpRequest();
    req.open('DELETE', `http://localhost:8080/instrumentosMusicais/${id}`);

    req.onload = () => {
        if(req.status === 200){
            M.toast({html: 'Instrumento apagado com sucesso!'});
            carregaTabela();
        } else {
            M.toast({html: 'Erro ao apagar instrumento'});
            console.error(req.responseText);
        }
    };

    req.onerror = () => {
        M.toast({html: 'Erro na comunicação com o servidor'});
    };

    req.send();
}
