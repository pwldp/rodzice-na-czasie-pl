$(document).ready(function() {	

    $("#more_user_menu").bind('click', function(){
        var pos = $("#logged_user_panel_content").position();
        $("#logged_user_panel_content_right").css("left", pos['left']+160 + "px");
        $("#logged_user_panel_content_right").slideToggle("fast", function() {
            $("#more_user_menu span").html($(this).is(':visible') ? '<img src="/images/arrow_left_15x24.png" />' : '<img src="/images/arrow_right_15x24.png" />');
            $("#more_user_menu span").parent().attr("title", $(this).is(':visible') ? "Zamknij panel użytkownika" : "Otwórz panel użytkownika");
            createMainTooltip("#more_user_menu");
        });
    });	


    //$("#f_search").bind('click', function() {
    //    if($(this).val() == "Wyszukaj szkołę lub użytkownika...") {
    //        $(this).val('');
    //    }
    //});

    createMainTooltip("#search_image_link");
    createMainTooltip("#more_user_menu");

    fitToScreen();

    //createSearchHelperTooltip("test");

    //setTimeout(function() {
    //    $("#wrapper").css('visibility', 'visible');
    //}, 3000);
	
});


$(window).resize(function() { fitToScreen(); });



function fitToScreen() {
    var window_height = $(window).height();
    var window_width = parseInt(GetWidth());
    //console.log(window_width);
    //var window_height = screen.height();
    //var window_width = screen.width();
    //alert(window_width);

    //console.log($("#wrapper").width());
    if(window_width < 860) {
        $("#content_box").css('width', window_width - 350 + 'px');
        $("#content_box").css('margin-left', '22px');
    }
    else if(window_width < 1100) {
        $("#content_box").css('width', '650px');
        $("#content_box").css('margin-left', '-12px');
    }
    else if(window_width < 1300) {
        $("#content_box").css('width', '800px');
        $("#content_box").css('margin-left', '22px');
    }
    else if(window_width < 1400) {
        $("#content_box").css('width', '870px');
        $("#content_box").css('margin-left', '22px');
    }
    else if(window_width < 1610) {
        $("#content_box").css('width', '990px');
        $("#content_box").css('margin-left', '62px');
    }
    else if(window_width < 1810) {
        $("#content_box").css('width', '1190px');
        $("#content_box").css('margin-left', '62px');
    }
    else {
        $("#content_box").css('width', '1290px');
        $("#content_box").css('margin-left', '62px');
    }
    //$("#wrapper").css('height', window_height + 'px');

    //$("select").select2({'width':'element'});

    //var content_box_width = $("#content_box").css('width');
    //$(".post_title").css('width', parseInt(content_box_width) - 420 + 'px');


    $(".ui-autocomplete").each(function() {
        $(this).css('height', '200px'); 
        $(this).css('overflow', 'auto');
        $(this).css('background-color', '#e8e6ed');
    });


    //var pos = $("#logged_user_panel").position();
    //$("#test_info").css('left', pos['left']+2 + 'px');

    fitPostContents();
    //fitSearchCategory();
}


function GetWidth() {
        var x = 0;
        if (self.innerHeight) {
                x = self.innerWidth;
        }
        else if (document.documentElement && document.documentElement.clientHeight) {
                x = document.documentElement.clientWidth;
        }
        else if (document.body) {
                x = document.body.clientWidth;
        }
        return $(window).width();
}


function showLoader() {
    $("#application_loader").show();
    
}


function hideLoader() {
    $("#application_loader").hide();
}


function createMainTooltip(target_items) {
    $(target_items).each(function(i){
        if($(this).attr('title')) {
            var rand = Math.floor((Math.random()*1000)+1000);
            var tooltext = ($(this).attr('title')).replace("[br]", "<br style='line-height: 20px;'>").replace("[b]", "<b>").replace("[/b]", "</b>").replace("[font13]", "<span style='font-size: 13px; font-family: HelveticaNeue, sans-serif;'>").replace("[/font13]", "</span>").replace("[font9]", "<span style='font-size: 9px;'>").replace("[/font9]", "</span>");
            $("body").append("<div class='cntr_tooltip' id='cntr_" + rand + "_tooltip"+i+"'><p>"+tooltext+"</p></div>");
	    var my_tooltip = $("#cntr_" + rand + "_tooltip"+i);
            $(this).removeAttr("title").mouseover(function(){
		my_tooltip.css({opacity:1, display:"none"}).show();
	    }).mousemove(function(kmouse){
		my_tooltip.css({left:kmouse.pageX - parseInt(parseInt($("#cntr_" + rand + "_tooltip"+i).width())/2), top:kmouse.pageY + 24});
	    }).mouseout(function(){
		my_tooltip.hide();
	    });
        }
    });
}


function clearTooltips() {
    $(".cntr_tooltip").each(function(i){
        $(this).remove();
    });
    $("#search_helper").hide();

    $("#logged_user_panel_content_right").slideUp("fast", function() {
        $("#more_user_menu span").html($(this).is(':visible') ? '<img src="/images/arrow_left_15x24.png" />' : '<img src="/images/arrow_right_15x24.png" />');
        $("#more_user_menu span").parent().attr("title", $(this).is(':visible') ? "Zamknij panel użytkownika" : "Otwórz panel użytkownika");
        createMainTooltip("#more_user_menu");
    });
    
}


function closeTopPanel() {
    $("#top_panel_toggle").slideUp("fast");
}


function closeSearchHelper() {
    $("#search_helper").hide();
}

function changeImageSrc(image_id, new_src) {
    $("#" + image_id).attr('src', new_src);
}


function redirectToUrl(url) {
    parent.location.href = url;
}


function createSearchHelperTooltip(message) {
    $('#search_helper').fadeIn(300);
}


function removeSearchHelperTooltip() {
    $('#search_helper').fadeOut(100);
}

function removeTimetablePosition(id) {
    clearTooltips();
    var agree = confirm("Czy na pewno usunąć pozycję?");
    if(agree) {
        $("#" + id).html('');
        $("#timetable_change_info").show();
    }
}


function resizeTextarea(obj_id, height) {
    $("#" + obj_id).css('height', height + 'px');
    //$("#" + obj_id).jScrollPane();
}


function generateSubjectShortcut(val) {
        if(val.indexOf(" ") > -1) {
            var arr = val.split(" ");
            //console.log(arr);
            var result = "";
            for(var i=0; i<=parseInt(arr.length)-2; i++) {
                //console.log(arr[i].substr(0,1));
                result += arr[i].substr(0,1);
            }
            if(result.length < 5) {
                //console.log(result);
                result += arr[arr.length-1].substr(0, 5-result.length);
            }
        }
        else {
            var result = val.substr(0,5);
        }
        //$("#field_subject_shortcut").text("Nazwa skrócona przedmiotu: " + result.toUpperCase());
        return result.toUpperCase();
}


function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}


function getDateText(dateString) {
    var today = new Date();
    if(dateString.toString().indexOf("T") > -1)
        var date_arr = dateString.toString().split("T");
    else
        var date_arr = dateString.toString().split(" ");
    console.log(date_arr);
    var dateToCheck = new Date(date_arr[0]);
    var one_day=1000*60*60*24;
    var days = Math.ceil((today.getTime()-dateToCheck.getTime())/(one_day)) - 1;
    var str = "";
    if(days == 0) str = "dzisiaj";
    else if(days == 1) str = "wczoraj";
    else if(days == 2) str = "przedwczoraj";
    else if(days == 7) str = "tydzień temu";
    else if(days == 14) str = "2 tygodnie temu";
    else if(days < 14) str = days + " dni temu";
    else str = date_arr[0];
    return str + ", " + date_arr[1].substr(0,5);
}


function isEmptyObject(obj) { 
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return false; 
} 


function enableDisableGroups(obj) {
    console.log(obj);
    if($(obj).attr('checked') == 'checked') {
        $(".post_checkbox_for_groups").each(function() {
            $(this).attr('disabled', 'disabled');
            $(this).css('background-color', '#333333');
            $(this).attr('title', 'Odznacz "Tylko Ciebie" żeby zaznaczyć grupy');
            $(this).css('opacity', '0.4');
        });
    }
    else {
        $(".post_checkbox_for_groups").each(function() {
            $(this).attr('disabled', '');
            $(this).removeAttr('disabled');
            $(this).css('background-color', '#ffffff');
            $(this).css('opacity', '1');
        });
    }
}


function createNotification(menu_category, counter, text) {
    var dt = new Date().getTime(); 
    var div_id = "notif_" + menu_category + "_" + dt;
    var pos = $("#main_menu_" + menu_category).position();
    var div_style = "top: " + (pos['top']-4) + "px; left: " + (pos['left']+86) + "px;";
    $("#wrapper").append('<div class="menu_notification" id="' + div_id + '" style="' + div_style + '" title="' + text + '"><span>' + counter + '</span></div>');
    
    if(text != "") {
        createMainTooltip("#" + div_id);
    }
}


function removeNotification(menu_category) {
    $(".menu_notification").each(function() {
        if($(this).attr('id').indexOf("notif_" + menu_category) > -1) {
            $(this).remove();
        }
    });
}


function timetable_kids_scroll(direction, number_of_kids) {
    var offset = $('#tt_kids_chooser_offset').text();
    if(offset == "") {
        $('#tt_kids_chooser_offset').text('0');
        offset = 0;
    }
    offset = parseInt(offset);
    if(direction == "right") {
        offset += (140*5);
        if (offset > (number_of_kids * 140)) {
            offset = number_of_kids * 140;
        }
        $('#tt_kids_chooser').animate({'margin-left': '-' + offset + 'px'});
    }
    else {
        offset -= (140*5);
        if (offset < 0) {
            offset = 0;
        }
        $('#tt_kids_chooser').animate({'margin-left': offset + 'px'});        
    }
    $('#tt_kids_chooser_offset').text(offset);

}


function validateHhMm(val) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(val);
    if (isValid)
        return true;
    return false;
}


function setSearchValue(val) {
    if(val != '') {
        $("#search_selected_id").text(val);
        $("#search_image_link").click();
    }
    else
        $("#search_selected_id").text('');
}



function fitPostContents() {
    $(".post_header").each(function() {
        var hght = $(this).height();
        var post_id = $(this).attr('id').replace('post_header_', '');
        $("#post_content_" + post_id).css('min-height', hght-38 + 'px');
    });

    var wdth1 = $(".post_header").width();
    var wdth2 = $(".post_content").width();
    
    //$(".post_comments_show_all").css('margin-left', wdth1 + wdth2 - 162 + 'px');
    //$(".post_comments").css('width', wdth2 + 32 + 'px');
    $(".post_comment_textarea").css('width', wdth2 - 288 + 'px');
    
}


function showAllPostContent(post_id, content) {
    $("#post_content_" + post_id).html(content);
}







function fitSearchCategory() {
    var pos = $("#search").position();
    //console.log(pos);
    $("#search_chooser").css('left', pos['left'] + 256 + 'px');

    $("#search_chooser").bind('click', function() {
        if($(this).css('height') == '62px') {
            $("#search_chooser").css('height', '31px');
            //$("#search_chooser").html('<div class="search_chooser_pos"><span>Użytkownicy</span></div>');
        }
        else {
            $("#search_chooser").css('height', '62px');
            $("#search_chooser").html('<div class="search_chooser_pos" onclick="searchCategoryClicked(1)"><span>Użytkownicy</span></div><div class="search_chooser_pos" onclick="searchCategoryClicked(2)"><span>Szkoły</span></div>');
        }
    });
}


function searchCategoryClicked(pos) {
    $("#active_search_chooser").text(pos);
    if($("#active_search_chooser").text() == "2") {
        $("#search_chooser").html('');
        $("#search_chooser").html('<div class="search_chooser_pos"><span>Szkoły</span></div>');
        $("#f_search_users").hide();
        $("#f_search_schools").show();
    }
    else {
        $("#search_chooser").html('');
        $("#search_chooser").html('<div class="search_chooser_pos"><span>Użytkownicy</span></div>');
        $("#f_search_schools").hide();
        $("#f_search_users").show();
    }
}




function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}


function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}


function setVoteWidth(obj_id, votes, votes_all) {
    var max_width = 360; 
    
}




