window.onload = function() {
"use strict";

// ------------------------------------------------------------
// * Globals
// ------------------------------------------------------------

var previous_worker_ids = [];

var chose_key1 = [];
var rts = [];

// ------------------------------------------------------------
// * Helper functions
// ------------------------------------------------------------

var E = function(x)
   {return document.getElementById(x);};

var save = function(name, val)
   {var e = document.createElement('input');
    e.type = 'hidden';
    e.name = name;
    e.value = JSON.stringify(val);
    E('submission-form').appendChild(e);};

// ------------------------------------------------------------
// * Startup
// ------------------------------------------------------------

var startup = function()
   {save('task_version', 'TASK_VERSION');
    save('user_agent', window.navigator.userAgent);

    if (typeof turkSetAssignmentID !== 'undefined')
      // We're on MTurk.
       {if (previous_worker_ids.indexOf(turkGetParam('workerId', '')) != -1)
            mode__return();
        else
           {turkSetAssignmentID();
            E('submission-form').action =
                turkGetSubmitToHost() + '/mturk/externalSubmit';
            mode__consent();}}
    else
        mode__consent();};

// ------------------------------------------------------------
// * Modes
// ------------------------------------------------------------

var mode__return = function()
   {E('mode--return').style.display = 'block';};

var mode__consent = function()
   {E('consent-form').addEventListener('submit', function(e)
       {e.preventDefault();
        if (/^\s*i\s*consent\s*$/i.test(E('consent-statement').value))
           {E('mode--consent').style.display = 'none';
            mode__decision_making();}});

    E('mode--consent').style.display = 'block';};

var mode__decision_making = function()
   {var n_trials = 200;
    var key1 = 'f';
    var key2 = 'j';

    var last_choice_time = Date.now();

    var key1_ready = true;
    var key2_ready = true;

    var get_pressed_char = function(e)
       {return String.fromCharCode(window.event
          ? e.keyCode
          : e.which).toLowerCase();};

    var keyup = function(e)
       {var input = get_pressed_char(e);
        if (input === key1)
            key1_ready = true;
        if (input === key2)
            key2_ready = true;};
    window.addEventListener('keyup', keyup);

    var keydown = function(e)
       {if (!key1_ready || !key2_ready)
            return;
        var input = get_pressed_char(e);
        if (input === key1 || input === key2)
           {var new_time = Date.now();
            rts.push(new_time - last_choice_time);
            last_choice_time = new_time;
            chose_key1.push(input === key1);
            if (input === key1)
                key1_ready = false;
            else
                key2_ready = false;
            E('trial-counter').textContent =
                n_trials - chose_key1.length;
            if (chose_key1.length >= n_trials)
                finish();}};
    window.addEventListener('keydown', keydown);

    E('trial-counter').textContent = n_trials;
    E('key1').textContent = key1;
    E('key2').textContent = key2;

    var finish = function()
       {save('chose_key1', chose_key1);
        save('rts', rts);
        window.removeEventListener('keyup', keyup);
        window.removeEventListener('keydown', keydown);
        E('mode--decision-making').style.display = 'none';
        mode__done();};

    E('mode--decision-making').style.display = 'block';};

var mode__done = function()
   {E('mode--done').style.display = 'block';};

startup();

};
