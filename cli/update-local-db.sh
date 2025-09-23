#!/bin/bash

echo "Running cfcc.sql..."
mysql -uroot tjcars < ./database/cfcc.sql

echo "Running cfccprices.sql..."
mysql -uroot tjcars < ./database/cfccprices.sql

echo "Running console.sql..."
mysql -uroot tjcars < ./database/console.sql

echo "Running custom_covers.sql..."
mysql -uroot tjcars < ./database/custom_covers.sql

echo "Running limo.sql..."
mysql -uroot tjcars < ./database/limo.sql