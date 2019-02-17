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
                url: 'api/clientes',
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
        create: function(NomeDoCliente, RG, Telefone) {
            let ajax_options = {
                type: 'POST',
                url: 'api/clientes',
                accepts: 'application/json',
                contentType: 'application/json',
                //dataType: 'json',
                data: JSON.stringify({
                    'NomeDoCliente': NomeDoCliente,
                    'RG': RG,
                    'Telefone': Telefone
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
        update: function(NomeDoCliente, RG, Telefone) {
            let ajax_options = {
                type: 'PUT',
                url: 'api/clientes/' + RG,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({
                    'NomeDoCliente': NomeDoCliente,
                    'RG': RG,
                    'Telefone': Telefone
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
        'delete': function(RG) {
            let ajax_options = {
                type: 'DELETE',
                url: 'api/clientes/' + RG,
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

    let $NomeDoCliente = $('#NomeDoCliente'),
        $RG = $('#RG'),
        $Telefone = $('#Telefone');

    // return the API
    return {
        reset: function() {
            $RG.val('');
            $NomeDoCliente.val('').focus();
            $Telefone.val('');
        },
        update_editor: function(NomeDoCliente, RG, Telefone) {
            $RG.val(RG);
            $NomeDoCliente.val(NomeDoCliente).focus();
            $Telefone.val(Telefone);
        },
        build_table: function(clientes) {
            let rows = ''

            // clear the table
            $('.clientes table > tbody').empty();

            // did we get a clientes array?

            if (clientes) {
                for (let i=0, l=clientes.length; i < l; i++) {
                    rows += `<tr><td class="NomeDoCliente">${clientes[i].NomeDoCliente}</td><td class="RG">${clientes[i].RG}</td><td class="Telefone">${clientes[i].Telefone}</td></tr>`;
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
        $NomeDoCliente = $('#NomeDoCliente'),
        $RG = $('#RG'),
        $Telefone = $('#Telefone');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(NomeDoCliente, RG, Telefone) {
        return NomeDoCliente !== "" && RG !== "" && Telefone !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let NomeDoCliente = $NomeDoCliente.val(),
            RG = $RG.val(),
            Telefone = $Telefone.val();

        e.preventDefault();

        if (validate(NomeDoCliente, RG, Telefone)) {
            model.create(NomeDoCliente, RG, Telefone)
        } else {
            alert('Problema com o nome, rg ou telefone do cliente');
        }
    });

    $('#update').click(function(e) {
        let NomeDoCliente = $NomeDoCliente.val(),
            RG = $RG.val(),
            Telefone = $Telefone.val();

        e.preventDefault();

        if (validate(NomeDoCliente, RG, Telefone)) {
            model.update(NomeDoCliente, RG, Telefone)
        } else {
            alert('Problema com o nome, rg ou telefone do cliente');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let RG = $RG.val();

        e.preventDefault();

        if (validate('placeholder', RG)) {
            model.delete(RG)
        } else {
            alert('Problema com o nome, rg ou telefone do cliente');
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
            NomeDoCliente,
            RG,
            Telefone;

        NomeDoCliente = $target
            .parent()
            .find('td.NomeDoCliente')
            .text();

        RG = $target
            .parent()
            .find('td.RG')
            .text();

        Telefone = $target
            .parent()
            .find('td.Telefone')
            .text();

        view.update_editor(NomeDoCliente, RG, Telefone);
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