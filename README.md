# Car Covers

[![Deployment status from DeployBot](https://ameri-brand-inc.deploybot.com/badge/66802253860797/214652.svg)](https://deploybot.com)

## Setup

Clone the GitHub repo into whichever directory on your file system you would like.

Note: you can get the https URL under the green "<> CODE ▼" dropdown menu on the [repo's main page](https://github.com/ameribrandinc/AB-Inc-TJCars).

Then you need to make sure you have MySQL installed on your local machine. If you don't visit the [MySQL download page](http://dev.mysql.com/downloads/mysql) and download the correct version for your computer.

Make sure to install all the necessary components to get things up and running. Here is a nice [installation guide](http://www.macminivault.com/mysql-mountain-lion/) to get you started.

Next, make sure that you have [Node.js](http://nodejs.org/) installed. Click the Install button on the home page and when it's finished downloading, run the installer.

This installer will give you the latest version of Node.js as well as NPM, the Node Package Manager.

After you have finished the installation, `cd` into the `AB-Inc-TJCars` directory and run the following commands.

```bash
npm install
npm install -g grunt-cli
grunt
```

After this, all you need to do is run the following command in order to start the site running locally at [http://localhost:3000/](http://localhost:3000/).

```bash
grunt serve
```

## Deployment

Deployment happens via the DeployBot continuous integration platform. DeployBot detects changes in the GitHub repository, then deploys changes to the application server's ~/DIST folder. Finally, it executes the bash command for instantaneous updates:
```bash
forever restartall
```

## Steps for conversion

1. Create new view in Node app
2. Paste page body and convert any functional PHP to Node
3. Make sure to include title, description, and canonical URL in the meta section
4. Setup proxy for PHP page
5. Replace all links in legacy project pointing to page being proxied to match Node route

## Updates
Changed 8/26/24

The update.txt file can be obtained from Brett Amundsen - bamundsen@covercraft.com

This should be changed from a .txt file simply by changing it's extention to .csv

Note: this file uses a tab delimeter

The updatedatabases.sh script calls:
```bash
node tjc-cli update -f ./database/update-csv/update.csv --verbose
```

The program now requires the FULL update file, NOT the monthly net change file. The script will shift each update into a dark table for backup.

Push the new updated .csv file to GitHub into the directory /database/update-csv making sure it's exact name is "update.csv". This will overwrite and replace the old update.csv file. You can backup first if you would like.

To run the updatedatabases.sh script, please log into the server using one of the following methods:

1. Via the droplet workspace

    * Log in to the project workspace at [digitalocean.com](https://cloud.digitalocean.com/login)
    * Select the droplet for carcovers.org
    * Click "Access" from the submenu
    * Click "Launch Recovery Console"

2. Via SSH

    * Log in via SSH with the command prompt / shell / using PuTTY / or any other SSH client
    ```bash
    ssh root@carcovers.org
    ```

Once logged in as root, execute the script with:
```bash
cd DIST
./update-databases.sh
```