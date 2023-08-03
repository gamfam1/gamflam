$.getJSON("/games.json", function (data) {
  starredgames = getCookie("starred");
  if (starredgames == "") {
    starredgames = [];
  } else {
    starredgames = JSON.parse(starredgames);
  }
  console.log(starredgames);
  $("#gamesearch").prop({ placeholder: "Click here to search through our " + data.length + " games!" });
  data.sort(dynamicSort("name"));
  gamelist = data;
  for (let i = 0; i < data.length; i++) {
    let $element = $("<div>")
      .prop({
        class: "game",
        style: "cursor: pointer;",
        id: data[i].directory,
      })
      .append(
        $("<img>").prop({
          src: data[i].directory + "/" + data[i].image,
          alt: data[i].name + " logo",
        })
      )
      .append($("<h1>").text(data[i].name))
      .append(
        $("<mat-icon>")
          .prop({
            class: "material-symbols-rounded",
          })
          .text("star")
      );

    if (starredgames.includes(data[i].directory)) {
      $element.find("mat-icon").attr("id", "starred");
      let $pinnedelement = $element.clone();
      $("#pinnedgames").append($pinnedelement);
      if ($("#pinnedgames #message")) {
        $("#pinnedmessage").hide();
      }
    }

    $("#games").append($element);
  }
  $("#games #message").remove();
});

$(document).ready(function () {
  let starred;
  $(document).on("click", ".game", function (event) {
    if ($(event.target).is("mat-icon")) {
      if (!$(event.target).attr("id")) {
        $(event.target).prop({ id: "starred" });
        starred = Cookies.get("starred");
        if (starred) {
          starred = JSON.parse(starred);
        } else {
          starred = [];
        }
        starred.push($(this).attr("id"));
        Cookies.set("starred", JSON.stringify(starred));
        $element = $(this).clone();
        $("#pinnedgames").append($element);
        $("#pinnedmessage").hide();
        temp = $("#pinnedgames")[0].childNodes;
        pinnedarray = [...temp];

        pinnedarray.sort(dynamicSort("id"));
        $("#pinnedgames").empty();
        for (let i = 0; i < pinnedarray.length; i++) {
          pinnedarraynodes = pinnedarray[i].childNodes;
          pinnedarraynodes = [...pinnedarraynodes];
          let $element = $("<div>")
            .prop({
              class: "game",
              style: "cursor: pointer;",
              id: pinnedarray[i].id,
            })
            .append(
              $("<img>").prop({
                src: pinnedarraynodes[0].src,
                alt: pinnedarraynodes[0].alt,
              })
            )
            .append($("<h1>").text(pinnedarraynodes[1].innerHTML))
            .append(
              $("<mat-icon>")
                .prop({
                  class: "material-symbols-rounded",
                  id: "starred",
                })
                .text("star")
            );
          $("#pinnedgames").append($element);
        }
      } else {
        $(event.target).removeAttr("id");
        $thisdiv = "#" + $(this).attr("id");
        $thisdiv = $thisdiv.replace(".", "\\.");
        starred = Cookies.get("starred");
        starred = JSON.parse(starred);
        ourindex = starred.indexOf($(this).attr("id"));
        starred.splice(ourindex, 1);
        Cookies.set("starred", JSON.stringify(starred));
        $("#pinnedgames " + $thisdiv).remove();
        if ($("#pinnedgames").is(":empty")) {
          $("#pinnedmessage").show();
        }
        $($thisdiv + " #starred").removeAttr("id");
      }
    } else {
      redirectGame($(this).attr("id"));
    }
  });
  $(document).on("click", "#game span", function (event) {
    $(this).prop({ class: "material-symbols-outlined fill" });
  });
});

function redirectGame(dir) {
  window.location.href = window.location.origin + "/" + dir + "/index.html";
}
function dynamicSort(property) {
  var sortOrder = 1;

  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }

  return function (a, b) {
    if (sortOrder == -1) {
      return b[property].localeCompare(a[property]);
    } else {
      return a[property].localeCompare(b[property]);
    }
  };
}

function selectRandomGame() {
  randomgame = Math.floor(Math.random() * gamelist.length - 1);
  Toastify({
    text: 'You will be redirected to ' + gamelist[randomgame].name + ' in 3 seconds',
    duration: 3000,
    gravity: "top", // `top` or `bottom`
    position: "center", // `left`, `center` or `right`
    style: {
      background: "linear-gradient(42deg, rgba(36, 69, 128, 1) 100%, rgb(24, 17, 87) 0%)",
      width: "25%",
    },
    onClick: function () {}, // Callback after click
  }).showToast();
  setTimeout(() => {
    redirectGame(gamelist[randomgame].directory);s
  }, 3000);
  
}