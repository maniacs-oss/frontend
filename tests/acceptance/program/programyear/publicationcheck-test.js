import destroyApp from '../../../helpers/destroy-app';
import {
  module,
  test
} from 'qunit';
import startApp from 'ilios/tests/helpers/start-app';
import setupAuthentication from 'ilios/tests/helpers/setup-authentication';

var application;
var fixtures = {};
module('Acceptance: Program Year - Publication Check', {
  beforeEach: function() {
    application = startApp();
    setupAuthentication(application);
    server.create('school');
    server.create('programYear');
    server.create('cohort');
    fixtures.fullProgram = server.create('program', {
      startYear: 2013,
      school: 1,
      programYears: [1],
    });
    fixtures.emptyProgram = server.create('program', {
      startYear: 2013,
      school: 1
    });
  },

  afterEach: function() {
    destroyApp(application);
  }
});

test('full program count', function(assert) {
  visit('/programs/' + fixtures.fullProgram.id + '/publicationcheck');
  andThen(function() {
    assert.equal(currentPath(), 'program.publicationCheck');
    var items = find('.program-publication-check .detail-content table tbody td');
    assert.equal(getElementText(items.eq(0)), getText('program 0'));
    assert.equal(getElementText(items.eq(1)), getText('short_0'));
    assert.equal(getElementText(items.eq(2)), 4);
    assert.equal(getElementText(items.eq(3)), getText('Yes (1)'));
  });
});

test('empty program count', function(assert) {
  visit('/programs/' + fixtures.emptyProgram.id + '/publicationcheck');
  andThen(function() {
    assert.equal(currentPath(), 'program.publicationCheck');
    var items = find('.program-publication-check .detail-content table tbody td');
    assert.equal(getElementText(items.eq(0)), getText('program 1'));
    assert.equal(getElementText(items.eq(1)), getText('short_1'));
    assert.equal(getElementText(items.eq(2)), 4);
    assert.equal(getElementText(items.eq(3)), getText('No'));
  });
});
