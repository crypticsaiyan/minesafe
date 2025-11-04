## Setup

Before running the project, configure the required environment variables and dependencies.

### 1. Create local environment file
Copy the example environment file and set the required API key(s):

```bash
cp .env.example .env.local
# then open .env.local and set the required API_KEY and other credentials
```

### 2. Account & credentials
Create any external service accounts needed and add their keys to `.env.local`. For production use, avoid disposable email addresses and follow the service provider's terms.

### 3. Install dependencies and prepare database
Install packages and run the drizzle-kit generators/migrations:

```bash
npm install
npx drizzle-kit generate
npx drizzle-kit migrate
```

Now the project should be ready to run. See project scripts (package.json) for available start/dev commands.

or simple do 

``` bash 
npm run dev
```