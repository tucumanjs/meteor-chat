var Rooms = new Meteor.Collection('rooms');
var Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  Template.rooms.events = ({
    'click button#addRoom': function () {
      var roomName = window.prompt('Nombre de la sala', 'Sala TucJS') || 'Sala sin nombre';
      if (roomName) {
        Rooms.insert({'name': roomName});
      }
    }
  });

  Template.main.currentRoom = function () {
    return Session.get('room') || false;
  };

  Template.rooms.availableRooms = function () {
    return Rooms.find({});
  };

  Template.roomItem.events = ({
    'click .enter': function () {
      var name;
      if (Session.get('name') === undefined) {
        name = window.prompt('Ingresa tu nombre', 'Invitado') || 'Fulanito';
        Session.set('name', name);
      }

      Session.set('room', this._id);
    },
    'click .delete': function () {
      Rooms.remove({_id:this._id});
    }
  });

  Template.room.roomName = function () {
     var room = Rooms.findOne({_id: Session.get('room')});
     return room && room.name;
  };

  Template.room.messages = function () {
    return Messages.find({room: Session.get('room')});
  };

  Template.room.events = ({
    'click #leave': function () {
      if(!window.confirm('Dejar la sala?', 'Quieres salir realmente?')) { return; }
      Session.set('room', undefined);
    },
    'submit': function () {
      var $msg  = $('#msg');
      if ($msg.val()){
        Messages.insert({
          'room': Session.get('room'),
          'author': Session.get('name'),
          'text': $msg.val(),
          'timestamp': (new Date()).toUTCString()
        });
      }

      $msg
        .val('')
        .focus();

      Meteor.flush();

      $('#messages').scrollTop(99999);
    }
  });

  Template.messageItem.authorClass = function () {
    return Session.equals('name', this.author) ? 'owner' : 'other';
  };
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
