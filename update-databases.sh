#!/bin/bash

#echo "Updating cfcc_dark table..."
#mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table cfcc_dark to cfcc_temp, cfcc to cfcc_dark, cfcc_temp to cfcc"

#echo "Updating cfccprices_dark table..."
#mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table cfccprices_dark to cfccprices_temp, cfccprices to cfccprices_dark, cfccprices_temp to cfccprices"

#echo "Updating console_dark table..."
#mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table console_dark to console_temp, console to console_dark, console_temp to console"

#echo "Updating limo_dark table..."
#mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table limo_dark to limo_temp, limo to limo_dark, limo_temp to limo"

#echo "Updating seatsavers_dark table..."
#mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table seatsavers_dark to seatsavers_temp, seatsavers to seatsavers_dark, seatsavers_temp to seatsavers"

echo "Updating custom_covers table..."

# Rename dark table to .old and create a new dark table
mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e \
  "DROP TABLE custom_covers_old; \
  RENAME TABLE custom_covers_dark TO custom_covers_old; \
  CREATE TABLE custom_covers_dark (
    id int(20) unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
    part varchar(255) DEFAULT NULL,
    year smallint(4) unsigned NOT NULL,
    make varchar(255) DEFAULT NULL,
    model varchar(100) DEFAULT NULL,
    submodel varchar(100) DEFAULT NULL,
    notes varchar(255) DEFAULT NULL,
    size enum('G1','G2','G3','G4','G5','T1','T2','T3','T4','T5') DEFAULT NULL,
    details varchar(255) DEFAULT NULL,
    slug varchar(100) DEFAULT NULL
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;"

# Update fields in dark table
node tjc-cli update -f ./database/update-csv/update.csv --verbose

# **Uncomment below only after you verify the updated custom_covers_dark table**
# **[hint: using SELECT COUNT(*) FROM custom_covers_dark should show you the number of rows in the database, which should correspond to the number of rows in the update.csv file minus 1(doesn't include header row)]
# Hold dark database in temp database, swap current database to dark and temp to current
mysql -u root -p3E10Pwu8j6480995 -Dtjcars_production -e "rename table custom_covers_dark to custom_covers_temp, custom_covers to custom_covers_dark, custom_covers_temp to custom_covers"
echo "Backing up new and old custom_covers tables..."
mysqldump -u root -p3E10Pwu8j6480995 --databases tjcars_production --tables custom_covers -r ./database/custom_covers.sql --skip-extended-insert --complete-insert
mysqldump -u root -p3E10Pwu8j6480995 --databases tjcars_production --tables custom_covers_dark -r ./database/custom_covers.old.sql --skip-extended-insert --complete-insert