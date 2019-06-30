var terms = [];
$(document).ready(function () {
    init_action();
    $('.start').each(function () {
        var $this = $(this);
        console.log($this.data('mcode'));
        $this.trigger('click');
    });
});

function init_action() {
    $('.action').off('click').on('click', function () {
        var $this = $(this);
        var action_case = $this.data('action_case');
        switch (action_case) {
            case 'run_cmd':
                var cmd_id = $('#comment_cmd').val();
                var url = 'get_cmd';
                var data = {
                    cmd_id: cmd_id
                };
                $.post(url, data, function (json) {
                    var cmd = json.cmd;
                    console.log(cmd);
                    for (idx in terms) {
                        if (terms[idx].activate == true) {
                            terms[idx].send(cmd + '\r');
                        }
                    }
                });
                break;
            case 'close':
                var mcode = $this.data('mcode');
                terms[mcode].destroy();
                console.log(terms[mcode]);
                $('#start_' + mcode).prop('disabled', false);
                break;
            case 'start':
                var $this = $(this);
                var id = $this.data('mcode');
                init_start_xterm(id);
                $this.prop('disabled', true);
                break;
        }
    });
}

function init_start_xterm(mcode) {
    var port = $('#xport').val();
    var id = mcode;
    var term;
    var terminalContainer = $('#terminal-container_' + id)[0];
    Terminal.applyAddon(fit);
    term = new Terminal({
        cursorBlink: true,
        cols: 20
    });
    term.open(terminalContainer);
    term.fit();
    var hostname = window.location.hostname;
    var protocal = window.location.protocol;
    var socket = io.connect('//'+hostname+':'+port+'?server=' + id);
    term.activate = false;
    socket.on('connect', function () {
        term.on('focus', function () {
            for (idx in terms) {
                terms[idx].activate = false;
            }
            term.activate = true;
        });
        term.on('keyup', function (data) {
            console.log(data);
            if (term.activate == true) {
                for (idx in terms) {
                    if (terms[idx].activate == false) {
                        terms[idx].write(data);
                    }
                }
            }
        });
        term.on('data', function (data) {
            socket.emit('data', data);
            if (term.activate == true) {
                for (idx in terms) {
                    if (terms[idx].activate == false) {
                        terms[idx].send(data);
                    }
                }
            }
        });
        term.write('\r\n*** Connected to backend***\r\n');
        // Backend -> Browser
        socket.on('data', function (data) {
            term.write(data);
        });
        socket.on('disconnect', function () {
            term.write('\r\n*** Disconnected from backend***\r\n');
            socket.close();
            term.destroy();
        });
    });
    terms[id] = term;
}