import shutil, argparse,os,re
shutil.copyfile('latent_preview.py', '../../latent_preview.py')
newlines = '''
parser.add_argument("--canvasport", default="5000")
'''
footer = '''

os.environ["LISTEN"] = args.listen
os.environ["CANVASPORT"] = args.canvasport
'''
with open('../../comfy/cli_args.py',"r") as file:
    lines = file.read()

x = re.search("argparse.ArgumentParser\(\)",lines).span()[1]
fp1 = lines[:x]
fp2 = lines[x:]
newtext = fp1+"\n"+newlines+"\n"+fp2+footer

with open('../../comfy/cli_args.py',"w") as file:
    file.writelines(newtext)
