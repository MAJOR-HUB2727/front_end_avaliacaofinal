// Falso banco de dados de clientes, em memória RAM
var clientes = []

// Falso banco de dados de Academias
var academias = []

// Falso banco de dados de EStilo de Body Builder
var estilos = []

//guarda o cliente que está sendo alterado
var clienteAlterado = null

function mostrarModal() {
    const modal = document.getElementById('modal')
    modal.style.display = "block"
}

function ocultarModal() {
    const modal = document.getElementById('modal')
    modal.style.display = "none"
}

// Função para abrir o modal de cadastro de Estilo
function mostrarModalEstilo() {
    const modal = document.getElementById('modalEstilo');
    modal.style.display = "block";
}

// Função para fechar o modal de cadastro de Estilo
function ocultarModalEstilo() {
    const modal = document.getElementById('modalEstilo');
    modal.style.display = "none";
}

function adicionar() {
    clienteAlterado = null // marca que está adicionando um cliente
    limparFormulario()
    mostrarModal()
}

// Função para carregar os estilos
function carregarEstilos() {
    fetch('http://localhost:3000/estilo', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
    })
    .then(response => response.json())
    .then(data => {
        estilos = data; // Atualiza a lista de estilos
        atualizarListaEstilos(); // Atualiza o dropdown de estilos
    })
    .catch(error => {
        console.error('Erro ao listar estilos:', error);
    });
}

// Função para atualizar a lista de estilos no formulário de cadastro/alteração
function atualizarListaEstilos() {
    let listaEstilo = document.getElementById("estilo");
    for(let i = 0; i < estilos.length; i++){
        let estilo = estilos[i];
        let option = document.createElement("option");
        option.value = estilo.id;
        option.innerHTML = estilo.nome;
        listaEstilo.appendChild(option);
    }
}

// Função para salvar o estilo
function salvarEstilo() {
    const nomeEstilo = document.getElementById("nomeEstilo").value;
    console.log('Nome do estilo:', nomeEstilo); // Adicionando log para verificar o valor
    
    fetch('http://localhost:3000/estilo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors',
        body: JSON.stringify({ nome: nomeEstilo }),
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        carregarEstilos(); // Recarregar a lista de estilos
        ocultarModalEstilo();
    })
    .catch(error => {
        console.error('Erro ao salvar estilo:', error);
    });

    return false; // Previne o envio do formulário
}


// Função chamada sempre que o usuário digitar algo na caixa de busca
function buscarClientes() {
    const searchQuery = document.getElementById("searchBox").value.trim().toLowerCase();

    // Envia a requisição para o backend com a query de busca
    fetch(`http://localhost:3000/body-builder?search=${searchQuery}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
        clientes = data;  // Atualiza a lista de clientes com os dados retornados
        atualizarLista();  // Atualiza a tabela com os novos dados filtrados
    })
    .catch(error => {
        console.error('Erro ao buscar clientes:', error);
        alert("Erro ao buscar clientes");
    });
}


function alterar(cpf) {
    //busca o cliente que será alterado
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]
        if (cliente.cpf == cpf) {

            // preenche os campos do formulário
            document.getElementById('nome').value = cliente.nome
            document.getElementById('cpf').value = cliente.cpf
            document.getElementById('peso').value = cliente.peso
            document.getElementById('altura').value = cliente.altura
            document.getElementById('idade').value = cliente.idade
            document.getElementById('estilo').value = cliente.style.id
            document.getElementById("academia").value = cliente.gym.id
            
            clienteAlterado = cliente // guarda o cliente que esta sendo alterado
            console.log(clienteAlterado, cliente)
            mostrarModal()
        }
    }

    atualizarLista()
}

function excluir(cpf) {
    if (confirm("Deseja realmente excluir este body builder")){
        fetch('http://localhost:3000/body-builder/' + cpf, {
            method: 'DELETE',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
        }).then( () => {
            alert("Excluído com sucesso")
            carregarClientes()
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
    }
}

function salvar() {

    let cpf = document.getElementById('cpf').value
    let nome = document.getElementById("nome").value
    let peso = document.getElementById('peso').value
    let altura = document.getElementById('altura').value
    let idade = document.getElementById('idade').value
    let idEstilo = document.getElementById('estilo').value
    let idAcademia = document.getElementById("academia").value
    console.log('Estilo selecionado:', idEstilo, idAcademia);

    let novoBodyBuilder = {
        
        cpf: cpf,
        nome: nome,
        peso: peso,
        altura: altura,
        idade: idade,
        idEstilo: idEstilo, // Converte para número
        idAcademia: idAcademia, 

        
    }
    console.log(novoBodyBuilder) // Verifica o objeto criado

    // Se o clienteAlterado == null, esta adicionando um novo cliente
    if (clienteAlterado == null) {
        fetch('http://localhost:3000/body-builder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novoBodyBuilder)
          })
          .then(() => {
            alert("Cadastrado com sucesso")
        }).catch((error) => {
            alert("Erro ao cadastrar")
        })
          
    } else { // Senão está alterando um cliente
        fetch('http://localhost:3000/body-builder/' + clienteAlterado.cpf, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify(novoBodyBuilder)
        }).then(() => {
            console.log(novoBodyBuilder);
            alert("Alterado com sucesso")
        }).catch((error) => {
            alert("Erro ao alterar")
        })
    }


    ocultarModal()

    limparFormulario()

    carregarClientes()
    return false
}

function limparFormulario() {
    document.getElementById('cpf').value = ""
    document.getElementById('nome').value = ""
    document.getElementById('peso').value = ""
    document.getElementById('altura').value = ""
    document.getElementById('idade').value = ""
    document.getElementById('estilo').value = ""
    document.getElementById("academia").value = ""
}

function atualizarLista() {
    let tbody = document.getElementsByTagName('tbody')[0] //pega o primeiro tbody da página
    tbody.innerHTML = "" //limpa as linhas da tabela
    clientes.forEach(cliente => {
       let linhaTabela = document.createElement('tr')
       linhaTabela.innerHTML = `
            <td>${cliente.gym.nome}</td>
            <td>${cliente.cpf}</td>
            <td>${cliente.nome}</td>
            <td>${cliente.peso} Kg</td>
            <td>${cliente.altura} M</td>
            <td>${cliente.idade}</td>
            <td>${cliente.style.nome}</td>
            
            <td>
                <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                <button onclick="excluir('${cliente.cpf}')">Excluir</button>
            </td>
        `
        tbody.appendChild(linhaTabela);
    //}
})
}
function carregarClientes(){
    fetch('http://localhost:3000/body-builder', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
        }).then((response) => response.json() )
        .then((data) => {
            // console.log(data)
            clientes = data // recebe a lista de clientes do back
            atualizarLista()
        }).catch((error) => {
            console.log(error)
            alert("Erro ao listar clientes")
        })
}
function carregarAcademias(){
    fetch('http://localhost:3000/gym', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
            mode: 'cors',
        }).then((response) => response.json() )
        .then((data) => {
            // console.log(data)
            academias = data // recebe a lista de academias do back
            atualizarListaAcademias()
        }).catch((error) => {
            console.log(error)
            alert("Erro ao listar academias")
        })
}

function atualizarListaAcademias(){
    let listaAcademia = document.getElementById("academia")
    for(let i = 0; i < academias.length; i++){
        let academia = academias[i]
        let option = document.createElement("option")
        option.value = academia.id
        option.innerHTML = academia.nome
        listaAcademia.appendChild(option)
    }
}
