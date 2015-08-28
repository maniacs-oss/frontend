import Ember from 'ember';

export default Ember.Route.extend({
    model: function(){
      var promises = {
        aamcpcrs: this.store.find('aamc-pcrs', {limit: 2}),
        aamcmethods: this.store.find('aamc-method', {limit: 2}),
        academicYears: this.store.find('academic-year', {limit: 2}),
        alerts: this.store.find('alert', {limit: 2}),
        cohorts: this.store.find('cohort', {limit: 2}),
        competencies: this.store.find('competency', {limit: 2}),
        courselearningmaterials: this.store.find('course-learning-material', {limit: 2}),
        courses: this.store.find('course', {limit: 2}),
        courseClerkshipTypes: this.store.find('course-clerkship-type', {limit: 2}),
        curriculuminventoryinstitutions: this.store.find('curriculum-inventory-institution', {limit: 2}),
        curriculuminventoryreports: this.store.find('curriculum-inventory-report', {limit: 2}),
        curriculuminventoryexports: this.store.find('curriculum-inventory-export', {limit: 2}),
        curriculuminventorysequences: this.store.find('curriculum-inventory-sequence', {limit: 2}),
        curriculuminventorysequenceblocks: this.store.find('curriculum-inventory-sequence-block', {limit: 2}),
        curriculuminventoryacademiclevels: this.store.find('curriculum-inventory-academic-level', {limit: 2}),
        disciplines: this.store.find('discipline', {limit: 2}),
        departments: this.store.find('department', {limit: 2}),
        ilmsessions: this.store.find('ilm-session', {limit: 2}),
        instructorgroups: this.store.find('instructor-group', {limit: 2}),
        learnergroups: this.store.find('learner-group', {limit: 2}),
        learningmaterials: this.store.find('learning-material', {limit: 2}),
        learningmaterialuserrole: this.store.find('learning-material-user-role', {limit: 2}),
        learningmaterialstatus: this.store.find('learning-material-status', {limit: 2}),
        meshconcepts: this.store.find('mesh-concept', {limit: 2}),
        meshdescriptors: this.store.find('mesh-descriptor', {limit: 2}),
        meshqualifiers: this.store.find('mesh-qualifier', {limit: 2}),
        objectives: this.store.find('objective', {limit: 2}),
        offerings: this.store.find('offering', {limit: 2}),
        programyears: this.store.find('program-year', {limit: 2}),
        programs: this.store.find('program', {limit: 2}),
        publishevents: this.store.find('publish-event', {limit: 2}),
        reports: this.store.find('report', {limit: 2}),
        schools: this.store.find('school', {limit: 2}),
        sessiondescriptions: this.store.find('session-description', {limit: 2}),
        sessionlearningmaterials: this.store.find('session-learning-material', {limit: 2}),
        sessiontypes: this.store.find('session-type', {limit: 2}),
        sessions: this.store.find('session', {limit: 2}),
        users: this.store.find('user', {limit: 2}),
        userroles: this.store.find('user-role', {limit: 2}),
      };
      return Ember.RSVP.hash(promises);
    },
});
