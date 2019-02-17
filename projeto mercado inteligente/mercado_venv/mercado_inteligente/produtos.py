from datetime import datetime
from flask import jsonify, make_response, abort

ARRAY_PRODUTOS = {
    "1": {
        "NomeDoProduto": "Arroz",
        "ID": "1",
        "Valor": "5",
        "IdCategoria": "1",
    },
    "2": {
        "NomeDoProduto": "Detergente",
        "ID": "2",
        "Valor": "3",
        "IdCategoria": "2",
    },
    "3": {
        "NomeDoProduto": "Camiseta",
        "ID": "3",
        "Valor": "30",
        "IdCategoria": "3",
    },
}

def read_all():
    dict_produtos = [ARRAY_PRODUTOS[key] for key in sorted(ARRAY_PRODUTOS.keys())]
    produtos = jsonify(dict_produtos)
    qtd = len(dict_produtos)
    content_range = "produtos 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    produtos.headers['Access-Control-Allow-Origin'] = '*'
    produtos.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    produtos.headers['Content-Range'] = content_range
    return produtos

def read_one(ID):
    if ID in ARRAY_PRODUTOS:
        produto = ARRAY_PRODUTOS.get(ID)
    else:
        abort(
            404, "Person with ID {ID} not found".format(ID=ID)
        )
    return produto


def create(produto):
    NomeDoProduto = produto.get("NomeDoProduto", None)
    ID = produto.get("ID", None)
    Valor = produto.get("Valor", None)
    IdCategoria = produto.get("IdCategoria",None)

    if ID not in ARRAY_PRODUTOS and ID is not None:
        ARRAY_PRODUTOS[ID] = {
            "NomeDoProduto": NomeDoProduto,
            "ID": ID,
            "Valor": Valor,
            "IdCategoria": IdCategoria,
        }
        return make_response(
            "{ID} successfully created".format(ID=ID), 201
        )
    else:
        abort(
            406,
            "Produto com ID {ID} ja existe".format(ID=ID),
        )


def update(ID,produto):
    if ID in ARRAY_PRODUTOS:
        ARRAY_PRODUTOS[ID]["ID"] = produto.get("ID")
        ARRAY_PRODUTOS[ID]["Valor"] = produto.get("Valor")
        ARRAY_PRODUTOS[ID]["NomeDoProduto"] = produto.get("NomeDoProduto")
        ARRAY_PRODUTOS[ID]["IdCategoria"] = produto.get("IdCategoria")
        return ARRAY_PRODUTOS[ID]
    else:
        abort(
            404, "Produto com ID {ID} nao encontrada".format(ID=ID)
        )

def delete(ID):
    if ID in ARRAY_PRODUTOS:
        del ARRAY_PRODUTOS[ID]
        return make_response(
            "{ID} deletado com sucesso".format(ID=ID), 200
        )
    else:
        abort(
            404, "Produto com ID {ID} nao encontrada".format(ID=ID)
        )