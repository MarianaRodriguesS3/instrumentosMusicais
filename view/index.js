function carregaTabela(){
    console.log('Carregando tabelas...')
    const req = new XMLHttpRequest()
    req.open('GET','http://localhost:8080/instrumentosMusicais')

    req.onload = () => {
        const instrumento=JSON.parse(req.responseText)
        console.log(instrumento)
        var tab = '<tr><th>id</th><th>Instrumento</th><th>Quantidade</th><th colspan="3">Canhoto/Destro</th></tr>';
        instrumento.forEach(p => {
            pJson=JSON.stringify(p)
            const tipo = p.tipo;

            tab += `<tr id=linha${p.id}>
            <td>${p.id}</td>
            <td>${p.instrumento}</td>
            <td>${p.quantidade}</td>
            <td>${tipo}</td>
            <td><button onclick=apagarInstrumento(${p.id})>apagar</button></td>
            <td class='semBorda'><button onclick=abaAlterar('${pJson}')>editar</button></td></tr>`
        });

        document.getElementById('tabInstrumentos').innerHTML=tab;
    }

    req.send()
}

// insere um instrumento no banco de dados
function incluirInstrumentos() {
    const instrumentoSelecionado = document.querySelector('input[name="instrumento"]:checked');
    const quantidadeSelecionada = document.querySelector('input[name="quantidade"]:checked');
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');

    // Verifica se todas as opções foram selecionadas
    if (!instrumentoSelecionado || !quantidadeSelecionada || !tipoSelecionado) {
        alert('Por favor, selecione um instrumento, uma quantidade e uma opção de canhoto/destro.');
        return;
    }

    const novoInstrumento = {
        'instrumento': instrumentoSelecionado.value,
        'quantidade': parseInt(quantidadeSelecionada.value),
        'tipo': tipoSelecionado.value,
    };

    console.log('incluir registro: ', novoInstrumento);

    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:8080/instrumentosMusicais/');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = () => {
        alert('Instrumento incluído');
        // Limpa as seleções após a inclusão
        document.querySelectorAll('input[name="instrumento"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="quantidade"]').forEach(radio => radio.checked = false);
        document.querySelectorAll('input[name="tipo"]').forEach(radio => radio.checked = false);

        carregaTabela();
    };
    req.send(JSON.stringify(novoInstrumento));
}

//apaga um registro
function apagarInstrumento(id){

    console.log('apagar registro : '+id)

    const req = new XMLHttpRequest()
    req.open('DELETE','http://localhost:8080/instrumentosMusicais/'+id)
    req.onload = () => { 
        alert('Registro apagado')
        carregaTabela();
    }
    req.send()
}

function alterarInstrumentos(id) {
    const instrumentoAlterado = {
        id: id,
        instrumento: document.querySelector(`input[name="instrumento"]:checked`).value,
        quantidade: document.querySelector(`input[name="quantidade"]:checked`).value,
        tipo: document.querySelector(`input[name="tipo"]:checked`).value,
    };
    
    const req = new XMLHttpRequest();
    req.open('PUT', `http://localhost:8080/instrumentosMusicais/${id}`);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = () => {
        alert('Registro Alterado');
        carregaTabela();
    };
    req.send(JSON.stringify(instrumentoAlterado));
}

function abaAlterar(p) {
    const instrumentoAlt = JSON.parse(p);

    const formAlt = `
        <td>${instrumentoAlt.id}</td>
        <td>
            <label><input type="radio" name="instrumento" value="Guitarra" ${instrumentoAlt.instrumento === 'Guitarra' ? 'checked' : ''}> Guitarra</label>
            <label><input type="radio" name="instrumento" value="Baixo" ${instrumentoAlt.instrumento === 'Baixo' ? 'checked' : ''}> Baixo</label>
            <label><input type="radio" name="instrumento" value="Violão" ${instrumentoAlt.instrumento === 'Violão' ? 'checked' : ''}> Violão</label>
            <label><input type="radio" name="instrumento" value="Bateria" ${instrumentoAlt.instrumento === 'Bateria' ? 'checked' : ''}> Bateria</label>
            <label><input type="radio" name="instrumento" value="Piano" ${instrumentoAlt.instrumento === 'Piano' ? 'checked' : ''}> Piano</label>
            <label><input type="radio" name="instrumento" value="Violino" ${instrumentoAlt.instrumento === 'Violino' ? 'checked' : ''}> Violino</label>
        </td>
        <td>
            <label><input type="radio" name="quantidade" value="1" ${instrumentoAlt.quantidade == 1 ? 'checked' : ''}> 1</label>
            <label><input type="radio" name="quantidade" value="2" ${instrumentoAlt.quantidade == 2 ? 'checked' : ''}> 2</label>
            <label><input type="radio" name="quantidade" value="3" ${instrumentoAlt.quantidade == 3 ? 'checked' : ''}> 3</label>
            <label><input type="radio" name="quantidade" value="4" ${instrumentoAlt.quantidade == 4 ? 'checked' : ''}> 4</label>
            <label><input type="radio" name="quantidade" value="5" ${instrumentoAlt.quantidade == 5 ? 'checked' : ''}> 5</label>
        </td>
        <td>
            <label><input type="radio" name="tipo" value="canhoto" ${instrumentoAlt.canhoto === 'canhoto' ? 'checked' : ''}> Canhoto</label>
            <label><input type="radio" name="tipo" value="destro" ${instrumentoAlt.canhoto === 'destro' ? 'checked' : ''}> Destro</label>
        </td>
        <td>
            <input type="button" value="Salvar Alterações" onclick="alterarInstrumentos(${instrumentoAlt.id})">
            <input type="button" value="Cancelar" onclick="carregaTabela()">
        </td>`;

    const linha = document.getElementById('linha' + instrumentoAlt.id);
    linha.innerHTML = formAlt;
}

document.addEventListener('DOMContentLoaded', () => {
    carregaTabela();
});
