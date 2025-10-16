document.addEventListener('DOMContentLoaded', () => {
    carregaTabela();
});

function carregaTabela() {
    const req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8080/instrumentosMusicais');

    req.onload = () => {
        const instrumento = JSON.parse(req.responseText);
        let tab = `
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Instrumento</th>
                    <th>Quantidade</th>
                    <th>Canhoto/Destro</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
        `;

        instrumento.forEach(p => {
            const pJson = JSON.stringify(p);
            tab += `
                <tr id="linha${p.id}">
                    <td>${p.id}</td>
                    <td>${p.instrumento}</td>
                    <td>${p.quantidade}</td>
                    <td>${p.tipo}</td>
                    <td>
                        <button class="btn-small red" onclick="apagarInstrumento(${p.id})">
                            <i class="material-icons">delete</i>
                        </button>
                        <button class="btn-small orange" onclick='abaAlterar(${pJson})'>
                            <i class="material-icons">edit</i>
                        </button>
                    </td>
                </tr>
            `;
        });

        tab += `</tbody>`;
        document.getElementById('tabInstrumentos').innerHTML = tab;
    };

    req.send();
}

function incluirInstrumentos() {
    const instrumentoSelecionado = document.querySelector('input[name="instrumento"]:checked');
    const quantidadeSelecionada = document.querySelector('input[name="quantidade"]:checked');
    const tipoSelecionado = document.querySelector('input[name="tipo"]:checked');

    if (!instrumentoSelecionado || !quantidadeSelecionada || !tipoSelecionado) {
        M.toast({ html: 'Preencha todas as opções!', classes: 'red' });
        return;
    }

    const novoInstrumento = {
        instrumento: instrumentoSelecionado.value,
        quantidade: parseInt(quantidadeSelecionada.value),
        tipo: tipoSelecionado.value
    };

    const req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:8080/instrumentosMusicais/');
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = () => {
        M.toast({ html: 'Instrumento incluído!', classes: 'green' });

        document.querySelectorAll('input[type=radio]').forEach(r => r.checked = false);
        carregaTabela();
    };

    req.send(JSON.stringify(novoInstrumento));
}

function apagarInstrumento(id) {
    const req = new XMLHttpRequest();
    req.open('DELETE', `http://localhost:8080/instrumentosMusicais/${id}`);
    req.onload = () => {
        M.toast({ html: 'Registro apagado!', classes: 'orange' });
        carregaTabela();
    };
    req.send();
}

function alterarInstrumentos(id) {
    const instrumento = document.querySelector('input[name="instrumento"]:checked').value;
    const quantidade = document.querySelector('input[name="quantidade"]:checked').value;
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    const instrumentoAlterado = {
        id,
        instrumento,
        quantidade,
        tipo
    };

    const req = new XMLHttpRequest();
    req.open('PUT', `http://localhost:8080/instrumentosMusicais/${id}`);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.onload = () => {
        M.toast({ html: 'Registro alterado!', classes: 'blue' });
        carregaTabela();
    };

    req.send(JSON.stringify(instrumentoAlterado));
}

function abaAlterar(p) {
    const linha = document.getElementById(`linha${p.id}`);

    linha.innerHTML = `
        <td>${p.id}</td>
        <td>
            ${gerarRadios('instrumento', ['Guitarra', 'Baixo', 'Violão', 'Bateria', 'Piano', 'Violino'], p.instrumento)}
        </td>
        <td>
            ${gerarRadios('quantidade', ['1', '2', '3', '4', '5'], p.quantidade)}
        </td>
        <td>
            ${gerarRadios('tipo', ['canhoto', 'destro'], p.tipo)}
        </td>
        <td>
            <button class="btn green" onclick="alterarInstrumentos(${p.id})">
                <i class="material-icons left">save</i>Salvar
            </button>
            <button class="btn grey" onclick="carregaTabela()">
                <i class="material-icons left">cancel</i>Cancelar
            </button>
        </td>
    `;
}

function gerarRadios(name, options, selected) {
    return options.map(opt => {
        const checked = (opt == selected) ? 'checked' : '';
        const capitalized = opt.charAt(0).toUpperCase() + opt.slice(1);
        return `
            <label style="display:block;">
                <input type="radio" name="${name}" value="${opt}" ${checked} />
                <span>${capitalized}</span>
            </label>
        `;
    }).join('');
}
