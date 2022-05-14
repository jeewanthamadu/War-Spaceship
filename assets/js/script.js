

$(function () {

    var anim_id;

    //saving dom objects to variables

    var container = $('#container');
    var spaceship = $('#spaceship');
    var stone1 = $('#stone_1');
    var stone2 = $('#stone_2');
    var stone3 = $('#stone_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');
    var high_score = localStorage.getItem('high_score');
    $('#high_score').text(high_score);

    //saving some initial setup
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var spaceship_width = parseInt(spaceship.width());
    var spaceship_height = parseInt(spaceship.height());

    //some other declarations
    var game_over = false;

    var score_counter = 1;

    var speed = 1;
    var line_speed = 3;

    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;

    /* Move the spaceship */
    $(document).on('keydown', function (e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $(document).on('keyup', function (e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(spaceship.css('left')) > 0) {
            spaceship.css('left', parseInt(spaceship.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(spaceship.css('left')) < container_width - spaceship_width) {
            spaceship.css('left', parseInt(spaceship.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }

    function up() {
        if (game_over === false && parseInt(spaceship.css('top')) > 0) {
            spaceship.css('top', parseInt(spaceship.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(spaceship.css('top')) < container_height - spaceship_height) {
            spaceship.css('top', parseInt(spaceship.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    /* Move the stones */
    anim_id = requestAnimationFrame(repeat);

    function repeat() {
        if (collision(spaceship, stone1) || collision(spaceship, stone2) || collision(spaceship, stone3)) {
            stop_the_game();
            return;
        }

        score_counter++;

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            line_speed++;
        }

        spaceship_down(stone1);
        spaceship_down(stone2);
        spaceship_down(stone3);


        anim_id = requestAnimationFrame(repeat);
    }

    function spaceship_down(spaceship) {
        var spaceship_current_top = parseInt(spaceship.css('top'));
        if (spaceship_current_top > container_height) {
            spaceship_current_top = -200;
            var spaceship_left = parseInt(Math.random() * (container_width - spaceship_width));
            spaceship.css('left', spaceship_left);
        }
        spaceship.css('top', spaceship_current_top + speed);
    }


    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restart_div.slideDown();
        restart_btn.focus();
        setHighScore();
    }

    function setHighScore() {
        if (high_score < parseInt(score.text())) {
            high_score = parseInt(score.text());
            localStorage.setItem('high_score', parseInt(score.text()));
        }
        $('#high_score').text(high_score);
    }


    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

});