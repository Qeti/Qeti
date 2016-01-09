# Qeti

## Installation

Instruction for Debian/Ubuntu.

Clone this repository:

```
git clone git@github.com:Qeti/Qeti.git
```

Create empty database with PostgreSQL or MySQL 
and create file `server/datasources.js` with connection info. 
Example for PostgreSQL:

```
{
  "db": {
    "name": "db",
    "connector": "memory"
  },
  "master": {
    "host": "localhost",
    "database": "qeti",
    "password": "postgres",
    "name": "master",
    "connector": "postgresql",
    "user": "postgres"
  }
}
```

Run `./install.sh` and follow instructions.

Installation completed.

## How to run

Run command from path where Qeti was installed: 

```
node .
```

Then open url, usually it is http://0.0.0.0:3000 in case of local installation.

## How to contribute

1. Fork this repository.

1. Add the main Qeti repository as an additional git remote called "upstream"

    ```
    git remote add upstream git://github.com/Qeti/Qeti.git
    ```

1. Install develop instance of Qeti (see instruction above).

1. Take one of Issues or create new Issue on Github.

1. Fetch the latest code from the main Qeti branch

    ```
    git fetch upstream
    ```

1. Create branch with name in format `<Issue number>-name-of-branch`. Example: `123-some-fix`.

    ```
    git checkout upstream/master
    git checkout -b 123-some-fix
    ```

1. Do it!

1. Commit with message what contains number of issue in format `#<Issue number>` 
(example: `#123 Fixed some problem`) and push changes to your repository.

1. Pull the latest Qeti code from upstream into your branch

    ```
    git pull upstream master
    ```

1. Having resolved any conflicts, push your code to GitHub

    ```
    git push -u origin 123-some-fix
    ```

1. Open pull request.
