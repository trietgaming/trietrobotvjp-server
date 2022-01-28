echo "building"
tsc -p tsconfig.json
echo "built"
cd build
echo "change dir to build"
cp ../package.json package.json
echo "copied package.json"
railway link 8852e0a7-616d-492d-a213-3f058e68ade8
echo "linked to project"
set RAILWAY_TOKEN=947dfcd7-bd04-4662-aa25-e3512d44e17d
railway up
echo "deployed"