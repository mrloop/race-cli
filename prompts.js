'use strict';

const { Event } = require('race-lib');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');
const chalk = require('chalk');
const { table } = require('table');

const ui = new inquirer.ui.BottomBar();

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const selectRace = function(evt) {
  if(evt.races.find( race => race.id )) {
    printRacesWithNoData(evt);
    return racePrompt(evt);
  } else {
    ui.updateBottomBar(chalk.bgMagenta('No entrants data found\n'));
    return selectEvent();
  }
}

const printRacesWithNoData = function(evt) {
  let s = evt.races.reduce((str, race) => {
    if(race.id === undefined) {
      str = `${str}\n${race.name}`;
    }
    return str;
  }, "");
  if(s.length > 0){
    ui.updateBottomBar(`${chalk.bgMagenta('No entrants data for:')}${s}\n`);
  }
}

const racePrompt = function(evt) {
  return inquirer.prompt({
    message: "what race?",
    type: 'list',
    choices: evt.races
      .filter(race => race.id )
      .map((race) => { return {name: race.name, value: race.id } }),
    name: 'race'
  }).then((answers) => {
    let race = evt.races.find((race) => { return race.id === answers.race; });
    ui.updateBottomBar('Entrants loading...');
    return race.entrants()
  }).then((users) => {
    displayEntrants(users);
    return selectEvent();
  })
}

const displayEntrants = function(users) {
  const headers = [["Name", "Club", "Regional Rank", "National Rank"].map( h => chalk.bold(h))];
  const data = users.reduce((arr, user) => {
    if(user.name) {
      arr.push([user.name,
        user.current_club,
        user.regional_rank === 999 ? '' : user.regional_rank,
        user.national_rank === 999 ? '' : user.national_rank
      ]);
    }
    return arr;
  }, []);
  ui.updateBottomBar(table(headers.concat(data)));
}

const searchEvents = function(answers, input) {
  input = input || '';
  return Event.upcomming().then((events) => {
    return fuzzy.filter(input, events, { extract: (evt) => evt.name }).map((result) => {
      return { name: result.original.name, value: result.original };
    });
  })
}

const selectEvent = function() {
  return inquirer.prompt({
    message: "what event?",
    name: 'event',
    type: 'autocomplete',
    source: searchEvents,
    pageSize: 10,
  }).then((answers) => {
    ui.updateBottomBar('Races loading...');
    return answers.event.init().then((evt) => {
      return selectRace(evt);
    });
  }).catch((error) => {
    console.log(error);
  });
}

module.exports.selectEvent = selectEvent;
module.exports.ui = ui;
