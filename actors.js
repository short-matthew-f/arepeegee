(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var Actor = ArePeeGee.Actor = function (options) {
    this.position = options.position;
    this.health = options.health;
    this.strength = options.strength;
    this.defense = options.defense;
  };

  _(Actor).extend({

  });

  _(Actor.prototype).extend({
    attack: function(target) {
      var oomph = Math.max(this.strength - target.defense, 0);
      var _rand = Math.floor(Math.random() + 0.5);
      var damageDone = oomph + _rand;

      target.health -= damageDone;
    }, 

    isAlive: function() {
      return this.health > 0;
    }
  });
})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var Enemy = ArePeeGee.Enemy = function (options) {
    ArePeeGee.Actor.call(this, options);
  };

  Enemy.inherits(ArePeeGee.Actor);

  _(Enemy).extend({

  });

  _(Enemy.prototype).extend({
    render: function() {
      return "enemy";
    }
  });
})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var Hero = ArePeeGee.Hero = function (options) {
    ArePeeGee.Actor.call(this, options);
  };

  Hero.inherits(ArePeeGee.Actor);

  _(Hero).extend({

  });

  _(Hero.prototype).extend({
    render: function() {
      return "hero";
    }
  });
})(window);