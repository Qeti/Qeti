BOLD='\033[1m'
SUCCESS='\033[0;32m\033[1m'
NORMAL='\033[0m'

echo "\n${BOLD}-------"
echo "Typings"
echo "-------${NORMAL}"
./node_modules/.bin/typings install && \

echo "\n${BOLD}-------"
echo "Generation of LoopBack services"
echo "-------${NORMAL}"
npm run lb-ng && \

echo "\n${BOLD}-------"
echo "Compiling TypeScript files into JavaScript"
echo "-------${NORMAL}"
npm run tsc && \

echo "\n${BOLD}-------"
echo "Building client files with Gulp"
echo "-------${NORMAL}"
npm run gulp build-dev && \

echo "\n${BOLD}-------"
echo "Generation of database schema"
echo "-------${NORMAL}"
npm run automigrate && \

echo "\n${BOLD}-------"
echo "Populate database with test data"
echo "-------${NORMAL}"
psql -U postgres -d qeti -a -f data/dump.sql > /dev/null && \

echo "\n${SUCCESS}-------"
echo "Success"
echo "-------${NORMAL}"
