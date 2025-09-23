#!/bin/bash

echo "Dumping cfcc..."
mysqldump -u root --databases tjcars_production --tables cfcc -r ./database/cfcc.sql --skip-extended-insert --complete-insert
echo "Finished dumping cfcc..."

echo "Dumping cfccprices..."
mysqldump -u root --databases tjcars_production --tables cfccprices -r ./database/cfccprices.sql --skip-extended-insert --complete-insert
echo "Finished dumping cfccprices..."

echo "Dumping console..."
mysqldump -u root --databases tjcars_production --tables console -r ./database/console.sql --skip-extended-insert --complete-insert
echo "Finished dumping console..."

echo "Dumping custom_covers..."
mysqldump -u root --databases tjcars_production --tables custom_covers -r ./database/custom_covers.sql --skip-extended-insert --complete-insert

echo "Finished dumping custom_covers..."