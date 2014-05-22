$(document).ready(function(){
  var storage_key = 'kanji';
  var input = $('#kanji');
  var KEY = function(){};
  KEY.ENTER = 13;

  function saveStorage(hash){
    localStorage.setItem(storage_key, JSON.stringify(hash));
  }

  function loadStorage(){
    return JSON.parse(localStorage.getItem(storage_key));
  }

  // initialize
  if(loadStorage() == undefined ) saveStorage({});

  var history = loadStorage();

  function print_history(){
    $('#hist').html('');
    sortable = [];
    $.each(history, function(kanji, count) {
      sortable.unshift({kanji: kanji, count: count})
    });
    $.each(sortable.sort(function(a, b){
      return b.count - a.count;
    }), function(i, o){
      size = 18 + o.count * 2;
      $('#hist').append('<li class="btn" style="font-size:'+size+'pt;">'+o.kanji+'</li>');
    });
  }

  function save(){
    str = $('<div>').text(input.val()).html(); // excape
    if(str == '') return;
    input.val('');
    if(history[str]){
      history[str] += 1;
    }else{
      history[str] = 1;
    }
    saveStorage(history);
    print_history();
  }

  function fitFontSizeToBox(box_id, inner_id){
    var box_width = $(box_id).width();
    var font_size = 20;
    while($(inner_id).width() + 20 < box_width){
      font_size += 3;
      $(inner_id).css({fontSize: font_size});
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
    $('#loupe-text').text($(this).text());
    $('#loupe').slideDown();
    fitFontSizeToBox('#loupe', '#loupe-text');
  });

  $('#loupe').click(function(){
    $(this).slideUp('fast', function(){
      $('#loupe-text').text('').css({fontSize: 20});
    });
  });
});
