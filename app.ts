/// <reference path="lib/typings/jquery/jquery.d.ts" />
/// <reference path="math/geometry.ts" />
/// <reference path="classes/mirror.ts" />
/// <reference path="classes/lightray.ts" />
/// <reference path="classes/hallofmirrors.ts" />
/// <reference path="inputparsing.ts" />
/// <reference path="generate.ts" />
/// <reference path="drawing/canvas.ts" />

// Draw the resulting hall of mirrors
function draw(hall: HallOfMirrors): void {
  $("#drawing").children().remove();
  //$("#link").attr("value", window.location.href + getSearchString(hall));
  $("#result").text(hall.endPoint().toString());

  var el = drawCanvasHoM(hall);
  $("#drawing").css({
    "width": el.width,
    "height": el.height
  });
}

// Draw an input area
function drawMenu(): void {
  var inputDiv = $("<div>").attr("id", "inputDiv");
  var textArea = $("<textarea>").attr("id", "inputval");
  var drawButton =
    $("<input>").attr({
      type: "button",
      value: "Draw"
    }).click(() => {
      draw(parseInput(textArea));
      inputDiv.slideToggle(300);
      });

  inputDiv.append(textArea, drawButton);

  var buttonArea = $("<div>").addClass("buttons");

  var toggleButton =
    $("<input>").attr({
      type: "button",
      value: "Menu"
    }).click(() => inputDiv.slideToggle(500));
  var randomButton =
    $("<input>").attr({
      type: "button",
      value: "Random"
    }).click(() => draw(randomHoM()));
  buttonArea.append(toggleButton, randomButton);

  $("#menu").append(inputDiv, buttonArea);
  textArea.focus();
}

var sample = "1\n-1 0 1 0\n-1 -1 1 1 2.828427";

window.onload = () => {
  drawMenu();
  var mirrors = window.location.search.toString().match(/[\?&]m=([^&=]+)/);
  if (mirrors) {
    var lightray = window.location.search.toString().match(/[\?&]lr=([^&=]+)/);
    $("#inputDiv").slideToggle(0);
    draw(parseInputGET(mirrors[1], lightray[1]));
  } else {
    var textArea = $("#inputval");
    textArea.val(sample);
    draw(parseInput(textArea));
  }
};
