import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('course-header', 'CourseHeaderComponent', {
  needs: [
    'component:editable-text',
    'component:publication-status',
    'helper:fa-icon'
  ]
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});