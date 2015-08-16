/**
 * Door Entity
 */
game.DoorEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // set settings
        settings.image = 'door';
        settings.frameheight = 16;
        settings.framewidth = 48;

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = 'door';
        this.closed = true;
        this.channel = settings.channel;
        this.anchor = this.pos;

        // set channel
        game.channels[this.channel] = false;

        // flip the sprite so it matches orientation
        this.facing = settings.facing;
        if (this.facing === 'right') {
            this.renderable.angle = Math.PI; // consider using flipY instead ?
        } else if (this.facing === 'up') {
            this.renderable.angle = Math.PI / 2;
        } else if (this.facing === 'down') {
            this.renderable.angle = -Math.PI / 2;
        } else {
            this.renderable.angle = 0;
        }

        // set the channel
        this.channel = settings.channel;

        // we set the velocity of the player's body
        this.body.setVelocity(0, 0);
        this.body.setMaxVelocity(0, 0);
        this.body.gravity = 0;

        // we always update the piglets, ALWAYS
        this.alwaysUpdate = true;
    },

    setCurrentAnimation: function(name, onComplete) {
        if (!this.renderable.isCurrentAnimation(name)) {
            this.renderable.setCurrentAnimation(name, onComplete);
        }
    },

    break: function() {
        //break the block
        me.game.world.removeChild(this);
    },

    /**
     * update the entity
     */
    update : function (dt) {
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // handle opening
        var isChannelOn = game.channels[this.channel];
        if (this.closed && isChannelOn) {
            this.open();
        } else if (!this.closed && !isChannelOn) {
            this.close();
        }

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]));
    },

    open: function() {
        this.pos = this.anchor.clone();
        this.pos.y -= 48;
        this.closed = false;

        //set timeout to close the door
        if(!this.closingTimeout) {
            this.closingTimeout = me.timer.setTimeout((function() {
                this.close();
                this.closingTimeout = null;
                console.log('kek');
            }).bind(this), 3000);
        }

    },

    close: function() {
        this.pos = this.anchor.clone();
        this.closed = true;
    },

    activateChannel: function(channel) {
        game.channels[channel] = true;
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision: function (response, other) {
        return false;
    }
});
