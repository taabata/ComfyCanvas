# ComfyCanvas

Canvas to use with ComfyUI 

<img src='https://github.com/taabata/ComfyCanvas/blob/main/ComfyCanvas.png'> 


# Installation

1. Clone this repo into ComfyUI/custom_nodes
```
git clone https://github.com/taabata/ComfyCanvas.git
```
2. Run setup.py after changing directory to ComfyCanvas
```
cd ComfyCanvas

python3 run setup.py 
```
3. In a terminal/cmd tab,start ComfyUI
4. In another terminal/cmd, run main.py
```
python3 run main.py 
```
5. Enjoy!!

**Note: Windows users may face issues due to paths, let me know in the issues tab.**


# Buttons description & hotkeys
**Set Ref.:** select a part of the image to be third output in OutputCanvasNode. (https://github.com/taabata/LCM_Inpaint_Outpaint_Comfy.git) **"s"**

**Reset Ref.:** reset the reference part of the image to be the whole image. **"r"**

**Crop:** crop the image. **"c"**

**Compare:** compare the image with what it was before the generation ends. **"o"**

**Move:** move the image (toggled by clicking on canvas), resize the image by scrolling up and down, flip vertically by scrolling to the left, and flip vertically by scrolling to the right. **"m"** 

**Erase:** erase parts of the image (toggled by clicking on canvas). **"e"**

**Mask:** mask parts of the image to manually specify the mask of the image (second output in OutputCanvasNode) (toggled by clicking on canvas). **"k"**

**Draw:** draw on the image, color specified from color input on settings bar, and opacity by first slider on settings bar (toggled by clicking on canvas) **"d"**

**Fit:** resize image to 512x512 pixels. **"f"**

**New:** upload new image (discard the current image). **"n"**

**Text:** add text to image. **"t"**

**GLIGEN:** gligen or regional diffusion. **"l"**

**Blank:** turns the image into a blank image based on selected color and opacity. **"b"**

**Grid:** turns grid on. **"g"**

**COMFY:** generation from ComfyUI (outputs from OutputCanvasNode will be selected). 

**Undo:** undo last image.

**Reset Mask:** reset manual mask.

**Reset Parameters:** reset changed workflow parameters. 

**Lock To Image:** locks selector to only select inside image. **"right shift"**

**Left,Top,Right,Bottom:** blocks selector to respective side of image. **"arrow keys"**

**Reset Image:** resets image, clears drawing, erased part, solves some issues (press if you face an error or generation doesnt start). **"spacebar"**

**Generate:** generate image. **"enter"**

**"h"**: hide settings bar.

**Rec. Routine:** record processes on an image as a routine to be applied to other images.

**Start Routine:** start a saved routine after selecting it from the dropdown list.


# Other GitHub repos to clone (workflows include nodes from these):

https://github.com/taabata/LCM_Inpaint_Outpaint_Comfy.git

https://github.com/kijai/ComfyUI-segment-anything-2.git

https://github.com/WASasquatch/was-node-suite-comfyui.git

https://github.com/kijai/ComfyUI-Florence2.git

https://github.com/JettHu/ComfyUI-TCD.git

https://github.com/cubiq/ComfyUI_IPAdapter_plus.git

https://github.com/kijai/ComfyUI-KJNodes.git

https://github.com/dfl/comfyui-tcd-scheduler.git

https://github.com/Derfuu/Derfuu_ComfyUI_ModdedNodes.git

https://github.com/ZHO-ZHO-ZHO/ComfyUI-BRIA_AI-RMBG.git

https://github.com/Fannovel16/comfyui_controlnet_aux.git

https://github.com/BadCafeCode/masquerade-nodes-comfyui.git

https://github.com/taabata/Comfy_Syrian_Falcon_Nodes.git (just download the .py file and put in ComfyUI/custom_nodes)

