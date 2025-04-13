from flask_openapi3 import OpenAPI, Info, Tag
from flask import redirect
from urllib.parse import unquote
from sqlalchemy.exc import IntegrityError
from model import Session, Funcionario
from logger import logger
from schemas import *
from flask_cors import CORS


info = Info(title="Minha API", version="1.0.0")
app = OpenAPI(__name__, info=info)
CORS(app)

# definindo tags
home_tag = Tag(name="Documentação", description="Seleção de documentação: Swagger, Redoc ou RapiDoc")
funcionario_tag = Tag(name="Funcionario", description="Adição, visualização e remoção de funcionarios à base")



@app.get('/', tags=[home_tag])
def home():
    """Redireciona para /openapi, tela que permite a escolha do estilo de documentação.
    """
    return redirect('/openapi')


@app.post('/funcionario', tags=[funcionario_tag],
          responses={"200": FuncionarioViewSchema, "409": ErrorSchema, "400": ErrorSchema})
def add_funcionario(form: FuncionarioSchema):
    """Adiciona um novo funcionario à base de dados

    Retorna uma representação dos funcionarios, suas respectivas vendas e porcentagem sobre a mesma.
    """

    # Calcula a comissão com base nas vendas e porcentagem
    venda = float(form.venda)
    porcentagem = float(form.porcentagem)
    comissao = venda * (porcentagem / 100)

    funcionario = Funcionario(
        nome=form.nome,
        venda=form.venda,
        porcentagem=form.porcentagem,
        comissao=comissao
    )
    logger.debug(f"Adicionando funcionario de nome: '{funcionario.nome}'")

    try:
        # criando conexão com a base
        session = Session()
        # adicionando funcionario
        session.add(funcionario)
        # efetivando o camando de adição de novo item na tabela
        session.commit()
        logger.debug(f"Adicionado funcionario de nome: '{funcionario.nome}'")
        return apresenta_funcionario(funcionario), 200

    except IntegrityError as e:
        # como a duplicidade do nome é a provável razão do IntegrityError
        error_msg = "Funcionario de mesmo nome já salvo na base :/"
        logger.warning(f"Erro ao adicionar funcionario '{funcionario.nome}', {error_msg}")
        return {"mesage": error_msg}, 409

    except Exception as e:
        # caso um erro fora do previsto
        error_msg = "Não foi possível salvar novo item :/"
        logger.warning(f"Erro ao adicionar funcionario '{funcionario.nome}', {error_msg}")
        return {"mesage": error_msg}, 400


@app.get('/funcionarios', tags=[funcionario_tag],
         responses={"200": ListagemFuncionariosSchema, "404": ErrorSchema})
def get_funcionarios():
    """Faz a busca por todos os funcionarios cadastrados

    Retorna uma representação da listagem de funcionarios.
    """
    logger.debug(f"Coletando funcionarios ")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    funcionarios = session.query(Funcionario).all()

    if not funcionarios:
        # se não há funcionarios cadastrados
        return {"funcionarios": []}, 200
    else:
        logger.debug(f"%d rodutos econtrados" % len(funcionarios))
        # retorna a representação de funcionario
        print(funcionarios)
        return apresenta_funcionarios(funcionarios), 200


@app.get('/funcionario', tags=[funcionario_tag],
         responses={"200": FuncionarioViewSchema, "404": ErrorSchema})
def get_funcionario(query: FuncionarioBuscaSchema):
    """Faz a busca por um funcionario a partir do nome do funcionario

    Retorna uma representação do funcionario e suas respectivas informações.
    """
    funcionario_nome = query.nome
    logger.debug(f"Coletando dados sobre funcionario #{funcionario_nome}")
    # criando conexão com a base
    session = Session()
    # fazendo a busca
    funcionario = session.query(Funcionario).filter(Funcionario.nome == funcionario_nome).first()

    if not funcionario:
        # se o funcionario não foi encontrado
        error_msg = "Funcionario não encontrado na base :/"
        logger.warning(f"Erro ao buscar funcionario '{funcionario_nome}', {error_msg}")
        return {"mesage": error_msg}, 404
    else:
        logger.debug(f"Funcionario econtrado: '{funcionario.nome}'")
        # retorna a representação de funcionario
        return apresenta_funcionario(funcionario), 200


@app.delete('/funcionario', tags=[funcionario_tag],
            responses={"200": FuncionarioDelSchema, "404": ErrorSchema})
def del_funcionario(query: FuncionarioBuscaSchema):
    """Deleta um funcionario a partir do nome do funcionario

    Retorna uma mensagem de confirmação da remoção.
    """
    funcionario_nome = unquote(unquote(query.nome))
    print(funcionario_nome)
    logger.debug(f"Deletando dados sobre funcionario #{funcionario_nome}")
    # criando conexão com a base
    session = Session()
    # fazendo a remoção
    count = session.query(Funcionario).filter(Funcionario.nome == funcionario_nome).delete()
    session.commit()

    if count:
        # retorna a representação da mensagem de confirmação
        logger.debug(f"Deletado funcionario #{funcionario_nome}")
        return {"mesage": "Funcionario removido", "id": funcionario_nome}
    else:
        # se o funcionario não foi encontrado
        error_msg = "Funcionario não encontrado na base :/"
        logger.warning(f"Erro ao deletar funcionario #'{funcionario_nome}', {error_msg}")
        return {"mesage": error_msg}, 404

