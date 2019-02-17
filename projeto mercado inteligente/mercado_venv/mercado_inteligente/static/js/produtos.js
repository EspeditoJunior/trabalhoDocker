// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/produtos',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(NomeDoProduto, ID, Valor, IdCategoria) {
            let ajax_options = {
                type: 'POST',
                url: 'api/produtos',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'NomeDoProduto': NomeDoProduto,
                    'ID': ID,
                    'Valor': Valor,
                    'IdCategoria': IdCategoria
                })
            };

            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(NomeDoProduto, ID, Valor, IdCategoria) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/produtos/' + ID,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'NomeDoProduto': NomeDoProduto,
                    'ID': ID,
                    'Valor': Valor,
                    'IdCategoria': IdCategoria
                })
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(ID) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/produtos/' + ID,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $NomeDoProduto = $('#NomeDoProduto'),
        $ID = $('#ID'),
        $Valor = $('#Valor'),
        $IdCategoria = $('#IdCategoria');

    // return the API
    return {
        reset: function() {
            $ID.val('');
            $NomeDoProduto.val('').focus();
            $Valor.val('');
            $IdCategoria.val('');
        },
        update_editor: function(NomeDoProduto, ID, Valor, IdCategoria) {
            $ID.val(ID);
            $NomeDoProduto.val(NomeDoProduto).focus();
            $Valor.val(Valor);
            $IdCategoria.val(IdCategoria);
        },
        build_table: function(produtos) {
            let rows = ''

            // clear the table
            $('.produtos table > tbody').empty();

            // did we get a produtos array?

            if (produtos) {
                for (let i=0, l=produtos.length; i < l; i++) {
                    rows += `<tr><td class="NomeDoProduto">${produtos[i].NomeDoProduto}</td><td class="ID">${produtos[i].ID}</td><td class="Valor">${produtos[i].Valor}</td><td class="IdCategoria">${produtos[i].IdCategoria}</td></tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $NomeDoProduto = $('#NomeDoProduto'),
        $ID = $('#ID'),
        $Valor = $('#Valor'),
        $IdCategoria = $('#IdCategoria');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(NomeDoProduto, ID, Valor, IdCategoria) {
        return NomeDoProduto !== "" && ID !== "" && Valor !== "" && IdCategoria !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let NomeDoProduto = $NomeDoProduto.val(),
            ID = $ID.val(),
            Valor = $Valor.val(),
            IdCategoria = $IdCategoria.val();

        e.preventDefault();

        if (validate(NomeDoProduto, ID, Valor, IdCategoria)) {
            model.create(NomeDoProduto, ID, Valor, IdCategoria)
        } else {
            alert('Problema com o nome, ID , Valor ou ID da categoria');
        }
    });

    $('#update').click(function(e) {
        let NomeDoProduto = $NomeDoProduto.val(),
            ID = $ID.val(),
            Valor = $Valor.val(),
            IdCategoria = $IdCategoria.val();

        e.preventDefault();

        if (validate(NomeDoProduto, ID, Valor, IdCategoria)) {
            model.update(NomeDoProduto, ID, Valor, IdCategoria)
        } else {
            alert('Problema com o nome, ID , Valor ou ID da categoria');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let ID = $ID.val();

        e.preventDefault();

        if (validate('placeholder', ID)) {
            model.delete(ID)
        } else {
            alert('Problema com o nome, ID , Valor ou ID da categoria');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        //location.reload();
        //model.read();
        window.location.reload();
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            NomeDoProduto,
            ID,
            Valor,
            IdCategoria;

        NomeDoProduto = $target
            .parent()
            .find('td.NomeDoProduto')
            .text();

        ID = $target
            .parent()
            .find('td.ID')
            .text();

        Valor = $target
            .parent()
            .find('td.Valor')
            .text();
        
            IdCategoria = $target
            .parent()
            .find('td.IdCategoria')
            .text();

        view.update_editor(NomeDoProduto, ID, Valor, IdCategoria);
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = "Msg de Erro:" + textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
    })
}(ns.model, ns.view));