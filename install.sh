HEADER='\033[1;36m'
SUCCESS='\033[0;32m\033[1m'
NORMAL='\033[0m'

stage=1
stages=7

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -"
echo "Typings"
echo "-------${NORMAL}"
./node_modules/.bin/typings install && \

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -------------------------"
echo "Generation of LoopBack services"
echo "-------------------------------${NORMAL}"
npm run lb-ng && \

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} ------------------------------------"
echo "Compiling TypeScript files into JavaScript"
echo "------------------------------------------${NORMAL}"
npm run tsc && \

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -------------------------"
echo "Building client files with Gulp"
echo "-------------------------------${NORMAL}"
npm run gulp build-dev && \

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} -----------------------"
echo "Generation of database schema"
echo "-----------------------------${NORMAL}"
npm run automigrate && \

stage=$((stage+1))
echo "\n${HEADER}- ${stage}/${stages} --------------------------"
echo "Populate database with test data"
echo "--------------------------------${NORMAL}"
psql -U postgres -d qeti -a -f data/dump.sql > /dev/null && \

echo "\n${SUCCESS}Installation completed successfully!${NORMAL}\n"
echo "Now start service with"
echo "  node ."
echo "or"
echo "  npm start"
echo ""