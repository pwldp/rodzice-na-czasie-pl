function setHelper() {	

    var window_height = $(window).height();
    var window_width = $(window).width();
    var div = '';

    $("#helper_wrapper").show();
    $("#helper_wrapper").html('');
    
    try {
        var pos_logged_user_panel_content = $("#logged_user_panel_content").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_logged_user_panel_content['left']+160) + "px; top: 24px;'><img src='/images/arrows__rightdownleftup.png' />&nbsp;<div>Rozwiń opcje<br>użytkownika</div></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_search_chooser = $("#search_image_link").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_search_chooser['left']-200) + "px; top: 46px;'>Skorzystaj z wyszukiwarki<br>aby znaleźć znajomych&nbsp;<img src='/images/arrows__leftdownrightup.png' align='right' style='position: relative; top: -32px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_options_panel = $(".options_panel").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_options_panel['left']-240) + "px; top: 100px;'>Tutaj zawsze znajduje się<br>możliwość dodania danych&nbsp;<img src='/images/arrows__leftuprightdown.png' align='right' style='position: relative; top: -12px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_invite_friends_form = $("#invite_friends_form").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_invite_friends_form['left']+100) + "px; top: " + (pos_invite_friends_form['top']-40) + "px;'><img src='/images/arrows__rightupleftdown.png' align='left' style='position: relative; top: 2px;' />&nbsp;Podaj email znajomego i zaproś go do serwisu</div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_common_cases = $("#common_cases_title").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_common_cases['left']+100) + "px; top: " + (pos_common_cases['top']+60) + "px;'><img src='/images/arrows__rightdownleftup.png' align='left' style='position: relative; top: -32px;' />&nbsp;Lista Twoich bieżących spraw</div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_tt_kids_chooser_outside = $("#tt_kids_chooser_outside").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_tt_kids_chooser_outside['left']+100) + "px; top: " + (pos_tt_kids_chooser_outside['top']+55) + "px;'><img src='/images/arrows__rightdownleftup.png' align='left' style='position: relative; top: -32px;' />&nbsp;Wybierz dziecko, którego plan lekcji chcesz edytować</div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_subjects_all = $("#subjects_all").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_subjects_all['left']+10) + "px; top: " + (pos_subjects_all['top']-60) + "px;'>Złap przedmiot myszką<br>i przeciągnij go na obszar<br>planu lekcji<img src='/images/arrows__leftuprightdown.png' align='right' style='position: relative; top: 2px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_subject_trash = $("#subject_trash").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_subject_trash['left']-210) + "px; top: " + (pos_subject_trash['top']-70) + "px;'>Przesuń tu przedmiot dodatkowy<br>aby go usunąć<img src='/images/arrows__leftuprightdown.png' align='right' style='position: relative; top: 2px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_bottom_box_options_icons = $(".bottom_box_options_icons").position();
        if(pos_bottom_box_options_icons['left'] > 0) {
            div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_bottom_box_options_icons['left']-150) + "px; top: " + (pos_bottom_box_options_icons['top']+30) + "px;'>Dostępne opcje<img src='/images/arrows__leftdownrightup.png' align='right' style='position: relative; top: -32px;' /></div>";
            $("#helper_wrapper").append(div);
        }
    } catch(err) {}

    try {
        var pos_contact_letters = $("#contact_letters").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_contact_letters['left']-60) + "px; top: " + (pos_contact_letters['top']+50) + "px;'>Filtruj listę znajomych<img src='/images/arrows__leftdownrightup.png' align='right' style='position: relative; top: -32px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_abuse = $(".abuse").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_abuse['left']-258) + "px; top: " + (pos_abuse['top']-70) + "px;'>Ktoś się pod kogoś podszywa?<br>Zgłoś nam nadużycie!<img src='/images/arrows__leftuprightdown.png' align='right' style='position: relative; top: 2px; left: 40px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_start_year = $("#change_actual_start_year_previous_link").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_start_year['left']) + "px; top: " + (pos_start_year['top']+20) + "px;'><img src='/images/arrows__rightdownleftup.png' align='left' style='position: relative; top: 2px;' />&nbsp;&nbsp;Sprawdź inne roczniki klas&nbsp;&nbsp;<img src='/images/arrows__leftdownrightup.png' align='right' style='position: relative; top: 2px; left: 8px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}

    try {
        var pos_filter_form_find_school = $("#filter_form_find_school").position();
        div = "<div class='helper_wrapper_inside' style='position: absolute; left: " + (pos_filter_form_find_school['left']-140) + "px; top: " + (pos_filter_form_find_school['top']-60) + "px;'>Użyj wyszukiwarki aby znaleźć szkołę&nbsp;<img src='/images/arrows__leftuprightdown.png' align='right' style='position: relative; top: 2px;' /></div>";
        $("#helper_wrapper").append(div);
    } catch(err) {}


}



function closeHelper() {	
    $("#helper_wrapper").hide();
}


