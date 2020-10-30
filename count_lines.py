class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

import os
totalLines = 0
filesNotOpen = 0
def scanFile(path):
	try:
		with open(path) as openFile:
			linesInFile = sum(1 for _ in openFile)
			print(path, end=" ")
			print(bcolors.WARNING + str(linesInFile) + bcolors.ENDC)
			global totalLines
			totalLines += linesInFile
	except Exception:
		global filesNotOpen
		filesNotOpen += 1
		pass
def scanningDir(path):
	allFiles = os.listdir(path)
	for file in allFiles:
		filePath = os.path.join(path, file)
		if os.path.isdir(filePath):
			scanningDir(filePath)
		elif os.path.isfile(filePath):
			if file.startswith("."):
				continue
			scanFile(filePath)
scanningDir("./src")
print(bcolors.OKBLUE + "Total lines: " + bcolors.BOLD +  str(totalLines) + bcolors.ENDC + bcolors.ENDC)
print(bcolors.FAIL + "Total files could not be open: " + bcolors.BOLD +  str(filesNotOpen) + bcolors.ENDC + bcolors.ENDC)