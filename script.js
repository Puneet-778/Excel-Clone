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

let cellData = { Sheet1: {} };
let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;
let save = true;
let defaultPropObj = {
  "font-family": "monospace",
  "font-size": 14,
  'text': "",
  'bold': false,
  'italic': false,
  'underline': false,
  'alignment': "left",
  'color': "#444",
  'bgcolor': "#fff",
};

for (let i = 1; i <= 100; i++) {
  let row = $(`<div class="cell-row"></div>`);
  for (let j = 1; j <= 100; j++) {
    row.append(
      `<div class="input-cell" id="row-${i}-col-${j}" contenteditable="false" ></div>`
    );
  }
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
  updateCellData("text", $(this).text());
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
 let data;
 if(cellData[selectedSheet][row-1] !=undefined && cellData[selectedSheet][row-1][col-1]!=undefined){
   data = cellData[selectedSheet][row-1][col-1];
 }else{
   data = defaultPropObj;
 }
 
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
  $("#font-size").val(data["font-size"]);
  $("#font-family").css("font-family", data["font-family"]);
  $("#font-family").val(data["font-family"]);
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
//-----------------------------------------------------------//

function updateCellData(key, value) {

  let currCellData = JSON.stringify(cellData);

  if (value != defaultPropObj[key]) {
    //change occured in alignment
    $(".cell-selected").each(function (index, data) {
      // console.log(data);
      let [row, col] = getCell(data);
      if (cellData[selectedSheet][row - 1] == undefined) {
        //rwo does not exist
        cellData[selectedSheet][row - 1] = {};
        cellData[selectedSheet][row - 1][col - 1] = { ...defaultPropObj };
        cellData[selectedSheet][row - 1][col - 1][key] = value;
      } else {
        //row exist
        if (cellData[selectedSheet][row - 1][col - 1] == undefined) {
          // column does not exist
          cellData[selectedSheet][row - 1][col - 1] = { ...defaultPropObj };
          cellData[selectedSheet][row - 1][col - 1][key] = value;
        } else {
          //column already exists
          cellData[selectedSheet][row - 1][col - 1][key] = value;
        }
      }
    });
  } else {
    //change equal to default value
    $(".cell-selected").each(function (index, data) {
      let [row, col] = getCell(data);
      if (
        cellData[selectedSheet][row - 1] != undefined &&
        cellData[selectedSheet][row - 1][col - 1] != undefined
      ) {
        //row and column both exists
        cellData[selectedSheet][row - 1][col - 1][key] = value;
        if (JSON.stringify(defaultPropObj) == JSON.stringify(cellData[selectedSheet][row - 1][col - 1])) {
          delete cellData[selectedSheet][row - 1][col - 1];
          if(Object.keys(cellData[selectedSheet][row-1]).length == 0){
            delete cellData[selectedSheet][row-1];//if there entire row becomes empty delete row
          }
        }
      }
    });
  }
  if(save && currCellData != JSON.stringify(cellData)){
    save = false;
  }
}

$(".alignment").click(function (e) {
  let alignment = $(this).attr("data-type"); //left,right,center
  $(".alignment.selected").removeClass("selected");
  $(this).addClass("selected");
  $(".input-cell.cell-selected").css("text-align", alignment);
  updateCellData("alignment", alignment);
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
    updateCellData(style, false);
    // $(".cell-selected").each(function (index, data) {
    //   let [row, col] = getCell(data);
    //   cellData[row - 1][col - 1][style] = false;
    // });
  } else {
    $(el).addClass("selected");
    $(".cell-selected").css(key, value);
    updateCellData(style, true);
    // $(".cell-selected").each(function (index, data) {
    //   let [row, col] = getCell(data);
    //   cellData[row - 1][col - 1][style] = true;
    // });
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
      // console.log(this.element);
      // console.log(this.element.children()[1]);
      let id = $(this.element.children()[1]).attr("id");
      if (id == "fill-color") {
        $(".cell-selected").css("background-color", this.color);
        // $(".cell-selected").each(function (index, data) {
        //   let [row, col] = getCell(data);
        //   cellData[row - 1][col - 1].bgcolor = color;
        // });
        updateCellData("bgcolor", this.color);
        $(".fill").css("border-bottom", `3px solid ${this.color}`);
      }
      if (id == "text-color") {
        $(".cell-selected").css("color", this.color);
        // $(".cell-selected").each(function (index, data) {
        //   let [row, col] = getCell(data);
        //   cellData[row - 1][col - 1].color = color;
        // });
        updateCellData("color", this.color);
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

$(".menu-selector").change(function (e) {
  let value = $(this).val();
  let key = $(this).attr("id");

  if (key == "font-family") {
    $("#font-family").css(key, value);
  }
  if (!isNaN(value)) {
    value = parseInt(value);
  }

  $(".cell-selected").css(key, value);
  // $(".cell-selected").each(function (index, data) {
  //   let [row, col] = getCell(data);
  //   cellData[row - 1][col - 1][key] = value;
  // });
  updateCellData(key, value);
});

//-----------------multiple sheets--------------------//
//<<-------------------UI update---------------------->>//

$('.container').click(function(){
  $('.sheet-options-modal').remove()
})

function addSheetEvents(){
  //event attached to dynamically added sheet
  //attach event to selected sheet
  $('.sheet-tab.selected').on('contextmenu',function(e){
    e.preventDefault();

    //select current sheet
    if(!$(this).hasClass('selected')){
      $('.sheet-tab.selected').removeClass('selected');
      $(this).addClass('selected');
      selectSheet();
    }

    $('.sheet-options-modal').remove();//previously opened modal will be deleted
    let modal = `<div class="sheet-options-modal">
                  <div class="option sheet-rename">Rename</div>
                  <div class="option sheet-delete">Delete</div>
                  </div>`;
    $('.container').append(modal);
    $('.sheet-options-modal').css('left',e.pageX);

    $('.sheet-rename').click(function(){
       let renameModal = $(`<div class="rename-modal-parent">
       <div class="rename-modal">
         <div class="modal-head">RENAME SHEET</div>
         <div class="modal-input" data-placeholder="Enter new name" contenteditable="true"></div>
         <div class="modal-okay-cancel">
           <div class="okay-modal">Okay</div>
           <div class="cancel-modal">Cancel</div>
         </div>
       </div>
     </div>`);
     $('.container').append(renameModal);

     $('.cancel-modal').click(function(){
     $('.rename-modal-parent').remove();
     });

     $('.okay-modal').click(renameSheet);
     $('.modal-input').keypress(function(e){
       if(e.key == 'Enter'){
         e.preventDefault();
         renameSheet();
       }
     });
    });
    
    $('.sheet-delete').click(function(){
      if(totalSheets > 1){ 
        let deleteModal = $(`<div class="delete-modal-parent">
        <div class="delete-modal">
          <div class="modal-head">Delete ${selectedSheet}</div>
          <div class="modal-confirm">Are you sure? <br> You want to delete this sheet.</div>
          <div class="modal-okay-cancel">
            <div class="okay-modal">Delete</div>
            <div class="cancel-modal">Cancel</div>
          </div>
        </div>
      </div>`);
      $('.container').append(deleteModal);
      $('.cancel-modal').click(function(){
        $('.delete-modal-parent').remove();
      });
      $('.delete-modal').click(function(){
          deleteSheet();
       })
      }else{
        //<<--------------display error modal--------------->>>
        //---------------------------------------------------//
        alert('cannot delete');
      }
    })
  });

  $('.sheet-tab.selected').click(function(){
    if(!$(this).hasClass('selected')){
      $('.sheet-tab.selected').removeClass('selected');
      $(this).addClass('selected');
      selectSheet();
    }
  });
  $('.sheet-tab.selected')[0].scrollIntoView();
}

addSheetEvents();

$('.add-sheet').click(function(){
  save = false;
  lastlyAddedSheet++;
  totalSheets++;
  cellData[`Sheet${lastlyAddedSheet}`] = {};//attach new object for new sheet
  $('.sheet-tab.selected').removeClass('selected');
  let newSheet = ` <div class="sheet-tab selected">Sheet${lastlyAddedSheet}</div>`;
  $('.sheet-tab-container').append(newSheet);
  addSheetEvents();
  
  selectSheet();
});

function selectSheet(){
  emptyPreviousSheet();
  selectedSheet = $('.sheet-tab.selected').text();
  loadCurrentSheet();
  $(`#row-1-col-1`).click();
}

function emptyPreviousSheet(){
  //from datastructure---> cellData find stored cells and empty them on UI for new Sheet to load;
  let data = cellData[selectedSheet];
  let cellRows = Object.keys(data);
  for(let i of cellRows){
    let cellCol = Object.keys(data[i]);
    for(let j of cellCol){
      let row = parseInt(i);
      let col = parseInt(j);
      let cell = $(`#row-${row+1}-col-${col+1}`);
      // console.log(cell.text());
      cell.text("");
      cell.css({
        'font-family':'monospace',
        'font-size':'14',
        'background-color':'#fff',
        'color':'#444',
        'font-weight':"",
        'font-style':'',
        'text-decoration':'',
        'text-align':'left'
      });
    }
  }
}

function loadCurrentSheet(){
  let data = cellData[selectedSheet];
  let cellRows = Object.keys(data);
  for(let i of cellRows){
     let cellCols = Object.keys(data[i]);
     for(let j of cellCols){
       let row = parseInt(i);
       let col = parseInt(j);

       let cell = $(`#row-${row+1}-col-${col+1}`);
       cell.text(data[i][j].text);
       cell.css({
         'font-family':data[i][j]['font-family'],
         'font-size':data[i][j]['font-size'],
         'color':data[i][j]['color'],
         'background-color':data[i][j]['bgcolor'],
         'font-weight': data[i][j]['bold'] ? 'bold':'',
         'font-style' : data[i][j]['italic'] ? 'italic':'',
         'text-decoration': data[i][j]['underline'] ? 'underline':'',
         'text-align':data[i][j]['alignment']
       });
     }
  }
}

//<<-----------------------Delete//Rename----------------------->>
//-----------------------------------------------------------------
function renameSheet(){
    let name = $('.modal-input').text();
    if(name != '' &&  !Object.keys(cellData).includes(name)){
      save = false;//unsaved change
      let newCellData = {};
      for(let i of Object.keys(cellData)){
        //in place renaming of objects
        if(i == selectedSheet){
          newCellData[name] = cellData[selectedSheet];
        }else{
          newCellData[i] = cellData[i];
        }
      }  
      cellData = newCellData;

      selectedSheet = name;
      
      $('.sheet-tab.selected').text(name);
  
      $('.rename-modal-parent').remove();
      // console.log(cellData);
    }else{
      //error
      $('.modal-input').addClass('error');
      $('.modal-input').attr('data-placeholder','Enter a valid name');
    }
}
function deleteSheet(){

  let currentlySelectedSheetIdx = Object.keys(cellData).indexOf(selectedSheet);
  let selectNow;
  let sheetidx;
  if(currentlySelectedSheetIdx == 0){
    sheetidx = currentlySelectedSheetIdx + 1;
    selectNow = Object.keys(cellData)[sheetidx];
  }else{
    sheetidx = currentlySelectedSheetIdx - 1;
    selectNow = Object.keys(cellData)[sheetidx];
  }

  let toRemove = $('.sheet-tab.selected');
  $($('.sheet-tab')[sheetidx]).addClass('selected');
  toRemove.remove();
  $('.delete-modal-parent').remove();
  
  emptyPreviousSheet();
  delete cellData[selectedSheet];
  selectedSheet = selectNow;
  loadCurrentSheet();
  $(`#row-1-col-1`).click();

  totalSheets--;
}

//<<-----------Navigate between sheets---------------->>//
//-------------------------------------------------------
$('.left-scroller,.right-scroller').click(function(){
  let currSheetidx = Object.keys(cellData).indexOf(selectedSheet);
  let selectidx = -1;
  if(currSheetidx != 0 || currSheetidx != Object.keys(cellData).length-1){
    
    if($(this).text() == 'arrow_left'&& currSheetidx != 0 ){
      $('.sheet-tab.selected').removeClass('selected');
      selectidx = currSheetidx - 1;
    }else if($(this).text() == 'arrow_right' && currSheetidx != Object.keys(cellData).length-1){
      $('.sheet-tab.selected').removeClass('selected');
      selectidx = currSheetidx + 1;
    }

    if(selectidx != -1){
      $($('.sheet-tab')[selectidx]).addClass('selected');
      emptyPreviousSheet();
      selectedSheet = Object.keys(cellData)[selectidx];
      loadCurrentSheet();
      $(`#row-1-col-1`).click();
    }
  }
  
});


//<<----------------file-menu----------------->>
//---------------------------------------------------
$('.menu-bar-item').click(function(){
  $('.menu-bar-item.selected').removeClass('selected');
  $(this).addClass('selected');
});
$($('.menu-bar-item')[0]).click(function(){
  let fileModal = $(`<div class="file-modal">
  <div class="left-panel">
    <div class="file-options">
      <div class="excel options">
        <div>Excel</div>
      </div>
      <div class="options home">
        <span class="file-icon material-icons"> home </span>
        <div>Home</div>
      </div>
      <div class="options new">
        <span class="file-icon material-icons"> insert_drive_file </span>
        <div>New</div>
      </div>
      <div class="options open">
        <span class="file-icon material-icons"> folder_open </span>
        <div>Open</div>
      </div>
      <div class="options save">
        <span class="file-icon material-icons"> save </span>
        <div>Save</div>
      </div>
    </div>
    <div class="end-border"></div>

    <div style="transform: rotate(90deg)" class="material-icons close-icon">
        arrow_circle_down
    </div>
  </div>
  <div class="right-panel"></div>
  <div class="blank-space"></div>
</div>`);

$('.container').append(fileModal);
fileModal.animate({width:'100vw'},400);


$('.close-icon,.blank-space').click(function(){
  fileModal.animate({width:'0vw'},400)
  setTimeout(()=>fileModal.remove() ,400);
});

//<<---------------New File------------------->>//
//------------------------------------------------
$('.new').click(function(){
  if(save){
    //file aready saved
    $('.file-modal').remove();
    openNewFile();
  }else{
    //file is not saved yet
    // Ask do you want to save
    $('.file-modal').remove(); 

    let saveFileModal = $(`<div class="delete-modal-parent">
        <div class="delete-modal">
          <div class="modal-head">${$('.title').text()}</div>
          <div class="modal-confirm">Unsaved Changes<br>Do you want to save Changes?</div>
          <div class="modal-okay-cancel">
            <div class="okay-modal">Save</div>
            <div class="cancel-modal">Cancel</div>
          </div>
        </div>
      </div>`);

     $('.container').append(saveFileModal);

     $('.okay-modal').click(function(){
        saveFileModal.remove();
        saveFile(true);//opens save file modal only
        save = true;     
      });
     $('.cancel-modal').click(function(){
        saveFileModal.remove();
        openNewFile();
      });
    }
  });
  //<<-------------SaveFile-------------->>
  //------------------------------------------
  $('.save').click(function(){
     saveFile(false);
     save = true;
  });

  //<<------------------Open File--------------------->>//
  //----------------------------------------------------//
  $('.open').click(function(){
    openExistingFile();
  });
});


function openNewFile(){
    emptyPreviousSheet();//empty UI
    $('.sheet-tab').remove();
    let newSheet = ` <div class="sheet-tab selected">Sheet1</div>`;
    $('.sheet-tab-container').append(newSheet);
    addSheetEvents();

    cellData = {'Sheet1':{}};
    totalSheets = 1;
    lastlyAddedSheet = 1;
    selectedSheet = 'Sheet1';
    save = true;

    $('.title').text('BOOK-1');
    $('#row-1-col-1').click();
    $('.file-modal').remove();
}

function saveFile(newClicked){
  console.log('savingfile');

  let saveModal = $(` <div class="rename-modal-parent">
  <div class="rename-modal">
    <div class="modal-head">SAVE FILE</div>
    <div class="modal-input" data-placeholder="Enter File Name" contenteditable="true">${$('.title').text()}</div>
    <div class="modal-okay-cancel">
      <div class="okay-modal">Save</div>
      <div class="cancel-modal">Cancel</div>
    </div>
  </div>
</div>`);

$('.container').append(saveModal);

$('.cancel-modal').click(function(){
  saveModal.remove();
  if(newClicked){
    openNewFile();
  }
});

$('.okay-modal').click(function(){

  let name = $('.modal-input').text();
  if(name == ''){  
    $('.modal-input').attr('data-placeholder','Enter a valid file name');
    $('.modal-input').addClass('error');
  }else if(name != ""){
    //save file here
    let anchor = document.createElement('a');
    $('.container').append(anchor);
    let str = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cellData));
    document.querySelector('a').setAttribute('href',str);
    document.querySelector('a').setAttribute('download',`${name}.json`);
    anchor.click();
    anchor.remove();
    saveModal.remove();

    if(newClicked){
      openNewFile();
    }
  }
});
}

function openExistingFile(){
    let inputFile = document.createElement('input');
    inputFile.setAttribute('type','file');
    inputFile.setAttribute('accept','application/JSON')
    $('.container').append(inputFile);
    inputFile.click();
    
    $(inputFile).change(function(e){
      let fileSelected = e.target.files[0];

      
      let reader = new FileReader();

      reader.readAsText(fileSelected);

      reader.onload = function(event){
        let fileData = event.target.result;
        // console.log(fileData);
        $('.file-modal').remove();


        //1.title change
        //fileSelected.name = filename.json
        $('.title').text(fileSelected.name.split('.')[0]);

        //2.Empty current UI
        emptyPreviousSheet();

        //3-->load cell data from filedata
        cellData = JSON.parse(fileData);
        console.log(cellData);

        //4-->sheet-tab update
        $('.sheet-tab').remove();
        lastlyAddedSheet = 1;
        for(let i of Object.keys(cellData)){
          if(i.includes('Sheet')){
            let splitnameArr = i.split("Sheet");
            if(splitnameArr.length == 2 && !isNaN(splitnameArr[1])){
               lastlyAddedSheet = splitnameArr[1];
            }
          }
          let newSheet = ` <div class="sheet-tab selected">${i}</div>`;
          $('.sheet-tab-container').append(newSheet);
          addSheetEvents();
        }
        // console.log($('.sheet-tab')[0]);
        $('.sheet-tab.selected').removeClass('selected');
        $($('.sheet-tab')[0]).addClass('selected');

        //5--> default settings
        totalSheets = Object.keys(cellData).length;
        console.log(totalSheets);
        // lastlyAddedSheet = Object.keys(cellData).length;
        save = true;

        //6.load currently selected sheet 
        selectedSheet = Object.keys(cellData)[0];
        loadCurrentSheet();
      }
    });
    inputFile.remove();
}