'use strict';
/* jshint esversion: 6 */

var Clock = function (mode, basetime, extratime) {
  this.mode = mode; // 'Standard'|'Fischer'||'Bronstein'
  this.basetime = basetime; // seconds
  this.extratime = extratime; // seconds (increment or delay)
  this.on_timeloss = null; // Callback: on_timeloss(username)
  this.on_tick = null; // Callback: on_tick(clock)
  this.ticker = null;
  this.state = {
    running: 'stop', // 'white'|'black'|'stop'|'white_timeout' |'black_timeout'
    locked: false,
    white: {
      time: this.basetime,
      extratime: this.extratime,
    },
    black: {
      time: this.basetime,
      extratime: this.extratime,
    },
  };

  this.tick = function (clock) {
    if (
      !clock.state.locked &&
      ['white', 'black'].indexOf (clock.state.running) !== -1
    ) {
      const player = clock.state.running;
      if (clock.mode === 'Bronstein' && clock.state[player].extratime > 0) {
        clock.state[player].extratime -= 1;
      } else {
        clock.state[player].time -= 1;
      }
      if (clock.on_tick) {
        clock.on_tick (clock);
      }
      if (clock.state[player].time <= 0) {
        clock.update_display (clock.state.running);
        clock.state.running = 'stop';
        clock.state.locked = true;
        if (clock.lost_on_time_callback) {
          clock.lost_on_time_callback (player);
        }
      }
    }
    clock.update_display (clock.state.running);
    clock.ticker = setTimeout (clock.tick, 1000, clock);
  };

  this.reset = function () {
    this.state.running = 'stop';
    this.state.locked = false;
    for (var player of ['white', 'black']) {
      console.log (
        `this=${this}; this.state=${this.state}; player=${player}; this.state[player]=${this.state[player]}`
      );
      this.state[player].time = this.basetime;
      this.state[player].extratime = this.extratime;
      this.update_display (player, true);
    }
    this.ticker = setTimeout (this.tick, 1000, this);
  };

  this.start = function (player) {
    if (this.state.locked) {
      console.log ('Clock is locked, need to reset');
      return;
    }
    switch (this.mode) {
      case 'Fischer':
        this.state[player].time += this.state[player].extratime;
        break;
      case 'Bronstein':
        this.state[player].extratime = this.extratime; // reset the delay
        break;
      default:
        break;
    }
    this.state.running = player;
    this.update_display (player);
    return this.state.running;
  };

  this.format_time = function (secs) {
    function d2 (i) {
      if (i < 10) {
        return '0' + i;
      }
      return i;
    }
    var hours = Math.floor (secs / 3600);
    secs -= hours * 3600;
    var mins = Math.floor (secs / 60);
    secs -= mins * 60;
    secs = Math.floor (secs);
    if (hours > 0) {
      return `${hours}:${d2 (mins)}.${d2 (secs)}`;
    } else if (mins > 0) {
      return `${mins}.${d2 (secs)}`;
    } else {
      return `.${d2 (secs)}`;
    }
  };

  this.update_display = function (player, statics) {
    if (player === 'white' || player === 'black') {
      if (statics) {
        // refresh the 'static' items (eg player names)
        $ (`#clock > #${player}name`).text (player);
      }
      var opponent = player === 'white' ? 'black' : 'white';
      var $player_time = $ (`#${player}_time`);
      var $opponent_time = $ (`#${opponent}_time`);
      var time = this.state[player].time;
      var time_str = this.format_time (time);
      $player_time
        .removeClass ('notrunning')
        .addClass ('running')
        .text (time_str);
      if (time < 20) {
        $player_time.addClass ('panic');
      }
      $opponent_time.removeClass ('running').addClass ('notrunning');
      // console.log (
      //   `${player}: ${$player_time.attr ('class')}, ${opponent}: ${$opponent_time.attr ('class')}
    }
  };
};
