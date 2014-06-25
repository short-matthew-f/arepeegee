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

    this.killXP = options.killXP;
  };

  Enemy.inherits(ArePeeGee.Actor);

  _(Enemy).extend({

  });

  _(Enemy.prototype).extend({
    actorType: function() {
      return "enemy";
    },

    render: function() {
      return "enemy";
    }
  });
})(window);

(function (root) {
  var ArePeeGee = root.ArePeeGee = (root.ArePeeGee || {});

  var Hero = ArePeeGee.Hero = function (options) {
    ArePeeGee.Actor.call(this, options);
    this.xp = 0;
    this.level = 1;
    this.levelXP = Hero.xpForLevel(this.level); 
  };

  Hero.inherits(ArePeeGee.Actor);

  _(Hero).extend({
    xpForLevel: function(n) {
      if(n===1) {
        return 3;
      } else {
        return 3 + Math.floor(Hero.xpForLevel(n-1) * 1.1);
      };
    }
  });

  _(Hero.prototype).extend({
    actorType: function() {
      return "hero";
    },

    render: function() {
      var $hero = $('.hero-hud');

      var $ul = $('<ul>');

      var $li = $('<li>');
      $li.append($('<h1>').text('Level')).append($('<p>').text(this.level));
      $ul.append($li);

      var $li = $('<li>');
      $li.append($('<h1>').text('XP')).append($('<p>').text(this.xp));
      $ul.append($li);

      var $li = $('<li>');
      $li.append($('<h1>').text('Next level')).append($('<p>').text(this.levelXP));
      $ul.append($li);

      var $li = $('<li>');
      $li.append($('<h1>').text('Health')).append($('<p>').text(this.health));
      $ul.append($li);

      var $li = $('<li>');
      $li.append($('<h1>').text('Strength')).append($('<p>').text(this.strength));
      $ul.append($li);

      var $li = $('<li>');
      $li.append($('<h1>').text('Defense')).append($('<p>').text(this.defense));
      $ul.append($li);

      $hero.html($ul);
    },

    levelUp: function() {
      if (this.xp >= this.levelXP) {
        this.level += 1;
        this.health += 5;
        this.strength += 1;
        this.defense += 1;
        this.levelXP = Hero.xpForLevel(this.level);
      };
    }
  });
})(window);