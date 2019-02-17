from datetime import datetime
from flask import jsonify, make_response, abort

ARRAY_CATEGORIAS = {
    "1": {
        "NomeDaCategoria": "Alimentacao",
        "ID": "1"
    },
    "2": {
        "NomeDaCategoria": "Limpeza",
        "ID": "2"
    },
    "3": {
        "NomeDaCategoria": "Vestuario",
        "ID": "3"
    },
}

def read_all():
    dict_categorias = [ARRAY_CATEGORIAS[key] for key in sorted(ARRAY_CATEGORIAS.keys())]
    categorias = jsonify(dict_categorias)
    qtd = len(dict_categorias)
    content_range = "categorias 0-"+str(qtd)+"/"+str(qtd)
    # Configura headers
    categorias.headers['Access-Control-Allow-Origin'] = '*'
    categorias.headers['Access-Control-Expose-Headers'] = 'Content-Range'
    categorias.headers['Content-Range'] = content_range
    return categorias

def read_one(ID):
    if ID in ARRAY_CATEGORIAS:
        categorias = ARRAY_CATEGORIAS.get(ID)
    else:
        abort(
            404, "Person with ID {ID} not found".format(ID=ID)
        )
    return categorias


def create(categoria):
    NomeDaCategoria = categoria.get("NomeDaCategoria", None)
    ID = categoria.get("ID", None)

    if ID not in ARRAY_CATEGORIAS and ID is not None:
        ARRAY_CATEGORIAS[ID] = {
            "NomeDaCategoria": NomeDaCategoria,
            "ID": ID,
        }
        return make_response(
            "{ID} successfully created".format(ID=ID), 201
        )
    else:
        abort(
            406,
            "Categoria com ID {ID} ja existe".format(ID=ID),
        )


def update(ID,categoria):
    if ID in ARRAY_CATEGORIAS:
        ARRAY_CATEGORIAS[ID]["ID"] = categoria.get("ID")
        ARRAY_CATEGORIAS[ID]["NomeDaCategoria"] = categoria.get("NomeDaCategoria")
        return ARRAY_CATEGORIAS[ID]
    else:
        abort(
            404, "Categoria com ID {ID} nao encontrada".format(ID=ID)
        )

def delete(ID):
    if ID in ARRAY_CATEGORIAS:
        del ARRAY_CATEGORIAS[ID]
        return make_response(
            "{ID} deletado com sucesso".format(ID=ID), 200
        )
    else:
        abort(
            404, "Categoria com ID {ID} nao encontrada".format(ID=ID)
        )