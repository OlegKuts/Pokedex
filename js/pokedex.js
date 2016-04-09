var currentURL;
var colors = {
  "normal": "#a3a375",
  "fighting": "#e60000",
  "flying": "#b380ff",
  "poison": "#ac00e6",
  "ground": "#ffdd99",
  "rock": "#cc8800",
  "bug": "#c4ff4d",
  "ghost": "#9966ff",
  "steel": "#ddccff",
  "fire": "#ff751a",
  "water": "#668cff",
  "grass": "#5cd65c",
  "electric": "#ffd633",
  "ice": "#cce6ff",
  "dragon": "#944dff",
  "dark": "#734d26",
  "fairy": "#ffb3ff",
  "unknown": "#00cccc",
  "shadow": "#000d1a",
  "psychic": "#ff33ff"
};
var idToFilter = {
  "All": [],
  "Normal": [],
  "Fighting": [],
  "Flying": [],
  "Poison": [],
  "Ground": [],
  "Rock": [],
  "Bug": [],
  "Ghost": [],
  "Steel": [],
  "Fire": [],
  "Water": [],
  "Grass": [],
  "Electric": [],
  "Ice": [],
  "Dragon": [],
  "Dark": [],
  "Fairy": [],
  "Unknown": [],
  "Shadow": [],
  "Psychic": []
};
$(document).ready(function() {
  getInitialData();
  showInfo();
  loadMoreData();
  addFilterButtons();
  filter();
});

function getInitialData() {
  $.get("http://pokeapi.co/api/v1/pokemon/?limit=12", function(data, status) {
    appendData(data);
  });
}

function appendData(data) {
  var button = '<div id="button" class=" btn btn-info">Load More</div>';
  var length = data["objects"].length;
  var html, id, pokemon, type;
  currentURL = data["meta"]["next"];
  for (var i = 0; i < length; i++) {
    pokemon = data["objects"][i];
    id = pokemon["national_id"];
    type = pokemon["types"][0]["name"];
    idToFilter["All"].push(id);
    idToFilter[capitalizeWord(type)].push(id);
    html = ['<div id="' + id + '" class="col-md-3 col-xs-4 pokemon">',
      '<div class="img-container">',
      '<div class="img">',
      '<img src="http://pokeapi.co/media/img/' + id + '.png" />',
      '</div>',
      '</div>',
      '<p class="name">' + pokemon["name"] + '</p>',
      '<div class="row type-container">',
      '<div class="col-md-6 type" style="background-color:' + colors[type] + '">' + capitalizeWord(type) + '</div>'
    ];

    if (pokemon["types"][1] !== undefined) {
      type = pokemon["types"][1]["name"];
      idToFilter[capitalizeWord(type)].push(id);
      html.push('<div class="col-md-6 type"  style="background-color:' + colors[type] + '">' + capitalizeWord(type) + '</div>');
    }
    html.push('</div>');
    html.push('</div>');
    html = html.join("\n");
    $("#rows").append(html);
    //some images have different height
    var img = $("#" + id + " .img-container");
    var height = img.width();
    img.css("height", height);

  }
  $("#button-container").empty();
  $("#button-container").append(button);
}

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function showInfo() {
  $("#rows").on("click", ".pokemon", function() {
    var id = $(this).attr("id");
    $.get("http://pokeapi.co/api/v1/pokemon/" + id + "/").done(function(data) {
      appendInfo(data);
    });
  });
}

function appendInfo(data) {
  var id = data["national_id"];
  var number = id < 10 ? " #00" + id : id > 99 ? " #" + id : " #0" + id;
  var offset = window.pageYOffset;
  //var offset = $("#"+id).position().top;
  var rowNames = ["Type", "Attack", "Defense", "HP", "SP Attack", "SP Defense", "Speed", "Weight", "Total moves"];
  var attributeKeys = ["types", "attack", "defense", "hp", "sp_atk", "sp_def", "speed", "weight", "moves"];
  var table = '<table class="info-table ">';
  var html = ['<div class="info col-md-10" style="margin-top:' + offset + 'px">',
    '<div class="img-container">',
    '<div class="img">',
    '<img src="http://pokeapi.co/media/img/' + id + '.png" />',
    '</div>',
    '</div>',
    '<p class="name">' + data["name"] + number + '</p>'
  ].join("");

  for (var i = 0; i < rowNames.length; i++) {
    var attr = (attributeKeys[i] == "moves" ? data["moves"].length : attributeKeys[i] == "types" ? (data["types"].length == 1 ? capitalizeWord(data[attributeKeys[i]][0]["name"]) : capitalizeWord(data[attributeKeys[i]][0]["name"]) + ", " + capitalizeWord(data[attributeKeys[i]][1]["name"])) : data[attributeKeys[i]]);
    table += '<tr><td>' + rowNames[i] + '</td><td>' + attr + '</td></tr>';
  }
  table += '</table>';
  html += table + '</div>';
  $("#info").empty();
  $("#info").append(html);
}

function loadMoreData() {
  $("#button-container").on("click", "#button", function() {
    $.get("http://pokeapi.co" + currentURL).done(function(data) {
      appendData(data);
    });
  });
}

function addFilterButtons() {
  var filter = $(".filter");
  filter.append('<div class="type-info btn">All</div>');
  for (var button in colors) {
    filter.append(' <div class="type-info btn" style="background-color:' + colors[button] + '">' + capitalizeWord(button) + '</div>');
  }
}

function filter() {
  $(".row").on("click", ".type-info", function() {
    var key = $(this).html();
    var filter = idToFilter[key];
    var all = idToFilter["All"];
    var hide = all.filter(function(item) {
      return filter.indexOf(item) == -1;
    });
    all.forEach(function(id) {
      $("#" + id).show();
    });
    hide.forEach(function(id) {
      $("#" + id).hide();
    });
  });
}