
// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
const containerEL=document.querySelector(".container-lg");
var timeEl=document.getElementById("currentDay");
var tasks=[];
//
if (localStorage.getItem("stored_tasks")!=null){
  tasks=JSON.parse(localStorage.getItem("stored_tasks"));
}

function checkTime()  {
  var d=new Date();
  if (d.getMinutes() == 0 && d.getSeconds() == 0)  {
    window.location.reload(true);
  }
  if(d.getHours() == 23 && d.getMinutes()==59 && d.getSeconds() == 59){
    localStorage.clear(); 
    window.location.reload(true);
  }
}

setInterval(checkTime,1000);


Window.onload = settime();
function settime(){
  var today=dayjs().format("dddd MMM D, YYYY");
  timeEl.innerHTML=setInterval(function(){
                                      const d = new Date();
                                      timeEl.innerHTML = today+'<br>'+d.toLocaleTimeString();
                                    },1000);                                      
}

function getParentID(elm){
  return(elm.parentNode.id);
}

$(function () {

  for (var i=9 ; i<=17 ; i++){
      var content;
      var time=dayjs().hour(i).format('ha');
      var classType;
      var d=new Date();
      var currenthour=d.getHours();
      var taskTime=dayjs().hour(i).format('H');
      if(currenthour>taskTime){
        classType="past";
      }
      else if(currenthour<taskTime){
        classType="future";
      }
      else{
        classType="present";
      }
      if(tasks.length!=0){
        for (var j=0 ; j<tasks.length ; j++){
          if(tasks[j].id =="hour-"+time){
            content=tasks[j].Descriotion;
          }
        }
      }
      else{
        content="";
      }
      $(containerEL).append(`
      <div id="hour-${time}" class="row time-block ${classType}">
        <div class="col-2 col-md-1 hour text-center py-3">${time}</div>
          <textarea class="col-8 col-md-10 description" rows="3">${content} </textarea>
          <button class="btn saveBtn col-2 col-md-1" aria-label="save">
            <i class="fas fa-save" aria-hidden="true"></i>
          </button>
      </div>
      `);
      content="";
   
}
$('button').click(function(event){
  event.preventDefault();
  event.currentTarget;
  var elid=getParentID(this);
  var taskDescriotion=$(`#${elid}`).find('.description').val();
  var taskObj={id:elid , Descriotion:taskDescriotion};
  if(tasks.length!=0){
    for(var i=0 ; i<tasks.length ; i++){
      if (tasks[i].id==elid){
        tasks[i].Descriotion=taskDescriotion;
      }
      else{
        tasks.push(taskObj);
      }
    }
  }
  else{
    tasks.push(taskObj);
  }
  localStorage.setItem("stored_tasks",JSON.stringify(tasks));
});

});
  
  /*($('<div id="hour-9" class="row time-block past"></div>')).append(
    $('<div class="col-2 col-md-1 hour text-center py-3">9AM</div>')).append(
      $('<textarea class="col-8 col-md-10 description" rows="3"> </textarea>')).append(
        $('<button class="btn saveBtn col-2 col-md-1" aria-label="save"> <i class="fas fa-save" aria-hidden="true"></i></button>'));
  /*$(containerEL).append('<div id="hour-9" class="row time-block past">').append(
    '<div class="col-2 col-md-1 hour text-center py-3">9AM</div>').append(
      '<textarea class="col-8 col-md-10 description" rows="3"> </textarea>').append(
        '<button class="btn saveBtn col-2 col-md-1" aria-label="save">        <i class="fas fa-save" aria-hidden="true"></i>      </button>');
  
         <div id="hour-9" class="row time-block past">
        <div class="col-2 col-md-1 hour text-center py-3">9AM</div>
        <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Example of a a present time block. The "present" class adds a red background color. -->
      <div id="hour-10" class="row time-block present">
        <div class="col-2 col-md-1 hour text-center py-3">10AM</div>
        <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>

      <!-- Example of a future time block. The "future" class adds a green background color. -->
      <div id="hour-11" class="row time-block future">
        <div class="col-2 col-md-1 hour text-center py-3">11AM</div>
        <textarea class="col-8 col-md-10 description" rows="3"> </textarea>
        <button class="btn saveBtn col-2 col-md-1" aria-label="save">
          <i class="fas fa-save" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  */      
  //$(".past").append("div").addClass("col-2 col-md-1 hour text-center py-3");
  //$(".text-center").append("textarea").addClass("col-8 col-md-10 description");
  //$(".description").append("button").addClass("btn saveBtn col-2 col-md-1");
  // TODO: Add a listener for click events on the save button. This code should
  // use the id in the containing time-block as a key to save the user input in
  // local storage. HINT: What does `this` reference in the click listener
  // function? How can DOM traversal be used to get the "hour-x" id of the
  // time-block containing the button that was clicked? How might the id be
  // useful when saving the description in local storage?
  //
  // TODO: Add code to apply the past, present, or future class to each time
  // block by comparing the id to the current hour. HINTS: How can the id
  // attribute of each time-block be used to conditionally add or remove the
  // past, present, and future classes? How can Day.js be used to get the
  // current hour in 24-hour time?
  //
  // TODO: Add code to get any user input that was saved in localStorage and set
  // the values of the corresponding textarea elements. HINT: How can the id
  // attribute of each time-block be used to do this?
  //
  // TODO: Add code to display the current date in the header of the page.
