import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { check } from 'meteor/check'

export const Tasks = new Mongo.Collection('tasks')

Meteor.methods({
	'tasks.insert'(text) {
		check(text, String)

		// Make sure the user is logged in before inserting a task
		if (!this.userId) {
			throw new Meteor.Error('not-authorized')
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: this.userId,
			username: Meteor.users.findOne(this.userId).username,
		})
	},
	'tasks.remove'(taskId) {
		check(taskId, String)

		const data = Tasks.findOne(taskId)
		if (data.owner !== this.userId) {
			throw new Meteor.Error('Not-Authorized')
		}

		Tasks.remove(taskId)
	},
	'tasks.setChecked'(taskId, setChecked) {
		check(taskId, String)
		check(setChecked, Boolean)

		const data = Tasks.findOne(taskId)
		if (data.owner !== this.userId) {
			throw new Meteor.Error('Not-Authorized')
		}

		Tasks.update(taskId, { $set: { checked: setChecked } })
	},
})
