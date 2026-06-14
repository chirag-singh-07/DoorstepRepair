# VPS Deployment Guide (Ubuntu/Debian)

This guide provides step-by-step instructions to deploy the DoorstepRepair application on a Virtual Private Server (VPS) running Ubuntu or Debian.

## Prerequisites
- A VPS with root or sudo access.
- A domain name pointing to your VPS IP address (optional but recommended for SSL).
- Git installed on your local machine to push the code (or you can clone it directly on the VPS).

## Step 1: Initial Server Setup

SSH into your VPS:
```bash
ssh user@your_vps_ip
```

Update your system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install necessary tools (Git, curl, build-essential):
```bash
sudo apt install git curl build-essential -y
```

## Step 2: Install Node.js & NPM

We will use NodeSource to install the latest LTS version of Node.js (v20):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify the installation:
```bash
node -v
npm -v
```

## Step 3: Install PostgreSQL

Install PostgreSQL database server:
```bash
sudo apt install postgresql postgresql-contrib -y
```

Create a database and a user for the application:
```bash
sudo -u postgres psql
```
Inside the PostgreSQL prompt, run:
```sql
CREATE DATABASE doorsteprepair;
CREATE USER dbuser WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE doorsteprepair TO dbuser;
\q
```

## Step 4: Clone the Repository

Navigate to the directory where you want to host your app (e.g., `/var/www/`):
```bash
cd /var/www
sudo mkdir doorstep-repair
sudo chown -R $USER:$USER doorstep-repair
git clone https://github.com/your-username/doorstep-repair.git doorstep-repair
cd doorstep-repair
```
*(If your repository is private, you may need to set up SSH keys or use a personal access token).*

## Step 5: Install Dependencies & Configure Environment

Install project dependencies:
```bash
npm install
```

Create a `.env` file from the example:
```bash
cp .env.example .env
nano .env
```

Update the following values in your `.env` file:
```env
# Use the PostgreSQL credentials you created in Step 3
DATABASE_URL=postgresql://dbuser:your_secure_password@localhost:5432/doorsteprepair

# Generate a secure session secret (e.g., using `openssl rand -hex 32`)
SESSION_SECRET=your_generated_secure_secret

NODE_ENV=production
PORT=5000
```

## Step 6: Build the Project and Migrate Database

Build the frontend and backend:
```bash
npm run build
```

Push the database schema (Migrations):
```bash
npm run db:push
```

## Step 7: Setup PM2 for Process Management

PM2 will keep your Node.js application running in the background and restart it if it crashes or the server reboots.

Install PM2 globally:
```bash
sudo npm install -g pm2
```

Start the application using the provided ecosystem file:
```bash
pm2 start ecosystem.config.cjs
```

Save the PM2 process list and configure it to start on boot:
```bash
pm2 save
pm2 startup
```
*(Run the command PM2 outputs at the end of the `pm2 startup` command).*

## Step 8: Setup Nginx Reverse Proxy

Nginx will route incoming HTTP/HTTPS traffic to your Node.js application running on port 5000.

Install Nginx:
```bash
sudo apt install nginx -y
```

Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/doorstep-repair
```

Paste the following configuration (replace `your_domain.com` with your actual domain or VPS IP):
```nginx
server {
    listen 80;
    server_name your_domain.com www.your_domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/doorstep-repair /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 9: Secure with SSL (Optional but Highly Recommended)

If you have a domain name pointing to your VPS, use Certbot to get a free SSL certificate from Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your_domain.com -d www.your_domain.com
```

Follow the prompts. Certbot will automatically configure Nginx to use SSL and redirect HTTP to HTTPS.

---

### You're all set! 🚀
Your application should now be live at `http://your_vps_ip` or `https://your_domain.com`.

### Updating your application
When you push new changes to your repository, SSH into your server and run:
```bash
cd /var/www/doorstep-repair
git pull
npm install
npm run build
npm run db:push
pm2 restart doorstep-repair
```
