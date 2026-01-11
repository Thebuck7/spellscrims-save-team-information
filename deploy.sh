#!/bin/bash

set -e

echo "🚀 Limpiando build..."
rm -rf dist lambda-build lambda.zip

echo "📦 Instalando dependencias..."
npm install

echo "🛠️ Compilando..."
npx tsc

echo "📁 Creando lambda-build..."
mkdir lambda-build

echo "📄 Copiando archivos..."
cp dist/index.js lambda-build/
cp package.json lambda-build/
cp -r node_modules lambda-build/

echo "🗜️ Comprimiendo ZIP con PowerShell..."
powershell.exe -Command "Compress-Archive -Path lambda-build/* -DestinationPath lambda.zip -Force"

echo "✅ Listo: lambda.zip creado"
