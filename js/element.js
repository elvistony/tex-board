

//Globals
var elements = []
var btn_newText = document.getElementById('newtext');
var btn_newBox = document.getElementById('newbox');
var btn_newCircle = document.getElementById('newcircle');
var btn_clearall = document.getElementById('clearall')

//Default - On Load
var editmode=true;
var selected=false;
var el=document.createElement("div");

/*      actions  
                on-element
                do-nothing
                on-drawing
                new-object
                new-circle
                new-square
                new-texbox
*/
var action='do-nothing';
var win_status = true;
var win_listener = Nothing;

Init()

function Edits(){
    editmode=false;
}

function Init(){
    WindowAction(Nothing)
    // Wait for Button Presses
    btn_newText.addEventListener('click',function(){
        action='new-text'
        btn = this.parentElement;
        if (btn.classList.contains('btn-on')){
            noWindowAction()
            btn.classList.remove('btn-on')
        }else{
            WindowAction(nTextBox)
            btn.classList.add('btn-on')
        }
    },false)

    btn_newBox.addEventListener('click',function(){
        action='new-box'
        var btn=this.parentElement;
        if (btn.classList.contains('btn-on')){
            noWindowAction()
            btn.classList.remove('btn-on')
        }else{
            WindowAction(nBoxCircle)
            btn.classList.add('btn-on')
        }
    },false)

    btn_newCircle.addEventListener('click',function(){
        action='new-circle'
        var btn=this.parentElement;
        if (btn.classList.contains('btn-on')){
            noWindowAction()
            btn.classList.remove('btn-on')
        }else{
            WindowAction(nBoxCircle)
            btn.classList.add('btn-on')
        }
    },false)

    btn_clearall.addEventListener('click',function(){
        if(confirm('Clear Canvas?')){
            while (canvas.firstChild) {
                canvas.removeChild(canvas.firstChild);
            }
        }
    })

    undo.addEventListener('click',function(){
        if(canvas.firstChild){
            canvas.removeChild(canvas.lastChild)
        }
    })
}

//-------------------------------------------------

function Drag(btn_move){
    var parent = btn_move.parentElement.parentElement
    el=parent;
    if(btn_move.classList.contains('btn-on')){
        el_movable=false;
        btn_move.classList.remove('btn-on')
        parent.removeEventListener('mousedown',mousedown);
    }else{
        el_movable=true;
        parent.addEventListener('mousedown',mousedown);
        btn_move.classList.add('btn-on')
    }
    btn_move.addEventListener('mouseup',function(){
        el_movable=false;
        btn_move.classList.remove('btn-on')
        btn_move.removeEventListener('mouseup',this)
        parent.removeEventListener('mousedown',mousedown);
    })
    //setTimeout(function(){ parent.removeEventListener('mousedown',mousedown); },600)
}

//--------------------------------------ELEMENT MODES

function ToggleOptions(event,element,action){
    if (action){
        element.children[1].classList.remove('visible-off')
    }else{
        if(event.target.parentElement!=element.parentElement){
            element.children[1].classList.add('visible-off')
        }
    }
}

function FontReduce(btn_reduce){
    var parent = btn_reduce.parentElement.parentElement
    f = parent.children[0].style.fontSize;
    parent.children[0].style.fontSize = f.substring(0,f.length-2)*1-5+'px';
    parent.style.width='fit-content';
    parent.style.height='fit-content';
    
}

function FontIncrease(btn_increase){
    var parent = btn_increase.parentElement.parentElement
    f = parent.children[0].style.fontSize;
    parent.children[0].style.fontSize = f.substring(0,f.length-2)*1+5+'px';
    parent.style.width='fit-content';
    parent.style.height='fit-content';
}

function EditMode(btn_edit){
    var parent = btn_edit.parentElement.parentElement
    if(btn_edit.classList.contains('btn-on')){
        btn_edit.parentElement.parentElement.children[0].contentEditable=false
        parent.style.height='fit-content';
        btn_edit.classList.remove('btn-on')
    }else{
        btn_edit.parentElement.parentElement.children[0].contentEditable=true
        parent.style.height='fit-content';
        btn_edit.classList.add('btn-on')
    }
    parent.addEventListener('focusout',function(){
        btn_edit.parentElement.parentElement.children[0].contentEditable=false
        parent.style.height='fit-content';
        btn_edit.classList.remove('btn-on')
    })
}

var move_dbl=false;
var isResizing=false;

function MoveMode(btn_move){
    var parent = btn_move.parentElement.parentElement
    el=parent;
    if(move_dbl){
        //show resizers
        // ToggleResizers(parent);
        move_dbl=false;
        if(isResizing){
            btn_move.classList.remove('btn-on-two')
            isResizing=false;
            parent.children[2].classList.add('visible-off')
            console.log('Resizing mode off');
        }else{
            btn_move.classList.add('btn-on-two')
            isResizing=true;
            parent.children[2].classList.remove('visible-off')
            console.log('Resizing mode on');
        }
        return;
    }
    move_dbl=true;
    setTimeout(function(){ move_dbl = false; },300)
    
}

var del_dbl=false;
function DelMode(btn_del){
    if(del_dbl){
        var parent = btn_del.parentElement.parentElement
        parent.parentElement.removeChild(parent)
        del_dbl=false;
        return;
    }
    del_dbl=true;
    btn_del.classList.add('btn-on')
    setTimeout(function(){ del_dbl = false;
        btn_del.classList.remove('btn-on') },300)
    
}

//---------------------------------------NEW OBJECTS
//last spawn coords

var lastX = 0;
var lastY = 0;

function nTextBox(e){
    //Event e
    e.preventDefault();
    if(e.target.classList.contains('no-spawn')) {
        return
    }
    if((lastX==e.clientX)&&(lastY==clientY)) {
        return
    }
    var element = document.createElement("div");
    element.innerHTML +=`
<span  contenteditable="false" style="font-size:30px;text-align: left;">
    Click Edit to add Text
</span>
<span class="item-options">
    <i style="cursor:all-scroll;" class="bt-round no-spawn fa fa-arrows" title="Drag for Reposition |Double Click for Resizing" onclick="MoveMode(this)" onmousedown="Drag(this)"></i>
    <i class="bt-round no-spawn fa fa-i-cursor" onclick="EditMode(this)"></i>
    <i class="bt-round no-spawn fa fa-trash bg-red" title="Double Click to Delete" onclick="DelMode(this)"></i>
    <i class="bt-round no-spawn fa fa-minus-square" onclick="FontReduce(this)"></i>
    <i class="bt-round no-spawn fa fa-plus-square" onclick="FontIncrease(this)"></i>
</span>
<span class="visible-off">
    <div class="resizer ne"></div>
    <div class="resizer nw"></div> 
    <div class="resizer sw"></div> 
    <div class="resizer se"></div> 
</span>
    `;
    element.classList.add('item','item-noText')
    //element.addEventListener('click',selectMe,false)
    lastX=e.clientX;
    lastY=e.clientY;
    element.style.left= e.clientX + "px";
    element.style.top = e.clientY + "px";
    let a;
    element.addEventListener('mouseover',function(e){
        clearTimeout(a);
        ToggleOptions(e,this,1);
    },false)
    element.addEventListener('mouseout',function(){
        ele=this;
        TimeOutToggle(e,ele)
    },false)

    function TimeOutToggle(e,ele){
        a=setTimeout(function(){ ToggleOptions(e,ele,0) },600)
    }
    canvas.appendChild(element)
    elements.push(element)
    //noWindowAction()
    InitializeResizers(element)
    el=element;
}

function nBoxCircle(e){
    //Event e
    e.preventDefault();
    console.log(e.target);
    if(e.target.classList.contains('no-spawn')) {
        return
    }
    if((lastX==e.clientX)&&(lastY==clientY)) {
        return
    }
    var element = document.createElement("div");
    element.innerHTML +=`
<span></span>
<span class="item-options">
    <i style="cursor:all-scroll;" class="bt-round no-spawn fa fa-arrows" title="Drag for Reposition |Double Click for Resizing" onclick="MoveMode(this)" onmousedown="Drag(this)"></i>
    <i class="bt-round fa fa-trash bg-red no-spawn"  title="Double Click to Delete" onclick="DelMode(this)"></i>
</span>
<span class="visible-off">
    <div class="resizer ne"></div>
    <div class="resizer nw"></div> 
    <div class="resizer sw"></div> 
    <div class="resizer se"></div> 
</span>
    `;
    element.classList.add('item-box')
    if(action=="new-circle"){
        element.classList.add('item-circle')
    }
    lastX=e.clientX;
    lastY=e.clientY;
    //element.addEventListener('click',selectMe,false)
    element.style.left= e.clientX + "px";
    element.style.top = e.clientY + "px";
    let a;
    element.addEventListener('mouseover',function(e){
        clearTimeout(a);
        ToggleOptions(e,this,1);
    },false)
    element.addEventListener('mouseout',function(){
        ele=this;
        TimeOutToggle(e,ele)
    },false)

    function TimeOutToggle(e,ele){
        a=setTimeout(function(){ ToggleOptions(e,ele,0) },600)
    }
    canvas.appendChild(element)
    elements.push(element)
    //noWindowAction()
    // var evt = new MouseEvent("mousemove", {
    //     view: window,
    //     bubbles: true,
    //     cancelable: true,
    //     clientX: e.clientX,
    //     clientY:e.clientY
    // });
    // window.dispatchEvent(evt);
    window.addEventListener('mousemove',mousemoveStart)
    window.addEventListener('mouseup',mouseup)
    prevX = e.clientX+50;
    prevY = e.clientY+50;
    function mousemoveStart(e){
        console.log('drawing');
        const rect = element.getBoundingClientRect();
        element.style.width = rect.width - (prevX - e.clientX) +'px' ;
        element.style.height = rect.height - (prevY - e.clientY)+ 'px';
        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup (e){
        console.log('finish');
        window.removeEventListener('mousemove',mousemoveStart);
        window.removeEventListener('mouseup',mouseup);
        isResizing=false;
    }
    InitializeResizers(element)
    el=element;
}

function InitializeResizers(el){
    let currentResizer;
    const resizers  = el.querySelectorAll(".resizer");
    for (let resizer of resizers){
        resizer.addEventListener('mousedown',mousedown);
        function mousedown (e){
            
            isResizing=true;

            currentResizer = e.target;
            let prevX = e.clientX;
            let prevY = e.clientY;

            window.addEventListener('mousemove',mousemove);
            window.addEventListener('mouseup',mouseup);

            function mousemove(e){
                const rect = el.getBoundingClientRect();

                if (currentResizer.classList.contains('se')){
                    el.style.width = rect.width - (prevX - e.clientX) +'px' ;
                    el.style.height = rect.height - (prevY - e.clientY)+ 'px';
                }
                else if (currentResizer.classList.contains('sw')){
                    el.style.width = rect.width + (prevX - e.clientX) +'px' ;
                    el.style.height = rect.height - (prevY - e.clientY)+ 'px';
                    el.style.left = rect.left - (prevX - e.clientX) + 'px';
                }
                else if (currentResizer.classList.contains('ne')){
                    el.style.width = rect.width - (prevX - e.clientX) +'px' ;
                    el.style.height = rect.height + (prevY - e.clientY)+ 'px';
                    el.style.top = rect.top - (prevY - e.clientY) + 'px';
                }
                else if (currentResizer.classList.contains('nw')){
                    el.style.width = rect.width + (prevX - e.clientX) +'px' ;
                    el.style.height = rect.height + (prevY - e.clientY)+ 'px';
                    el.style.top = rect.top - (prevY - e.clientY) + 'px';
                    el.style.left = rect.left - (prevX - e.clientX) + 'px';
                }

                prevX = e.clientX;
                prevY = e.clientY;
                //fitText(el,0.7)
            }

            function mousemoveStart(e){
                const rect = el.getBoundingClientRect();
                el.style.width = rect.width - (prevX - e.clientX) +'px' ;
                el.style.height = rect.height - (prevY - e.clientY)+ 'px';
                prevX = e.clientX;
                prevY = e.clientY;

            }

            function mouseup (e){
                window.removeEventListener('mousemove',mousemove);
                window.removeEventListener('mouseup',mouseup);
                isResizing=false;
            }
        }
    }
}

//-------------------------------------REAL CALCS

function mousedown(e){
    e.preventDefault()
    window.addEventListener('mouseup',mouseup)
    window.addEventListener('mousemove',mousemove)
    
    let prevX = e.clientX;
    let prevY = e.clientY;

    function mousemove(e){
        e.preventDefault()
        //!isResizing && allowPhysical
        if (true){
            let newX = prevX - e.clientX;
            let newY = prevY - e.clientY;
            const rect = el.getBoundingClientRect();
            var l = rect.left - newX;
            var t = rect.top  - newY;

            // l= Math.round(l / 10) * 10;
            // t= Math.round(t / 10) * 10;
            el.style.left= l + "px";
            el.style.top = t + "px";
            prevX = e.clientX;
            prevY = e.clientY;
        }
    }
    function mouseup(){
        window.removeEventListener('mousemove',mousemove);
        window.removeEventListener('mouseup',mouseup);
    }
}

//------------------------------------------------
function Nothing(){
    console.log('Doing Nothing');
}

function Escape(){

}

function WindowAction(listener){
    if(win_status){
        window.removeEventListener('mousedown',win_listener);
    }
    window.addEventListener('mousedown',listener);    
    
    win_listener=listener;
    win_status=true;
}

function noWindowAction(){
    window.removeEventListener('mousedown',win_listener);
    win_status=false;
}
