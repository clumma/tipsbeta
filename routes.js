if (Meteor.isClient) {
  Meteor.Router.add({
    '/home'  : 'home',
    '/about' : 'about'
  });
}
