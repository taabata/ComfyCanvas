from flask import Flask, render_template,request, send_from_directory
from urllib import parse
from urllib import request as rq
import webbrowser
import os,base64,io, time, random
from PIL import Image, ImageFilter, ImageOps
try:
	from signal import SIGKILL
except:
	from signal import SIGABRT
import json, socket, argparse

def stopprocess():
    pid = os.getpid()
    try:
        os.kill(int(pid), SIGKILL)
    except:
        os.kill(int(pid), SIGABRT)
    return "none"
from pathlib import Path
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument("--canvasport", default="5000")
parser.add_argument("--listen", type=str, default="127.0.0.1", metavar="IP", nargs="?", const="0.0.0.0,::", help="Specify the IP address to listen on (default: 127.0.0.1). You can give a list of ip addresses by separating them with a comma like: 127.2.2.2,127.3.3.3 If --listen is provided without an argument, it defaults to 0.0.0.0,:: (listens on all ipv4 and ipv6)")
args = parser.parse_args()

ip = ""
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()

tt = ""
imagesgen = []
genflag = False
sharedata = {
    "savedata":"",
    "imgs":{}
}

app = Flask(__name__)

image = ""

bs = 512

@app.route("/")
def index():
    return render_template('index.html',byte_im="",w="",h="",bs=bs,host=args.listen,port=args.canvasport)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route("/grabwfsmodels",methods=['GET', 'POST','DELETE'])
def grabwfsmodels():
    models = ["Diffusers Models"]
    path = Path('../../models/diffusers')
    diffusers = [i for i in sorted(os.listdir(path)) if os.path.isdir(os.path.join(path,i))]
    models+=diffusers
    models+=["Checkpoints"]
    path = Path('../../models/checkpoints')
    ckpts = [i for i in sorted(os.listdir(path)) if i.endswith((".safetensors", ".ckpt"))]
    models += ckpts
    models+=["Unets"]
    path = Path('../../models/unet')
    unets = [i for i in sorted(os.listdir(path)) if i.endswith((".safetensors", ".ckpt",".gguf"))]
    models+=unets
    path = Path('./workflows')
    wfs = sorted(os.listdir(path))
    wfs = [i.replace(".json","") for i in wfs]
    path = Path('../../models/loras')
    loras = [i for i in sorted(os.listdir(path)) if i.endswith((".safetensors"))]
    return{"models":models,"wfs":wfs,"loras":loras}

@app.route("/cancelgen",methods=['GET', 'POST','DELETE'])
def cancelgen():
    global genflag
    genflag = True
    req =  rq.Request(f"http://{args.listen}:8188/interrupt",data={})
    rq.urlopen(req)
    return{}

@app.route("/saveimg",methods=['GET', 'POST','DELETE'])
def saveimg():
    pixels = request.json["pixels"]
    if pixels != "":
        for i in range(0,len(pixels)):
            for j in range(0,len(pixels[i])):
                pixels[i][j] = tuple(pixels[i][j])
                
        
        array = np.array(pixels, dtype=np.uint8)
        image = Image.fromarray(array)
        sharedata["imgs"]["image"] = json.dumps(np.array(image).tolist())
        sharedata["imgs"]["mask"] = json.dumps(np.array(image).tolist())
        sharedata["imgs"]["reference"] = json.dumps(np.array(image).tolist())
        wf = "saveimg.json"
        def queue_prompt(prompt_workflow):
            p = {"prompt": prompt_workflow}
            data = json.dumps(p).encode('utf-8')
            req =  rq.f"http://{args.listen}:8188/prompt", data=data)
            rq.urlopen(req)
        path = Path('./workflows')
        prompt_workflow = json.load(open(os.path.join(path,wf)))
        for i in prompt_workflow:
            if "seed" in prompt_workflow[i]['inputs']:
                prompt_workflow[i]['inputs']['seed'] = random.randint(0,10000000000)
        queue_prompt(prompt_workflow)
    return{}

@app.route("/grabwfparams",methods=['GET', 'POST','DELETE'])
def grabwfparams():
    wf = request.json["wf"]
    wf +=".json"
    path = Path('./workflows')
    prompt_workflow = json.load(open(os.path.join(path,wf)))
    for i in prompt_workflow:
        if "steps" in prompt_workflow[i]["inputs"]:
            params = [j for j in prompt_workflow[i]["inputs"] if any(x in str(type(prompt_workflow[i]["inputs"][j])) for x in ["int","float"])]
    return{"params":params}


@app.route("/prepare",methods=['GET', 'POST','DELETE'])
def prep():
    return{"exist":"no"}

@app.route("/getnodes",methods=['GET', 'POST','DELETE'])
def getNodes():
    wf = request.json["wf"]+".json"
    path = Path('./workflows')
    prompt_workflow = json.load(open(os.path.join(path,wf)))
    return{"prompt_workflow":prompt_workflow}

@app.route("/generate",methods=['GET', 'POST','DELETE'])
def generate():
    wf = request.json["wf"]
    gligparams = request.json["gligparams"]
    wf+=".json"
    model = request.json["model"]
    lora = request.json["lora"]
    params = request.json["params"]
    def queue_prompt(prompt_workflow):
        p = {"prompt": prompt_workflow}
        data = json.dumps(p).encode('utf-8')
        req =  rq.Request(f"http://{args.listen}:8188/prompt", data=data)
        rq.urlopen(req)
    path = Path('./workflows')
    prompt_workflow = json.load(open(os.path.join(path,wf)))
    if "gligen" in wf:
        print(gligparams)
        nn = int(list(prompt_workflow.keys())[-1])+1
        for idx,i in enumerate(gligparams):
            if idx<=len(gligparams)-2:
                n = nn + int(idx)
                prompt_workflow[str(n)] = {
                    "inputs":{},
                    "class_type":"",
                    "_meta":{}
                }
                prompt_workflow[str(n)]["inputs"]["text"] = i["text"]
                prompt_workflow[str(n)]["inputs"]["width"] = i["width"]
                prompt_workflow[str(n)]["inputs"]["height"] = i["height"]
                prompt_workflow[str(n)]["inputs"]["x"] = i["x"]
                prompt_workflow[str(n)]["inputs"]["y"] = i["y"]
                if idx==0:
                    prompt_workflow[str(n)]["inputs"]["conditioning_to"] = ["6",0]
                else:
                    prompt_workflow[str(n)]["inputs"]["conditioning_to"] = [str(n-1),0]
                prompt_workflow[str(n)]["inputs"]["clip"] = ["4",1]
                prompt_workflow[str(n)]["inputs"]["gligen_textbox_model"] = ["12",0]
                prompt_workflow[str(n)]["class_type"] = "GLIGENTextBoxApply"
                prompt_workflow[str(n)]["_meta"]["title"] = "GLIGENTextBoxApply"
        prompt_workflow["6"]["inputs"]["text"] = gligparams[-1]["text"]
        prompt_workflow["3"]["inputs"]["positive"] = [str(nn+int(len(gligparams)-2)),0]
    if "areacomp" in wf:
        print(gligparams)
        nn = int(list(prompt_workflow.keys())[-1])+1
        n = nn
        for idx,i in enumerate(gligparams):
            if idx<=len(gligparams)-2:
                n+=1
                prompt_workflow[str(n)] = {
                    "inputs": {
                    "text": i["text"],
                    "clip": [
                        "4",
                        1
                    ]
                    },
                    "class_type": "CLIPTextEncode",
                    "_meta": {
                    "title": "CLIP Text Encode (Prompt)"
                    }
                }
                n+=1
                prompt_workflow[str(n)] = {
                    "inputs": {
                    "width": i["width"],
                    "height": i["height"],
                    "x": i["x"],
                    "y": i["y"],
                    "strength": 1,
                    "conditioning": [
                        str(n-1),
                        0
                    ]
                    },
                    "class_type": "ConditioningSetArea",
                    "_meta": {
                    "title": "Conditioning (Set Area)"
                    }
                }
                n+=1
                tt = "6" if idx==0 else str(n-3)
                prompt_workflow[str(n)] = {
                    "inputs": {
                    "conditioning_1": [
                        str(n-1),
                        0
                    ],
                    "conditioning_2": [
                        tt,
                        0
                    ]
                    },
                    "class_type": "ConditioningCombine",
                    "_meta": {
                    "title": "Conditioning (Combine)"
                    }
                }
        prompt_workflow["6"]["inputs"]["text"] = gligparams[-1]["text"]
        prompt_workflow["3"]["inputs"]["positive"] = [str(n),0]
    if "stickerize" not in wf:
        for i in prompt_workflow:
            if "seed" in prompt_workflow[i]['inputs']:
                prompt_workflow[i]['inputs']['seed'] = random.randint(0,10000000000)
            if "model_name" in prompt_workflow[i]['inputs'] and prompt_workflow[i]['class_type'] !='UpscaleModelLoader':
                prompt_workflow[i]['inputs']['model_name'] = model
            if "ckpt_name" in prompt_workflow[i]['inputs']:
                prompt_workflow[i]['inputs']['ckpt_name'] = model
            if "steps" in prompt_workflow[i]['inputs']:
                for j in params:
                    prompt_workflow[i]['inputs'][j] = params[j]
    else:
        for i in prompt_workflow:
            if "seed" in prompt_workflow[i]['inputs']:
                prompt_workflow[i]['inputs']['seed'] = random.randint(0,10000000000)
    changedparams = request.json["changedparams"]
    print(changedparams)
    for i in changedparams.keys():
        for j in changedparams[i].keys():
            prompt_workflow[i]['inputs'][j] = changedparams[i][j]
    queue_prompt(prompt_workflow)
    return{}


@app.route("/settaesd",methods=['GET', 'POST','DELETE'])
def settaesd():
    global tt
    tt = request.json["data"]
    return {}

@app.route("/getGenStatus",methods=['GET', 'POST','DELETE'])
def getGenStatus():
    global genflag, imagesgen
    genflag = request.json["data"]
    image = Image.open(request.json["data"]["genimg"])
    buf = io.BytesIO()
    image.save(buf, format='PNG')
    byte_im = buf.getvalue()
    byte_im = base64.b64encode(byte_im).decode('utf-8')
    byte_im = f"data:image/png;base64,{byte_im}"
    if len(imagesgen)<5:
        imagesgen.append(byte_im)
    else:
        imagesgen.pop(0)
        imagesgen.append(byte_im)
    return {}

@app.route("/getImagesPaths",methods=['GET', 'POST','DELETE'])
def getImagesPaths():
    global imagesgen
    return {"imagesgen":imagesgen}

@app.route("/getSharedData",methods=['GET', 'POST','DELETE'])
def getSharedData():
    global sharedata
    return sharedata


@app.route("/savedata",methods=['GET', 'POST','DELETE'])
def savedata():
    global image, tt, genflag
    img2img = "inpaint"
    taesd = request.json["taesd"]
    savedata = request.json["savedata"]
    if taesd == "false":
        ff = int(savedata["ff"])
        selectorsize = request.json["selectorsize"]
        pixels = savedata["pxlsarray"]
        if pixels != "":
            for i in range(0,len(pixels)):
                for j in range(0,len(pixels[i])):
                    pixels[i][j] = tuple(pixels[i][j])
                    
            
            array = np.array(pixels, dtype=np.uint8)
            image = Image.fromarray(array)
        sharedata["imgs"]["out"] = json.dumps(np.array(image).tolist())
        left = int(float(savedata["crpdims"]["left"]))
        top = int(float(savedata["crpdims"]["top"]))
        right = int(float(savedata["crpdims"]["right"]))
        bottom = int(float(savedata["crpdims"]["bottom"]))
        croped = image.crop((left,top,right,bottom))
        try:
            left = int(float(savedata["crpdimsref"]["left"]))
            top = int(float(savedata["crpdimsref"]["top"]))
            right = int(float(savedata["crpdimsref"]["right"]))
            bottom = int(float(savedata["crpdimsref"]["bottom"]))
            if left==0 and right==0 and top ==0 and bottom==0:
                ref = image
            else:
                ref = image.crop((left,top,right,bottom))
        except:
            ref = image
        sharedata["imgs"]["reference"] = json.dumps(np.array(ref).tolist())
        croped2 = croped.copy()
        px = croped2.load()
        for i in range(0,croped2.size[0]):
            for j in range(0,croped2.size[1]):
                try:
                    if px[i,j][3] <250:
                        px[i,j] = (255,255,255,255)
                    else:
                        px[i,j] = (0,0,0,255)
                except:
                    px[i,j] = (0,0,0)
        selectorsize = int(selectorsize)
        bg = Image.new("RGB",(selectorsize,selectorsize),(0,0,0))
        bg2 = Image.new("RGB",(selectorsize,selectorsize),(255,255,255))
        add = (int(float(savedata["additionaldims"]["left"])),int(float(savedata["additionaldims"]["top"])),int(float(selectorsize-savedata["additionaldims"]["right"])),int(float(selectorsize-savedata["additionaldims"]["bottom"])))
        bg.paste(croped,(add))
        bg2.paste(croped2,(add))



        ###########################
        toparr = []
        leftarr = []
        rightarr = []
        bottomarr = []

        topleftarr = []
        toprightarr = []
        bottomleftarr = []
        bottomrightarr = []
        whitepix = 0
        px = bg2.load()
        for i in range(0,bg2.size[0]):
            for j in range(0,bg2.size[1]):
                if px[i,j][0] == 255:
                    whitepix+=1
                try:
                    if px[i,j][0] == 255 and 0<i<bg.size[0]-1 and 0<j<bg.size[1]-1:
                        if px[i,j+1][0] <255:
                            rightarr.append([i,j])
                        if px[i,j-1][0] <255:
                            leftarr.append([i,j])

                        if px[i+1,j][0] <255:
                            bottomarr.append([i,j])

                        if px[i-1,j][0] <255:
                            toparr.append([i,j])

                        if px[i-1,j-1][0] <255:
                            topleftarr.append([i,j])
                        if px[i-1,j+1][0] <255:
                            toprightarr.append([i,j])

                        if px[i+1,j+1][0] <255:
                            bottomrightarr.append([i,j])

                        if px[i+1,j-1][0] <255:
                            bottomleftarr.append([i,j])

                except:
                    continue

        
        for i in range(0,len(toparr)):
            for k in range(0,ff):
                try:
                    px[toparr[i][0]-k,toparr[i][1]] = (255,255,255)
                except:
                    continue

        for i in range(0,len(leftarr)):
            for k in range(0,ff):
                try:
                    px[leftarr[i][0],leftarr[i][1]-k] = (255,255,255)
                except:
                    continue

        for i in range(0,len(rightarr)):
            for k in range(0,ff):
                try:
                    px[rightarr[i][0],rightarr[i][1]+k] = (255,255,255)
                except:
                    continue

        for i in range(0,len(bottomarr)):
            for k in range(0,ff):
                try:
                    px[bottomarr[i][0]+k,bottomarr[i][1]] = (255,255,255)
                except:
                    continue
        


        for i in range(0,len(topleftarr)):
            for k in range(0,ff):
                try:
                    px[topleftarr[i][0]-k,topleftarr[i][1]-k] = (255,255,255)
                except:
                    continue

        for i in range(0,len(toprightarr)):
            for k in range(0,ff):
                try:
                    px[toprightarr[i][0]-k,toprightarr[i][1]+k] = (255,255,255)
                except:
                    continue

        for i in range(0,len(bottomleftarr)):
            for k in range(0,ff):
                try:
                    px[bottomleftarr[i][0]+k,bottomleftarr[i][1]-k] = (255,255,255)
                except:
                    continue

        for i in range(0,len(bottomrightarr)):
            for k in range(0,ff):
                try:
                    px[bottomrightarr[i][0]+k,bottomrightarr[i][1]+k] = (255,255,255)
                except:
                    continue
            
                
                




        ########################



        sharedata["imgs"]["image"] = json.dumps(np.array(bg).tolist())
        if whitepix == 0:
            border = Image.new("RGB",(bg2.size[0],bg2.size[1]),(0,0,0)) 
            bg2 = ImageOps.invert(bg2)
            bg2 = bg2.resize((bg2.size[0]-ff*2,bg2.size[1]-ff*2))
            border.paste(bg2,(ff,ff))
            bg2 = border
            img2img = "img2img"
        bg2 = bg2.filter(ImageFilter.BoxBlur(ff-int(ff/2)))
        if request.json["savedata"]["mskarray"]=="":
            sharedata["imgs"]["mask"] = json.dumps(np.array(bg2).tolist())
        else:
            pixels = savedata["mskarray"]
            if pixels != "":
                for i in range(0,len(pixels)):
                    for j in range(0,len(pixels[i])):
                        pixels[i][j] = tuple(pixels[i][j])
                        
                
                array = np.array(pixels, dtype=np.uint8)
                maskimage = Image.fromarray(array)
                sharedata["imgs"]["out"] = json.dumps(np.array(image).tolist())
                left = int(float(savedata["crpdims"]["left"]))
                top = int(float(savedata["crpdims"]["top"]))
                right = int(float(savedata["crpdims"]["right"]))
                bottom = int(float(savedata["crpdims"]["bottom"]))
                cropedmsk = maskimage.crop((left,top,right,bottom))
                cropedmsk = cropedmsk.filter(ImageFilter.BoxBlur(ff-int(ff/2)))
                sharedata["imgs"]["mask"] = json.dumps(np.array(cropedmsk).tolist())
        width = int(float(savedata["additionaldims"]["left"])) + int(float(savedata["additionaldims"]["right"]))
        height = int(float(savedata["additionaldims"]["top"])) + int(float(savedata["additionaldims"]["bottom"]))
        
        data = {
            "savedata":savedata
        }
        json_object = json.dumps(data, indent=4)
        sharedata["savedata"] = savedata
        taesds = "no"
    else:
        img2img = request.json["img2img"]
        if img2img=="":
            img2img = "inpaint"
    flag = False
    realflag = flag
    if genflag:
        try:
            image = Image.open(genflag["genimg"])
        except: 
            pass
        tt = ""
        genflag = False
        flag = True
    if flag:
        taesds = "no"
        realflag = flag
        flag = False
        try:
            width = image.size[0]
            height = image.size[1]
            buf = io.BytesIO()
            image.save(buf, format='PNG')
            byte_im = buf.getvalue()
            byte_im = base64.b64encode(byte_im).decode('utf-8')
            byte_im = f"data:image/png;base64,{byte_im}"
        except:
            byte_im = ""
            width = ""
            height = ""

    else:
        try:
            width = tt["width"]
            height = tt["height"]
            byte_im = tt["img"]
            taesds = "no"
        except:
            taesds = "yes"
    try:
        return {"img":byte_im,"width":width,"height":height,"data":savedata,"flag":str(realflag),"taesd":taesds,"img2img":img2img}
    except:
        byte_im = ""
        width = ""
        height = ""
        return {"img":byte_im,"width":width,"height":height,"data":savedata,"flag":str(realflag),"taesd":taesds,"img2img":img2img}



if __name__ == "__main__":
    print(args)
    webbrowser.open(f"http://{args.listen}:{args.canvasport}")
    app.run(host=args.listen,port=args.canvasport,debug=False)
    
