set -e

git init
git add -A
git commit -m 'deploy'
git push -f https://github.com/yunlew531/wowo-room.git master:gh-pages

cd -