#!/usr/bin/env node

const { Event } = require('race-lib');
const inquirer = require('inquirer');
const fuzzy = require('fuzzy');

const ui = new inquirer.ui.BottomBar();

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const selectRace = function(evt) {
  return inquirer.prompt({
    message: "what race?",
    type: 'list',
    choices: evt.races.map((race) => { return {name: race.name, value: race.id } } ),
    name: 'race'
  }).then((answers) => {
    console.log(answers);
    let race = evt.races.find((race) => { return race.id === answers.race; });
    return race.entrants()
  }).then((users) => {
    console.log(users);
    selectEvent();
  });
}

const searchEvents = function(answers, input) {
  input = input || '';
  ui.updateBottomBar('Events loading...');
  return Event.upcomming().then((events) => {
    return fuzzy.filter(input, events, { extract: (evt) => evt.name }).map((result) => {
      return { name: result.original.name, value: result.original };
    });
  })
}

const selectEvent = function() {
  console.log('bar');
  inquirer.prompt({
    message: "what event?",
    name: 'event',
    type: 'autocomplete',
    source: searchEvents,
    pageSize: 10,
  }).then((answers) => {
    ui.updateBottomBar('Races loading...');
    answers.event.init().then((evt) => {
      selectRace(evt);
    });
  });
}

selectEvent();
