#!/bin/bash

dist='dist'

rm -rf $dist
mkdir $dist

cp -r public/* $dist
tsc --outDir $dist

current_path=`pwd`
echo $current_path
temp="${current_path}/temp"

mkdir $temp
cd $temp
packageJson='{
                "name"           : "utools-scriptrunner-dependencies",
                "version"        : "1.0.0",
                "license"        : "MIT",
                "dependencies"   : {
                  "nano-jsx"     : "^0.0.20"
                }
              }'
echo $packageJson > package.json
yarn install

cd "${temp}/node_modules/nano-jsx"
rm -rf .vscode readme .eslintrc .prettierrc bundles typings *.tsx jest*.json tsconfig*.json LICENSE *.md
find lib -name '*.ts' | xargs rm -rf
find lib -name '*.map' | xargs rm -rf

cd $current_path
cp -r "${temp}/node_modules" $dist/

rm -rf $temp