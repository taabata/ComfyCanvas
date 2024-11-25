var loneFlag = false;
var routine = {};
var routineon = false;
var routinerecflag = false;
var selroutine = "";
var generating = false;
var grid = false;
var gridsize = 128;
var gridpoints = [];
var textflag = false;
var textadded = {};
var textnum = 0;
var gligenflag = false;
var gligenbaseimage = "";
var gligenparams = {};
var gligennum = 0;
var drawerflag = false;
var mousex = 0;
var boxleft = "";
var boxtop = "";
var imgflip = false;
var fsimgs = {};
var selmod = "";
var sellora = "";
var selparam = "";
var selwf = "";
var genflag = false;
var canvasflag = true;
var taesd = "false";
var img2img = "";
var backup = {
    "img":"",
    "left":"",
    "top":"",
    "width":"",
    "height":""
}
var params = {};
var mousey = 0;
var lockflag = false;
var prevmousex = 0;
var prevmousey = 0;
var clickflag = false;
var moveimgenableflag = false;
var selectorsize = 512;
var crplft = 0;
var crptp = 0;
var crprght = 0;
var crpbtm = 0;
var eraseflag = false;
var drawenableflag = false;
var eraseenableflag = false;
var maskenableflag = false;
var drawflag = false;
var maskflag = false;
var ll = false;
var lr = false;
var lt = false;
var lb = false;
var setref = false;
var comporder = [];
var imagetomove = "";
var cropflag = false;
var cropcount = 0;
var compareflag = false;
var savedata = {
    "crpdimsref": {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    },
    "crpdims": {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    },
    "additionaldims": {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    },
    "boxsz":512,
    "ff":10,
    "pxlsarray":"",
    "mskarray":""


};

var imagedims = {
    "width":128,
    "height":128
};

var changedparams = {};

function undoimg(){
    document.getElementById("sourceimg").width = backup["width"];
    document.getElementById("sourceimg").height = backup["height"];
    document.getElementById("source").width = backup["width"];
    document.getElementById("source").height = backup["height"];
    document.getElementById("source").style.left = backup["left"];
    document.getElementById("source").style.top = backup["top"];
    document.getElementById("sourceimg").src = backup["img"];
    img = new Image();
    img.onload = function() {            
        var canvas = document.getElementById("source");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);        
        imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var pxlsarray = [[]];
        for(i = 0;i<pxls.length;i++){
            pxlsarray[pxlsarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%canvas.width==0 && i>canvas.width-10){
                    pxlsarray.push([]);
                }
            }
            
        }
        savedata["pxlsarray"] = pxlsarray;
    }
    img.src = backup["img"];
    fsimgs["main"] = backup["img"];
    savedata["crpdims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
    savedata["additionaldims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
    document.getElementById("oldimg").src = document.getElementById("sourceimg").src;
    document.getElementById("sourceimg").onload = function(){
        document.getElementById("oldimg").width = document.getElementById("source").width;
        document.getElementById("oldimg").height = document.getElementById("source").height;
    }

}

function paramset(){
   changedparams = {};
}

window.onload = function(){
    document.getElementById("stack").style.visibility = "hidden";
    document.getElementById("erasersize").value = 10;
    document.getElementById("ff").value = 20;
    document.getElementById("selectorsize").value = 512;
    document.getElementById("selector").style.width = "512px";  
    document.getElementById("selector").style.height = "512px";  
    prepare();

    //copied from https://jsfiddle.net/4N6D9/1/
    document.getElementById("openimg").onchange =function(e) {
        var file, img;   
        if ((file = this.files[0])) {
            img = new Image();
            img.onload = function() {
                document.getElementById("sourceimg").width = this.width;
                document.getElementById("sourceimg").height = this.height;
                document.getElementById("source").width = this.width;
                document.getElementById("source").height = this.height;
                var canvas = document.getElementById("source");
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var img = document.getElementById("sourceimg");
                ctx.drawImage(img, 0, 0);
                imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                data = imgData.data;
                pxls = [];
                for (let i = 0; i < data.length; i += 4) {
                    var pixel = [];
                    pixel.push(data[i]);
                    pixel.push(data[i+1]);
                    pixel.push(data[i+2]);
                    pixel.push(data[i+3]);
                    pxls.push(pixel);
                }
                var pxlsarray = [[]];
                for(i = 0;i<pxls.length;i++){
                    pxlsarray[pxlsarray.length-1].push(pxls[i]);
                    if(i<pxls.length-2){
                        if((i+1)%canvas.width==0 && i>canvas.width-10){
                            pxlsarray.push([]);
                        }
                    }
                    
                }
                savedata["pxlsarray"] = pxlsarray;
                backup["img"] = document.getElementById("sourceimg").src;
            };
            img.src = URL.createObjectURL(file);
            document.getElementById("sourceimg").src = URL.createObjectURL(file);
            document.getElementById("oldimg").src = URL.createObjectURL(file);
            document.getElementById("uploadcontainer").style.visibility = "hidden";
            document.getElementById("grid").style.visibility = "visible";
            
    
    
        }
        fsimgs["main"] = document.getElementById("sourceimg").src;
        
    
    }

    document.getElementById("openimgadd").onchange =function(e) {
        document.getElementById("settings").style.visibility = "hidden";
        document.getElementById("undo").style.visibility = "hidden";
        var file, img;
        if ((file = this.files[0])) {
            comporder = [];
            document.getElementById("selector").style.visibility = "hidden";
            var num = (document.getElementById("canvascontainer").children.length /2)+1;
            num = String(num);
            document.getElementById("settings2").style.visibility = "visible";
            document.getElementById("openimgadd").style.visibility = "hidden";
            if(!document.getElementById("openimgadd2")){
                var newel = document.createElement("input");
                newel.id = "openimgadd2";
                newel.type = "file";
                newel.onchange =function(e) {
                    var file, img;
                    if ((file = this.files[0])) {
                        comporder = [];
                        document.getElementById("selector").style.visibility = "hidden";
                        var num = (document.getElementById("canvascontainer").children.length /2)+1;
                        num = String(num);
                        document.getElementById("settings2").style.visibility = "visible";
                        var newel = document.createElement("div");
                        newel.id = "moveimg"+num;
                        newel.addEventListener("click",moveimgenable);
                        newel.className = "moveimgclass txt";
                        newel.style.left = 5+(num-1)*10+"%";
                        var newelpar = document.createElement("p");            
                        newelpar.innerHTML = "Move Image "+num;
                        newelpar.className = "txt";
                        newel.append(newelpar);
                        document.getElementById("settings2").append(newel);
                        newel = document.createElement("img");
                        newel.id = "sourceimg"+num;
                        newel.style.display = "none";
                        document.getElementById("canvascontainer").append(newel);
                        newel = document.createElement("canvas");
                        newel.id = "source"+num;
                        newel.className = "canvas";
                        newel.style.position = "fixed";
                        newel.style.left = parseInt(document.getElementById("source").style.left) + document.getElementById("source").width + "px";
                        newel.style.top = document.getElementById("source").style.top;
                        document.getElementById("canvascontainer").append(newel);
                        img = new Image();
                        img.src = URL.createObjectURL(file);
                        img.onload = function() {
                            document.getElementById("sourceimg"+num).width = this.width;
                            document.getElementById("sourceimg"+num).height = this.height;
                            document.getElementById("source"+num).width = this.width;
                            document.getElementById("source"+num).height = this.height;
                            var canvas = document.getElementById("source"+num);
                            var ctx = canvas.getContext("2d");
                            ctx.clearRect(0, 0, canvas.width, canvas.height);
                            var img = document.getElementById("sourceimg"+num);
                            ctx.drawImage(img, 0, 0);
                            imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                            data = imgData.data;
                            pxls = [];
                            for (let i = 0; i < data.length; i += 4) {
                                var pixel = [];
                                pixel.push(data[i]);
                                pixel.push(data[i+1]);
                                pixel.push(data[i+2]);
                                pixel.push(data[i+3]);
                                pxls.push(pixel);
                            }
                            var pxlsarray = [[]];
                            for(i = 0;i<pxls.length;i++){
                                pxlsarray[pxlsarray.length-1].push(pxls[i]);
                                if(i<pxls.length-2){
                                    if((i+1)%canvas.width==0 && i>canvas.width-10){
                                        pxlsarray.push([]);
                                    }
                                }
                                
                            }
                        };
                        document.getElementById("sourceimg"+num).src = URL.createObjectURL(file);
                        fsimgs[num] = document.getElementById("sourceimg"+num).src;
                    }
                    
                }
                document.getElementById("settings2").append(newel);
            }
            document.getElementById("openimgadd2").style.visibility = "visible";
            var newel = document.createElement("div");
            newel.id = "moveimg"+num;
            newel.addEventListener("click",moveimgenable);
            newel.className = "moveimgclass txt";
            newel.style.left = 5+(num-1)*10+"%";
            var newelpar = document.createElement("p");            
            newelpar.innerHTML = "Move Image "+num;
            newelpar.className = "txt";
            newel.append(newelpar);
            document.getElementById("settings2").append(newel);
            newel = document.createElement("img");
            newel.id = "sourceimg"+num;
            newel.style.display = "none";
            document.getElementById("canvascontainer").append(newel);
            newel = document.createElement("canvas");
            newel.id = "source"+num;
            newel.className = "canvas";
            newel.style.position = "fixed";
            newel.style.left = parseInt(document.getElementById("source").style.left) + document.getElementById("source").width + "px";
            newel.style.top = document.getElementById("source").style.top;
            document.getElementById("canvascontainer").append(newel);
            img = new Image();
            img.onload = function() {
                document.getElementById("sourceimg"+num).width = this.width;
                document.getElementById("sourceimg"+num).height = this.height;
                document.getElementById("source"+num).width = this.width;
                document.getElementById("source"+num).height = this.height;
                var canvas = document.getElementById("source"+num);
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var img = document.getElementById("sourceimg"+num);
                ctx.drawImage(img, 0, 0);
                imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                data = imgData.data;
                pxls = [];
                for (let i = 0; i < data.length; i += 4) {
                    var pixel = [];
                    pixel.push(data[i]);
                    pixel.push(data[i+1]);
                    pixel.push(data[i+2]);
                    pixel.push(data[i+3]);
                    pxls.push(pixel);
                }
                var pxlsarray = [[]];
                for(i = 0;i<pxls.length;i++){
                    pxlsarray[pxlsarray.length-1].push(pxls[i]);
                    if(i<pxls.length-2){
                        if((i+1)%canvas.width==0 && i>canvas.width-10){
                            pxlsarray.push([]);
                        }
                    }
                    
                }
            };
            img.src = URL.createObjectURL(file);
            document.getElementById("sourceimg"+num).src = URL.createObjectURL(file);
            fsimgs[num] = document.getElementById("sourceimg"+num).src;
        }
        
    }
    grabwfsmodels();

    
    document.getElementById("compare").style.left = document.getElementById("source").style.left;
    document.getElementById("compare").style.width = parseInt(document.getElementById("oldimg").width)-parseInt(document.getElementById("oldimg").width)/2 + "px";
    document.getElementById("compare").style.height = document.getElementById("oldimg").style.height;
    document.getElementById("sourceimg").onload = function(){
        document.getElementById("oldimg").width = document.getElementById("sourceimg").width;
        document.getElementById("oldimg").height = document.getElementById("sourceimg").height;
    }
    document.getElementById("source").style.top = "5px";
    document.getElementById("source").style.left = "5px";


}

function prepare(){
    fetch('http://'+host+':'+port+'/prepare'
    ).then(function (response) {
        responseClone = response.clone();
        return response.json();
    })
    .then(data => {
        if(data["exist"]!="yes"){
            document.getElementById("sourceimg").src = "";
            document.getElementById("uploadcontainer").style.height = "100%";
            document.getElementById("uploadcontainer").style.visibility = "visible";
            document.getElementById("uploadcontainer").style.opacity = 1;
        }
        else{
            document.getElementById("uploadcontainer").style.visibility = "hidden";
            resetimg();
        }
    });
}

function setreftoggle(){
    setref = !setref;
    if(setref){
        document.getElementById("hint").style.visibility = "visible";
        document.getElementById("selector").style.border = "2px solid red";
        document.getElementById("setref").style.backgroundColor = "rgb(20,20,20)";
        document.getElementById("saveexit").style.visibility = "hidden";
        document.getElementById("settings").style.visibility = "hidden";
        document.getElementById("undo").style.visibility = "hidden";
        ll = true;
        lr = true;
        lt = true;
        lb = true;
        document.getElementById("saveexit").style.visibility = "hidden";
        document.getElementById("hinttext").innerHTML = "Horizontal: ";
        document.getElementById("hintinp").value = selectorsize;
        document.getElementById("lockleft").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockright").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("locktop").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockbottom").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockbox").style.backgroundColor = "rgb(20, 20, 20)";

    }
    else{
        document.getElementById("selector").style.border = "2px solid green";
        document.getElementById("setref").style.backgroundColor = "rgb(80, 80, 80)";
        ll = false;
        lr = false;
        lt = false;
        lb = false;
        document.getElementById("lockbox").style.backgroundColor = "rgb(80, 80, 80)";
    }
}
function resetimg(){
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = document.getElementById("sourceimg");
    ctx.drawImage(img, 0, 0);
    savedata["additionaldims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    }
}

function ffupdate(){
    savedata["ff"] = document.getElementById("ff").value;
}
function draw(){
    var c = document.getElementById("source");
    var ctx = c.getContext("2d");  
    var erasersize = 30
    try{
        erasersize = parseInt(document.getElementById("erasersize").value);
    }
    catch(err){
        console.log(err);
    }        
    if(eraseenableflag){
        
        var imgData = ctx.getImageData(Math.floor(mousex)-parseInt(document.getElementById('source').getBoundingClientRect()["left"]), Math.floor(mousey)-parseInt(document.getElementById('source').getBoundingClientRect()["top"]), erasersize,erasersize);
        var data = imgData.data;
        var pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; 
            data[i + 1] = avg; 
            data[i + 2] = avg; 
            data[i + 3] = 0; 
        }
        ctx.putImageData(imgData, (Math.floor(mousex)-parseInt(document.getElementById('source').getBoundingClientRect()["left"]))-(erasersize/2), (Math.floor(mousey)-parseInt(document.getElementById('source').getBoundingClientRect()["top"]))-(erasersize/2));
    }
    else if(drawenableflag){
        ctx.fillStyle = document.getElementById("clr").value+parseInt(document.getElementById("inprange").value).toString(16);
        ctx.fillRect((Math.floor(mousex)-parseInt(document.getElementById('source').getBoundingClientRect()["left"]))-(erasersize/2), (Math.floor(mousey)-parseInt(document.getElementById('source').getBoundingClientRect()["top"]))-(erasersize/2),erasersize/2,erasersize/2);
    }
    else if(maskenableflag){
        var cmask = document.getElementById("canvasmask");
        var ctxmask = cmask.getContext("2d");
        ctxmask.fillStyle = "white";
        ctxmask.fillRect((Math.floor(mousex)-parseInt(document.getElementById('source').getBoundingClientRect()["left"]))-(erasersize/2), (Math.floor(mousey)-parseInt(document.getElementById('source').getBoundingClientRect()["top"]))-(erasersize/2),erasersize/2,erasersize/2);
    }
    else{
        var selec = document.getElementById("selector");
        selec.style.left = Math.floor(mousex)+"px";
        selec.style.top = Math.floor(mousey)+"px";
        /* imgData = ctx.getImageData(0, 0, c.width,c.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var pxlsarray = [[]];
        for(i = 0;i<pxls.length;i++){
            pxlsarray[pxlsarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%c.width==0 && i>c.width-10){
                    pxlsarray.push([]);
                }
            }
            
        }
        savedata["pxlsarray"] = pxlsarray;

        var cmask = document.getElementById("canvasmask");
        var ctxmask = cmask.getContext("2d");
        imgData = ctxmask.getImageData(0, 0, cmask.width,cmask.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var mskarray = [[]];
        for(i = 0;i<pxls.length;i++){
            mskarray[mskarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%cmask.width==0 && i>cmask.width-10){
                    mskarray.push([]);
                }
            }
            
        }
        savedata["mskarray"] = mskarray; */
    }
}

function saveArrays(){
    var c = document.getElementById("source");
    var ctx = c.getContext("2d");  
    imgData = ctx.getImageData(0, 0, c.width,c.height);
    data = imgData.data;
    pxls = [];
    for (let i = 0; i < data.length; i += 4) {
        var pixel = [];
        pixel.push(data[i]);
        pixel.push(data[i+1]);
        pixel.push(data[i+2]);
        pixel.push(data[i+3]);
        pxls.push(pixel);
    }
    var pxlsarray = [[]];
    for(i = 0;i<pxls.length;i++){
        pxlsarray[pxlsarray.length-1].push(pxls[i]);
        if(i<pxls.length-2){
            if((i+1)%c.width==0 && i>c.width-10){
                pxlsarray.push([]);
            }
        }
        
    }
    savedata["pxlsarray"] = pxlsarray;
    
    if(maskflag){
        var cmask = document.getElementById("canvasmask");
        var ctxmask = cmask.getContext("2d");
        imgData = ctxmask.getImageData(0, 0, cmask.width,cmask.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var mskarray = [[]];
        for(i = 0;i<pxls.length;i++){
            mskarray[mskarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%cmask.width==0 && i>cmask.width-10){
                    mskarray.push([]);
                }
            }
            
        }
        savedata["mskarray"] = mskarray;
    }
}

function drawenable(){
    if(drawflag){
        drawenableflag = !drawenableflag;
    }
    else if(eraseflag){
        eraseenableflag = !eraseenableflag;
    }
    else if(maskflag){
        maskenableflag= !maskenableflag;
    }
}




function changesize(e){
    if(drawflag || eraseflag || maskflag){
        if(e.deltaY < 0){
            document.getElementById("erasersize").value = parseInt(document.getElementById("erasersize").value) + 1;
        }
        else{
            if(parseInt(document.getElementById("erasersize").value)-1>0){
                document.getElementById("erasersize").value = parseInt(document.getElementById("erasersize").value) - 1;
            }
        }
    }
    else if(!moveimgenableflag){
        if(cropflag || setref || textflag || gligenflag){
            if(cropcount==0){
                if(e.deltaY < 0 && parseInt(document.getElementById("selectorsize").value)+10<= parseInt(document.getElementById("source").width)){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) + 10;
                    selectorsize = document.getElementById("selectorsize").value;
                    savedata["boxsz"] = selectorsize;
                    document.getElementById("selector").style.width = selectorsize+"px";                   
                }
                else if(e.deltaY < 0 && parseInt(document.getElementById("selectorsize").value)+10> parseInt(document.getElementById("source").width)){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("source").width);
                    selectorsize = document.getElementById("selectorsize").value;
                    savedata["boxsz"] = selectorsize;
                    document.getElementById("selector").style.width = selectorsize+"px";   
                }
                else{
                    if(parseInt(document.getElementById("selectorsize").value)-1>0){
                        document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) - 10;
                        selectorsize = document.getElementById("selectorsize").value;
                        savedata["boxsz"] = selectorsize;
                        document.getElementById("selector").style.width = selectorsize+"px";  
                    }
                }
                document.getElementById("hinttext").innerHTML = "Horizontal: ";
                document.getElementById("hintinp").value = selectorsize;
            }
            else if(cropcount==1){
                if(e.deltaY < 0 && parseInt(document.getElementById("selectorsize").value)+10<= parseInt(document.getElementById("source").height)){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) + 10;
                    selectorsize = document.getElementById("selectorsize").value;
                    savedata["boxsz"] = selectorsize;
                    document.getElementById("selector").style.height = selectorsize+"px";                   
                }
                else if(e.deltaY < 0 && parseInt(document.getElementById("selectorsize").value)+10> parseInt(document.getElementById("source").height)){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("source").height);
                    selectorsize = document.getElementById("selectorsize").value;
                    savedata["boxsz"] = selectorsize;
                    document.getElementById("selector").style.height = selectorsize+"px"; 
                }
                else{
                    if(parseInt(document.getElementById("selectorsize").value)-10>0){
                        document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) - 10;
                        selectorsize = document.getElementById("selectorsize").value;
                        savedata["boxsz"] = selectorsize;
                        document.getElementById("selector").style.height = selectorsize+"px";  
                    }
                }
                document.getElementById("hinttext").innerHTML = "Vertical: ";
                document.getElementById("hintinp").value = selectorsize;
            }
        }
        else{
            if(e.deltaY < 0){
                if(!lockflag){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) + 64;
                    changeselectorsize(event);
                }
                else if(lockflag && parseInt(document.getElementById("selectorsize").value)+64<= parseInt(document.getElementById("source").width) && parseInt(document.getElementById("selectorsize").value)+64<= parseInt(document.getElementById("source").height)){
                    document.getElementById("selector").style.left = parseFloat(document.getElementById("source").style.left) + Math.floor(selectorsize/2)+"px";
                    document.getElementById("selector").style.top = parseFloat(document.getElementById("source").style.top) + Math.floor(selectorsize/2)+"px";
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) + 64;
                    changeselectorsize(event);
                    
                } 
            }
            else{
                if(parseInt(document.getElementById("selectorsize").value)-64>0){
                    document.getElementById("selectorsize").value = parseInt(document.getElementById("selectorsize").value) - 64;
                    changeselectorsize(event);
                }
            }
        }
    }
    else if(moveimgenableflag){
        var canvas = document.getElementById("source"+imagetomove);
        var ctx = canvas.getContext("2d");
        if(e.deltaY < 0){      
            if(parseFloat(document.getElementById("source"+imagetomove).width)>parseFloat(document.getElementById("source"+imagetomove).height)){
                let r =  parseFloat(document.getElementById("source"+imagetomove).width)/parseFloat(document.getElementById("source"+imagetomove).height);
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) + 10;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) + 10/r;
            }
            else if(parseFloat(document.getElementById("source"+imagetomove).width)<parseFloat(document.getElementById("source"+imagetomove).height)){ 
                let r =  parseFloat(document.getElementById("source"+imagetomove).height)/parseFloat(document.getElementById("source"+imagetomove).width);
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) + 10/r;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) + 10;
            }
            else{
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) + 10;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) + 10;
            }
            
        }  
        else if(e.deltaY > 0){
            if(parseFloat(document.getElementById("source"+imagetomove).width)>parseFloat(document.getElementById("source"+imagetomove).height)){
                let r =  parseFloat(document.getElementById("source"+imagetomove).width)/parseFloat(document.getElementById("source"+imagetomove).height);
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) - 10;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) - 10/r;
            }
            else if(parseFloat(document.getElementById("source"+imagetomove).width)<parseFloat(document.getElementById("source"+imagetomove).height)){
                let r =  parseFloat(document.getElementById("source"+imagetomove).height)/parseFloat(document.getElementById("source"+imagetomove).width);
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) - 10/r;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) - 10;
            }
            else{
                document.getElementById("source"+imagetomove).width = parseFloat(document.getElementById("source"+imagetomove).width) - 10;
                document.getElementById("source"+imagetomove).height = parseFloat(document.getElementById("source"+imagetomove).height) - 10;
            }
            
        
        }    
        if(e.deltaX < 0){      
            if(imgflip==false){
                ctx.translate(canvas.width, 0);
                imgflip = true;
                ctx.scale(-1, 1);
        
            }
            else{
                imgflip = false;
                
            }         
            
        
        }  
        else if(e.deltaX > 0){      
            if(imgflip==false){
                ctx.translate(0, canvas.height);
                imgflip = true;
                ctx.scale(1, -1);
        
            }            
            else{
                imgflip = false;
                
            }         
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var img = new Image;
        if(imagetomove==""){
            img.src = fsimgs["main"];
        }
        else{
            img.src = fsimgs[imagetomove];
        }
        
        img.onload = function(){
            ctx.drawImage(img, 0, 0, img.width,img.height,0, 0, canvas.width, canvas.height);
            document.getElementById("sourceimg"+imagetomove).src = canvas.toDataURL();
            document.getElementById("oldimg").width = canvas.width;
            document.getElementById("oldimg").height = canvas.height;
            document.getElementById("oldimg").src = canvas.toDataURL();

        }
           
    
    }
}

function erasemodeon(){
    if(eraseflag){
        saveArrays();
        document.getElementById("sourceimg").src = document.getElementById("source").toDataURL();
        fsimgs["main"] = document.getElementById("sourceimg").src;
        document.getElementById("selector").style.visibility = "visible";
        document.getElementById("moveimglistner").style.visibility = "visible";
        document.getElementById("eraseon").style.backgroundColor = "rgb(80, 80, 80)";
        eraseflag = !eraseflag
    }
    else{
        if(drawflag==false && moveimgenableflag==false && maskflag==false){
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("moveimglistner").style.visibility = "hidden";
            document.getElementById("eraseon").style.backgroundColor = "rgb(20, 20, 20)";
            eraseflag = !eraseflag
        }
    }
}

function drawmodeon(){
    if(drawflag){
        saveArrays();
        document.getElementById("sourceimg").src = document.getElementById("source").toDataURL();
        fsimgs["main"] = document.getElementById("sourceimg").src;
        document.getElementById("selector").style.visibility = "visible";
        document.getElementById("moveimglistner").style.visibility = "visible";
        document.getElementById("drawon").style.backgroundColor = "rgb(80, 80, 80)";
        drawflag = !drawflag
    }
    else{
        if(eraseflag==false && moveimgenableflag==false && maskflag==false){
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("moveimglistner").style.visibility = "hidden";
            document.getElementById("drawon").style.backgroundColor = "rgb(20, 20, 20)";
            drawflag = !drawflag
        }
    }
}

function maskmodeon(){
    if(maskflag){
        saveArrays();
        document.getElementById("canvasmask").remove();
        document.getElementById("sourceimg").src = document.getElementById("source").toDataURL();
        fsimgs["main"] = document.getElementById("sourceimg").src;
        document.getElementById("selector").style.visibility = "visible";
        document.getElementById("moveimglistner").style.visibility = "visible";
        document.getElementById("maskon").style.backgroundColor = "rgb(80, 80, 80)";
        maskflag = !maskflag
    }
    else{
        if(eraseflag==false && moveimgenableflag==false && drawflag==false){
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("moveimglistner").style.visibility = "hidden";
            document.getElementById("maskon").style.backgroundColor = "rgb(20, 20, 20)";
            var cmask = document.createElement("canvas");
            cmask.id = "canvasmask";
            cmask.style.position = "fixed";
            cmask.style.left = document.getElementById("source").style.left;
            cmask.style.top = document.getElementById("source").style.top;
            cmask.style.zIndex = "1000";
            cmask.onclick = function(){
                drawenable();
            }
            cmask.onmousemove = function(){
                draw();
            }
            cmask.width = document.getElementById("source").width;
            cmask.height = document.getElementById("source").height;
            document.getElementById("canvascontainer").append(cmask);
            maskflag = !maskflag
        }
    }
}

function saveimg(){
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = document.getElementById("sourceimg");
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
    data = imgData.data;
    pxls = [];
    for (let i = 0; i < data.length; i += 4) {
        var pixel = [];
        pixel.push(data[i]);
        pixel.push(data[i+1]);
        pixel.push(data[i+2]);
        pixel.push(data[i+3]);
        pxls.push(pixel);
    }
    var pxlsarray = [[]];
    for(i = 0;i<pxls.length;i++){
        pxlsarray[pxlsarray.length-1].push(pxls[i]);
        if(i<pxls.length-2){
            if((i+1)%canvas.width==0 && i>canvas.width-10){
                pxlsarray.push([]);
            }
        }
        
    }
    savedata["pxlsarray"] = pxlsarray;
    fetch('http://'+host+':'+port+'/saveimg',{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"pixels":savedata["pxlsarray"]})
    })
    .then(function (response){
        return response.json();
    })
    .then(data=>{
    });
}

function grabwfsmodels(id = "", paramsdata={},j="", addtype=""){
    fetch('http://'+host+':'+port+'/grabwfsmodels')
    .then(function (response){
        return response.json();
    })
    .then(data=>{
        if(id==""){
            for(let i =0;i<data["wfs"].length;i++){
                var el = document.createElement("a");
                el.innerHTML =  data["wfs"][i];
                el.onclick = function(evt){
                    selwf = evt.target.innerHTML;
                    document.getElementById("wfbutton").innerHTML = evt.target.innerHTML;
                    paramset();
                }
                document.getElementById("wfscont").append(el);
            }
            for(let i =0;i<data["routines"].length;i++){
                var el = document.createElement("a");
                el.innerHTML =  data["routines"][i];
                el.onclick = function(evt){
                    selroutine = evt.target.innerHTML;
                    document.getElementById("routinebutton").innerHTML = evt.target.innerHTML;
                }
                document.getElementById("routinecont").append(el);
            }
        }
        if(id=="" || addtype=="model"){
            for(let i =0;i<data["models"].length;i++){
                var el = document.createElement("a");
                el.innerHTML =  data["models"][i];
                if(["Unets","Diffusers Models","Checkpoints"].includes(data["models"][i])){
                    el.style.background = "rgb(50,50,50)";
                    el.style.color = "white";
                }
                else{
                    el.onclick = function(evt){
                        selmod = evt.target.innerHTML;
                        document.getElementById("modelbutton"+id).innerHTML = evt.target.innerHTML;
                        if(id!=""){
                            if(changedparams[id]==undefined){
                                changedparams[id] = {};
                            }
                            changedparams[id][Object.keys(paramsdata["prompt_workflow"][id]["inputs"])[j]] = evt.target.innerHTML;
                        }
                    }
                }
                document.getElementById("modelscont"+id).append(el);
            }
        }
        if(id!="" && addtype=="lora"){
            for(let i =0;i<data["loras"].length;i++){
                var el = document.createElement("a");
                el.innerHTML =  data["loras"][i];
                el.onclick = function(evt){
                    sellora = evt.target.innerHTML;
                    document.getElementById("lorabutton"+id).innerHTML = evt.target.innerHTML;                    
                    if(changedparams[id]==undefined){
                        changedparams[id] = {};
                    }
                    changedparams[id][Object.keys(paramsdata["prompt_workflow"][id]["inputs"])[j]] = evt.target.innerHTML;                    
                }
                document.getElementById("lorascont"+id).append(el);
            }
        }
    });
}


function generate(){
    let gligenparamsarray = [];
    for(let i =0;i< Object.keys(gligenparams).length;i++){
        gligenparamsarray.push(gligenparams[Object.keys(gligenparams)[i]]);
    }
    fetch('http://'+host+':'+port+'/generate', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"wf":selwf,"model":selmod,"params":params,"gligparams":gligenparamsarray,"lora":sellora,"changedparams":changedparams})
    })
    .then(function (response){
        return response.json();
    })
    .then(data=>{
    });
}

function cancelgen(){
    fetch('http://'+host+':'+port+'/cancelgen')
    .then(function (response){
        return response.json();
    })
    .then(data=>{
        document.getElementById("blockactions").style.visibility = "hidden";
    });
}
function saved(savedata){
    var responseClone;   
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");
    /* imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
    data = imgData.data;
    pxls = [];
    for (let i = 0; i < data.length; i += 4) {
        var pixel = [];
        pixel.push(data[i]);
        pixel.push(data[i+1]);
        pixel.push(data[i+2]);
        pixel.push(data[i+3]);
        pxls.push(pixel);
    }
    var pxlsarray = [[]];
    for(i = 0;i<pxls.length;i++){
        pxlsarray[pxlsarray.length-1].push(pxls[i]);
        if(i<pxls.length-2){
            if((i+1)%canvas.width==0 && i>canvas.width-10){
                pxlsarray.push([]);
            }
        }
        
    }
    savedata["pxlsarray"] = pxlsarray;
    console.log(savedata["pxlsarray"]); */
    fetch('http://'+host+':'+port+'/savedata', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"savedata":savedata,"selectorsize":selectorsize,"taesd":taesd,"img2img":img2img})
    })
    .then(function (response) {
        responseClone = response.clone(); 
        return response.json();
    })
    .then(data => {
        if(!generating){
            document.getElementById("settings").style.visibility = "hidden";
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("saveexit").style.visibility = "hidden";
            document.getElementById("undo").style.visibility = "hidden";
            document.getElementById("moveimglistner").style.visibility = "hidden";
            document.getElementById("cancel").style.visibility = "visible";
            generating = true;
            document.getElementById("aura").style.visibility = "visible";
            document.getElementById("aura").style.opacity = "1";
            auraAnimate(300);
        }
        img2img = data["img2img"];
        if(genflag==false && loneFlag==false){
            generate();
            genflag = true;
            document.getElementById("blockactions").style.visibility = "visible";
        }
        if(data["taesd"]=="no"){
            if(data["flag"]=="False"){
                if(document.getElementById("taesdcanvas")){
                    var canvas = document.getElementById("taesdcanvas");
                }
                else{
                    var canvas = document.createElement("canvas");
                    canvas.id = "taesdcanvas";
                    canvas.width = data["width"];
                    canvas.height = data["height"];
                    canvas.style.left = boxleft;
                    canvas.style.top = boxtop;
                    if(data["img2img"]=="img2img"){
                        img2img = "img2img";
                        canvas.style.zIndex = "4";
                    }
                    document.getElementById("canvascontainer").append(canvas);
                }
                img = new Image();
                img.onload = function() {
                    canvas = document.getElementById("taesdcanvas");
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                }
                img.src = data["img"];

                
            }
            else{
                if(canvasflag){
                    backup["width"] = document.getElementById("source").width;
                    backup["height"] = document.getElementById("source").height;
                    backup["left"] = document.getElementById("source").style.left;
                    backup["top"] = document.getElementById("source").style.top;
                    backup["img"] = document.getElementById("sourceimg").src;
    
                    document.getElementById("sourceimg").width = data["width"];
                    document.getElementById("sourceimg").height =data["height"];
                    document.getElementById("source").width = data["width"];
                    document.getElementById("source").height = data["height"];
                }
                canvasflag = false;
    
    
    
                document.getElementById("sourceimg").src = data["img"];
                img = new Image();
                img.onload = function() {            
                    var canvas = document.getElementById("source");
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var img = document.getElementById("sourceimg");
                    ctx.drawImage(img, 0, 0);
                    imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                    data = imgData.data;
                    pxls = [];
                    for (let i = 0; i < data.length; i += 4) {
                        var pixel = [];
                        pixel.push(data[i]);
                        pixel.push(data[i+1]);
                        pixel.push(data[i+2]);
                        pixel.push(data[i+3]);
                        pxls.push(pixel);
                    }
                    var pxlsarray = [[]];
                    for(i = 0;i<pxls.length;i++){
                        pxlsarray[pxlsarray.length-1].push(pxls[i]);
                        if(i<pxls.length-2){
                            if((i+1)%canvas.width==0 && i>canvas.width-10){
                                pxlsarray.push([]);
                            }
                        }
                        
                    }
                    savedata["pxlsarray"] = pxlsarray;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);
                    fsimgs["main"] = canvas.toDataURL();
                    routineon = false;
                }
                img.src = data["img"];

            }
            
        }
        
        if(data["flag"]=="False"){
            taesd = "true";
            setTimeout(() => {
                saved(savedata);
            }, 100);
        }
        else{
            document.getElementById("aura").style.opacity = "0";
            document.getElementById("aura").style.visibility = "hidden";
            generating = false;
            document.getElementById("settings").style.visibility = "visible";
            document.getElementById("selector").style.visibility = "visible";
            document.getElementById("undo").style.visibility = "visible";
            document.getElementById("moveimglistner").style.visibility = "visible";
            document.getElementById("cancel").style.visibility = "hidden";
            taesd = "false";
            canvasflag = true;
            genflag = false;
            boxleft = "";
            boxtop = "";
            params = {};
            if(parseInt(data["data"]["additionaldims"]["left"])!=0){
                document.getElementById("source").style.left = parseFloat(document.getElementById("source").style.left) - parseInt(data["data"]["additionaldims"]["left"]) +"px";
                document.getElementById("compare").style.left = parseFloat(document.getElementById("source").style.left) - parseInt(data["data"]["additionaldims"]["left"]) +"px";
            }
            else{
                document.getElementById("compare").style.left = parseFloat(document.getElementById("source").style.left)+"px";
            }
            if(parseInt(data["data"]["additionaldims"]["top"])!=0){
                document.getElementById("source").style.top = parseFloat(document.getElementById("source").style.top) - parseInt(data["data"]["additionaldims"]["top"]) +"px";
                document.getElementById("compare").style.top = parseFloat(document.getElementById("source").style.top) - parseInt(data["data"]["additionaldims"]["top"]) +"px"
            }
            else{
                document.getElementById("compare").style.top = parseFloat(document.getElementById("source").style.top)+"px";
            }
            try{
                if(document.getElementById("taesdcanvas")!=undefined || document.getElementById("taesdcanvas")){
                    document.getElementById("taesdcanvas").remove();
                }
            }
            catch(error){
                console.log(error);
            }
            savedata["crpdims"] = {
                "left":0,
                "top": 0,
                "right":0,
                "bottom":0
            };
            
            savedata["additionaldims"] = {
                "left":0,
                "top": 0,
                "right":0,
                "bottom":0
            };           
            document.getElementById("paramsbutton").innerHTML = "Change Parameter";
            document.getElementById("paramvalue").value = "";
            document.getElementById("blockactions").style.visibility = "hidden";

        }
        


    }, function (rejectionReason) { 
        responseClone.text() 
        .then(function (bodyText) {
            console.log('Received the following instead of valid JSON:', bodyText);
        });
    });
    
}

function recordRoutine(){
    if(routinerecflag){
        routinerecflag = false;
        let name = prompt("Enter routine name: ");
        document.getElementById("routinerecord").style.backgroundColor = "rgb(80, 80, 80)";
        fetch('http://'+host+':'+port+'/saveRoutine',
        {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"routine":routine,"name":name})

        }).
        then(function(response){
            return response.json();
        }).
        then(data=>{
            console.log("routine saved");
        });
    }
    else{
        routinerecflag = true;
        routine = {};
        document.getElementById("routinerecord").style.backgroundColor = "rgb(20, 20, 20)";
    }
    
}

function getRoutine(){
    if(document.getElementById("routinebutton").innerHTML!="Select Routine"){
        fetch('http://'+host+':'+port+'/getRoutine',
            {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"routine":selroutine})

            }).
        then(function(response){
            return response.json();
        }).
        then(data=>{
            startRoutine(data["routine"],0);
        });
    }
    
}

function startRoutine(routine,n){
    if(n==0){
        document.getElementById("routinestart").style.backgroundColor = "rgb(20, 20, 20)";
    }
    if(!genflag && !routineon && (document.getElementById("cancel").style.visibility != "visible")){
        pxlsarray = savedata["pxlsarray"];
        mskarray = savedata["mskarray"];
        savedata = {...routine[n]["savedata"]};
        savedata["pxlsarray"] = pxlsarray;
        savedata["mskarray"] = mskarray;
        selectorsize = routine[n]["selectorsize"];
        taesd = routine[n]["taesd"];
        img2img = routine[n]["img2img"];
        selwf = routine[n]["selwf"]; 
        selmod = routine[n]["selmod"];
        sellora = routine[n]["sellora"];
        params = routine[n]["params"];
        gligenparamsarray = routine[n]["gligenparamsarray"];
        changedparams = routine[n]["changedparams"];  
        boxleft = routine[n]["boxleft"];  
        boxtop = routine[n]["boxtop"]; 
        document.getElementById("source").style.left = routine[n]["canvasleft"];
        document.getElementById("source").style.top = routine[n]["canvastop"];  
        var canvas = document.getElementById("source");
        var ctx = canvas.getContext("2d"); 
        document.getElementById("source").width = routine[n]["canvaswidth"];
        document.getElementById("source").height = routine[n]["canvasheight"];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var img = new Image;
        if(imagetomove==""){
            img.src = fsimgs["main"];
        }
        else{
            img.src = fsimgs[imagetomove];
        }
        
        img.onload = function(){
            ctx.drawImage(img, 0, 0, img.width,img.height,0, 0, canvas.width, canvas.height);
            document.getElementById("sourceimg"+imagetomove).src = canvas.toDataURL();
            document.getElementById("oldimg").width = canvas.width;
            document.getElementById("oldimg").height = canvas.height;
            document.getElementById("oldimg").src = canvas.toDataURL();
            routineon = true; 
            savejson();
            if(n<Object.keys(routine).length-1){
                n++;  
                setTimeout(() => {
                    startRoutine(routine,n);
                }, 1000);
            }
            else{
                document.getElementById("routinestart").style.backgroundColor = "rgb(80, 80, 80)";
            }

        } 
    }
    else{
        setTimeout(() => {
            startRoutine(routine,n);
        }, 1000);
    }
}

function mousecoordinates(event){
    prevmousex = mousex;
    prevmousey =mousey;
    mousex = event.clientX;
    mousey = event.clientY;
    
    
}

function setLone(){
    loneFlag = !loneFlag;
    if(!loneFlag){
        document.getElementById("lone").style.backgroundColor = "rgb(80, 80, 80)";
    }
    else{
        document.getElementById("lone").style.backgroundColor = "rgb(20,20,20)";
    }
}

function selector(){
    var selec = document.getElementById("selector");
    selec.style.left = Math.floor(mousex)+"px";
    selec.style.top = Math.floor(mousey)+"px";
    if(lockflag==false){
        if((parseFloat(document.getElementById("selector").style.left)-(selectorsize/2))<0){
            selec.style.left = Math.floor(selectorsize/2)+"px";
        }
        if((parseFloat(document.getElementById('selector').getBoundingClientRect()["right"])-(selectorsize/2))>parseInt(screen.availWidth)){
            selec.style.left = parseInt(screen.availWidth)-selectorsize+"px";
        }
        if((parseFloat(document.getElementById("selector").style.top)-(selectorsize/2))<0){
            selec.style.top = Math.floor(selectorsize/2)+"px";
        }
        if((parseFloat(document.getElementById('selector').getBoundingClientRect()["bottom"])-(selectorsize/2))>parseInt(screen.availHeight)){
            selec.style.bottom = parseInt(screen.availHeight)-selectorsize+"px";
        }
    }
    
    if(cropflag || setref || textflag || gligenflag){
        if(ll){
            if((parseFloat(document.getElementById("selector").style.left)-parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("width"))/2))<parseFloat(document.getElementById("source").style.left)){
                selec.style.left = parseFloat(document.getElementById("source").style.left) + parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("width"))/2)+"px";
            }
        }
        if(lr){
            if((parseFloat(document.getElementById('selector').getBoundingClientRect()["right"]))>parseFloat(document.getElementById('source').getBoundingClientRect()["right"])){
                selec.style.left = parseFloat(document.getElementById("source").style.left)+parseFloat(document.getElementById("source").width) - parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("width"))/2)+"px";
            }
        }
        if(lt){
            if((parseFloat(document.getElementById("selector").style.top)-parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("height"))/2))<parseFloat(document.getElementById("source").style.top)){
                selec.style.top = parseFloat(document.getElementById("source").style.top) + parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("height"))/2)+"px";
            }
        }
        if(lb){
            if((parseFloat(document.getElementById('selector').getBoundingClientRect()["bottom"]))>parseFloat(document.getElementById('source').getBoundingClientRect()["bottom"])){
                selec.style.top = parseFloat(document.getElementById("source").style.top)+parseFloat(document.getElementById("source").height) - parseInt(parseInt(window.getComputedStyle(selec).getPropertyValue("height"))/2)+"px";
            }
        }
    }
    else{
        if(!grid){
            if(ll){
                if((parseFloat(document.getElementById("selector").style.left)-(selectorsize/2))<parseFloat(document.getElementById("source").style.left)){
                    selec.style.left = parseFloat(document.getElementById("source").style.left) + Math.floor(selectorsize/2)+1+"px";
                }
            }
            if(lr){
                if((parseFloat(document.getElementById('selector').getBoundingClientRect()["right"]))>parseFloat(document.getElementById('source').getBoundingClientRect()["right"])){
                    selec.style.left = parseFloat(document.getElementById("source").style.left)+parseFloat(document.getElementById("source").width) - Math.floor(selectorsize/2) +"px";
                }
            }
            if(lt){
                if((parseFloat(document.getElementById("selector").style.top)-(selectorsize/2))<parseFloat(document.getElementById("source").style.top)){
                    selec.style.top = parseFloat(document.getElementById("source").style.top) + Math.floor(selectorsize/2)+"px";
                }
            }
            if(lb){
                if((parseFloat(document.getElementById('selector').getBoundingClientRect()["bottom"]))>parseFloat(document.getElementById('source').getBoundingClientRect()["bottom"])){
                    selec.style.top = parseFloat(document.getElementById("source").style.top)+parseFloat(document.getElementById("source").height) - Math.floor(selectorsize/2)+"px";
                }
            }
        }
        else{
            let closestx = 10000;
            let closesty = 10000;
            let pointx = 0;
            let pointy = 0;
            for(let i=0;i<gridpoints.length;i++){
                if(Math.abs(gridpoints[i][0]-mousex)<closestx){
                    closestx=Math.abs(gridpoints[i][0]-mousex);
                    pointx = gridpoints[i][0];
                }
            }
            for(let i=0;i<gridpoints.length;i++){
                if(Math.abs(gridpoints[i][1]-mousey)<closesty){
                    closesty=Math.abs(gridpoints[i][1]-mousey);
                    pointy = gridpoints[i][1];
                }
            }
            selec.style.left = pointx+"px";
            selec.style.top = pointy+"px";
        }
    }
     
    
    
}


function imgmover(){
    if(!compareflag && !grid){    
        var selec = document.getElementById("source"+imagetomove);
        if(mousex>prevmousex){
            selec.style.left = parseInt(selec.getBoundingClientRect()["left"])+10+"px";
        }
        else if(mousex<prevmousex){
            selec.style.left = parseInt(selec.getBoundingClientRect()["left"])-10+"px";
        }
        if(mousey>prevmousey){
            selec.style.top = parseInt(selec.getBoundingClientRect()["top"])+10+"px";
        }
        else if(mousey<prevmousey){
            selec.style.top = parseInt(selec.getBoundingClientRect()["top"])-10+"px";
        } 
        let addleft = 0;
        let addtop = 0; 
        try{
            if(parseInt(data["data"]["additionaldims"]["left"])!=0){
                addleft = parseInt(data["data"]["additionaldims"]["left"]) +"px";
            }
            if(parseInt(data["data"]["additionaldims"]["top"])!=0){
                addtop =  parseInt(data["data"]["additionaldims"]["top"]) +"px";
            }
        } 
        catch(error){

        }
        document.getElementById("compare").style.left = parseInt(selec.style.left)-addleft+"px";
        document.getElementById("compare").style.top = parseInt(selec.style.top)-addtop+"px";
        document.getElementById("hint").style.left = parseInt(selec.style.left) +"px";
        document.getElementById("hint").style.top = parseInt(selec.style.top) - 100 +"px";
        document.getElementById("textinput").style.left = parseInt(selec.style.left) +"px";
        document.getElementById("textinput").style.top = parseInt(selec.style.top) - 200 +"px";
        document.getElementById("gligencont").style.left = parseInt(selec.getBoundingClientRect()["right"]) + 120 +"px";
        document.getElementById("gligencont").style.top = parseInt(selec.style.top) +"px";
    } 
    else if(!compareflag && grid){
        var selec = document.getElementById("source"+imagetomove);
        let closestx = 10000;
        let closesty = 10000;
        let pointx = 0;
        let pointy = 0;
        for(let i=0;i<gridpoints.length;i++){
            if(Math.abs(gridpoints[i][0]-mousex)<closestx){
                closestx=Math.abs(gridpoints[i][0]-mousex);
                pointx = gridpoints[i][0];
            }
        }
        for(let i=0;i<gridpoints.length;i++){
            if(Math.abs(gridpoints[i][1]-mousey)<closesty){
                closesty=Math.abs(gridpoints[i][1]-mousey);
                pointy = gridpoints[i][1];
            }
        }
        selec.style.left = pointx+"px";
        selec.style.top = pointy+"px";
        let addleft = 0;
        let addtop = 0; 
        try{
            if(parseInt(data["data"]["additionaldims"]["left"])!=0){
                addleft = parseInt(data["data"]["additionaldims"]["left"]) +"px";
            }
            if(parseInt(data["data"]["additionaldims"]["top"])!=0){
                addtop =  parseInt(data["data"]["additionaldims"]["top"]) +"px";
            }
        } 
        catch(error){

        }
        document.getElementById("compare").style.left = parseInt(selec.style.left)-addleft+"px";
        document.getElementById("compare").style.top = parseInt(selec.style.top)-addtop+"px";
        document.getElementById("hint").style.left = parseInt(selec.style.left) +"px";
        document.getElementById("hint").style.top = parseInt(selec.style.top) - 100 +"px";
        document.getElementById("textinput").style.left = parseInt(selec.style.left) +"px";
        document.getElementById("textinput").style.top = parseInt(selec.style.top) - 200 +"px";
        document.getElementById("gligencont").style.left = parseInt(selec.getBoundingClientRect()["right"]) + 120 +"px";
        document.getElementById("gligencont").style.top = parseInt(selec.style.top) +"px";
    }
    else{
        if(mousex>prevmousex){
            if(parseInt(document.getElementById("compare").style.width) + 10<=parseInt(document.getElementById("oldimg").width)){
                document.getElementById("compare").style.width = parseInt(document.getElementById("compare").style.width) + 10 +"px";
            }
            else{
                document.getElementById("compare").style.width = parseInt(document.getElementById("oldimg").width) +"px";
            }
        }
        else if(mousex<prevmousex){
            if(parseInt(document.getElementById("compare").style.width) - 10>=0){
                document.getElementById("compare").style.width = parseInt(document.getElementById("compare").style.width) - 10 +"px";
            }
            else{
                document.getElementById("compare").style.width = "0px";
            }
        }
    }
}
function snapshot(){
    imagedims["width"] = parseInt(document.getElementById('source').width);
    imagedims["height"] = parseInt(document.getElementById('source').height);
    if(cropflag || setref || textflag || gligenflag){
        let oldleft = savedata["crpdims"]["left"];
        let oldright = savedata["crpdims"]["right"];
        let oldtop = savedata["crpdims"]["top"];
        let oldbottom = savedata["crpdims"]["bottom"];
        savedata["crpdims"]["left"] = (parseFloat(document.getElementById("selector").style.left)-(parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("width"))/2)))-document.getElementById('source').getBoundingClientRect()["left"];
        savedata["crpdims"]["right"] = (parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("width"))/1)) + ((parseFloat(document.getElementById("selector").style.left)-(parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("width"))/2)))-parseFloat(document.getElementById('source').getBoundingClientRect()["left"]));
        savedata["crpdims"]["top"] = (parseFloat(document.getElementById("selector").style.top)-(parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("height"))/2)))-document.getElementById('source').getBoundingClientRect()["top"];
        savedata["crpdims"]["bottom"] = (((parseFloat(document.getElementById("selector").style.top)-(parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("height"))/2)))-document.getElementById('source').getBoundingClientRect()["top"])+(parseInt(parseInt(window.getComputedStyle(document.getElementById("selector")).getPropertyValue("height"))/1)));
        if(cropcount==1){
            if(setref){
                document.getElementById("settings").style.visibility = "visible";
                document.getElementById("undo").style.visibility = "visible";
                document.getElementById("hint").style.visibility = "hidden";
                cropcount = 0;
                document.getElementById("lockbox").style.background = "rgb(80, 80, 80)";
                lockflag = false;
                ll = false;
                lr = false;
                lt = false;
                lb = false;
                savedata["crpdimsref"] = {
                    "left":savedata["crpdims"]["left"],
                    "top": savedata["crpdims"]["top"],
                    "right":savedata["crpdims"]["right"],
                    "bottom":savedata["crpdims"]["bottom"]
                };
                setref = false;
                document.getElementById("setref").style.backgroundColor = "rgb(80, 80, 80)";
                document.getElementById("selector").style.border = "2px solid green";
                changeselectorsize(event);
            }
            else if(textflag){  
                cropcount = 0;    
                let d = {
                    "x":savedata["crpdims"]["left"],
                    "y": savedata["crpdims"]["top"],
                    "width":savedata["crpdims"]["right"]-savedata["crpdims"]["left"],
                    "height":savedata["crpdims"]["bottom"]-savedata["crpdims"]["top"],
                    "text":document.getElementById("textinp").value
                };
                document.getElementById("hinttext").innerHTML = "Horizontal: ";
                document.getElementById("hintinp").value = selectorsize;
                let el = document.createElement("div");
                el.id = "gligen_"+(textnum);
                textadded[el.id]=d;
                textnum++;
                el.className = "gligcond";
                el.innerHTML = document.getElementById("textinp").value;
                let canvas = document.getElementById("gligencanvas");
                let ctx = canvas.getContext("2d");
                let sz =  savedata["crpdims"]["bottom"] - savedata["crpdims"]["top"];
                sz = Math.floor((savedata["crpdims"]["right"] - savedata["crpdims"]["left"]));
                ctx.font = sz+"px Arial";
                ctx.font = "italic small-caps 50px 12px arial";
                ctx.fillStyle = document.getElementById("clr").value+parseInt(document.getElementById("inprange").value).toString(16);
                ctx.textBaseline = "middle";
                ctx.fillText(document.getElementById("textinp").value,savedata["crpdims"]["left"],Math.floor((savedata["crpdims"]["top"]))+d["height"]/2);
                el.addEventListener("click", function(e){
                    document.getElementById("gligencanvas").remove();
                    canvas = document.createElement("canvas");
                    canvas.width = document.getElementById("source").width;
                    canvas.height = document.getElementById("source").height;
                    canvas.style.left = document.getElementById("source").style.left;
                    canvas.style.top = document.getElementById("source").style.top;
                    canvas.style.zIndex = "1";
                    canvas.style.position = "fixed";
                    canvas.id = "gligencanvas";
                    document.getElementById("canvascontainer").append(canvas);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(document.getElementById("source"), 0, 0);
                    delete textadded[e.target.id];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(document.getElementById("source"), 0, 0);
                    for(let i = 0;i<Object.keys(textadded).length;i++){
                        ctx.font = sz+"px Arial";
                        ctx.font = "italic small-caps 50px 12px arial";
                        ctx.fillStyle = document.getElementById("clr").value+parseInt(document.getElementById("inprange").value).toString(16);
                        ctx.textBaseline = "middle";
                        ctx.fillText(textadded[Object.keys(textadded)[i]]["text"],textadded[Object.keys(textadded)[i]]["x"], textadded[Object.keys(textadded)[i]]["y"]+textadded[Object.keys(textadded)[i]]["height"]/2);                 
                    }
                    this.remove();
                });
                document.getElementById("gligencont").append(el);
            }
            else if(gligenflag){
                cropcount = 0;
                let d = {
                    "x":savedata["crpdims"]["left"],
                    "y": savedata["crpdims"]["top"],
                    "width":savedata["crpdims"]["right"]-savedata["crpdims"]["left"],
                    "height":savedata["crpdims"]["bottom"]-savedata["crpdims"]["top"],
                    "text":document.getElementById("textinp").value
                };
                document.getElementById("hinttext").innerHTML = "Horizontal: ";
                document.getElementById("hintinp").value = selectorsize;
                let el = document.createElement("div");
                el.id = "gligen_"+(gligennum);
                gligenparams[el.id]=d;
                gligennum++;
                el.className = "gligcond";
                el.innerHTML = document.getElementById("textinp").value;
                let canvas = document.getElementById("gligencanvas");
                let ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.rect(savedata["crpdims"]["left"], savedata["crpdims"]["top"], savedata["crpdims"]["right"]-savedata["crpdims"]["left"], savedata["crpdims"]["bottom"]-savedata["crpdims"]["top"]);
                ctx.strokeStyle = "rgb("+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+","+Math.floor(Math.random()*255)+")";
                ctx.lineWidth = 3;
                ctx.stroke();
                ctx.font = "25px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(document.getElementById("textinp").value,savedata["crpdims"]["left"], savedata["crpdims"]["top"]+20);
                el.addEventListener("click", function(e){
                    document.getElementById("gligencanvas").remove();
                    canvas = document.createElement("canvas");
                    canvas.width = document.getElementById("source").width;
                    canvas.height = document.getElementById("source").height;
                    canvas.style.left = document.getElementById("source").style.left;
                    canvas.style.top = document.getElementById("source").style.top;
                    canvas.style.zIndex = "1";
                    canvas.style.position = "fixed";
                    canvas.id = "gligencanvas";
                    document.getElementById("canvascontainer").append(canvas);
                    let ctx = canvas.getContext("2d");
                    ctx.drawImage(document.getElementById("source"), 0, 0);
                    delete gligenparams[e.target.id];
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(document.getElementById("source"), 0, 0);
                    for(let i = 0;i<Object.keys(gligenparams).length;i++){
                        ctx.rect(gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"], gligenparams[Object.keys(gligenparams)[i]]["width"], gligenparams[Object.keys(gligenparams)[i]]["height"]);
                        ctx.strokeStyle = "red";
                        ctx.lineWidth = 5;
                        ctx.stroke();
                        ctx.font = "25px Arial";
                        ctx.fillStyle = "red";
                        ctx.fillText(gligenparams[Object.keys(gligenparams)[i]]["text"],gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"]+20);                     
                    }
                    this.remove();
                });
                document.getElementById("gligencont").append(el);
                document.getElementById("gligenmain").value += ", "+document.getElementById("textinp").value;
            }
            else{
                var canvas = document.getElementById("source");
                var ctx = canvas.getContext("2d");
                let tempcanvas = document.createElement("canvas");
                tempcanvas.width = canvas.width;
                tempcanvas.height = canvas.height;
                document.getElementById("canvascontainer").append(tempcanvas);
                let tempctx = tempcanvas.getContext("2d");
                tempctx.drawImage(canvas, 0, 0);
                let cw = tempcanvas.width;
                let cl = 0;
                let ch = tempcanvas.height;
                let ct = 0;
                canvas.width = savedata["crpdims"]["right"]-savedata["crpdims"]["left"];
                canvas.height = savedata["crpdims"]["bottom"]-savedata["crpdims"]["top"];
                ctx.drawImage(tempcanvas, savedata["crpdims"]["left"], savedata["crpdims"]["top"], savedata["crpdims"]["right"]-savedata["crpdims"]["left"], savedata["crpdims"]["bottom"]-savedata["crpdims"]["top"], 0, 0, canvas.width, canvas.height); 
                cropcount = 0;
                cropflag = false;
                lockflag = false;
                ll = false;
                lr = false;
                lt = false;
                lb = false;
                changeselectorsize(event);
                tempcanvas.remove();
                document.getElementById("settings").style.visibility = "visible";
                document.getElementById("undo").style.visibility = "visible";
                document.getElementById("sourceimg").src = canvas.toDataURL();
                document.getElementById("selector").style.border = "2px solid green";
                fsimgs["main"] = document.getElementById("sourceimg").src
                document.getElementById("oldimg").src = document.getElementById("sourceimg").src;
                document.getElementById("sourceimg").onload = function(){
                    document.getElementById("oldimg").width = document.getElementById("source").width;
                    document.getElementById("oldimg").height = document.getElementById("source").height;
                }
                document.getElementById("hint").style.visibility = "hidden";
                return 0;
            }
        }
        else{
            cropcount = 1;
            document.getElementById("hinttext").innerHTML = "Vertical: ";
            document.getElementById("hintinp").value = selectorsize;
        }
    }
    if(!setref && !gligenflag){
        savedata["crpdims"] = {
            "left":0,
            "top": 0,
            "right":0,
            "bottom":0
        };
        if(!cropflag && !gligenflag && !textflag){
            document.getElementById("saveexit").style.visibility = "visible";
        }
        if((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))<document.getElementById('source').getBoundingClientRect()["left"]){
            if(document.getElementById('selector').getBoundingClientRect()["right"]<document.getElementById('source').getBoundingClientRect()["right"]){
                savedata["additionaldims"]["left"] = document.getElementById('source').getBoundingClientRect()["left"]-(parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2));
                savedata["crpdims"]["left"] = 0;
                savedata["crpdims"]["right"] = parseFloat(selectorsize) - (parseFloat(document.getElementById('source').getBoundingClientRect()["left"])-(parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2)));
            }
            else{
                savedata["crpdims"]["right"] = imagedims["width"];
                savedata["additionaldims"]["left"] = document.getElementById('source').getBoundingClientRect()["left"]-(parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2));
                let lft = (parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"];
                savedata["additionaldims"]["right"] = parseFloat(selectorsize) - (imagedims["width"]-lft);
            }
        }
        else if((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))>=document.getElementById('source').getBoundingClientRect()["left"]){
            if(((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"])+parseFloat(selectorsize)>imagedims["width"]){
                let lft = (parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"];
                savedata["additionaldims"]["right"] = parseFloat(selectorsize) - (imagedims["width"]-lft);
                savedata["additionaldims"]["left"] = 0;
                savedata["crpdims"]["left"] = lft;
                savedata["crpdims"]["right"] = imagedims["width"];
            }
            else{
        
                savedata["crpdims"]["left"] = (parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"];
                savedata["crpdims"]["right"] = parseFloat(selectorsize) + ((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-parseFloat(document.getElementById('source').getBoundingClientRect()["left"]));
            }
        }
        
        
        if((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))<document.getElementById('source').getBoundingClientRect()["top"]){
            if(document.getElementById('selector').getBoundingClientRect()["bottom"]<document.getElementById('source').getBoundingClientRect()["bottom"]){
                savedata["additionaldims"]["top"] = document.getElementById('source').getBoundingClientRect()["top"]-(parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2));
                savedata["crpdims"]["top"] = 0;
                savedata["crpdims"]["bottom"] = parseFloat(selectorsize) - (document.getElementById('source').getBoundingClientRect()["top"]-(parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2)));
            }
            else{
                savedata["crpdims"]["bottom"] = imagedims["height"];
                savedata["additionaldims"]["top"] = document.getElementById('source').getBoundingClientRect()["top"]-(parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2));
                let lft = (parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"];
                savedata["additionaldims"]["bottom"] = parseFloat(selectorsize) - (imagedims["height"]-lft);
            }
        }
        else if((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))>=document.getElementById('source').getBoundingClientRect()["top"]){
            if(((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"])+parseFloat(selectorsize)>imagedims["height"]){
                let tp = (parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"];
                savedata["additionaldims"]["bottom"] = parseFloat(selectorsize) - (imagedims["height"]-tp);
                savedata["additionaldims"]["top"] = 0;
                savedata["crpdims"]["top"] = tp;
                savedata["crpdims"]["bottom"] = imagedims["height"];
            }
            else{
                savedata["crpdims"]["top"] = (parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"];
                savedata["crpdims"]["bottom"] = (((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"])+parseFloat(selectorsize));
            }
        }
        boxleft = parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2)+"px";
        boxtop = parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2) + "px";
    }
    else{
        savedata["crpdimsref"] = {
            "left":0,
            "top": 0,
            "right":0,
            "bottom":0
        };
        if((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))<document.getElementById('source').getBoundingClientRect()["left"]){
            if(document.getElementById('selector').getBoundingClientRect()["right"]<document.getElementById('source').getBoundingClientRect()["right"]){
                savedata["crpdimsref"]["left"] = 0;
                savedata["crpdimsref"]["right"] = parseFloat(selectorsize) - (parseFloat(document.getElementById('source').getBoundingClientRect()["left"])-(parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2)));
                
            }
            else{
                savedata["crpdimsref"]["right"] = imagedims["width"];
                
            }
        }
        else if((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))>=document.getElementById('source').getBoundingClientRect()["left"]){
            if(((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"])+parseFloat(selectorsize)>imagedims["width"]){
                let lft = (parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"];
                savedata["crpdimsref"]["left"] = lft;
                savedata["crpdimsref"]["right"] = imagedims["width"];
                
            }
            else{
        
                savedata["crpdimsref"]["left"] = (parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["left"];
                savedata["crpdimsref"]["right"] = parseFloat(selectorsize) + ((parseFloat(document.getElementById("selector").style.left)-(parseFloat(selectorsize)/2))-parseFloat(document.getElementById('source').getBoundingClientRect()["left"]));
                
            }
        }
        
        if((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))<document.getElementById('source').getBoundingClientRect()["top"]){
            if(document.getElementById('selector').getBoundingClientRect()["bottom"]<document.getElementById('source').getBoundingClientRect()["bottom"]){
                savedata["crpdimsref"]["top"] = 0;
                savedata["crpdimsref"]["bottom"] = parseFloat(selectorsize) - (document.getElementById('source').getBoundingClientRect()["top"]-(parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2)));
            }
            else{
                savedata["crpdimsref"]["bottom"] = imagedims["height"];
                
            }
        }
        else if((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))>=document.getElementById('source').getBoundingClientRect()["top"]){
            if(((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"])+parseFloat(selectorsize)>imagedims["height"]){
                let tp = (parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"];
                
                savedata["crpdimsref"]["top"] = tp;
                savedata["crpdimsref"]["bottom"] = imagedims["height"];
            }
            else{
                savedata["crpdimsref"]["top"] = (parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"];
                savedata["crpdimsref"]["bottom"] = (((parseFloat(document.getElementById("selector").style.top)-(parseFloat(selectorsize)/2))-document.getElementById('source').getBoundingClientRect()["top"])+parseFloat(selectorsize));
            }
        }
    }
    
}

function lockleft(){
    if(ll){
        document.getElementById("lockleft").style.backgroundColor = "rgb(80, 80, 80)";
    }
    else{
        document.getElementById("lockleft").style.backgroundColor = "rgb(20,20,20)";
    }
    if(!lockflag){
        ll = !ll;
    }
}
function lockright(){
    if(lr){
        document.getElementById("lockright").style.backgroundColor = "rgb(80, 80, 80)";
    }
    else{
        document.getElementById("lockright").style.backgroundColor = "rgb(20,20,20)";
    }
    if(!lockflag){
        lr = !lr;
    }
    
}
function locktop(){
    if(lt){
        document.getElementById("locktop").style.backgroundColor = "rgb(80, 80, 80)";
    }
    else{
        document.getElementById("locktop").style.backgroundColor = "rgb(20,20,20)";
    }
    if(!lockflag){
        lt = !lt;
    }
    
}
function lockbottom(){
    if(lb){
        document.getElementById("lockbottom").style.backgroundColor = "rgb(80, 80, 80)";
    }
    else{
        document.getElementById("lockbottom").style.backgroundColor = "rgb(20,20,20)";
    }
    if(!lockflag){
        lb = !lb;
    }

    
}
function lockbox(){
    if(!lockflag){
        ll = true;
        lr = true;
        lt = true;
        lb = true;
        document.getElementById("lockleft").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockright").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("locktop").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockbottom").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("lockbox").style.backgroundColor = "rgb(20, 20, 20)";
    }
    else{
        document.getElementById("lockbox").style.backgroundColor = "rgb(80, 80, 80)";
        ll = false;
        lr = false;
        lt = false;
        lb = false;
    }
    lockflag = !lockflag;
}

function grabselector(){
    if(lockflag==false){
        document.getElementById("selector").style.left = Math.floor(mousex)+"px";
        document.getElementById("selector").style.top = Math.floor(mousey)+"px";
    }
    

}

function moveimgenablefirst(){
    if(moveimgenableflag){
        document.getElementById("selector").style.visibility = "visible";        
        document.getElementById("moveimg").style.backgroundColor = "rgb(80, 80, 80)";         
        moveimgenableflag = !moveimgenableflag
        imagetomove = "";
    }
    else{
        if(drawflag==false && eraseflag==false && !compareflag && maskflag==false){
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("moveimg").style.backgroundColor = "rgb(20,20,20)";   
            moveimgenableflag = !moveimgenableflag;
            imagetomove = "";
        }
    }
}
function moveimgenable(t){
    if(moveimgenableflag){
        try{
            document.getElementById(t.currentTarget.id).style.backgroundColor = "rgb(80, 80, 80)"; 
        }
        catch(error){
            document.getElementById("moveimg1").style.backgroundColor = "rgb(80, 80, 80)";
        }      
        moveimgenableflag = !moveimgenableflag
        imagetomove = "";
    }
    else{
        if(drawflag==false && eraseflag==false && maskflag==false){ 
            try{
                document.getElementById(t.currentTarget.id).style.backgroundColor = "rgb(20,20,20)";
                document.getElementById("canvascontainer").appendChild(document.getElementById("source"+t.currentTarget.id.match(/\d+/)[0]));
            }          
            catch(error){
                document.getElementById("moveimg1").style.backgroundColor = "rgb(20,20,20)";
                document.getElementById("canvascontainer").appendChild(document.getElementById("source"));
            }
            
            moveimgenableflag = !moveimgenableflag;
            try{
                imagetomove = String(t.currentTarget.id.match(/\d+/)[0]);
                comporder.push(t.currentTarget.id.match(/\d+/)[0]);
            }
            catch(error){
                imagetomove = "";
                comporder.push("");
            }
        }
    }
}

function compimage(){
    backup["width"] = document.getElementById("source").width;
    backup["height"] = document.getElementById("source").height;
    backup["left"] = document.getElementById("source").style.left;
    backup["top"] = document.getElementById("source").style.top;
    backup["img"] = document.getElementById("sourceimg").src;
    var order = [""];
    var coordinates = [[parseInt(document.getElementById('source').getBoundingClientRect()["left"]),parseInt(document.getElementById('source').getBoundingClientRect()["top"])]];
    var num = document.getElementById("settings2").children.length - 3;
    document.getElementById("openimgadd2").style.visibility = "hidden";
    document.getElementById("openimgadd").style.visibility = "visible";
    var newel = document.createElement("input");
    newel.id = "openimgadd";
    newel.type = "file";
    newel.onchange =function(e) {
        document.getElementById("settings").style.visibility = "hidden";
        document.getElementById("undo").style.visibility = "hidden";
        var file, img;
        if ((file = this.files[0])) {
            comporder = [];
            document.getElementById("selector").style.visibility = "hidden";
            var num = (document.getElementById("canvascontainer").children.length /2)+1;
            num = String(num);
            document.getElementById("settings2").style.visibility = "visible";
            var newel = document.createElement("div");
            newel.id = "moveimg"+num;
            newel.addEventListener("click",moveimgenable);
            newel.className = "moveimgclass txt";
            newel.style.left = 5+(num-1)*10+"%";
            var newelpar = document.createElement("p");            
            newelpar.innerHTML = "Move Image "+num;
            newelpar.className = "txt";
            newel.append(newelpar);
            document.getElementById("settings2").append(newel);
            newel = document.createElement("img");
            newel.id = "sourceimg"+num;
            newel.style.display = "none";
            document.getElementById("canvascontainer").append(newel);
            newel = document.createElement("canvas");
            newel.id = "source"+num;
            newel.style.position = "fixed";
            newel.style.left = parseInt(document.getElementById("source").style.left) + document.getElementById("source").width + "px";
            newel.style.top = document.getElementById("source").style.top;
            document.getElementById("canvascontainer").append(newel);
            img = new Image();
            img.onload = function() {
                document.getElementById("sourceimg"+num).width = this.width;
                document.getElementById("sourceimg"+num).height = this.height;
                document.getElementById("source"+num).width = this.width;
                document.getElementById("source"+num).height = this.height;
                var canvas = document.getElementById("source"+num);
                var ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                var img = document.getElementById("sourceimg"+num);
                ctx.drawImage(img, 0, 0);
                imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                data = imgData.data;
                pxls = [];
                for (let i = 0; i < data.length; i += 4) {
                    var pixel = [];
                    pixel.push(data[i]);
                    pixel.push(data[i+1]);
                    pixel.push(data[i+2]);
                    pixel.push(data[i+3]);
                    pxls.push(pixel);
                }
                var pxlsarray = [[]];
                for(i = 0;i<pxls.length;i++){
                    pxlsarray[pxlsarray.length-1].push(pxls[i]);
                    if(i<pxls.length-2){
                        if((i+1)%canvas.width==0 && i>canvas.width-10){
                            pxlsarray.push([]);
                        }
                    }
                    
                }
            };
            img.src = URL.createObjectURL(file);
            document.getElementById("sourceimg"+num).src = URL.createObjectURL(file);
        }
        document.getElementById("source"+num).className = "canvas";
        fsimgs[num] = document.getElementById("sourceimg"+num).src;
        document.getElementById("compare").style.left = document.getElementById("source").style.left;
        document.getElementById("compare").style.width = parseInt(document.getElementById("oldimg").width)-parseInt(document.getElementById("oldimg").width)/2 + "px";
        document.getElementById("compare").style.height = document.getElementById("oldimg").style.height;
        document.getElementById("sourceimg").onload = function(){
            document.getElementById("oldimg").width = document.getElementById("sourceimg").width;
            document.getElementById("oldimg").height = document.getElementById("sourceimg").height;
        }
        
    }
    for(let i=1;i<num;i++){
        order.push(String(i+1));
    }
    if(comporder.length>0){
        comporder.reverse();
        order.reverse();
        for(let i=0;i<order.length;i++){
            comporder.push(order[i]);
        }
        order = [];
        for(let i=0;i<comporder.length;i++){
            if(!order.includes(comporder[i])){
                order.push(comporder[i]);
            }
        }
        
    }


    



    var leftest = parseInt(document.getElementById('source').getBoundingClientRect()["left"]);
    var topest = parseInt(document.getElementById('source').getBoundingClientRect()["top"]);
    var rightest = parseInt(document.getElementById('source').getBoundingClientRect()["right"]);
    var bottomest = parseInt(document.getElementById('source').getBoundingClientRect()["bottom"]);
    for(let i =2;i<num+1;i++){
        coordinates.push([parseInt(document.getElementById('source'+i).getBoundingClientRect()["left"]),parseInt(document.getElementById('source'+i).getBoundingClientRect()["top"])])
        if(parseInt(document.getElementById('source'+i).getBoundingClientRect()["left"])<leftest){
            leftest = parseInt(document.getElementById('source'+i).getBoundingClientRect()["left"])
        }
        if(parseInt(document.getElementById('source'+i).getBoundingClientRect()["top"])<topest){
            topest = parseInt(document.getElementById('source'+i).getBoundingClientRect()["top"])
        }
        if(parseInt(document.getElementById('source'+i).getBoundingClientRect()["right"])>rightest){
            rightest = parseInt(document.getElementById('source'+i).getBoundingClientRect()["right"])
        }
        if(parseInt(document.getElementById('source'+i).getBoundingClientRect()["bottom"])>bottomest){
            bottomest = parseInt(document.getElementById('source'+i).getBoundingClientRect()["bottom"])
        }
    }
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");
    canvas.width = rightest-leftest;
    canvas.height = bottomest-topest;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    order.reverse();
    for(let i = 0;i<order.length;i++){
        if(order[i]==""){
            var img = document.getElementById("sourceimg");
            ctx.drawImage(img, coordinates[0][0]-leftest, coordinates[0][1]-topest);
        }
        else{
            img = document.getElementById("sourceimg"+order[i]);
            ctx.drawImage(img, coordinates[parseInt(order[i])-1][0]-leftest, coordinates[parseInt(order[i])-1][1]-topest);
            document.getElementById("sourceimg"+order[i]).remove();
            document.getElementById("source"+order[i]).remove();
            document.getElementById("moveimg"+order[i]).remove();
        }
    }
    document.getElementById("sourceimg").src = canvas.toDataURL();
    imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
    data = imgData.data;
    pxls = [];
    for (let i = 0; i < data.length; i += 4) {
        var pixel = [];
        pixel.push(data[i]);
        pixel.push(data[i+1]);
        pixel.push(data[i+2]);
        pixel.push(data[i+3]);
        pxls.push(pixel);
    }
    var pxlsarray = [[]];
    for(i = 0;i<pxls.length;i++){
        pxlsarray[pxlsarray.length-1].push(pxls[i]);
        if(i<pxls.length-2){
            if((i+1)%canvas.width==0 && i>canvas.width-10){
                pxlsarray.push([]);
            }
        }
        
    }
    savedata["pxlsarray"] = pxlsarray;
    document.getElementById("settings2").style.visibility="hidden";
    document.getElementById("selector").style.visibility = "visible";
    document.getElementById("sourceimg").src = canvas.toDataURL();
    document.getElementById("oldimg").src = document.getElementById("sourceimg").src;
    document.getElementById("sourceimg").onload = function(){
        document.getElementById("oldimg").width = document.getElementById("source").width;
        document.getElementById("oldimg").height = document.getElementById("source").height;
    }
    imagetomove = "";
    fsimgs = {};
    fsimgs["main"] = document.getElementById("sourceimg").src;
    let childs = document.getElementById("settings").children;
    let numoia = 0;
    for (let x = 0;x<childs.length;x++){
        if(childs[x].id=="openimgadd"){
            numoia++;
        }
    }
    numoia-=1;
    for (let x = 0;x<childs.length;x++){
        if(childs[x].id=="openimgadd"){
            if(numoia>0){
                childs[x].remove();
            }
        }
    }
    document.getElementById("settings").style.visibility = "visible";
    document.getElementById("undo").style.visibility = "visible";

}
function moveimg(){    
    if(clickflag && (moveimgenableflag || compareflag)){
        document.getElementById("moveimglistner").removeEventListener("mousemove", imgmover);
        clickflag = !clickflag
    }
    else{   
        document.getElementById("moveimglistner").addEventListener("mousemove", imgmover);
        clickflag = !clickflag
    }
}
function changeselectorsize(evt){
    if(evt.target.id=="hintinp"){
        var elem = evt.target;
        selectorsize = elem.value;
        savedata["boxsz"] = selectorsize;
        if(cropcount==1){
            document.getElementById("selector").style.height = selectorsize+"px";
        }
        else{
            document.getElementById("selector").style.width = selectorsize+"px";
        }
               
    }
    else{
        var elem = document.getElementById("selectorsize");
        selectorsize = elem.value;
        savedata["boxsz"] = selectorsize;
        document.getElementById("selector").style.width = selectorsize+"px";
        document.getElementById("selector").style.height = selectorsize+"px";
    }
}

function savejson(){
    document.getElementById("oldimg").src = document.getElementById("sourceimg").src;
    document.getElementById("sourceimg").onload = function(){
        document.getElementById("oldimg").width = document.getElementById("source").width;
        document.getElementById("oldimg").height = document.getElementById("source").height;
    }
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");
    let tempcanvas = document.createElement("canvas");
    tempcanvas.width = canvas.width+savedata["additionaldims"]["left"]+savedata["additionaldims"]["right"];
    tempcanvas.height = canvas.height+savedata["additionaldims"]["top"]+savedata["additionaldims"]["bottom"];
    document.getElementById("canvascontainer").append(tempcanvas);
    let tempctx = tempcanvas.getContext("2d");
    tempctx.drawImage(canvas, savedata["additionaldims"]["left"], savedata["additionaldims"]["top"]);    
    document.getElementById("oldimg").src = tempcanvas.toDataURL();
    tempcanvas.remove();
    if(routinerecflag){
        let altdata = {...savedata};
        altdata["pxlsarray"] = "";
        altdata["mskarray"] = "";
        routine[Object.keys(routine).length] = {
            "savedata":altdata,
            "selectorsize":selectorsize,
            "taesd":taesd,
            "img2img":img2img,
            "selwf":selwf,
            "selmod":selmod,
            "sellora":sellora,
            "params":params,
            "changedparams":changedparams,
            "boxleft":boxleft,
            "boxtop":boxtop,
            "canvasleft":document.getElementById("source").style.left,
            "canvastop":document.getElementById("source").style.top,
            "canvaswidth":document.getElementById("source").width,
            "canvasheight":document.getElementById("source").height,

        };
    }
    if(true){
        var responseClone;   
        var canvas = document.getElementById("source");
        var ctx = canvas.getContext("2d");
        imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var pxlsarray = [[]];
        for(i = 0;i<pxls.length;i++){
            pxlsarray[pxlsarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%canvas.width==0 && i>canvas.width-10){
                    pxlsarray.push([]);
                }
            }
            
        }
        savedata["pxlsarray"] = pxlsarray;
        
    }
    saved(savedata);
    
}


function reset(){
    var selec = document.getElementById("selector");
    selec.style.left = mousex+"px";
    selec.style.top = mousey+"px";
}

function cropimg(){
    backup["width"] = document.getElementById("source").width;
    backup["height"] = document.getElementById("source").height;
    backup["left"] = document.getElementById("source").style.left;
    backup["top"] = document.getElementById("source").style.top;
    backup["img"] = document.getElementById("sourceimg").src;
    cropflag = true;
    document.getElementById("hint").style.visibility = "visible";
    document.getElementById("selector").style.border = "2px solid orange";
    document.getElementById("settings").style.visibility = "hidden";
    document.getElementById("undo").style.visibility = "hidden";
    savedata["crpdims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
    ll = true;
    lr = true;
    lt = true;
    lb = true;
    lockflag = true;
    document.getElementById("saveexit").style.visibility = "hidden";
    document.getElementById("hinttext").innerHTML = "Horizontal: ";
    document.getElementById("hintinp").value = selectorsize;

}

function addText(){
    document.getElementById("gligenmain").style.visibility = "hidden";
    let canvas = document.createElement("canvas");
    canvas.width = document.getElementById("source").width;
    canvas.height = document.getElementById("source").height;
    canvas.style.left = document.getElementById("source").style.left;
    canvas.style.top = document.getElementById("source").style.top;
    canvas.style.zIndex = "1";
    canvas.style.position = "fixed";
    canvas.id = "gligencanvas";
    document.getElementById("canvascontainer").append(canvas);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(document.getElementById("source"), 0, 0);
    textflag = true;
    document.getElementById("gligencont").style.visibility = "visible";
    document.getElementById("textinput").style.visibility = "visible";
    document.getElementById("hint").style.visibility = "visible";
    document.getElementById("selector").style.border = "2px solid blue";
    document.getElementById("settings").style.visibility = "hidden";
    document.getElementById("undo").style.visibility = "hidden";
    savedata["crpdims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
    ll = true;
    lr = true;
    lt = true;
    lb = true;
    lockflag = true;
    document.getElementById("saveexit").style.visibility = "hidden";
    document.getElementById("hinttext").innerHTML = "Horizontal: ";
    document.getElementById("hintinp").value = selectorsize;
    document.getElementById("source").style.opacity = "0";

}


function compare(){
    if(!moveimgenableflag){
        compareflag = !compareflag;
        if(!compareflag){
            document.getElementById("compare").style.visibility = "hidden";
            document.getElementById("selector").style.visibility = "visible";        
            document.getElementById("compbtn").style.backgroundColor = "rgb(80, 80, 80)";
        }
        else{
            document.getElementById("compare").style.visibility = "visible";
            document.getElementById("selector").style.visibility = "hidden";
            document.getElementById("compbtn").style.backgroundColor = "rgb(20,20,20)";  
        }
    }
}

function resetref(){
    savedata["crpdimsref"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
}

function fit(){
    var canvas = document.getElementById("source"+imagetomove);
    var ctx = canvas.getContext("2d");
    if(parseFloat(document.getElementById("source"+imagetomove).width)>parseFloat(document.getElementById("source"+imagetomove).height)){
        let r =  parseFloat(document.getElementById("source"+imagetomove).width)/parseFloat(document.getElementById("source"+imagetomove).height);
        document.getElementById("source"+imagetomove).width = 512;
        document.getElementById("source"+imagetomove).height = 512/r;
    }
    else if(parseFloat(document.getElementById("source"+imagetomove).width)<parseFloat(document.getElementById("source"+imagetomove).height)){
        let r =  parseFloat(document.getElementById("source"+imagetomove).height)/parseFloat(document.getElementById("source"+imagetomove).width);
        document.getElementById("source"+imagetomove).width = 512/r;
        document.getElementById("source"+imagetomove).height = 512;
    }
    else{
        document.getElementById("source"+imagetomove).width = 512;
        document.getElementById("source"+imagetomove).height = 512;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image;
    img.src = fsimgs["main"];  
    img.onload = function(){
        ctx.drawImage(img, 0, 0, img.width,img.height,0, 0, canvas.width, canvas.height);
        document.getElementById("sourceimg"+imagetomove).src = canvas.toDataURL();
        document.getElementById("oldimg").width = canvas.width;
        document.getElementById("oldimg").height = canvas.height;
        document.getElementById("oldimg").src = canvas.toDataURL();

    }
}

function uploadnewimage(){
    document.getElementById("uploadcontainer").style.visibility = "visible";
    var file, img;   
    if ((file = this.files[0])) {
        img = new Image();
        img.onload = function() {
            document.getElementById("sourceimg").width = this.width;
            document.getElementById("sourceimg").height = this.height;
            document.getElementById("source").width = this.width;
            document.getElementById("source").height = this.height;
            var canvas = document.getElementById("source");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var img = document.getElementById("sourceimg");
            ctx.drawImage(img, 0, 0);
            imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
            data = imgData.data;
            pxls = [];
            for (let i = 0; i < data.length; i += 4) {
                var pixel = [];
                pixel.push(data[i]);
                pixel.push(data[i+1]);
                pixel.push(data[i+2]);
                pixel.push(data[i+3]);
                pxls.push(pixel);
            }
            var pxlsarray = [[]];
            for(i = 0;i<pxls.length;i++){
                pxlsarray[pxlsarray.length-1].push(pxls[i]);
                if(i<pxls.length-2){
                    if((i+1)%canvas.width==0 && i>canvas.width-10){
                        pxlsarray.push([]);
                    }
                }
                
            }
            savedata["pxlsarray"] = pxlsarray;
            backup["img"] = document.getElementById("sourceimg").src;
        };
        img.src = URL.createObjectURL(file);
        document.getElementById("sourceimg").src = URL.createObjectURL(file);
        document.getElementById("oldimg").src = URL.createObjectURL(file);
        document.getElementById("uploadcontainer").style.visibility = "hidden";
        


    }
    fsimgs["main"] = document.getElementById("sourceimg").src;
}


function expandDrawer(){
    drawerflag = !drawerflag;
    if(drawerflag){
        fetch('http://'+host+':'+port+'/getImagesPaths'
        ).then(function (response) {
            responseClone = response.clone();
            return response.json();
        })
        .then(data => {
            let images = data["imagesgen"];   
            for(let i =images.length;i>0;i--){
                document.getElementById("img"+(i)).src = images[i-1];
            }
            
        });
        document.getElementById("drawer").style.left = "75%";
    }
    else{
        document.getElementById("drawer").style.left = "99%";
    }
}

function openDrawerImage(evt){
    
    document.getElementById("settings").style.visibility = "hidden";
    document.getElementById("undo").style.visibility = "hidden";
    var file, img;
    comporder = [];
    document.getElementById("selector").style.visibility = "hidden";
    var num = (document.getElementById("canvascontainer").children.length /2)+1;
    num = String(num);
    document.getElementById("settings2").style.visibility = "visible";
    document.getElementById("openimgadd").style.visibility = "hidden";
    if(!document.getElementById("openimgadd2")){
        var newel = document.createElement("input");
        newel.id = "openimgadd2";
        newel.type = "file";
        newel.onchange =function(e) {
            var file, img;
            if ((file = this.files[0])) {
                comporder = [];
                document.getElementById("selector").style.visibility = "hidden";
                var num = (document.getElementById("canvascontainer").children.length /2)+1;
                num = String(num);
                document.getElementById("settings2").style.visibility = "visible";
                var newel = document.createElement("div");
                newel.id = "moveimg"+num;
                newel.addEventListener("click",moveimgenable);
                newel.className = "moveimgclass txt";
                newel.style.left = 5+(num-1)*10+"%";
                var newelpar = document.createElement("p");            
                newelpar.innerHTML = "Move Image "+num;
                newelpar.className = "txt";
                newel.append(newelpar);
                document.getElementById("settings2").append(newel);
                newel = document.createElement("img");
                newel.id = "sourceimg"+num;
                newel.style.display = "none";
                document.getElementById("canvascontainer").append(newel);
                newel = document.createElement("canvas");
                newel.id = "source"+num;
                newel.className = "canvas";
                newel.style.position = "fixed";
                newel.style.left = parseInt(document.getElementById("source").style.left) + document.getElementById("source").width + "px";
                newel.style.top = document.getElementById("source").style.top;
                document.getElementById("canvascontainer").append(newel);
                img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = function() {
                    document.getElementById("sourceimg"+num).width = this.width;
                    document.getElementById("sourceimg"+num).height = this.height;
                    document.getElementById("source"+num).width = this.width;
                    document.getElementById("source"+num).height = this.height;
                    var canvas = document.getElementById("source"+num);
                    var ctx = canvas.getContext("2d");
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    var img = document.getElementById("sourceimg"+num);
                    ctx.drawImage(img, 0, 0);
                    imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
                    data = imgData.data;
                    pxls = [];
                    for (let i = 0; i < data.length; i += 4) {
                        var pixel = [];
                        pixel.push(data[i]);
                        pixel.push(data[i+1]);
                        pixel.push(data[i+2]);
                        pixel.push(data[i+3]);
                        pxls.push(pixel);
                    }
                    var pxlsarray = [[]];
                    for(i = 0;i<pxls.length;i++){
                        pxlsarray[pxlsarray.length-1].push(pxls[i]);
                        if(i<pxls.length-2){
                            if((i+1)%canvas.width==0 && i>canvas.width-10){
                                pxlsarray.push([]);
                            }
                        }
                        
                    }
                };
                document.getElementById("sourceimg"+num).src = URL.createObjectURL(file);
                fsimgs[num] = document.getElementById("sourceimg"+num).src;
            }
            
        }
        document.getElementById("settings2").append(newel);
    }
    document.getElementById("openimgadd2").style.visibility = "visible";
    var newel = document.createElement("div");
    newel.id = "moveimg"+num;
    newel.addEventListener("click",moveimgenable);
    newel.className = "moveimgclass txt";
    newel.style.left = 5+(num-1)*10+"%";
    var newelpar = document.createElement("p");            
    newelpar.innerHTML = "Move Image "+num;
    newelpar.className = "txt";
    newel.append(newelpar);
    document.getElementById("settings2").append(newel);
    newel = document.createElement("img");
    newel.id = "sourceimg"+num;
    newel.style.display = "none";
    document.getElementById("canvascontainer").append(newel);
    newel = document.createElement("canvas");
    newel.id = "source"+num;
    newel.className = "canvas";
    newel.style.position = "fixed";
    newel.style.left = parseInt(document.getElementById("source").style.left) + document.getElementById("source").width + "px";
    newel.style.top = document.getElementById("source").style.top;
    document.getElementById("canvascontainer").append(newel);
    img = new Image();
    img.onload = function() {
        document.getElementById("sourceimg"+num).width = this.width;
        document.getElementById("sourceimg"+num).height = this.height;
        document.getElementById("source"+num).width = this.width;
        document.getElementById("source"+num).height = this.height;
        var canvas = document.getElementById("source"+num);
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var img = document.getElementById("sourceimg"+num);
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(0, 0, canvas.width,canvas.height);
        data = imgData.data;
        pxls = [];
        for (let i = 0; i < data.length; i += 4) {
            var pixel = [];
            pixel.push(data[i]);
            pixel.push(data[i+1]);
            pixel.push(data[i+2]);
            pixel.push(data[i+3]);
            pxls.push(pixel);
        }
        var pxlsarray = [[]];
        for(i = 0;i<pxls.length;i++){
            pxlsarray[pxlsarray.length-1].push(pxls[i]);
            if(i<pxls.length-2){
                if((i+1)%canvas.width==0 && i>canvas.width-10){
                    pxlsarray.push([]);
                }
            }
            
        }
    };
    img.src = evt.target.src;
    document.getElementById("sourceimg"+num).src = evt.target.src;
    fsimgs[num] = document.getElementById("sourceimg"+num).src;
}

function setGligen(){
    document.getElementById("gligenmain").style.visibility = "visible";
    if(Object.keys(gligenparams).length>0){
        delete gligenparams["main"];
    }
    let canvas = document.createElement("canvas");
    canvas.width = document.getElementById("source").width;
    canvas.height = document.getElementById("source").height;
    canvas.style.left = document.getElementById("source").style.left;
    canvas.style.top = document.getElementById("source").style.top;
    canvas.style.zIndex = "1";
    canvas.style.position = "fixed";
    canvas.id = "gligencanvas";
    document.getElementById("canvascontainer").append(canvas);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(document.getElementById("source"), 0, 0);
    for(let i = 0;i<Object.keys(gligenparams).length;i++){
        let el = document.createElement("div");
        el.id = Object.keys(gligenparams)[i];
        el.className = "gligcond";
        el.innerHTML = gligenparams[Object.keys(gligenparams)[i]]["text"];
        el.addEventListener("click", function(e){
            document.getElementById("gligencanvas").remove();
            canvas = document.createElement("canvas");
            canvas.width = document.getElementById("source").width;
            canvas.height = document.getElementById("source").height;
            canvas.style.left = document.getElementById("source").style.left;
            canvas.style.top = document.getElementById("source").style.top;
            canvas.style.zIndex = "1";
            canvas.style.position = "fixed";
            canvas.id = "gligencanvas";
            document.getElementById("canvascontainer").append(canvas);
            let ctx = canvas.getContext("2d");
            ctx.drawImage(document.getElementById("source"), 0, 0);
            delete gligenparams[e.target.id];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(document.getElementById("source"), 0, 0);
            for(let i = 0;i<Object.keys(gligenparams).length;i++){
                ctx.rect(gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"], gligenparams[Object.keys(gligenparams)[i]]["width"], gligenparams[Object.keys(gligenparams)[i]]["height"]);
                ctx.strokeStyle = "red";
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.font = "25px Arial";
                ctx.fillStyle = "red";
                ctx.fillText(gligenparams[Object.keys(gligenparams)[i]]["text"],gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"]+20);                     
            }
            this.remove();
        });
        document.getElementById("gligencont").append(el);
        ctx.rect(gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"], gligenparams[Object.keys(gligenparams)[i]]["width"], gligenparams[Object.keys(gligenparams)[i]]["height"]);
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.font = "15px Arial";
        ctx.fillStyle = "red";
        ctx.fillText(gligenparams[Object.keys(gligenparams)[i]]["text"],gligenparams[Object.keys(gligenparams)[i]]["x"], gligenparams[Object.keys(gligenparams)[i]]["y"]+20);
    }
    gligenflag = true;
    gligenbaseimage = document.getElementById("source");
    document.getElementById("gligencont").style.visibility = "visible";
    document.getElementById("textinput").style.visibility = "visible";
    document.getElementById("hint").style.visibility = "visible";
    document.getElementById("selector").style.border = "2px solid orange";
    document.getElementById("settings").style.visibility = "hidden";
    document.getElementById("undo").style.visibility = "hidden";
    savedata["crpdims"] = {
        "left":0,
        "top": 0,
        "right":0,
        "bottom":0
    };
    ll = true;
    lr = true;
    lt = true;
    lb = true;
    lockflag = true;
    document.getElementById("saveexit").style.visibility = "hidden";
    document.getElementById("hinttext").innerHTML = "Horizontal: ";
    document.getElementById("hintinp").value = selectorsize;
    document.getElementById("source").style.opacity = "0";
}

function confirmGligen(){
    document.getElementById("gligenmain").style.visibility = "hidden";
    document.getElementById("source").style.opacity = "1";
    if(gligenflag){
        document.getElementById("gligencanvas").remove();
        for(let i = 0;i<Object.keys(gligenparams).length;i++){
            if(Object.keys(gligenparams)[i].includes("gligen")){
                document.getElementById(Object.keys(gligenparams)[i]).remove();
            }
        }
        d = {
            "text":document.getElementById("gligenmain").value
        }
        gligenparams["main"]=d;        
        document.getElementById("gligencont").style.visibility = "hidden";
        gligenflag = false;
        gligenbaseimage = "";
        document.getElementById("selector").style.border = "2px solid green";
        document.getElementById("textinput").style.visibility = "hidden";
        document.getElementById("settings").style.visibility = "visible";
        document.getElementById("hint").style.visibility = "hidden";
        selectorsize = 512;
        savedata["boxsz"] = selectorsize;
        document.getElementById("lockbox").style.background =  "rgb(20,20,20)";
        document.getElementById("selector").style.width = selectorsize+"px";
        document.getElementById("selector").style.height = selectorsize+"px";
        document.getElementById("selector").style.left = document.getElementById("source").style.left;
        document.getElementById("selector").style.top = document.getElementById("source").style.top;
    }
    else{
        for(let i = 0;i<Object.keys(textadded).length;i++){
            document.getElementById(Object.keys(textadded)[i]).remove();
        };
        textadded = {};
        textnum = 0;
        let canvas = document.getElementById("source");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(document.getElementById("gligencanvas"), 0, 0);
        document.getElementById("source").style.opacity = "1";
        document.getElementById("gligencanvas").remove();
        document.getElementById("gligencont").style.visibility = "hidden";
        document.getElementById("settings").style.visibility = "visible";
        document.getElementById("undo").style.visibility = "visible";
        document.getElementById("hint").style.visibility = "hidden";
        cropcount = 0;
        document.getElementById("lockbox").style.background = "rgb(80, 80, 80)";
        lockflag = false;
        ll = false;
        lr = false;
        lt = false;
        lb = false;
        textflag = false;
        document.getElementById("addtext").style.backgroundColor = "rgb(80, 80, 80)";
        document.getElementById("selector").style.border = "2px solid green";
        document.getElementById("textinput").style.visibility = "hidden";
        changeselectorsize(event);
    }
}

function emptyCanvas(){
    backup["width"] = document.getElementById("source").width;
    backup["height"] = document.getElementById("source").height;
    backup["left"] = document.getElementById("source").style.left;
    backup["top"] = document.getElementById("source").style.top;
    backup["img"] = document.getElementById("sourceimg").src;
    let canvas = document.getElementById("source");
    let ctx = canvas.getContext("2d");
    ctx.rect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = document.getElementById("clr").value+parseInt(document.getElementById("inprange").value).toString(16);
    ctx.fill();
    document.getElementById("undo").style.visibility = "visible";
    document.getElementById("sourceimg").src = canvas.toDataURL();
    fsimgs["main"] = document.getElementById("sourceimg").src
}

function printLetter(evt){
    if(document.getElementById("uploadcontainer").style.visibility=="hidden" && document.getElementById("stack").style.visibility=="hidden" && !gligenflag && !textflag){
        switch(evt.code){
            case "KeyM":
                if(!gligenflag && !cropflag && !textflag && !drawflag && !eraseflag && !setref && !maskflag){
                    moveimgenablefirst();
                }
                break;
            case "KeyS":
                if(!gligenflag && !cropflag && !textflag && !drawflag && !eraseflag && !maskflag){
                    setreftoggle();
                }
                break;
            case "KeyR":
                resetref();
                break;
            case "KeyC":
                if(!gligenflag && !textflag && !drawflag && !eraseflag && !setref && !maskflag){
                    cropimg();
                }
                break;
            case "KeyO":
                if(!gligenflag && !cropflag && !textflag && !drawflag && !eraseflag && !setref && !maskflag){
                    compare();
                }
                break;
            case "KeyE":
                if(!gligenflag && !cropflag && !textflag && !drawflag && !setref && !maskflag){
                    erasemodeon();
                }
                break;
            case "KeyK":
                if(!gligenflag && !cropflag && !textflag && !drawflag && !setref && !eraseflag){
                    maskmodeon();
                }
                break;
            case "KeyD":
                if(!gligenflag && !cropflag && !textflag  && !eraseflag && !setref && !maskflag){
                    drawmodeon();
                }
                break;
            case "KeyF":
                fit();
                break;
            case "KeyN":
                uploadnewimage();
                break;
            case "KeyT":
                if(!gligenflag && !cropflag && !drawflag && !eraseflag && !setref && !maskflag){
                    addText();
                }
                break;
            case "KeyG":
                if(!cropflag && !textflag && !drawflag && !eraseflag && !setref && !maskflag){
                    gridDraw();
                }
                break;
            case "KeyL":
                if(!cropflag && !textflag && !drawflag && !eraseflag && !setref && !maskflag){
                    setGligen();
                }
                break;
            case "KeyB":
                emptyCanvas();
                break;
            case "KeyU":
                if(document.getElementById("saveexit").style.visibility=="visible"){
                    undoimg();
                }
                break;
            case "ArrowUp":
                locktop();
                break;
            case "ArrowDown":
                lockbottom();
                break;
            case "ArrowLeft":
                lockleft();
                break;
            case "ArrowRight":
                lockright();
                break;
            case "Enter":
                if(document.getElementById("saveexit").style.visibility=="visible"){
                    savejson();
                }
                break;
            case "ShiftRight":
                lockbox();
                break;
            case "Space":
                resetimg();
                break;
            case "KeyI":
                saveimg();
                break;
            case "KeyH":
                if(document.getElementById("settings").style.visibility=="hidden"){
                    document.getElementById("settings").style.visibility="visible";
                    document.getElementById("undo").style.visibility="visible";
                    document.getElementById("saveexit").style.visibility="visible";
                }
                else{
                    document.getElementById("settings").style.visibility="hidden";
                    document.getElementById("undo").style.visibility="hidden";
                    document.getElementById("saveexit").style.visibility="hidden";
                }
                break;
        }
    }  

    else if(document.getElementById("uploadcontainer").style.visibility=="hidden" && gligenflag && document.activeElement.id!="gligenmain"){
        if(evt.code == "Space"){
            document.getElementById("textinp").value+=" ";
        }
        else if(evt.code.includes("Key")){
            document.getElementById("textinp").value+=evt.code.slice(-1).toLowerCase();
        }
        else if(evt.code == "Backspace"){
            document.getElementById("textinp").value = document.getElementById("textinp").value.substring(0,document.getElementById("textinp").value.length-1);
        }
        else if(evt.code == "Delete"){
            document.getElementById("textinp").value = "";
        }
        
    }
}

function stackNodes(){
    fetch('http://'+host+':'+port+'/getnodes', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"wf":selwf})
    })
    .then(function (response){
        return response.json();
    })
    .then(data=>{
        let cont = document.getElementById("stack");
        while (cont.firstChild) {
            cont.removeChild(cont.lastChild);
        }
        let newel = document.createElement("div");
        newel.className = "stackbar";
        newel.onclick = function(){returnToCanvas();}
        newel.innerHTML = "...";
        cont.append(newel);
        let nodelinks = {};
        let v = Object.keys(data["prompt_workflow"]);
        for(let i=0; i<v.length;i++){
            nodelinks[v[i]] = {};
            nodelinks[v[i]]["ins"] = [];
            nodelinks[v[i]]["outs"] = [];
        }
        for(let i=0; i<v.length;i++){
            let x = Object.keys(data["prompt_workflow"][v[i]]["inputs"]);
            for(let j=0; j<x.length;j++){
                if(Array.isArray(data["prompt_workflow"][v[i]]["inputs"][x[j]])){
                    nodelinks[data["prompt_workflow"][v[i]]["inputs"][x[j]][0]]["outs"].push(v[i]);
                    nodelinks[v[i]]["ins"].push(data["prompt_workflow"][v[i]]["inputs"][x[j]][0]);
                }
            }
        }
        for(let i=0; i<v.length;i++){
            let node = document.createElement("div");
            node.className = "node";
            node.id = "node" + v[i];
            document.getElementById("stack").append(node);
            let nodetitle = document.createElement("div");
            nodetitle.className = "nodetitle";
            if(Object.keys(data["prompt_workflow"][v[i]]).includes("_meta")){
                nodetitle.innerHTML = data["prompt_workflow"][v[i]]["_meta"]["title"]+" ("+v[i]+")";
            }
            else{
                nodetitle.innerHTML = data["prompt_workflow"][v[i]]["class_type"]+" ("+v[i]+")";
            }
            nodetitle.id = "nodet" + v[i];
            nodetitle.addEventListener("click",function(event){
                let cont = document.getElementById("stack");
                for(let x=0;x<cont.children.length;x++){
                    cont.children[x].style.border = "2px solid transparent";
                    for(let y=0;y<nodelinks[event.target.id.slice(5,event.target.id.length)]["ins"].length;y++){
                        if(cont.children[x].id=="node"+nodelinks[event.target.id.slice(5,event.target.id.length)]["ins"][y]){
                            cont.children[x].style.border = "2px solid green";
                        }
                    }
                    for(let y=0;y<nodelinks[event.target.id.slice(5,event.target.id.length)]["outs"].length;y++){
                        if(cont.children[x].id=="node"+nodelinks[event.target.id.slice(5,event.target.id.length)]["outs"][y]){
                            cont.children[x].style.border = "2px solid red";
                        }
                    }

                }
                document.getElementById("node"+event.target.id.slice(5,event.target.id.length)).style.border = "2px solid white";
            });
            node.append(nodetitle);

            let nodemain = document.createElement("div");
            nodemain.className = "nodemain";
            node.append(nodemain);

            let nodein = document.createElement("div");
            nodein.className = "nodein";
            nodemain.append(nodein);
            for(let j=0; j<nodelinks[v[i]]["ins"].length;j++){
                let inputnode = document.createElement("div");
                inputnode.innerHTML = nodelinks[v[i]]["ins"][j];
                nodein.append(inputnode);
            }

            let nodeinps = document.createElement("div");
            nodeinps.className = "nodeinps";
            nodemain.append(nodeinps);
            for(let j=0;j<Object.keys(data["prompt_workflow"][v[i]]["inputs"]).length;j++){
                if(!(Array.isArray(data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]]))){
                    let inputvarcont = document.createElement("div");
                    inputvarcont.className = "inputvarcont";
                    nodeinps.append(inputvarcont);

                    let inputtitle = document.createElement("div");
                    inputtitle.innerHTML = Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j];
                    inputtitle.className = "inputtitle";
                    inputvarcont.append(inputtitle);
                    if(Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j].includes("model_name") || Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j].includes("ckpt_name")){
                        let cont = document.createElement("div");
                        cont.id = "modelsdropdown"+v[i];
                        cont.className = "dropdown";
                        inputvarcont.append(cont);
                        let btn = document.createElement("button");
                        btn.className = "dropbtn";
                        btn.innerHTML = data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]];
                        btn.id = "modelbutton"+v[i];
                        cont.append(btn);
                        let drp = document.createElement("div");
                        drp.className = "dropdown-content";
                        drp.id = "modelscont"+v[i];
                        cont.append(drp);
                        grabwfsmodels(id=v[i],paramsdata=data,j=j,addtype="model");
                        
                    }
                    else if(Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j].includes("lora_name")){
                        let cont = document.createElement("div");
                        cont.id = "lorasdropdown"+v[i];
                        cont.className = "dropdown";
                        inputvarcont.append(cont);
                        let btn = document.createElement("button");
                        btn.className = "dropbtn";
                        btn.innerHTML = data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]];
                        btn.id = "lorabutton"+v[i];
                        cont.append(btn);
                        let drp = document.createElement("div");
                        drp.className = "dropdown-content";
                        drp.id = "lorascont"+v[i];
                        cont.append(drp);
                        grabwfsmodels(id=v[i],paramsdata=data,j=j,addtype="lora");
                        
                    }

                    else{
                        let inputvar = document.createElement("input");
                        inputvar.placeholder = data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]];
                        inputvar.value = data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]];
                        inputvar.className = "inputvar";
                        inputvar.type = typeof(data["prompt_workflow"][v[i]]["inputs"][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]]);
                        inputvar.addEventListener("change",function(event){
                            if(changedparams[v[i]]==undefined){
                                changedparams[v[i]] = {};
                            }
                            changedparams[v[i]][Object.keys(data["prompt_workflow"][v[i]]["inputs"])[j]] = inputvar.value;
                        });
                        inputvarcont.append(inputvar);
                    }
                }
            }
            

            let nodeout = document.createElement("div");
            nodeout.className = "nodeout";
            nodemain.append(nodeout);
            for(let j =0;j<nodelinks[v[i]]["outs"].length;j++){
                let outputnode = document.createElement("div");
                outputnode.innerHTML = nodelinks[v[i]]["outs"][j];
                nodeout.append(outputnode);
            }

        }
    });
}

function showStack(){
    if(selwf!=""){
        document.getElementById("stack").style.visibility = "visible";
        stackNodes();
    }
}

function returnToCanvas(){
    document.getElementById("stack").style.visibility = "hidden";
}


function gridDraw(){
    if(grid){
        grid = false;
        gridpoints = [];
        document.getElementById('grid').style.visibility = "hidden";
    }
    else{
        grid = true;
        gridpoints = [];
        document.getElementById('grid').style.visibility = "visible";
        var can = document.getElementById('grid');
        can.width = screen.availWidth;
        can.height = screen.availHeight;
        var ctx = can.getContext('2d');
        ctx.clearRect(0,0,can.width,can.height);

        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        let n = gridsize;
        let nx = Math.floor(screen.availWidth/n);
        let ny = Math.floor(screen.availHeight/n);
        gridpoints.push([0,0]);
        for(let i =0;i<nx;i++){
            for(let j =0;j<nx;j++){
                var grad= ctx.createLinearGradient(i*n, j*n, i*n, n*(j+1));
                grad.addColorStop(0, "rgb(125,125,125)");
                grad.addColorStop(0.5, "black");
                grad.addColorStop(1, "rgb(125,125,125)");
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(i*n,j*n);
                ctx.lineTo(i*n,n*(j+1));
                ctx.stroke();
                gridpoints.push([i*n,n*(j+1)]);
            }
        }
        for(let i =0;i<nx;i++){
            for(let j =0;j<nx;j++){
                var grad= ctx.createLinearGradient(i*n,  j*n,(i+1)*n, j*n);
                grad.addColorStop(0, "rgb(125,125,125)");
                grad.addColorStop(0.5, "black");
                grad.addColorStop(1, "rgb(125,125,125)");
                ctx.strokeStyle = grad;
                ctx.beginPath();
                ctx.moveTo(i*n,j*n);
                ctx.lineTo((i+1)*n,n*j);
                ctx.stroke();
            }
        }
    }

}

function setGridSize(event){
    gridsize = event.target.value;
}

function maskreset(){
    savedata["mskarray"] = "";
}

function auraAnimate(n,dir="up",clrs=[[255,0,0],[0,255,255],[0,255,0],[0,0,255],[255,0,255],[["up","down","down"],["down","up","up"],["down","up","down"],["down","down","up"],["up","down","up"]]]){
    let el = document.getElementById("aura");
    for(let i = 0;i<clrs.length;i++){
        for(let j =0;j<3;j++){
            if(clrs[i][j]>-1){
                if(clrs[i][j]>=255){
                    clrs[i][j]-=1;
                    clrs[5][i][j] = "down";
                }
                else if(clrs[i][j]<=0){
                    clrs[i][j]+=1;
                    clrs[5][i][j] = "up";
                }
                else{
                    if(clrs[5][i][j] == "down"){
                        clrs[i][j]-=1;
                    }
                    else{
                        clrs[i][j]+=1;
                    }
                }
            }
        }
    }
    el.style.filter = "blur("+n+"px)";
    el.style.background = "linear-gradient(to left,"+"rgb("+clrs[0][0]+","+clrs[0][1]+","+clrs[0][2]+")"+","+"rgb("+clrs[1][0]+","+clrs[1][1]+","+clrs[1][2]+")"+","+"rgb("+clrs[2][0]+","+clrs[2][1]+","+clrs[2][2]+")"+","+"rgb("+clrs[3][0]+","+clrs[3][1]+","+clrs[3][2]+")"+","+"rgb("+clrs[4][0]+","+clrs[4][1]+","+clrs[4][2]+")"+")";
    if(n>300){
        dir="down";
    }
    else if(n<100){
        dir="up";
    }
    if(generating){
        if(dir=="up"){
            n+=10;
            setTimeout(() => {
                auraAnimate(n,dir="up",clrs);
            }, 50);
        }
        else if(dir=="down"){
            n-=10;
            setTimeout(() => {
                auraAnimate(n,dir="down",clrs);
            }, 50);
        }
    }
}

function setImageWidth(e){
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d"); 
    document.getElementById("source").width = e.target.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image;
    if(imagetomove==""){
        img.src = fsimgs["main"];
    }
    else{
        img.src = fsimgs[imagetomove];
    }
    
    img.onload = function(){
        ctx.drawImage(img, 0, 0, img.width,img.height,0, 0, canvas.width, canvas.height);
        document.getElementById("sourceimg"+imagetomove).src = canvas.toDataURL();
        document.getElementById("oldimg").width = canvas.width;
        document.getElementById("oldimg").height = canvas.height;
        document.getElementById("oldimg").src = canvas.toDataURL();

    }
    e.target.value = "";
}

function setImageHeight(e){
    var canvas = document.getElementById("source");
    var ctx = canvas.getContext("2d");  
    document.getElementById("source").height = e.target.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image;
    if(imagetomove==""){
        img.src = fsimgs["main"];
    }
    else{
        img.src = fsimgs[imagetomove];
    }
    
    img.onload = function(){
        ctx.drawImage(img, 0, 0, img.width,img.height,0, 0, canvas.width, canvas.height);
        document.getElementById("sourceimg"+imagetomove).src = canvas.toDataURL();
        document.getElementById("oldimg").width = canvas.width;
        document.getElementById("oldimg").height = canvas.height;
        document.getElementById("oldimg").src = canvas.toDataURL();

    }
    e.target.value = "";
}

function setImageOpacity(e){
    var c = document.getElementById("source");
    var ctx = c.getContext("2d");  
    var imgData = ctx.getImageData(0,0,c.width,c.height);
    var data = imgData.data;
    var pxls = [];
    for (let i = 0; i < data.length; i += 4) {
        data[i + 3] = parseInt(e.target.value); 
    }
    ctx.putImageData(imgData,0,0);
    document.getElementById("sourceimg").src = c.toDataURL();
    fsimgs["main"] = document.getElementById("sourceimg").src;
    e.target.value = "";
}
