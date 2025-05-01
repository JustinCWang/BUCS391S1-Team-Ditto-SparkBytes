# Team-Ditto-Spark!Bytes (WIP README)
A working software application system developed as part of BU CS391 S1 that enables Boston University (BU) the ability to access extra food from events and other sources at Boston University. This software system is called Spark!Bytes.

## Prerequisites

Before running the app, you’ll need to set up a supabase account and Google Cloud account:

### [Supabase](https://supabase.com)

1. Click on new project then create a Supabase project.
2. Then go to project settings and click on Data API.
3. Note down the supabase URL and anon public key for you .env file later.

### [Google Clound](https://cloud.google.com/)
1. Sign up or Sign in your Google Cloud account
2. Navigate to console and then create a new project
3. In the navigation menu, go to APIs & Services > Library.
4. Search for "Maps JavaScript API" and click on it.
5. Click Enable to activate the API for your project.
6. Go to APIs & Services > Credentials.
7. Click Create credentials and select API key.
8. Copy the generated API key. This is the key you will use in your code.

## Frontend

To set up and run the frontend locally:

### Installation

You will need to go into the frontend directory then install all the dependencies for the project.

```bash
cd frontend
npm install
```

### Environment Variables

Create a .env file in the frontend directory. Then you will need to define your environment variables. Using what you noted down earlier from the prerequisite.

```bash
NEXT_PUBLIC_SUPABASE_URL="your url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your anon key"

NEXT_PUBLIC_MAPS_API_KEY="your google map API Key"
```

### Setting up Supabase Database & Test data

To set up your Supabase database for this project, please refer to the schema in the [documentation](../Documentation.pdf). To set up the test data, please refer to the [README](../testdata/README.md)


### Development Server

Then you can start your devlopment server!

```bash
npm run dev
```
