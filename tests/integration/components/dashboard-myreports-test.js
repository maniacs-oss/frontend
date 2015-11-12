import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import tHelper from "ember-i18n/helper";

let mockReports = [
  Ember.Object.create({displayTitle: {content: 'all courses'}, subject: 'courses', user: 1}),
  Ember.Object.create({displayTitle: {content: 'courses for session'}, subject: 'courses', prepositionalObject: 'session', prepositionalObjectTableRowId: 11, user: 1}),
];

let currentUserMock = Ember.Service.extend({
  model: Ember.computed(function(){
    let model = Ember.Object.extend({
      reports: Ember.computed(function() {
        return Ember.RSVP.resolve(mockReports);
      })
    });
    return new Ember.RSVP.resolve(model.create());
  })
});

let currentUserMockNoReports = Ember.Service.extend({
  model: Ember.computed(function(){
    let model = Ember.Object.extend({
      reports: Ember.computed(function() {
        return Ember.RSVP.resolve([]);
      })
    });
    return new Ember.RSVP.resolve(model.create());
  })
});



moduleForComponent('dashboard-myreports', 'Integration | Component | dashboard myreports', {
  integration: true,
  beforeEach: function() {
    this.container.lookup('service:i18n').set('locale', 'en');
    this.registry.register('helper:t', tHelper);
  }
});

test('list reports', function(assert) {
  assert.expect(4);
  this.container.register('service:mockcurrentuser', currentUserMock);
  this.container.injection('component', 'currentUser', 'service:mockcurrentuser');
  this.render(hbs`{{dashboard-myreports}}`);
  
  assert.equal(this.$('.dashboard-block-header').text().trim(), 'My Reports');
  for(let i = 0; i < 2; i++){
    let tds = this.$(`table tr:eq(${i}) td`);
    assert.equal(tds.eq(0).text().trim(), mockReports[i].displayTitle.content);
  }
  assert.equal(this.$(`table tr`).length, 2);
});

test('display none when no reports', function(assert) {
  assert.expect(2);
  this.container.register('service:mockcurrentuser', currentUserMockNoReports);
  this.container.injection('component', 'currentUser', 'service:mockcurrentuser');
  this.render(hbs`{{dashboard-myreports}}`);
  assert.equal(this.$('.dashboard-block-header').text().trim(), 'My Reports');
  
  assert.equal(this.$('.dashboard-block-body').text().trim(), 'None');
  
});
