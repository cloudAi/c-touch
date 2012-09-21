var appTouch = appTouch || {};
(function($, T){

var Scene = {
    init : function(){
        this.init_outlet();
        this.init_segue_action();
        this.init_push_action();
        this.init_add_action();
    },

    init_outlet : function(){
        this.scene = $('.c_scene_wrap');
        this.scene_holder = $('.c_scene_inner:first', this.scene);
        this.home_view = $('.home_view:first' , this.scene);
        this.add_home_view = $('.add_view:first' , this.scene);
        this.scene_title = $('.c_title:first' , this.scene);

        var content = ('<div class="place_holder">detail_view</div>');
        // this.detail_view = this.add_view(content);
        this.detail_view = $('.detail_view:first' , this.scene);
    },

    init_push_action : function(){
        var self = this;
        var segue_btn = $('.place_holder', self.home_view);

        segue_btn.on('click', function(){
            var key = {
                point : 'L',
                root  : self.home_view,
                segue : self.detail_view
            }

            self.push_segue(key);
            return false;
        });

    },

    init_segue_action : function(){
        var self = this;
        var segue_btn = $('.place_holder', self.detail_view);
        var back_btn = $('.c_title .c_left a:first', self.detail_view);
        var back = segue_btn.add(back_btn);
        back.on('click', function(){
            var key = {
                point : 'R',
                root  : self.detail_view,
                segue : self.home_view
            }
            self.push_segue(key);
            return false;
        });
    },


    init_add_action : function(){
        var self = this;
        var segue_btn = $('.c_right a', self.home_view);

        segue_btn.on('click', function(){
            var key = {
                point : 'T',
                root  : self.home_view,
                segue : self.add_home_view
            }
            self.slide_segue(key);
            return false;
        });
        var cancel_btn = $('.c_right a', self.add_home_view);

        cancel_btn.on('click', function(){
            var key = {
                point : 'B',
                root  : self.add_home_view,
                segue : self.home_view
            }
            self.slide_segue(key);
            return false;
        });
    },


    slide_segue : function(key){

        if(!key) return;
        var self = this;
        var action = {};
        var plan = {};

        key.holder = key.holder || self.scene_holder;
        switch(key.point)
        {
            case 'L':
            case 'R':
                action.left = '0%';
                break;
            case 'T':
                action.top = '0%';
                key.mover  = key.segue;
                break;
            case 'B':
                action.top = '0%';
                key.mover  = key.root;
                break;
        }

        key.action = action;
         
        self.segue_animate(key);
    },

    push_segue : function(key){
        if(!key) return;
        var self = this;
        var action = {};
        var plan = {};
        var attr = 'left';
        var flag = false;

        switch(key.point)
        {
            case 'L':
                key.title_magic = true;
                break;
            case 'R':
                flag = true;
                key.title_magic = true;
                break;
            case 'T':
                action.top = '-100%';
                plan.top = '100%';
                break;
            case 'B':
                action.top = '100%';
                plan.top = '-100%';
                break;
        }
        var des = '100%';
        var val = (flag ? '':'-') + des;
        action[attr] = val;
        var val = (flag ? '':'-') + des;

        key.action = action;
        key.holder = key.holder || self.scene_holder;
        key.mover  = key.holder;
         
        self.segue_animate(key);
    },

    segue_title_animate : function(k, speed, type){

        var t_holder = k.holder.siblings('.c_scene_title:first');
        if(t_holder.length == 0){
            t_holder = $('<div></div>').addClass('c_scene_title c_title');
            t_holder.insertBefore(k.holder);
        }else{
            t_holder.html();
        }

        var t_root = $('.c_title:first', k.root).clone();
        var t_segue = $('.c_title:first', k.segue).clone();

        t_root.attr('class','c_title_inner');
        t_segue.attr('class','c_title_inner');

        t_holder.html(t_root);
        t_holder.append(t_segue);

        t_holder.addClass('c_title_pushing c_title_push_' + k.point);

        t_point = k.point == 'L' ? '' : '-';

        t_segue.css({
            opacity : 0.1,
            left : t_point + '20%'
        });
        t_root.css({
            opacity : 0.8
        });

        var t_tit_text = $('.c_mid:first', t_root);

        var t_call = function(){
            t_holder.remove();
        }

        var t_speed = 300;

        t_tit_text.animate({right : t_point + '10%'}, t_speed);
        t_root.animate({ opacity : 0.1 }, t_speed / 2);
        t_segue.animate({left: '0%', opacity : 1 }, t_speed , t_call);

    },


    segue_animate : function(k, speed, type ){
        if(!k) return;
        var self = this;

        var point = k.point;

        var root  = k.root;
        var segue = k.segue;
        var mover = k.mover;
        var holder = k.holder;

        var action = k.action;

        //avoid the pushing repeat
        if(holder.hasClass('c_view_pushing')) return;

        //code for title magic move;
        var t_magic = k.title_magic || 0;

        if(t_magic){
            self.segue_title_animate(k);
        }

        //view pushing action
        var callback = function(){
            console.log(k.point + ' push ok');
            holder.removeClass('c_view_pushing c_view_push_' + point);

            root.addClass('c_view_hide');
            segue.removeClass('c_view_segue');
        
            mover.removeAttr('style');
        }

        holder.addClass('c_view_pushing c_view_push_' + point);
        segue.removeClass('c_view_hide');
        segue.addClass('c_view_segue');

        //mover.css('z-index', 1);

        if(0 && $.browser.webkit){
            mover.addClass('c_view_webkit');
            mover.css(action);
            setTimeout(callback, 350);
        }else{
            mover.animate(action, 300, callback);
        }
    },

    // view shoud be an $dom object
    add_segue_view : function(content){
        var segue_view = this.add_view();
        segue_view.addClass('c_view_segue');
        segue_view.append(content);
        return segue_view;
    },

    add_view : function(content){
        var view = $('<div></div>');
        view.addClass('c_view c_view_hide');
        view.append(content);
        view.appendTo(this.scene_holder);
        return view;
    }

}


// var base = function(){
//     this.info = 'I am the base class';
//     this.getInfo = function(){
//         return this.info;
//     }
// }

// var newClass = function(){
//     this.info = "I am the new class";
// }

// newClass.prototype = new base();

// var obj = new newClass();

// console.log(obj.getInfo());

var Node = function(){
    this.info = 'I am the base class';
    this.getInfo = function(){
        return this.info;
    }

    var addRAM = function (additionalRAM) {
        RAM += additionalRAM;
    };
}

var node = Node;

var View = function(){
    this.info = "I am the new a class";
}

View.prototype = new node();

T.view = View;

$(function(){
    Scene.init();
})

})(jQuery, appTouch);

(function($, T){

var Scene = function(){
    this.info = 'I am the base scene';
    var getModel =  function () {
        console.log( "The private is " + this.info);
    }
    return SceneClass;

}

var SceneClass = {
    init : function() {
        console.log('init');
    },

    extand : function(){
        
    }
}

var View = function(){
    this.info = 'I am the base view';
    return ViewClass;
}

var ViewClass = {
    init : function() {
        console.log('init');
    },

    extend : function(subClass){
        return subClass;
    }
}



var scene = new Scene();

})(jQuery, appTouch);

var console = console || {
    log : function(){
        return false;
    }
}

$(function(){
    var T = appTouch;
    var obj = new T.view();
    var info = obj.getInfo();
    console.log(info);
})