from datetime import datetime
from flask import jsonify, make_response, abort
from pprint import pprint

ARRAY_CLIENTES = {
    "482844831": {
        "NomeDoCliente": "Joao da Silva",
        "RG": "482844831",
        "Telefone": "9827467839",
    },
    "1928348312": {
        "NomeDoCliente": "Maria de Sousa",
        "RG": " 1928348312",
        "Telefone": "3848292992",
    },
    "183848578": {
        "NomeDoCliente": "Caroline Oliveira",
        "RG": "183848578",
        "Telefone": "1828384838",
    },
}

def read_all():
    dict_clientes = [ARRAY_CLIENTES[key] for key in sorted(ARRAY_CLIENTES.keys())]
    clientes = jsonify(dict_clientes)
    qtd = len(dict_clientes)
    content_range = "clientes 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    clientes.headers['Access-Control-Allow-Origin'] = '*'
    clientes.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    clientes.headers['Content-Range'] = content_range
    return clientes

def read_one(RG):
    if RG in ARRAY_CLIENTES:
        cliente = ARRAY_CLIENTES.get(RG)
    else:
        abort(
            404, "Person with RG {RG} not found".format(RG=RG)
        )
    return cliente


def create(cliente):
    NomeDoCliente = cliente.get("NomeDoCliente", None)
    RG = cliente.get("RG", None)
    Telefone = cliente.get("Telefone", None)

    if RG not in ARRAY_CLIENTES and RG is not None:
        ARRAY_CLIENTES[RG] = {
            "NomeDoCliente": NomeDoCliente,
            "RG": RG,
            "Telefone": Telefone,
        }
        return make_response(
            "{RG} successfully created".format(RG=RG), 201
        )
    else:
        abort(
            406,
            "Pessoa com RG {RG} ja existe".format(RG=RG),
        )


def update(RG,cliente):
    if RG in ARRAY_CLIENTES:
        ARRAY_CLIENTES[RG]["RG"] = cliente.get("RG")
        ARRAY_CLIENTES[RG]["Telefone"] = cliente.get("Telefone")
        ARRAY_CLIENTES[RG]["NomeDoCliente"] = cliente.get("NomeDoCliente")
        return ARRAY_CLIENTES[RG]
    else:
        abort(
            404, "Pessoa com RG {RG} nao encontrada".format(RG=RG)
        )

def delete(RG):
    if RG in ARRAY_CLIENTES:
        del ARRAY_CLIENTES[RG]
        return make_response(
            "{RG} deletado com sucesso".format(RG=RG), 200
        )
    else:
        abort(
            404, "Pessoa com RG {RG} nao encontrada".format(RG=RG)
        )