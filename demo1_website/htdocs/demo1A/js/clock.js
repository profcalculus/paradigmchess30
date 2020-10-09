'use strict';
let clock = new Vue ({
  el: '#clock',
  data: {
    name: 'clock',
    mode: 'standard',
    extratime: 2,
    runstate: 'pause',
    player_white: 'White',
    player_black: 'Black',
    white: {
      maintime: 300,
      extratime: 2,
    },
    black: {
      maintime: 300,
      extratime: 2,
    },
    toplay: 'white',
    timer: null,
    form: {
      mode: 'standard',
      maintime: {
        h: 0,
        m: 5,
        s: 0,
      },
      extratime: 2,
    },
    modes: [
      {
        value: 'standard',
        text: 'Standard',
      },
      {
        value: 'increment',
        text: 'Increment',
      },
      {
        value: 'delay',
        text: 'Delay',
      },
    ],
    options: {
      title: '',
      content: '',
    },
  },
  methods: {
    run: function () {
      if (['white', 'black'].indexOf (this.runstate) < 0) {
        if (this.timer) {
          clearTimeout (this.timer);
          this.timer = null;
        }
        return;
      }
      console.log ('run()');
      let times = this[this.toplay];
      if (this.mode === 'delay') {
        if (times.extratime > 0) {
          times.extratime -= 1;
        } else {
          times.maintime -= 1;
        }
      } else {
        times.maintime -= 1;
      }
      if (times.maintime <= 0) {
        this.runstate = 'pause';
      }
      console.log (
        `After run(): ${this.toplay} : ${this[this.toplay].maintime}`
      );
      clearTimeout (this.timer);
      this.timer = setTimeout (this.run, 1000);
    },

    reset: function () {
      console.log ('reset()');
      ['white', 'black'].forEach (player => {
        ['maintime', 'extratime'].forEach (time => {
          this[player][time] = this[time];
        });
      });
      this.toplay = 'white';
      this.runstate = 'pause';
    },

    start: function (player) {
      console.log (`start(${player})`);
      if (!player) {
        player = this.toplay;
      }
      if (player.maintime <= 0){
          return;
      }
      this.runstate = player;
      this.toplay = player;
      switch (this.mode) {
        case 'delay':
          this[player].extratime = this.extratime;
          break;
        case 'increment':
          this[player].maintime += this.extratime;
          break;
        default:
          break;
      }
      this.run ();
    },
    pause: function () {
      console.log ('pause');
      this.runstate = 'pause';
    },
    onFormOk: function (evt) {
      this.mode = this.form.mode;
      this.extratime = this.form.extratime;
      this.reset ();
    },
    onFormCancel: function (evt) {
      this.reset ();
    },
    settingsSummary: function (mode, maintime, extratime) {
      let str = `${capitalise (mode)}: ${formatTime (maintime)}`;
      if (mode != 'standard') {
        str = `${str} + ${extratime} s`;
      }
      return str;
    },
    timeClass: function (player) {
      if (this.white.maintime === 0 || this.black.maintime === 0) {
        return 'text-secondary';
      }
      return this[player].maintime > 10 ? 'text-dark' : 'text-danger';
    },
    newGame: function () {
      this.reset ();
      newGame ();
    },
    fixPGN: function () {
        console.log('fixPGN() called');
        console.log(this.player_white, this.player_black);
      window.pgnHeader (this.player_white, this.player_black);
    },
  },
  filters: {
    time_display: function (txt) {
      return formatTime (txt);
    },
  },
  created () {
    console.log ('created()');
    this.reset ();
  },
  computed: {
    extratime_label: function () {
      if (this.form.mode === 'standard') {
        return null;
      } else {
        return capitalise (this.form.mode) + ' (s)';
      }
    },

    clock_settings_popover: function () {
      let content = `[${capitalise (this.mode)} ${formatTime (this.maintime)}`;
      if (this.mode !== 'standard') {
        content += '+' + this.extratime + 's';
      }
      content += ']';
      return {
        title: 'Clock settings',
        content: content,
      };
    },
    maintime: function () {
      let form_t = this.form.maintime;
      return 3600 * form_t.h + 60 * form_t.m + form_t.s;
    },
  },
});

function formatTime (sec) {
  let [hours, mins, secs] = split_time (sec);
  let str = '';
  if (hours > 0) {
    str += hours + ':';
  }
  str += ('00' + mins).slice (-2) + '.';
  str += ('00' + secs).slice (-2);
  return str;
}

function split_time (sec) {
  let hours = Math.trunc (sec / 3600);
  let mins = Math.trunc ((sec - 3600 * hours) / 60);
  let secs = Math.trunc (sec - 3600 * hours - 60 * mins);
  return [hours, mins, secs];
}

function capitalise (str) {
  return str.charAt (0).toUpperCase () + str.slice (1);
}
