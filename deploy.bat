@echo off

echo "starting pushing codes ..."
echo:

cd .vitepress\dist

git init

git add . && git commit -m "commit docs deploying files

git push -f https://github.com/huohuoren4/huohuoren4.github.io.git master:main

echo:
echo "pushed codes successfully (:"

cd ..\..\


