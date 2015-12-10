/**
 * Mongodb yazılar collection'u
 * @type {Mongo.Collection}
 */
Yazilar = new Mongo.Collection("Yazilar");

/**
 * Sadece istemcide çalışacak kodlar
 */
if (Meteor.isClient) {

  /**
   * Kayıtları kullanıcı adı üzerinden almak için.
   */
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });

  /**
   * Kullanıcıların kendi yazıları sunucudan publish ( paylaşılıyor ) bizde onu subscribe ( takip ) ediyoruz!
   * Bu sayede veritabanından veriler kullanıcı bazlı filtrelenerek geliyor.
   */
  Meteor.subscribe('kullaniciYazilari');

  /**
   * Yazılar adlı template'in helper'i yani;
   * Veritabanı ile yapılacak işlemler vb.
   */
  Template.yazilar.helpers({

    yazilar: function () {

      return Yazilar.find();

    }

  });

  /**
   * Yazılar adlı template'in events'leri yani;
   * Kullanıcı dom elementlerinden birine tıkladığında x işlemi yap.
   * jQuery yazan kişiler bu senaryoya hakimdir.
   */
  Template.yazilar.events({

    'click .sil': function () {

      yazi = this._id;

      Meteor.call('yaziSil',yazi);

    }

  });

  /**
   * Yazı Ekle adlı template'in events'leri yani;
   * Kullanıcı dom elementlerinden birine tıkladığında x işlemi yap.
   * jQuery yazan kişiler bu senaryoya hakimdir.
   */
  Template.yaziEkle.events({

    'submit form': function (event) {

      event.preventDefault();

      var yazi = event.target.yazi.value;

      Meteor.call('yaziEkle',yazi);

      event.target.yazi.value = "";
    }

  });

}

/**
 * Sadece sunucuda çalışacak kodlar
 */
if (Meteor.isServer) {

  /**
   * Meteor'un publish metodu,
   * veritabanımızdan istemciye paylaşmak istediğimiz kodları
   * filtreleyerek paylaşmamıza yarar.
   */
  Meteor.publish('kullaniciYazilari', function () {

    var kullanici = this.userId; // this.userId değeri ile giriş yapan kullanıcının id değerini işledik!
    return Yazilar.find({kullanici : kullanici});

  });

  /**
   * Meteor'un metods metodu,
   * Veritabanımıza gireceğimiz (insert) verilerin güvenlik dahilinde
   * İçeri aktarılması içindir!
   */
  Meteor.methods({

    /**
     * Yazı Ekleme Metodu
     * @param yazi
       */
    'yaziEkle': function (yazi) {
      Yazilar.insert({
        kullanici : Meteor.userId(), // Meteor.userId() değeri ile giriş yapan kullanıcının id değerini işledik!
        yazi : yazi,
        createdAt : new Date
      });
      console.log("Yazı eklendi!");
    },
    'yaziSil': function (yazi) {

      Yazilar.remove({_id : yazi,kullanici : Meteor.userId()}); // Meteor.userId() değeri ile giriş yapan kullanıcının id değerine göre veriyi işledik!

    }

  });

}
