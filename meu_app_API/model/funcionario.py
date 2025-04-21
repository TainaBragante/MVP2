from sqlalchemy import Column, String, Integer, DateTime, Float, Numeric
from datetime import datetime
from typing import Union
from  model import Base


class Funcionario(Base):
    __tablename__ = 'funcionario'

    id = Column("pk_funcionario", Integer, primary_key=True)
    nome = Column(String(140), unique=True)
    venda = Column(Numeric(15, 2))
    porcentagem = Column(Numeric(4, 2))
    comissao = Column(Numeric(15, 2))
    comissao_real = Column(Numeric(15, 2))


    def __init__(self, nome:str, venda:float, porcentagem:float, comissao:float, comissao_real: float):
        """
        Cria um Funcionario

        Arguments:
            nome: nome do funcionario.
            venda: total de vendas realizadas pelo funcionario
            porcentagem: porcentagem que o funcionario receberá sobre as vendas realizadas
            comissao: valor calculado em dólar de quanto o funcionario irá receber sobre as vendas realizadas 
            comissao_real: valor da comissão convertido para reais
        """
        self.nome = nome
        self.venda = venda
        self.porcentagem = porcentagem
        self.comissao = comissao
        self.comissao_real = comissao_real

