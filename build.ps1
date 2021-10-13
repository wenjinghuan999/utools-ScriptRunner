$dist="dist"

Remove-Item -Force -Recurse $dist
mkdir $dist

Copy-Item -Recurse -Path .\public\* $dist
tsc --outDir $dist

$current_path=Get-Location
Write-Output $current_path
$temp="$current_path\temp"

mkdir $temp
Set-Location $temp
$packageJson=@"
{
    "name"           : "utools-scriptrunner-dependencies",
    "version"        : "1.0.0",
    "license"        : "MIT",
    "dependencies"   : {
      "nano-jsx"     : "^0.0.20"
    }
}
"@

Write-Output $packageJson | Out-File package.json -Encoding utf8
yarn install

Set-Location "$temp\node_modules\nano-jsx"
Remove-Item -Force -Recurse .vscode,readme,.eslintrc,.prettierrc,bundles,typings,*.tsx,jest*.json,tsconfig*.json,LICENSE,*.md
Get-ChildItem * -Include *.ts -Recurse | Remove-Item
Get-ChildItem * -Include *.map -Recurse | Remove-Item
Set-Location $temp

Set-Location $current_path
Copy-Item -Recurse "$temp\node_modules" $dist
Remove-Item -Force -Recurse $temp