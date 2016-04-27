import Ember from 'ember';
import DS from 'ember-data';
import { translationMacro as t } from "ember-i18n";

const { Component, computed, inject, observer, RSVP, run, ObjectProxy } = Ember;
const { PromiseArray, PromiseObject } = DS;
const { service } = inject;
const { debounce } = run;
const { sort, not, alias } = computed;
const { Promise } = RSVP;

const SessionProxy = ObjectProxy.extend({
  content: null,
  currentUser: null,
  expandOfferings: false,
  showRemoveConfirmation: false,
  userCanDelete: computed('content.course', 'currentUser.model.directedCourses.[]', function(){
    let defer = RSVP.defer();
    this.get('currentUser.userIsDeveloper').then(isDeveloper => {
      if(isDeveloper){
        defer.resolve(true);
      } else {
        this.get('content').get('course').then(course => {
          this.get('currentUser.model').then(user => {
            user.get('directedCourses').then(directedCourses => {
              defer.resolve(directedCourses.contains(course));
            });
          });
        });
      }
    });

    return PromiseObject.create({
      promise: defer.promise
    });
  })
});

export default Component.extend({
  classNames: ['detail-view', 'sessions-list'],

  store: service(),
  i18n: service(),
  currentUser: service(),

  editable: not('course.locked'),
  sessionsCount: alias('sessions.length'),
  sessions: alias('course.sessions'),
  offset: 0,
  limit: 25,

  filter: '',
  course: null,

  placeholderValue: t('sessions.titleFilterPlaceholder'),

  //in order to delay rendering until a user is done typing debounce the title filter
  debouncedFilter: '',

  watchFilter: observer('filter', function() {
    debounce(this, this.setFilter, 500);
  }),

  setFilter() {
    this.set('debouncedFilter', this.get('filter'));
  },

  proxiedSessions: computed('sessions.[]', function() {
    return new Promise( resolve => {
      this.get('sessions').then(sessions => {
        return RSVP.map(sessions.toArray(), session => {
          return RSVP.hash({
            sessionType: session.get('sessionType'),
            firstOfferingDate: session.get('firstOfferingDate'),
            associatedLearnerGroups: session.get('associatedLearnerGroups'),
            offerings: session.get('offerings'),
          }).then(({sessionType, firstOfferingDate, associatedLearnerGroups, offerings})=> {
            return SessionProxy.create({
              content: session,
              currentUser: this.get('currentUser'),
              sessionType: sessionType.get('title'),
              firstOfferingDate,
              learnerGroupCount: associatedLearnerGroups.get('length'),
              offeringCount: offerings.get('length')
            });
          });
        }).then((proxiedSessions => {
          resolve(proxiedSessions);
        }));
      });
    });
  }),

  filteredContent: computed('proxiedSessions.[]', 'debouncedFilter', function(){
    let defer = RSVP.defer();
    this.get('proxiedSessions').then(sessions => {
      let filter = this.get('debouncedFilter');
      let filterExpressions = filter.split(' ').map(function(string){
        return new RegExp(string, 'gi');
      });
      let filtered = sessions.filter(session => {
        let searchString = session.get('searchString');
        if(searchString === null || searchString === undefined){
          return false;
        }
        let matchedSearchTerms = 0;
        for (let i = 0; i < filterExpressions.length; i++) {
          if(searchString.match(filterExpressions[i])){
            matchedSearchTerms++;
          }
        }
        //if the number of matching search terms is equal to the number searched, return true
        return (matchedSearchTerms === filterExpressions.length);
      });

      defer.resolve(filtered.sortBy('title'));
    });

    return PromiseArray.create({
      promise: defer.promise
    });
  }),

  sortAscending: true,
  sortItem: 'title',
  sortSessionBy: computed('sortAscending', 'sortItem', function(){
    const direction = this.get('sortAscending')?'asc':'desc';
    let sortItem = this.get('sortItem');

    return [sortItem + ':' + direction];
  }),
  sortedSessionList: sort('filteredContent', 'sortSessionBy'),

  displayedSessions: computed('sortedSessionList.[]', 'offset', 'limit', function(){
    const limit = this.get('limit');
    const offset = this.get('offset');
    const end = limit + offset;
    let sessions = this.get('sortedSessionList');

    return sessions.slice(offset, end);
  }),

  editorOn: false,

  saved: false,
  savedSession: null,
  isSaving: null,

  actions: {
    toggleEditor() {
      if (this.get('editorOn')) {
        this.set('editorOn', false);
      } else {
        this.setProperties({ editorOn: true, saved: false });
      }
    },

    cancel() {
      this.set('editorOn', false);
    },

    save(session) {
      this.set('isSaving', true);
      const course = this.get('course');
      session.set('course', course);

      return session.save().then((savedSession) => {
        this.setProperties({ saved: true, savedSession, isSaving: false });
      });
    },

    toggleExpandedOffering(sessionProxy){
      sessionProxy.set('expandOfferings', !sessionProxy.get('expandOfferings'));
    },
    confirmRemoval(sessionProxy){
      sessionProxy.set('showRemoveConfirmation', true);
    },
    remove(sessionProxy){
      let session = sessionProxy.get('content');
      session.deleteRecord();
      session.save();
    },
    cancelRemove(sessionProxy){
      sessionProxy.set('showRemoveConfirmation', false);
    },
    sortBy(item){
      this.set('forceFullSessionList', true);
      if (item === this.get('sortItem')){
        this.set('sortAscending', !this.get('sortAscending'));
      } else {
        this.set('sortAscending', true);
      }
      this.set('sortItem', item);
    },

    setOffset(offset){
      this.sendAction('setOffset', offset);
    },
    setLimit(limit){
      this.sendAction('setLimit', limit);
    }
  }
});
