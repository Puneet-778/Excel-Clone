const ps = new PerfectScrollbar("#cells");

//<-----------------RowHeading && Column Heading---------------->
//--------------------------------------------------------------
for (let i = 1; i <= 100; i++) {
  let str = "";
  let n = i;
  while (n > 0) {
    let rem = n % 26;
    if (rem == 0) {
      str = "Z" + str;
      n = Math.floor(n / 26) - 1;
    } else {
      str = String.fromCharCode(rem - 1 + 65) + str;
      n = Math.floor(n / 26);
    }
  }
  $("#columns").append(`<div class="column-name">${str}</div>`);
  $("#rows").append(`<div class="row-name">${i}</div>`);
}

// ---------//GRID _GENERATION ---------------> CELLS---------------------//
//---------------------------------------------------------------

let cellData = [];

for (let i = 1; i <= 100; i++) {
  let row = $(`<div class="cell-row"></div>`);
  let rowArr = [];
  for (let j = 1; j <= 100; j++) {
    row.append(
      `<div class="input-cell" id="row-${i}-col-${j}" contenteditable="false" ></div>`
    );
    let obj = {
      "font-family":"monospace",
      "font-size": 14,
      text: "",
      bold: false,
      italic: false,
      underline: false,
      alignment: "left",
      color: "#444",
      bgcolor: "rgb(247, 221, 74)",
    };
    // cellData[i-1][j-1].push(obj);
    rowArr.push(obj);
  }
  cellData.push(rowArr);
  $("#cells").append(row);
}

//-------------------------------Scroll-------------------------------->
//----------------------------------------------------------------------
$("#cells").scroll(function (e) {
  // console.log(this.scrollLeft);
  // console.log(this.scrollTop);
  $("#columns").scrollLeft(this.scrollLeft);
  $("#rows").scrollTop(this.scrollTop);
});

// <--------------double click--------------->

$(".input-cell").dblclick(function (e) {
  // console.log(e);
  $(".input-cell").removeClass(
    "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
  );
  $(this).addClass("cell-selected");
  $(this).attr("contenteditable", "true");
  $(this).focus();
});
$(".input-cell").blur(function () {
  $(this).attr("contenteditable", "false");
});

// <--------------------------SIngleClick------------------------>
//-------------------------------------------------------
// $('.input-cell').click(function(){
//   $('.input-cell').removeClass('cell-selected');
//   $(this).addClass('cell-selected');
// })

//<---------------------------CTRL+SELECT-------------------->
//------------------------------------------------------------

function getCell(cell) {
  let cellid = $(cell).attr("id");
  let cellarr = cellid.split("-");
  let x = parseInt(cellarr[1]);
  let y = parseInt(cellarr[3]);
  return [x, y];
}

function getTLDR(rowId, colId) {
  // let cellarr = getCell(cell);
  // let cellid = $(cell).attr("id");
  // let cellarr = cellid.split("-");
  let x = rowId;
  let y = colId;
  let top = $(`#row-${x - 1}-col-${y}`);
  let left = $(`#row-${x}-col-${y - 1}`);
  let down = $(`#row-${x + 1}-col-${y}`);
  let right = $(`#row-${x}-col-${y + 1}`);

  return [top, left, down, right];
}
// <<--------------SELECT CELL function-------------->>>>
//<<------------------------------------------------->>>>>
//----------------------------------------------------------
function selectCell(cell, e, top, left, down, right) {
  if (e.ctrlKey) {
    // let [top, left, down, right] = getTLDR(cell);
    if (top.hasClass("cell-selected")) {
      $(cell).addClass("remove-top-border");
      top.addClass("remove-bottom-border");
    }
    if (left.hasClass("cell-selected")) {
      $(cell).addClass("remove-left-border");
      left.addClass("remove-right-border");
    }
    if (down.hasClass("cell-selected")) {
      $(cell).addClass("remove-bottom-border");
      down.addClass("remove-top-border");
    }
    if (right.hasClass("cell-selected")) {
      $(cell).addClass("remove-right-border");
      right.addClass("remove-left-border");
    }
  } else {
    $(".input-cell").removeClass(
      "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
    );
  }
  if ($(cell).attr("contenteditable") == "false")
    $(cell).addClass("cell-selected");

  changeHeader(cell);
}

function changeHeader(cell) {
  let [row, col] = getCell(cell);
  let data = cellData[row - 1][col - 1];
  $(".alignment.selected").removeClass("selected");
  $(".menu-item.selected").removeClass("selected");
  $(`.alignment[data-type=${data.alignment}]`).addClass("selected");

  //<<-------------BOLD-------------------->
  if (data.bold) {
    $(`#bold`).addClass("selected");
  }

  //<--------------------ITALIC--------------------->
  if (data.italic) {
    $(`#italic`).addClass("selected");
  }

  //<<<<-----------UNdelrine----------------->>
  if (data.underline) {
    $(`#underline`).addClass("selected");
  }

  //<<<--------------Fill-Color-change----------------->>>//
  $(".fill").css("border-bottom", `3px solid ${data.bgcolor}`);
  $(".text").css("border-bottom", `3px solid ${data.color}`);

  //<<----------------Font-family && font-size---------------->>//
  //----------------------------------------------------------
  $('#font-size').val(data['font-size']);
  $('#font-family').css('font-family',data['font-family']);
  $('#font-family').val(data['font-family']);

}

// <<--------------DESELECT CELL function-------------->>>>
//<<------------------------------------------------->>>>>
//----------------------------------------------------------
function deselectCell(cell, e, top, left, bottom, right) {
  // console.log("deselect");
  // let [top, left, bottom, right] = getTLDR(cell);
  if ($(cell).hasClass("remove-right-border")) {
    right.removeClass("remove-left-border");
  }
  if ($(cell).hasClass("remove-left-border")) {
    left.removeClass("remove-right-border");
  }
  if ($(cell).hasClass("remove-top-border")) {
    top.removeClass("remove-bottom-border");
  }
  if ($(cell).hasClass("remove-bottom-border")) {
    bottom.removeClass("remove-top-border");
  }
  $(cell).removeClass(
    "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
  );
}

//-------------------------------------Click on cell-------------------------------
//-------------------------------------------------------------------------------

$(".input-cell").click(function (e) {
  // <-----------remove already selected-------------->
  //--------------------------------------------------
  //-------------------------------------------------->
  let [rowId, colId] = getCell(this);
  // let [top, left, down, right] = getTLDR(this);
  let [top, left, down, right] = getTLDR(rowId, colId);
  if ($(this).hasClass("cell-selected") && e.ctrlKey) {
    //if already selected
    // console.log("deselect");
    deselectCell(this, e, top, left, down, right);
  } else {
    //<---------------Select single and multilpes------------->
    //--------------------------------------------------------
    //---------------------------------------------------------
    selectCell(this, e, top, left, down, right);
  }
});

//<<<<----------------------------------DRAG SELECT-------------------------------->>>>>
//--------------------------------------------------------------------------------------

let startCellSelected = false;
let startCell = {};
let endCell = {};
//---------------------------------using MOUSEMOVE--------------------------------------
//<<---------------------------------------------------------------------------------->>
// $('.input-cell').mousemove(function(event){
//   event.preventDefault();
//   // console.log(event.buttons);
//   //-------when left mouse button is clicked
//   if(event.buttons == 1){
//     //<<------------------------------- unselect before select-------------------------------------->>>
//     //1)---> mousemove with click   2)---> deselect all selected cells
//     //3)---> get start index and end index
//     //4)---> select all between start index and end index
//     $('.input-cell').removeClass(
//       "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
//     );
//     if(startCellSelected == false){ //------------there is no startCell---------------
//       let [rowId,colId] = getCell(this);
//       startCell = {'rowId' : rowId,'colId' : colId};
//       // console.log(startCell);
//       startCellSelected = true;// --------------- ---stored startCell------------
//     }else if(startCellSelected == true){
//       let [rowId,colId] = getCell(this);
//       endCell = {'rowId':rowId,'colId':colId};
//       // console.log(endCell);
//       //<<------------------ we have both startCell and endCell now we can select----------------->>
//       selectAllBetweenCells(startCell,endCell);
//     }
//    }
//    //------------when left mouse button is not clicked-------
//    else if(event.buttons != 1){
//     startCellSelected = false;
//   }
// });

//--------------------------------------Using mouseenter mousemove mouseup----------------------------------------
//<<----------------------------------------------------------------------------------------->>
$(".input-cell").mousemove(function (event) {
  // console.log(event);
  event.preventDefault();
  if (event.buttons == 1) {
    if (startCellSelected == false) {
      let [rowId, colId] = getCell(this);
      startCell = { rowId: rowId, colId: colId };
      if (event.ctrlKey == false) {
        $(".input-cell").removeClass(
          "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
        );
      }
      $(`#row-${startCell.rowId}-col-${startCell.colId}`).addClass(
        "cell-selected"
      );
      startCellSelected = true;
      // console.log(startCell);
    }
  }
});
$(".input-cell").mouseup(function (event) {
  // console.log(event);
  startCellSelected = false;
});

$(".input-cell").mouseenter(function (event) {
  if (event.buttons == 1) {
    // if(event.ctrlKey == false){
    //   $('.input-cell').removeClass(
    //     "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
    //     );
    // }
    let [rowId, colId] = getCell(this);
    endCell = { rowId: rowId, colId: colId };
    selectAllBetweenCells(event, startCell, endCell);
  }
});

// ----------------------------------function for selecting multiple cells----------------------------
//-----------------------------------------------------------------------------------------------------
function selectAllBetweenCells(event, startCell, endCell) {
  // if(event.ctrlKey == false){
  //     $('.input-cell').removeClass(
  //       "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
  //       );
  //   }
  $(".input-cell").removeClass(
    "cell-selected remove-left-border remove-right-border remove-top-border remove-bottom-border"
  );
  for (
    let i = Math.min(startCell.rowId, endCell.rowId);
    i <= Math.max(startCell.rowId, endCell.rowId);
    i++
  ) {
    for (
      let j = Math.min(startCell.colId, endCell.colId);
      j <= Math.max(startCell.colId, endCell.colId);
      j++
    ) {
      let currCell = $(`#row-${i}-col-${j}`); //
      // console.log(currCell);
      let [top, left, down, right] = getTLDR(i, j);
      selectCell(currCell[0], { ctrlKey: true }, top, left, down, right);
    }
  }
}

//------------------- functionality--------------------------//
$(".alignment").click(function (e) {
  let alignment = $(this).attr("data-type");
  console.log(alignment);
  $(".alignment.selected").removeClass("selected");
  $(this).addClass("selected");
  $(".input-cell.cell-selected").css("text-align", alignment);
  $(".input-cell.cell-selected").each(function (item, data) {
    // console.log(data);
    let [row, col] = getCell(data);
    cellData[row - 1][col - 1].alignment = alignment;
  });
});
//<<----------------BOLD------------------->>>
$("#bold").click(function () {
  changeStyle(this, "bold", "font-weight", "bold");
});

//<<----------------------ItaLIC---------------->>
$("#italic").click(function () {
  changeStyle(this, "italic", "font-style", "italic");
});

//<<------------------------Underline----------------->>
$("#underline").click(function () {
  changeStyle(this, "underline", "text-decoration", "underline");
});

function changeStyle(el, style, key, value) {
  if ($(el).hasClass("selected")) {
    $(el).removeClass("selected");
    $(".cell-selected").css(key, "");
    $(".cell-selected").each(function (item, data) {
      let [row, col] = getCell(data);
      cellData[row - 1][col - 1][style] = false;
    });
  } else {
    $(el).addClass("selected");
    $(".cell-selected").css(key, value);
    $(".cell-selected").each(function (item, data) {
      let [row, col] = getCell(data);
      cellData[row - 1][col - 1][style] = true;
    });
  }
}


// <<-----------------COLOR-PICKER-------------------->>>
//--------------------------------------------------------
$(".pick-color").colorPick({
  initialColor: "#abcd",
  allowRecent: true,
  recentMax: 5,
  allowCustomColor: true,
  palette: [
    "#1abc9c",
    "#16a085",
    "#2ecc71",
    "#27ae60",
    "#3498db",
    "#2980b9",
    "#9b59b6",
    "#8e44ad",
    "#34495e",
    "#2c3e50",
    "#f1c40f",
    "#f39c12",
    "#e67e22",
    "#d35400",
    "#e74c3c",
    "#c0392b",
    "#ecf0f1",
    "#bdc3c7",
    "#95a5a6",
    "#7f8c8d",
  ],
  onColorSelected: function () {
    if (this.color != "#ABCD") {
      //some color has been selected by user
      // console.log(this.color);
      // console.log(this.element);
      // console.log(this.element.children()[1]);
      let color = this.color;
      let id = $(this.element.children()[1]).attr("id");
      console.log(id);
      if (id == "fill-color") {
        $(".cell-selected").css("background-color", this.color);
        $(".cell-selected").each(function (item, data) {
          let [row, col] = getCell(data);
          cellData[row - 1][col - 1].bgcolor = color;
        });
        $(".fill").css("border-bottom", `3px solid ${this.color}`);
      }
      if (id == "text-color") {
        $(".cell-selected").css("color", this.color);
        $(".cell-selected").each(function (item, data) {
          let [row, col] = getCell(data);
          cellData[row - 1][col - 1].color = color;
        });
        $(".text").css("border-bottom", `3px solid ${this.color}`);
      }
    }
  },
});

$("#fill-color").click(function () {
  setTimeout(() => {
    $(this).parent().click();
  }, 10);
});

$("#text-color").click(function () {
  setTimeout(() => {
    $(this).parent().click();
  }, 10);
});



//<<-----------------------FONT-FAMILY --------------------------->>
//<<-------------------------FONT-SIZE---------------------------->>

$('.menu-selector').change(function(e){
  let value = $(this).val();
  let key = $(this).attr('id');

  if(key == 'font-family'){
    $('#font-family').css(key,value);
  }
  if(!isNaN(value)){
    value = parseInt(value);
  }

  $('.cell-selected').css( key , value );
  $('.cell-selected').each(function(item,data){
    let[row,col] = getCell(data);
    cellData[row-1][col-1][key] = value;
  })
})


//-----------------multiple sheets--------------------
