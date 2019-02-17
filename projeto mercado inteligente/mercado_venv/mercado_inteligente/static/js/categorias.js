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
                url: 'api/categorias',
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
        create: function(NomeDaCategoria, ID) {
            let ajax_options = {
                type: 'POST',
                url: 'api/categorias',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'NomeDaCategoria': NomeDaCategoria,
                    'ID': ID
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
        update: function(NomeDaCategoria, ID) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/categorias/' + ID,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'NomeDaCategoria': NomeDaCategoria,
                    'ID': ID
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
                url: 'api/categorias/' + ID,
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

    let $NomeDaCategoria = $('#NomeDaCategoria'),
        $ID = $('#ID');

    // return the API
    return {
        reset: function() {
            $ID.val('');
            $NomeDaCategoria.val('').focus();
        },
        update_editor: function(NomeDaCategoria, ID) {
            $ID.val(ID);
            $NomeDaCategoria.val(NomeDaCategoria).focus();
        },
        build_table: function(categorias) {
            let rows = ''

            // clear the table
            $('.categorias table > tbody').empty();

            // did we get a categorias array?           

            if (categorias) {
                for (let i=0, l=categorias.length; i < l; i++) {
                    rows += `<tr><td class="NomeDaCategoria">${categorias[i].NomeDaCategoria}</td><td class="ID">${categorias[i].ID}</td></tr>`;
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
        $NomeDaCategoria = $('#NomeDaCategoria'),
        $ID = $('#ID');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(NomeDaCategoria, ID) {
        return NomeDaCategoria !== "" && ID !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let NomeDaCategoria = $NomeDaCategoria.val(),
            ID = $ID.val();

        e.preventDefault();

        if (validate(NomeDaCategoria, ID)) {
            model.create(NomeDaCategoria, ID)
        } else {
            alert('Problema com o nome ou ID da categoria');
        }
    });

    $('#update').click(function(e) {
        let NomeDaCategoria = $NomeDaCategoria.val(),
            ID = $ID.val();

        e.preventDefault();

        if (validate(NomeDaCategoria, ID)) {
            model.update(NomeDaCategoria, ID)
        } else {
            alert('Problema com o nome ou ID da categoria');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let ID = $ID.val();

        e.preventDefault();

        if (validate('placeholder', ID)) {
            model.delete(ID)
        } else {
            alert('Problema com o nome ou ID da categoria');
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
            NomeDaCategoria,
            ID;

        NomeDaCategoria = $target
            .parent()
            .find('td.NomeDaCategoria')
            .text();

        ID = $target
            .parent()
            .find('td.ID')
            .text();

        view.update_editor(NomeDaCategoria, ID);
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