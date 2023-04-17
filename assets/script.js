
// this function is to reset the schedual
function reset(){
  localStorage.clear(); // clear the local storage
  $(`.description`).val(''); // clear the current tasks
  $("#pre").hide();// hide the previous button since there is no archive
}
const containerEL=document.querySelector(".container-lg"); // the dive where we will display the Schedule
const timeEl=document.getElementById("currentDay"); // the element that will display the date and time
var tasks=[]; // array that will store all the taskes for today
var archive=[]; // array that will store the tasks arraies so we can go back many days to the back
var day_archived=0; // the number of the day we will use it to navigate the archive array
// we assign the local storage pointer to the today tasks arrray if there is a local storage exist
if (localStorage.getItem("stored_tasks")!=null){
  tasks=JSON.parse(localStorage.getItem("stored_tasks"));
}

// we assign the local storage pointer that hold the archive array to the array
if(localStorage.getItem("archive")!=null){
  archive=JSON.parse(localStorage.getItem("archive"));
  $("#pre").show();
}

// this function we use it to watch the time and do an action at certain time
function checkTime()  {
  var d=new Date();
  // at the beginning of each hour we will refresh the page so the color for each scheduled task will change dynamically
  if (d.getMinutes() == 0 && d.getSeconds() == 0)  {
    window.location.reload(true);
  }
  // at 6 o'clock after the working hours we will put today's tasks in the archive and empty the schedual
  if(d.getHours() == 16 && d.getMinutes()==57 && d.getSeconds() == 35){
    archive.unshift(tasks);// add today's tasks to the archive
    localStorage.setItem("archive",JSON.stringify(archive));//assign a pointer to the archived array after using JSON to converted to string
    localStorage.removeItem("stored_tasks"); //delete today's tasks array
    window.location.reload(true); // refresh the page
  }
}
setInterval(checkTime,1000); // call checktime function every second


Window.onload = settime(); // when we load the page we will call the settime function
// settime function will display the date and time in the time element
function settime(){
  var today=dayjs().format("dddd MMM D, YYYY"); // get the date in the folowing format ' Monday Apr 17, 2023 '
  timeEl.innerHTML=setInterval(function(){
                                      const d = new Date(); // get 'NOW' time
                                      timeEl.innerHTML = today+'<br>'+d.toLocaleTimeString(); //display the date and time
                                    },1000);                                      
}

// this 'getParentID' function will return the id of the parrent of the element that we pass it to it
function getParentID(elm){
  return(elm.parentNode.id);
}
// this 'dispaly_tasks' function will take and array of tasks and display it on the screen in the right way
function dispaly_tasks(array){
  $(`.description`).val(''); // empty all the elements that has a calss 'description' which is the task description
  // we will make a loop to go on each item in the array that we want to dispaly
  for (var n=0;n<array.length; n++){
    var content=array[n].Descriotion;
    var lid=array[n].id;
    $(`#${lid}`).find('.description').val(content);//we look for the element that has same id as the one in the arrat and we put the array's element discription in that element
  }
}



$(function () {
  // for loop on the working hours from 9am to 5 pm to display tasks div elements in the right way
  for (var i=9 ; i<=17 ; i++){
      var content;
      var time=dayjs().hour(i).format('ha'); // the time of each task 
      var classType;
      var d=new Date(); // time object
      var currenthour=d.getHours(); // we get the current hour in the day so we can adjust the tasks color depending on it
      var taskTime=i; // the time of the task that will be compared to the current hour 
      if(currenthour>taskTime){ // if the current hour is bigger than the task hour
        classType="past";// that will mean the task is in the past and we will assign 'past' value to the class of that task element
      }
      else if(currenthour<taskTime){ // if the current hour smaller than the task hour then
        classType="future";// the task will be in the future and we assign 'future' value to the class of the task element
      }
      else{ // if the current hour is same as the task hour then 
        classType="present";// we will asiign present value to the class of the task element 
      }
      if(tasks.length!=0){ //if the tasks array is not empty we display it on tha page
       dispaly_tasks(tasks);
      }
      else{// if we don't have a tasks array then we put empty value in all the tasks discription
        content=""; 
      }
      // this is the task dive that will dispaly on the scrren
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
// this listener will listen to the click on any button on this page
$('button').click(function(event){
  event.preventDefault();
  event.currentTarget;
  // if the 'aria-label' value of the clicked button is 'save' that mean we pressed a save button
  if($(this).attr("aria-label")=="save"){
    var elid=getParentID(this); // this variable will hold the id of the parrent element of the clicked button
    var taskDescriotion=$(`#${elid}`).find('.description').val();//this variable till hold the task discription after we find it using the parrent id ' elid'
    var taskObj={id:elid , Descriotion:taskDescriotion}; // we use this object to hold the parrent id and discription of the right task after we click the save button
    if(tasks.length!=0){ // if we already have a tasks array not empty
      // before we push the taskobj in the tasks array 
      for(var i=0 ; i<tasks.length ; i++){
        if (tasks[i].id==elid){ // if this tasks already saved befor then 
          tasks[i].Descriotion=taskDescriotion;//we just update the discription to the new discription
        }
        else{ // if this is a first time we save this task, then
          tasks.push(taskObj);// we just make a push 'taskobj' to the end of the tasks array
        }
      }
    }
    else{ // if the tasks array is empty then we just push 'taskobj' to the end of the tasks array
      tasks.push(taskObj);
    }
    localStorage.setItem("stored_tasks",JSON.stringify(tasks));// we assign the tasks array after we converted to string usnig JSON to the local storage pointer "stored_tasks"
  }
  // if the clicked button was previous
  else if($(this).attr("id")=="pre"){
    $('#nxt').show();// we show the Next button
    $('#old_date').text(dayjs().subtract((day_archived+1),'day').format("dddd MMM D, YYYY"));// will dispay the date of the tasks that we are diplaying now
    archive=JSON.parse(localStorage.getItem("archive")); //retreive the archived arraies from string form to object form
    if(archive.length!=0 && day_archived<archive.length){ // if the day number is in the limits of the srchive array
      dispaly_tasks(archive[day_archived]);// display thatday tasks on the page
      day_archived+=1;// increase the day pointer by one
      if (day_archived  == archive.length){ // if we are dispalying the last day in the archive array 
        $("#pre").hide();// we hide the previous button
      }
    }

  }
  // if the clicked button was Next
  else if($(this).attr("id")=="nxt"){
    archive=JSON.parse(localStorage.getItem("archive"));//retreive the archived arraies from string form to object form
    $("#pre").show();// dispaly the Previous button
    if(day_archived==archive.length){ // if day number is greater than the archive length
      day_archived-=1; // we move the day number one to the back
    }
    if(day_archived>0){ // if the day number is greater tham 0 then we display the date and the tasks of that day
      $('#old_date').text(dayjs().subtract((day_archived),'day').format("dddd MMM D, YYYY"));// will dispay the date of the tasks that we are diplaying now
      day_archived-=1;
      dispaly_tasks(archive[day_archived]);
    }
    else{ // if we are at day 0 then we hid the next button and display todays tasks
      $('#nxt').hide();
      $('#old_date').text('');
      dispaly_tasks(tasks);
    }
  }
});

});
  