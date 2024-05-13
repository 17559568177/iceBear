
import os
def walk_files(src_filepath = "."):
    filepath_list = []
   
    #This for loop uses the os.walk() function to walk through the files and directories
    #and records the filepaths of the files to a list
    for root, dirs, files in os.walk(src_filepath):
        
        #iterate through the files currently obtained by os.walk() and
        #create the filepath string for that file and add it to the filepath_list list
        for file in files:
            #Checks to see if the root is '.' and changes it to the correct current
            #working directory by calling os.getcwd(). Otherwise root_path will just be the root variable value.
            if root == '.':
                root_path = os.getcwd() + "/"
            else:
                root_path = root
            
            #This if statement checks to see if an extra '/' character is needed to append 
            #to the filepat or not
            if (root_path != src_filepath) and (root != '.'):
                filepath = root_path + "/" + file
            else:
                filepath = root_path + file
            
            #Appends filepath to filepath_list if filepath does not currently exist in filepath_list
            if filepath not in filepath_list:
                filepath_list.append(filepath)
                
    #Return filepath_list        
    return filepath_list

for filename in walk_files('./src/'):
    if filename.endswith('ts') or filename.endswith('tsx'):
        #print(filename)
        with open(filename, 'r', encoding='utf-8') as f:
            text = f.read()
        text2 = text.replace('/rag/', 'rag/')
        if text2 != text:
            print(filename)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(text2)
    