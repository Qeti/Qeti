HEADER='\033[1;36m'
SUCCESS='\033[0;32m\033[1m'
NORMAL='\033[0m'
ERROR='\033[41m\033[37m'

stage=1
stages=7
errors=""

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -"
echo "Typings"
echo "-------${NORMAL}"
./node_modules/.bin/typings install
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on generation of Typings"
fi

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -------------------------"
echo "Generation of LoopBack services"
echo "-------------------------------${NORMAL}"
npm run lb-ng
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on generation of LoopBack services"
fi

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} ------------------------------------"
echo "Compiling TypeScript files into JavaScript"
echo "------------------------------------------${NORMAL}"
npm run tsc
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on compilation of TypeScript files into JavaScript"
fi

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -------------------------"
echo "Building client files with Gulp"
echo "-------------------------------${NORMAL}"
npm run gulp build-dev
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on Building client files with Gulp"
fi

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -----------------------"
echo "Generation of database schema"
echo "-----------------------------${NORMAL}"
npm run automigrate
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on generation of database schema"
fi

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} --------------------------"
echo "Populate database with test data"
echo "--------------------------------${NORMAL}"
psql -v ON_ERROR_STOP=1 -U postgres -d qeti -a -f data/dump.sql > /dev/null
if [ $? -ne 0 ]; then
    errors="$errors\n\t- Error on population of database with test data"
fi

if [ -n $errors ]; then
    echo "\n${SUCCESS}Installation completed successfully!${NORMAL}\n"
    echo "Now start service with"
    echo "  node ."
    echo "or"
    echo "  npm start"
    echo ""
else
    echo "\n${ERROR}\n\n\tError!\n$errors\n${NORMAL}\n"
fi
