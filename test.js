Yazilar = new Mongo.Collection("Yazilar");

if (Meteor.isClient) {

  Meteor.subscribe('kullaniciYazilari');

  Template.yazilar.helpers({

    yazilar: function () {

      return Yazilar.find();

    }

  });

  Template.yazilar.events({

    'click .sil': function () {

      yazi = this._id;

      Meteor.call('yaziSil',yazi);

    }

  });

  Template.yaziEkle.events({

    'submit form': function (event) {

      event.preventDefault();

      var yazi = event.target.yazi.value;

      Meteor.call('yaziEkle',yazi);

      event.target.yazi.value = "";
    }

  });

}

if (Meteor.isServer) {

  Meteor.publish('kullaniciYazilari', function () {

    var kullanici = this.userId;
    return Yazilar.find({kullanici : kullanici});

  });

  Meteor.methods({

    'yaziEkle': function (yazi) {
      Yazilar.insert({
        kullanici : Meteor.userId(),
        yazi : yazi,
        createdAt : new Date
      });
      console.log("Yazı eklendi!");
    },
    'yaziSil': function (yazi) {

      Yazilar.remove({_id : yazi,kullanici : Meteor.userId()});

    }

  });

}
