# Using Distrobox

Distrobox is a way to run containerized linux distro on your terminal. 
Quite useful if you want to seperate your workspace apart so that it doesnt clutter your main workspace.
It uses either your standard Docker program or Podman as the backend.

If you want to use it inside a distrobox container, here are the step required to setup stuff

`"Basically, this is just for my workspace only though..." - VIM`

1. Create the distrobox container

```sh
distrobox create -n webdev-daskomrec26 -i quay.io/toolbx/arch-toolbox:latest --init --additional-packages "composer mariadb php npm nodejs eza starship systemd neovim"
```

2. Go inside the container

```sh
distrobox enter webdev-daskomrec26
```

3. Create the mysql database

Before creating the database, you have to uncomment these lines on `/etc/php/php.ini`:

```ini
extension=mysqli
extension=pdo_mysql
```

After that, run this:

```sh
sudo mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
sudo chown -R mysql:mysql /var/lib/mysql
sudo systemctl start mariadb
sudo mariadb
```

Inside the mariadb REPL:

```sh
CREATE DATABASE daskomrec26;
CREATE USER 'laravel'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON daskomrec26.* TO 'laravel'@'localhost';
FLUSH PRIVILEGES;
exit
```

Then, change this lines on the `.env` file:

```config
DB_USERNAME=laravel
DB_PASSWORD=password
```

Then, run these php command:

```sh
php artisan config:clear
php artisan migrate
```

4. Install the packages

```sh
composer install
npm install
```

5. Run the server!

```sh
composer run dev
```

Now, you can access the website on `localhost:8000`

# Additional Fix

Sometimes, if you want to rerun it again, you will found an error on mysql that some directory aren't found or something (idk why though)
Just follow this step to fix it:

```sh
distrobox enter webdev-daskomrec26
```

```sh
sudo mkdir -p /run/mariadb
sudo chown -R mysql:mysql /run/mariadb
sudo chmod 755 /run/mariadb

sudo mkdir -p /run/mysqld
sudo chown mysql:mysql /run/mysqld
sudo chmod 755 /run/mysqld

sudo systemctl restart mariadb
```

# Resources

Github: [https://github.com/89luca89/distrobox](https://github.com/89luca89/distrobox)
Website: [https://distrobox.it/](https://distrobox.it/)
