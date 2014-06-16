$(document).ready(function(){
  var storage_key = 'kanji.0.2';
  var input = $('#kanji');
  var KEY = function(){};
  KEY.ENTER = 13;

  // appCache = window.applicationCache;
  // appCache.update();

  function saveStorage(hash){
    localStorage.setItem(storage_key, JSON.stringify(hash));
  }

  function loadStorage(){
    return JSON.parse(localStorage.getItem(storage_key));
  }

  // initialize
  if(loadStorage() == undefined) saveStorage({});

  var history = loadStorage();
  if(Object.keys(history).length === 0){
    alert('漢字をメモしておけるよ。サーバにはなにも保存していないので、恥しい漢字を保存しても大丈夫ですよ。iPhone 用だよ。');
    openSlide($('#help'));
  }else{
    console.log(history);
  }

  function print_history(){
    $('#hist').html('');
    var sort_by_count      = function(a, b){ return b.count - a.count; }
    var sort_by_created_at = function(a, b){ return b.updated_at - a.updated_at; }
    var array = []

    // hash to array
    $.each(history, function(key, h){ array.unshift(h); });
    $.each(array.sort(sort_by_created_at), function(index, h){
      append(h);
    });
  }

  function append(hist){
    size = 20 + hist.count * 4;
    var li = 
      '<li class="" style="font-size:'+size+'pt;">' +
        hist.word + 
      '</li>';
    $('#hist').append(li);
  }

  function clean_input(){
    return $('<div>').text(input.val()).html(); // excape
  }

  function save(){
    str = clean_input();
    if(str == '') return;
    input.val('');

    if(history[str]){
      history[str]['count'] += 1;
      history[str]['updated_at'] = Date.now();
    }else{
      history[str] = { count: 1, word: str, updated_at: Date.now() };
    }
    saveStorage(history);
    print_history();
  }

  function fitFontSizeToBox(box_id, inner_id){
    var box_width = $(box_id).width() - 20;
    var font_size = 20;
    while($(inner_id).width() + 20 < box_width){
      font_size += 3;
      $(inner_id).css({fontSize: font_size});
    }
  }

  function openSlide(dom){
    var top = $(window).scrollTop();
    var margin_top =  top + 'px'
    dom.css('margin-top', margin_top );
    dom.slideDown();
  }

  function date_for(date_obj){
    var d = new Date(date_obj);
    return [
      d.getFullYear(),
      pad(d.getMonth() + 1),
      pad(d.getDate()),
    ].join("-") + " " + [
      pad(d.getHours()),
      pad(d.getMinutes())
    ].join(":")
  }

  function pad(num){
    if(num < 10){
      return "0" + num;
    }else{
      return num;
    }
  }

  if (localStorage) {
    print_history();
  }else{
    $('#container').hide();
    $('#localstorage-disabled').show();
  }

  input.keypress(function(e){
    if(e.which == KEY.ENTER) save();
  });

  $('#save').click(function(){
    save();
  });

  var type_at = Date.now();
  var timer = 0;
  input.keyup(function(){
    if(timer > 0) clearInterval(timer);
    timer = setTimeout(function(){
      var str = clean_input();
      if(str == '' || str.match(/^[\u3040-\u309F\u30A0-\u30FFa-zA-Z0-9]+$/)){
        // ignore hiragana, katakana, alpha, number
      }else{
        save();
        input.val('');
      }
      timer = 0;
    }, 5000);
  });

  $('#delete-button').click(function(){
    var str = $('#loupe-text').html();
    delete history[str];
    saveStorage(history);
    print_history();
  });

  $('#clear-all-button').click(function(){
    $('#hist').html('');
    history = {}
    saveStorage({});
  });

  $('#hist').delegate('li', 'click', function(){
    var str = $(this).text();
    var h = history[str];
    $('#loupe-text').text(str);
    $('#loupe-count').html( h.count + "回");
    $('#loupe-updated_at').text(date_for(h.updated_at));
    openSlide($('#loupe'));
    fitFontSizeToBox('#loupe', '#loupe-text');
  });

  $('#loupe').click(function(){
    $(this).slideUp('fast', function(){
      $('#loupe-text').text('').css({fontSize: 20});
    });
  });

  $('#open-help').click(function(){
    openSlide($('#help'));
  });
  $('#help').click(function(){
    $(this).slideUp('fast');
  });
});
