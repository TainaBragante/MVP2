from pydantic import BaseModel
from typing import Optional, List
from model.funcionario import Funcionario


class FuncionarioSchema(BaseModel):
    """ Define como um novo funcionario a ser inserido deve ser representado
    """
    nome: str = "Jorge Silva"
    venda: float = 10000
    porcentagem: float = 10

class FuncionarioBuscaSchema(BaseModel):
    """ Define como deve ser a estrutura que representa a busca. Que será
        feita apenas com base no nome do funcionario.
    """
    nome: str = "Jorge Silva"


class ListagemFuncionariosSchema(BaseModel):
    """ Define como uma listagem de funcionarios será retornada.
    """
    funcionarios:List[FuncionarioSchema]


class FuncionarioViewSchema(BaseModel):
    """ Define como um funcionario será retornado: funcionario.
    """
    id: int = 1
    nome: str = "Jorge Silva"
    venda: float = 10000
    porcentagem: float = 10
    comissao: float = 1000

def apresenta_funcionarios(funcionarios: List[Funcionario]):
    """ Retorna uma representação do funcionario seguindo o schema definido em
        FuncionarioViewSchema.
    """
    result = []
    for funcionario in funcionarios:
        result.append({
            "nome": funcionario.nome,
            "venda": funcionario.venda,
            "porcentagem": funcionario.porcentagem,
            "comissao": funcionario.comissao,
        })

    return {"funcionarios": result}


def apresenta_funcionario(funcionario: Funcionario):
    """ Retorna uma representação do funcionario seguindo o schema definido em
        FuncionarioViewSchema.
    """
    return {
        "id": funcionario.id,
        "nome": funcionario.nome,
        "venda": funcionario.venda,
        "porcentagem": funcionario.porcentagem,
        "comissao": funcionario.comissao
    
    }


class FuncionarioDelSchema(BaseModel):
    """ Define como deve ser a estrutura do dado retornado após uma requisição
        de remoção.
    """
    mesage: str
    nome: str