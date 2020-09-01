var el = document.querySelector('.item')
el.addEventListener('click',selectMe,false)

//let el = document.querySelector('.item')

var elements = []
selected=false;
var canvas = document.getElementById('canvas');


var button = document.getElementById('newtext')
button.addEventListener('click',NewTextBox,false)
function NewTextBox(e){
    window.addEventListener('click',newText)
    function newText(e){
        if(e.target == button) {
            return
        }
        var element = document.createElement("div");
        element.innerHTML +=`
            <span  contenteditable="true" draggable="false" >
                Click to edit Text!
            </span>
            <span>
                <div class="resizer ne"></div>
                <div class="resizer nw"></div> 
                <div class="resizer sw"></div> 
                <div class="resizer se"></div> 
            </span> 
        `;
        element.classList.add('item','item-select')
        element.addEventListener('click',selectMe,false)
        element.style.left= e.clientX + "px";
        element.style.top = e.clientY + "px";
        canvas.appendChild(element)
        elements.push(element)
        InitEle(element)
        window.removeEventListener('click',newText)
        window.addEventListener('click',noSelect)
        el=element;
    }
    
}

var dblclick = false
var allowPhysical = false;
function selectMe(ele){
    if(dblclick){
        allowPhysical=true;
        el.children[0].setAttribute('contenteditable','false')
        el.children[1].style.display='block';
        el.classList.add('item-noText')
        dblclick=false;
        return
    }
    dblclick=true;
    setTimeout(function(){ dblclick = false},300)
    if(selected){
        el.children[1].style.display='none';
        el.classList.remove('item-select')
    }
        selected=true;
        el = this;
        //console.log(this);
        
        el.classList.add('item-select')
    
}

let isResizing=false;
window.addEventListener('click',noSelect)

function noSelect(e){
    if(e.target != el) {
        if(true){
                allowPhysical=false;
                el.children[1].style.display='none';
                el.classList.remove('item-select')
                el.classList.remove('item-noText')
        }
    }
    
}

function InitEle(el){
    

    el.addEventListener('mousedown',mousedown)
    function mousedown(e){
    window.addEventListener('mouseup',mouseup)
    window.addEventListener('mousemove',mousemove)
    
    let prevX = e.clientX;
    let prevY = e.clientY;

    function mousemove(e){
        if (!isResizing && allowPhysical){
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
        el.children[0].setAttribute('contenteditable','true')
        allowPhysical = false;
        el.classList.remove('item-noText')
    }
}

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
            fitText(el,0.7)
        }

        function mouseup (e){
            window.removeEventListener('mousemove',mousemove);
            window.removeEventListener('mouseup',mouseup);
            isResizing=false;
        }
    }
}

}

InitEle(el)