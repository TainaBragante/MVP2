# Minha API

Este projeto foi desenvolvido na pós-graduação em Desenvolvimento Full Stack. Trata-se de um MVP criado para colocar em prática os conceitos aprendidos durante o curso.

O objetivo aqui é criar uma API funcional que gerencie informações de funcionários, incluindo seus nomes, vendas realizadas, porcentagens de comissão, calcular automaticamente o valor das comissões em dólar e posteriormente converter para real.

---
## Como executar 


Será necessário ter todas as libs python listadas no `requirements.txt` instaladas.
Após clonar o repositório, é necessário ir ao diretório raiz, pelo terminal, para poder executar os comandos descritos abaixo.

> É fortemente indicado o uso de ambientes virtuais do tipo [virtualenv](https://virtualenv.pypa.io/en/latest/installation.html).
> 
> Instalando o VirtualEnv: pip install virtualenv
> 
> Criando o VirtualEnv: python -m venv env
> 
> Ativando o VirtualEnv: .\env\Scripts\Activate



Após a ativação do ambiente virtual executar os comandos:

```
cd meu_app_API
pip install -r requirements.txt
```

Este comando instala as dependências/bibliotecas, descritas no arquivo `requirements.txt`.

Para ativar a API basta executar:

```
flask run --host 127.0.0.1 --port 5000
```

Em modo de desenvolvimento é recomendado executar utilizando o parâmetro reload, que reiniciará o servidor
automaticamente após uma mudança no código fonte. 

```
flask run --host 127.0.0.1 --port 5000 --reload
```

Abra o [http://localhost:5000/#/](http://localhost:5000/#/) no navegador para verificar o status da API em execução.
