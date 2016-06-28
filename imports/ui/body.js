import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './task.js';
import './body.html';
 
Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict()
});

Template.body.helpers({
  tasks() {
  	const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
    // Otherwise, return all of the tasks
  	return Tasks.find({},{sort:{createdAt:-1}});
  },
});

Template.body.events({
	"submit .new-task"(evt) {
		evt.preventDefault();
		Tasks.insert({
			text:evt.target.text.value,
			createdAt: new Date()
		});
		evt.target.text.value = '';
	},
	'change .hide-completed input'(evt, instance) {
		instance.state.set('hideCompleted',evt.target.checked);
	},
}) // end of Template.body.events

