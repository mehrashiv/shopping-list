import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './task.js';
import './body.html';
 
Template.body.onCreated(function bodyOnCreated() {
	this.state = new ReactiveDict()
	Meteor.subscribe('tasks');
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
  incompleteCount() {
    return Tasks.find({checked : {$ne:true}}).count()
  },
});

Template.body.events({
	"submit .new-task"(evt) {
		evt.preventDefault();
		Meteor.call('tasks.insert', evt.target.text.value);
		// Tasks.insert({
		// 	text:evt.target.text.value,
		// 	createdAt: new Date(),
		// 	owner:Meteor.userId(),
		// 	username:Meteor.user().username,
		// });
		evt.target.text.value = '';
	},
	'change .hide-completed input'(evt, instance) {
		instance.state.set('hideCompleted',evt.target.checked);
	},
}) // end of Template.body.events

