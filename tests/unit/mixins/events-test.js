import EventMixin from '../../../mixins/events';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Mixin | events');

// Replace this with your real tests.
test('it works', function(assert) {
  var EventObject = Ember.Object.extend(EventMixin);
  var subject = EventObject.create();
  assert.ok(subject);
});
